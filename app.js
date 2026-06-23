// ── State ──────────────────────────────────────────────────────────────────
const S = {
  lang: 'de',
  mode: 'word',       // 'word' | 'image'
  roundMode: 'infinite', // 'infinite' | 'time' | 'cards'
  roundValue: 0,      // seconds or card count (0 = infinite)
  category: null,
  deck: [],
  index: 0,
  correct: 0,
  wrong: 0,
  startTime: 0,
  timer: null,
  timeLeft: 0,
  advancing: false,
  neutralBeta: null,
  tiltInvert: false,
  currentImage: null,
};

window.LANG = 'de';

// ── Audio ──────────────────────────────────────────────────────────────────
const AC = new (window.AudioContext || window.webkitAudioContext)();

function beep(freq, duration, type = 'sine', gain = 0.3) {
  const osc = AC.createOscillator();
  const g = AC.createGain();
  osc.connect(g); g.connect(AC.destination);
  osc.frequency.value = freq;
  osc.type = type;
  g.gain.setValueAtTime(gain, AC.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + duration);
  osc.start(); osc.stop(AC.currentTime + duration);
}

function soundCorrect() { beep(880, 0.15); setTimeout(() => beep(1320, 0.2), 100); }
function soundWrong()   { beep(200, 0.3, 'sawtooth', 0.2); }

// ── Wikimedia ──────────────────────────────────────────────────────────────
async function fetchWikiImageByTitle(title, lang) {
  const url = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=600&origin=*`;
  const r = await fetch(url);
  const j = await r.json();
  const pages = j.query?.pages;
  const page = pages ? Object.values(pages)[0] : null;
  return page?.thumbnail?.source || null;
}

async function fetchWikiImage(term) {
  const lang = S.lang === 'de' ? 'de' : 'en';
  try {
    // 1. Direct title lookup
    const direct = await fetchWikiImageByTitle(term, lang);
    if (direct) return direct;

    // 2. Search fallback – find the best matching article title
    const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&srlimit=3&format=json&origin=*`;
    const sr = await fetch(searchUrl);
    const sj = await sr.json();
    const hits = sj.query?.search || [];
    for (const hit of hits) {
      const img = await fetchWikiImageByTitle(hit.title, lang);
      if (img) return img;
    }
    return null;
  } catch { return null; }
}

// ── Helpers ────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const show = id => $(id).classList.remove('hidden');
const hide = id => $(id).classList.add('hidden');
const hideAll = () => ['screen-start','screen-category','screen-game','screen-summary'].forEach(hide);

function setLang(l) { S.lang = l; window.LANG = l; renderAll(); }

function renderAll() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ── Screen: Start ──────────────────────────────────────────────────────────
function showStart() {
  stopTimer();
  hideAll();
  show('screen-start');
  renderAll();
  renderRoundOptions();
}

function renderRoundOptions() {
  const mode = S.roundMode;
  document.querySelectorAll('.round-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.rmode === mode);
  });
  hide('time-options'); hide('cards-options');
  if (mode === 'time') show('time-options');
  if (mode === 'cards') show('cards-options');
}

// ── Screen: Category ──────────────────────────────────────────────────────
function showCategory() {
  hideAll();
  show('screen-category');
  renderAll();
  const grid = $('cat-grid');
  grid.innerHTML = '';
  CATEGORIES.forEach(cat => {
    if (cat.onlyDE && S.lang === 'en') return;
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.textContent = t(`cats.${cat.id}`);
    btn.onclick = () => { S.category = cat.id; startGame(); };
    grid.appendChild(btn);
  });
}

// ── Screen: Game ──────────────────────────────────────────────────────────
async function startGame() {
  S.deck = shuffle(getWords(S.category, S.lang));
  S.index = 0; S.correct = 0; S.wrong = 0;
  S.startTime = Date.now();
  S.advancing = false;
  hideAll(); show('screen-game');
  hide('timer-display');
  renderAll();
  updateProgress();
  if (S.roundMode === 'time') startTimer();
  await showCard();
  calibrateTilt();
}

async function showCard() {
  if (S.index >= S.deck.length) { endGame(); return; }
  const word = S.deck[S.index];
  $('card-word').textContent = '';
  $('card-image').src = '';
  $('card-image').classList.add('hidden');
  $('card-word').classList.remove('hidden');

  if (S.mode === 'image') {
    $('card-word').textContent = t('loading');
    const img = await fetchWikiImage(word);
    if (img) {
      $('card-image').src = img;
      $('card-image').classList.remove('hidden');
      $('card-word').classList.add('hidden');
    } else {
      // no image found → silently skip this card
      S.index++;
      if (S.index >= S.deck.length) { endGame(); return; }
      await showCard();
      return;
    }
    // preload next
    if (S.deck[S.index + 1]) fetchWikiImage(S.deck[S.index + 1]);
  } else {
    $('card-word').textContent = word;
  }
  updateProgress();
}

function updateProgress() {
  const total = S.roundMode === 'cards' ? S.roundValue : S.deck.length;
  $('progress-text').textContent = S.roundMode === 'cards'
    ? `${S.index} / ${total}`
    : S.index > 0 ? `${S.index}` : '';
  $('score-text').textContent = S.correct;
}

