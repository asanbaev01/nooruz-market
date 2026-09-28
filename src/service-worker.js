/* eslint-disable no-restricted-globals */

self.__WB_MANIFEST; // eslint-disable-line no-unused-expressions

const CACHE_NAME = 'nooruz-market-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  console.log('🟢 Service Worker орнотулууда...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Кэш ачылды');
      return cache.addAll(urlsToCache);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker активдүү');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Эски кэш өчүрүлдү:', cacheName);
            return caches.delete(cacheName);
          }

          return null;
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Оффлайн режим',
          }),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      })
    );

    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((fetchResponse) => {
          if (
            fetchResponse &&
            fetchResponse.status === 200 &&
            fetchResponse.type === 'basic'
          ) {
            const responseToCache = fetchResponse.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return fetchResponse;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }

          return new Response('', {
            status: 503,
            statusText: 'Offline',
          });
        });
    })
  );
});