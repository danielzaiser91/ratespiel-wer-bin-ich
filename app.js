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
  tiltLocked: false,
  neutralBeta: null,
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
  S.tiltLocked = false; S.neutralBeta = null;
  hideAll(); show('screen-game');
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
  if (S.tiltLocked) return;
  S.tiltLocked = true;
  S.correct++;
  navigator.vibrate?.(100);
  soundCorrect();
  flashOverlay('flash-correct');
  advance();
}

function triggerWrong() {
  if (S.tiltLocked) return;
  S.tiltLocked = true;
  S.wrong++;
  navigator.vibrate?.([80, 40, 80]);
  soundWrong();
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
  setTimeout(() => { S.tiltLocked = false; }, 1000);
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
  S.neutralBeta = null;
  const calibrate = e => {
    S.neutralBeta = e.beta;
    window.removeEventListener('deviceorientation', calibrate);
    listenTilt();
  };
  window.addEventListener('deviceorientation', calibrate);
}

function listenTilt() {
  _orientHandler = e => {
    if (S.tiltLocked || S.neutralBeta === null) return;
    const delta = e.beta - S.neutralBeta;
    if (delta < -25) triggerCorrect();
    else if (delta > 25) triggerWrong();
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

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(console.warn);
  }

  showStart();
  renderAll();
});
