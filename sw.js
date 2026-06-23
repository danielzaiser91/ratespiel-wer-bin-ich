const CACHE = 'ratespiel-v3';
const ASSETS = ['./', './index.html', './style.css', './app.js', './i18n.js', './data.js', './manifest.json'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener('fetch', e => {
  if (e.request.url.includes('wikipedia.org')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
