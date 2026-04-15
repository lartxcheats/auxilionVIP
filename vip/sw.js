const CACHE = 'lartxvip-v1';
const ASSETS = [
    './',
    './index.html',
    './dashboard.html',
    './style.css',
    './app.js',
    './dashboard.js',
    './manifest.json',
    './discord.png',
    './guu.jpeg'
];

// Instala e faz cache dos assets
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Limpa caches antigos
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Cache-first para assets, network-first para navegação
self.addEventListener('fetch', e => {
    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request).catch(() => caches.match('./index.html'))
        );
        return;
    }
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request))
    );
});