function triggerCorrect() {
  if (S.advancing) return;
  S.advancing = true;
  S.correct++;
  navigator.vibrate?.(100);
  try { soundCorrect(); } catch(e) {}
  flashOverlay('flash-correct');
  advance();
}

function triggerWrong() {
  if (S.advancing) return;
  S.advancing = true;
  S.wrong++;
  navigator.vibrate?.([80, 40, 80]);
  try { soundWrong(); } catch(e) {}
  flashOverlay('flash-wrong');
  advance();
}

function flashOverlay(id) {
  const el = $(id);
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 600);
}

async function advance() {
  S.index++;
  if (S.roundMode === 'cards' && S.index >= S.roundValue) { endGame(); return; }
  if (S.index >= S.deck.length) { endGame(); return; }
  await showCard();
  S.advancing = false;
}

// ── Timer ──────────────────────────────────────────────────────────────────
function startTimer() {
  S.timeLeft = S.roundValue;
  $('timer-display').textContent = formatTime(S.timeLeft);
  show('timer-display');
  S.timer = setInterval(() => {
    S.timeLeft--;
    $('timer-display').textContent = formatTime(S.timeLeft);
    if (S.timeLeft <= 0) endGame();
  }, 1000);
}

function stopTimer() {
  clearInterval(S.timer);
  S.timer = null;
}

// ── End Game ──────────────────────────────────────────────────────────────
function endGame() {
  stopTimer();
  removeOrientationListener();
  const elapsed = Math.floor((Date.now() - S.startTime) / 1000);
  hideAll(); show('screen-summary');
  renderAll();
  $('sum-time').textContent = formatTime(elapsed);
  $('sum-correct').textContent = S.correct;
  $('sum-wrong').textContent = S.wrong;
  $('sum-score').textContent = S.correct;
}

// ── DeviceOrientation ──────────────────────────────────────────────────────
let _orientHandler = null;

function calibrateTilt() {
  // Use stored calibration if available, otherwise fall back to auto-detect
  if (S.neutralBeta !== null) { listenTilt(); return; }
  const autoCalib = e => {
    S.neutralBeta = e.beta;
    window.removeEventListener('deviceorientation', autoCalib);
    listenTilt();
  };
  window.addEventListener('deviceorientation', autoCalib);
}

function listenTilt() {
  let tiltCooldown = false;
  _orientHandler = e => {
    if (S.advancing || tiltCooldown || S.neutralBeta === null) return;
    let delta = e.beta - S.neutralBeta;
    if (S.tiltInvert) delta = -delta;
    // Phone held against forehead screen-away: forward tilt increases beta
    if (delta > 25) {
      tiltCooldown = true;
      setTimeout(() => { tiltCooldown = false; }, 300);
      triggerCorrect();
    } else if (delta < -25) {
      tiltCooldown = true;
      setTimeout(() => { tiltCooldown = false; }, 300);
      triggerWrong();
    }
  };
  window.addEventListener('deviceorientation', _orientHandler);
}

function removeOrientationListener() {
  if (_orientHandler) {
    window.removeEventListener('deviceorientation', _orientHandler);
    _orientHandler = null;
  }
}

async function requestSensor() {
  if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
    try {
      const perm = await DeviceOrientationEvent.requestPermission();
      if (perm === 'granted') $('sensor-area').classList.add('hidden');
    } catch(e) { console.warn(e); }
  } else {
    $('sensor-area').classList.add('hidden');
  }
}

// ── Calibration Wizard ─────────────────────────────────────────────────────
const _calib = { step: 0, samples: [], neutral: 0, forward: 0, handler: null, timer: null };

const CALIB_STEPS_CFG = [
  { icon: '📱', key: 'calibStep1' },
  { icon: '✅', key: 'calibStep2' },
  { icon: '❌', key: 'calibStep3' },
];

function loadCalib() {
  const stored = localStorage.getItem('tilt_calib');
  if (stored) {
    const c = JSON.parse(stored);
    S.neutralBeta = c.neutral;
    S.tiltInvert  = c.invert ?? false;
  }
}

function openCalib() {
  show('calib-overlay');
  show('calib-wizard');
  hide('calib-done');
  _calibRunStep(0);
}

function closeCalib() {
  hide('calib-overlay');
  if (_calib.handler) { window.removeEventListener('deviceorientation', _calib.handler); _calib.handler = null; }
  clearTimeout(_calib.timer);
}

