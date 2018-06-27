let cacheName = 'cur-conv-v15';
// self.addEventListener('install', e => {
//   const timeStamp = Date.now();
//   e.waitUntil(
//     caches.open(cacheName).then(cache => {
//       return cache.addAll([
//         `/`,
//         `/index.html`,
//         `/assets/css/main.css`,
//         '/assets/js/app.js'
//       ])
//           .then(() => self.skipWaiting());
//     })
//   );
// });
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll([
          '/index.html',
          '/assets/css/main.css',
          '/assets/js/app.js'
        ])
          .then(() => self.skipWaiting());
      })
  )
})
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// self.addEventListener('fetch', event => {
//     event.respondWith(
//         caches.open(cacheName)
//             .then(cache=>{
//                 return cache.match('/')
//             })
//             .then(response => {
//                 return response || fetch(event.request);

//             })
//             .catch(err => fetch(event.request))
//     )
// })
// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.open(cacheName)
//       .then(cache => cache.match(event.request, {ignoreSearch: true}))
//       .then(response => {
//       return response || fetch(event.request);
//     })
//   );
// });
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