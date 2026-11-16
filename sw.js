/* keeps the app's own small files on the phone, so it opens fast; the lessons themselves always come from the site */
var C='english-practice-v3', FILES=['./','index.html','config.js','splash.jpg','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','favicon.png'];
self.addEventListener('install',function(e){ e.waitUntil(caches.open(C).then(function(c){ return c.addAll(FILES); })); self.skipWaiting(); });
self.addEventListener('activate',function(e){ e.waitUntil(caches.keys().then(function(k){ return Promise.all(k.filter(function(x){ return x!==C; }).map(function(x){ return caches.delete(x); })); })); self.clients.claim(); });
self.addEventListener('fetch',function(e){
  var u=new URL(e.request.url);
  if(u.origin!==location.origin) return;            // the site itself (Google) is never cached
  e.respondWith(fetch(e.request).then(function(r){ var copy=r.clone(); caches.open(C).then(function(c){ c.put(e.request,copy); }); return r; })
    .catch(function(){ return caches.match(e.request).then(function(r){ return r || caches.match('index.html'); }); }));
});
