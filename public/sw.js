// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var dataCacheName = 'dingdongData-v1';
var cacheName = 'dingdongPWA-v1';
var filesToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/js/characters.js',
  '/js/main.js',
  '/js/page.js',
  '/js/vendor/jquery-3.2.1.min.js',
  '/js/vendor/knockout-3.3.0.js',
  '/js/vendor/jquery.animateNumber.min.js',
  '/js/custom.js',

  '/images/characters/bayonetta.png',
  '/images/characters/bowser.png',
  '/images/characters/bowserjr.png',
  '/images/characters/cfalcon.png',
  '/images/characters/charizard.png',
  '/images/characters/cloud.png',
  '/images/characters/cloudlimit.png',
  '/images/characters/corrin.png',
  '/images/characters/darkpit.png',
  '/images/characters/diddykong.png',
  '/images/characters/donkeykong.png',
  '/images/characters/drmario.png',
  '/images/characters/duckhunt.png',
  '/images/characters/falco.png',
  '/images/characters/fox.png',
  '/images/characters/gameandwatch.png',
  '/images/characters/ganondorf.png',
  '/images/characters/greninja.png',
  '/images/characters/ike.png',
  '/images/characters/jigglypuff.png',
  '/images/characters/kingdedede.png',
  '/images/characters/kirby.png',
  '/images/characters/link.png',
  '/images/characters/littlemac.png',
  '/images/characters/lucario.png',
  '/images/characters/lucas.png',
  '/images/characters/lucina.png',
  '/images/characters/luigi.png',
  '/images/characters/mario.png',
  '/images/characters/marth.png',
  '/images/characters/megaman.png',
  '/images/characters/metaknight.png',
  '/images/characters/mewtwo.png',
  '/images/characters/miibrawler.png',
  '/images/characters/miigunner.png',
  '/images/characters/miiswordfighter.png',
  '/images/characters/ness.png',
  '/images/characters/olimar.png',
  '/images/characters/pacman.png',
  '/images/characters/palutena.png',
  '/images/characters/peach.png',
  '/images/characters/pikachu.png',
  '/images/characters/pit.png',
  '/images/characters/rob.png',
  '/images/characters/robin.png',
  '/images/characters/rosalina.png',
  '/images/characters/roy.png',
  '/images/characters/ryu.png',
  '/images/characters/samus.png',
  '/images/characters/sheik.png',
  '/images/characters/shulk.png',
  '/images/characters/shulkbuster.png',
  '/images/characters/shulkjump.png',
  '/images/characters/shulkshield.png',
  '/images/characters/shulksmash.png',
  '/images/characters/shulkspeed.png',
  '/images/characters/sonic.png',
  '/images/characters/toonlink.png',
  '/images/characters/villager.png',
  '/images/characters/wario.png',
  '/images/characters/wiifittrainer.png',
  '/images/characters/yoshi.png',
  '/images/characters/zelda.png',
  '/images/characters/zerosuitsamus.png'

];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://dingdong-pwa.firebaseapp.com';
  if (e.request.url.indexOf(dataUrl) > -1) {
    /*
     * When the request URL contains dataUrl, the app is asking for fresh
     * weather data. In this case, the service worker always goes to the
     * network and then caches the response. This is called the "Cache then
     * network" strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
     */
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    /*
     * The app is asking for app shell files. In this scenario the app uses the
     * "Cache, falling back to the network" offline strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
     */
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
