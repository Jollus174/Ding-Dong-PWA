importScripts('/lib/sw-toolbox.js');

toolbox.router.default = toolbox.cacheFirst;

self.addEventListener("install", function(event) {
  console.log('SW: Installing service worker');
});
