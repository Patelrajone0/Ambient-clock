// Ambient Clock — Progressive Web App Service Worker
const CACHE_NAME = 'ambient-clock-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './icon-192.png',
  './icon-512.png',
];

// Installation: pre-cache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('[SW] Core assets pre-cache partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activation: purge older caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate for app assets, bypass for AdSense/external dynamic APIs
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external ads, tracking, or weather APIs from aggressive caching
  if (
    url.hostname.includes('googlesyndication.com') ||
    url.hostname.includes('google-analytics.com') ||
    url.hostname.includes('open-meteo.com') ||
    url.hostname.includes('bigdatacloud.net')
  ) {
    return;
  }

  // Handle local app shell with Stale-While-Revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);

      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and no network, return cached response
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Listen for skip waiting command
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