function _calibRunStep(step) {
  if (_calib.handler) { window.removeEventListener('deviceorientation', _calib.handler); _calib.handler = null; }
  clearTimeout(_calib.timer);

  if (step >= 3) {
    // Auto-detect direction: if forward tilt increased beta → no invert; decreased → invert
    const tiltInvert = _calib.forward < _calib.neutral;
    S.neutralBeta = _calib.neutral;
    S.tiltInvert  = tiltInvert;
    localStorage.setItem('tilt_calib', JSON.stringify({ neutral: _calib.neutral, invert: tiltInvert }));
    hide('calib-wizard');
    show('calib-done');
    _calib.timer = setTimeout(closeCalib, 1500);
    return;
  }

  _calib.step = step;
  _calib.samples = [];

  const cfg = CALIB_STEPS_CFG[step];
  $('calib-wizard-icon').textContent = cfg.icon;
  $('calib-wizard-text').textContent = t(cfg.key);

  document.querySelectorAll('.calib-dot').forEach((d, i) => {
    d.classList.toggle('calib-dot-active', i === step);
  });

  let seconds = 2;
  $('calib-countdown').textContent = seconds;

  _calib.handler = e => { if (e.beta !== null) _calib.samples.push(e.beta); };
  window.addEventListener('deviceorientation', _calib.handler);

  const tick = () => {
    seconds--;
    if (seconds > 0) {
      $('calib-countdown').textContent = seconds;
      _calib.timer = setTimeout(tick, 1000);
    } else {
      $('calib-countdown').textContent = '✓';
      const avg = _calib.samples.length > 0
        ? _calib.samples.reduce((a, b) => a + b, 0) / _calib.samples.length
        : 0;
      if (step === 0) _calib.neutral = Math.round(avg);
      else if (step === 1) _calib.forward = Math.round(avg);
      window.removeEventListener('deviceorientation', _calib.handler);
      _calib.handler = null;
      _calib.timer = setTimeout(() => _calibRunStep(step + 1), 500);
    }
  };
  _calib.timer = setTimeout(tick, 1000);
}

// ── PWA Install ────────────────────────────────────────────────────────────
let _deferredInstall = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _deferredInstall = e;
  // Only show if not already installed
  if (!window.matchMedia('(display-mode: standalone)').matches) {
    show('install-overlay');
  }
});

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      setLang(b.dataset.lang);
    });
  });

  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      S.mode = b.dataset.mode;
    });
  });

  // Round mode buttons
  document.querySelectorAll('.round-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.round-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      S.roundMode = b.dataset.rmode;
      if (S.roundMode === 'time')  S.roundValue = 30;
      if (S.roundMode === 'cards') S.roundValue = 5;
      renderRoundOptions();
    });
  });

  // Time preset buttons
  document.querySelectorAll('.time-preset').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.time-preset').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      if (b.dataset.val === 'custom') {
        show('time-custom-wrap');
      } else {
        hide('time-custom-wrap');
        S.roundValue = parseInt(b.dataset.val);
      }
    });
  });

  $('time-custom-input').addEventListener('input', e => {
    S.roundValue = Math.max(1, Math.min(3600, parseInt(e.target.value) || 60));
  });

  // Cards preset buttons
  document.querySelectorAll('.cards-preset').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.cards-preset').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      if (b.dataset.val === 'custom') {
        show('cards-custom-wrap');
      } else {
        hide('cards-custom-wrap');
        S.roundValue = parseInt(b.dataset.val);
      }
    });
  });

  $('cards-custom-input').addEventListener('input', e => {
    S.roundValue = Math.max(1, parseInt(e.target.value) || 10);
  });

  // Central tap zone → correct
  $('tap-zone').addEventListener('click', triggerCorrect);

  // Calibration
  $('btn-open-calib').addEventListener('click', openCalib);
  $('btn-calib-cancel').addEventListener('click', closeCalib);

  // Navigation
  $('btn-to-category').addEventListener('click', showCategory);
  $('btn-back-from-category').addEventListener('click', showStart);
  $('btn-end-game').addEventListener('click', endGame);
  $('btn-play-again').addEventListener('click', () => { S.category ? showCategory() : showStart(); });
  $('btn-to-start').addEventListener('click', showStart);
  $('btn-sensor').addEventListener('click', requestSensor);

  // Keyboard fallback (space = correct, enter = wrong, for testing on desktop)
  document.addEventListener('keydown', e => {
    const gs = !$('screen-game').classList.contains('hidden');
    if (!gs) return;
    if (e.code === 'Space') { e.preventDefault(); triggerCorrect(); }
    if (e.code === 'Enter') { e.preventDefault(); triggerWrong(); }
  });

  // iOS sensor check
  if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
    show('sensor-area');
  }

  // PWA install buttons
  $('btn-install-app').addEventListener('click', async () => {
    if (_deferredInstall) {
      // Android/Chrome: trigger native install prompt
      _deferredInstall.prompt();
      const { outcome } = await _deferredInstall.userChoice;
      _deferredInstall = null;
    }
    hide('install-overlay');
  });

  $('btn-install-skip').addEventListener('click', () => {
    hide('install-overlay');
    // Request fullscreen so browser mode feels like the app
    const el = document.documentElement;
    (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen)?.call(el);
  });

  // iOS: show manual instructions instead of install button
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isIOS && !isStandalone) {
    show('install-overlay');
    hide('btn-install-app');
    show('install-ios-hint');
  }

  // Service Worker – auto-reload when a new version activates
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        reg.installing?.addEventListener('statechange', e => {
          if (e.target.state === 'activated') window.location.reload();
        });
      });
    }).catch(console.warn);

    // Also catches the case where skipWaiting fired before we registered the listener
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }

  loadCalib();
  showStart();
  renderAll();
});
