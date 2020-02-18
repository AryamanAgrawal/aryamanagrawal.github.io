'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "/assets\AssetManifest.json": "b8127247d004ba4e727de41826b863de",
"/assets\assets\back.gif": "fd789c2563f36186cc846db07ae1cf48",
"/assets\assets\back2.gif": "8e8ef9eb4bf83c38d15b14afbdefe722",
"/assets\assets\behance.png": "eace5f433c83a220accf60619acea06e",
"/assets\assets\gitb.png": "ef7a02b69836dc8b6a732a54c4200dcb",
"/assets\assets\linkb.png": "1b18d461ce75c75fdb4d7b6ec08b3e65",
"/assets\assets\medium.png": "45140ce1eb5fe8d0caed749229873cca",
"/assets\assets\ProductSans-Regular.ttf": "b61c0ab33a818a0162f3e868babcef4b",
"/assets\assets\profile.jpg": "c98d992fe17eb43a3b08592679802c78",
"/assets\assets\skype.png": "71534d8eeab8deba957dc4e5f0ec9694",
"/assets\FontManifest.json": "c39f1df69478d9a4d28983097daa6ace",
"/assets\fonts\MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16",
"/assets\LICENSE": "3414534d5b54c1da616f604e55aab752",
"/assets\packages\cupertino_icons\assets\CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"/index.html": "81c76a0bbbadbbd34528c5d5235d8968",
"/main.dart.js": "bd38f613dc7906e559712684f0f4daab"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request, {
          credentials: 'include'
        });
      })
  );
});
