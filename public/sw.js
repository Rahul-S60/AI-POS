self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// A simple fetch handler is REQUIRED by Android/Chrome for PWA installation
self.addEventListener('fetch', (event) => {
  // Pass through all requests to the network
  event.respondWith(fetch(event.request));
});
