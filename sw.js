// Cache de l'app pour qu'elle s'ouvre hors ligne. Incrémenter VERSION à chaque mise à jour.
const VERSION = 'ecrin-v14';
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const SHELL = [
  './', 'index.html', 'styles.css', 'app.js', 'db.js', 'catalog.js',
  'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Réseau d'abord (pour recevoir les mises à jour), cache en secours hors ligne.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Polices Google : cache d'abord, pour qu'elles marchent hors ligne.
  if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return res;
    })));
    return;
  }
  if (url.origin !== location.origin) return;
  // `no-cache` : on revalide toujours auprès du serveur, sans attendre la fin du cache HTTP de GitHub (10 min).
  const fresh = e.request.mode === 'navigate' ? fetch(e.request.url, { cache: 'no-cache' }) : fetch(e.request, { cache: 'no-cache' });
  e.respondWith(
    fresh
      .then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
