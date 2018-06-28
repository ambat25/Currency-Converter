let cacheName = 'cur-conv-v3';
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll([
          '/Currency-Converter/index.html',
          '/Currency-Converter/assets/css/main.css',
          '/Currency-Converter/assets/js/app.js'
        ])
          .then(() => self.skipWaiting());
      })
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;     // if valid response is found in cache return it
        } else {
          return fetch(event.request)     //fetch from internet
            .then(function (res) {
              return caches.open(cacheName)
                .then(function (cache) {
                  cache.put(event.request.url, res.clone());    //save the response for future
                  return res;   // return the fetched data
                })
            })
        }
      })
  );
}); 
