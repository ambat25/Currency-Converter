var staticCacheName = 'cc-v6';

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(staticCacheName).then((cache) => {
        return cache.addAll([
            'Currency-Converter/index.html',
          'Currency-Converter/assets/js/app.js',
          'Currency-Converter/assets/css/main.css',
        ]);
      })
    );
  });


  self.addEventListener('fetch', function(event) {
    // TODO: respond to requests for the root page with
    // the page skeleton from the cache
    // console.log(event.request.url);
    // console.log("this event is happening",event)
    var requestUrl = new URL(event.request.url);
    if(requestUrl.origin == location.origin){
  
    if(requestUrl.pathname === '/'){
    //   // event.respondWith(cach)
    // // }
        event.respondWith(
          caches.match('index.html').then(function(response) {
            return response || fetch(event.request);
          })
        );
      }
    } 
  });
