const CACHE_NAME = 'echo-chat-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest'
];

// Установка: кэшируем основные файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Активация: чистим старый кэш
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Ответ: сначала сеть, если не получилось — берём из кэша
self.addEventListener('fetch', event => {
  const req = event.request;
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
