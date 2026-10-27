// BBS BY SALMA - Service Worker PWA (Progressive Web App)
const CACHE_NAME = 'bbs-by-salma-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png'
];

// 1. Installation du Service Worker et mise en cache du shell de l'application
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[BBS PWA] Mise en cache des ressources statiques');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[BBS PWA] Erreur pré-cache non bloquante :', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[BBS PWA] Suppression ancien cache :', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Stratégie de récupération réseau / cache (Stale-while-revalidate pour images, Network-first pour API)
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET ou de méthodes de paiement externes (Wave, etc.)
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Pour les appels API (/api/*) : Network-first avec secours sur cache si hors-ligne
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Pour les images (/assets/*) : Cache-first avec mise à jour en arrière-plan
  if (url.pathname.startsWith('/assets/') || request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Pour le reste (pages, scripts, styles) : Network d'abord, secours sur le cache ou index.html si hors-ligne
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return null;
        });
      })
  );
});
