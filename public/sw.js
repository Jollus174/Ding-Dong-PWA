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

var dataCacheName = 'dingdongData-v2-5';
var cacheName = 'dingdongPWA-v2-5';
var filesToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/style-minified.css',
  '/css/character-icons.css',
  '/js/build/script.min.js',
  '/js/characters.js',
  '/js/custom.js',
  '/js/main.js',
  '/js/page.js',

  '/js/vendor/jquery-3.2.1.min.js',
  '/js/vendor/knockout-3.3.0.js',
  '/js/vendor/jquery.animateNumber.min.js',

  '/images/characters/png/bayonetta.png',
  '/images/characters/png/bowser.png',
  '/images/characters/png/bowserjr.png',
  '/images/characters/png/cfalcon.png',
  '/images/characters/png/charizard.png',
  '/images/characters/png/cloud.png',
  '/images/characters/png/cloudlimit.png',
  '/images/characters/png/corrin.png',
  '/images/characters/png/darkpit.png',
  '/images/characters/png/diddykong.png',
  '/images/characters/png/donkeykong.png',
  '/images/characters/png/drmario.png',
  '/images/characters/png/duckhunt.png',
  '/images/characters/png/falco.png',
  '/images/characters/png/fox.png',
  '/images/characters/png/gameandwatch.png',
  '/images/characters/png/ganondorf.png',
  '/images/characters/png/greninja.png',
  '/images/characters/png/ike.png',
  '/images/characters/png/jigglypuff.png',
  '/images/characters/png/kingdedede.png',
  '/images/characters/png/kirby.png',
  '/images/characters/png/link.png',
  '/images/characters/png/littlemac.png',
  '/images/characters/png/lucario.png',
  '/images/characters/png/lucas.png',
  '/images/characters/png/lucina.png',
  '/images/characters/png/luigi.png',
  '/images/characters/png/mario.png',
  '/images/characters/png/marth.png',
  '/images/characters/png/megaman.png',
  '/images/characters/png/metaknight.png',
  '/images/characters/png/mewtwo.png',
  '/images/characters/png/miibrawler.png',
  '/images/characters/png/miigunner.png',
  '/images/characters/png/miiswordfighter.png',
  '/images/characters/png/ness.png',
  '/images/characters/png/olimar.png',
  '/images/characters/png/pacman.png',
  '/images/characters/png/palutena.png',
  '/images/characters/png/peach.png',
  '/images/characters/png/pikachu.png',
  '/images/characters/png/pit.png',
  '/images/characters/png/rob.png',
  '/images/characters/png/robin.png',
  '/images/characters/png/rosalina.png',
  '/images/characters/png/roy.png',
  '/images/characters/png/ryu.png',
  '/images/characters/png/samus.png',
  '/images/characters/png/sheik.png',
  '/images/characters/png/shulk.png',
  '/images/characters/png/shulkbuster.png',
  '/images/characters/png/shulkjump.png',
  '/images/characters/png/shulkshield.png',
  '/images/characters/png/shulksmash.png',
  '/images/characters/png/shulkspeed.png',
  '/images/characters/png/sonic.png',
  '/images/characters/png/toonlink.png',
  '/images/characters/png/villager.png',
  '/images/characters/png/wario.png',
  '/images/characters/png/wiifittrainer.png',
  '/images/characters/png/yoshi.png',
  '/images/characters/png/zelda.png',
  '/images/characters/png/zerosuitsamus.png',

  '/images/stages/stage_bf.jpg',
  '/images/stages/stage_dl.jpg',
  '/images/stages/stage_fd.jpg',
  '/images/stages/stage_ly.jpg',
  '/images/stages/stage_sv.jpg',
  '/images/stages/stage_tc.jpg',

  '/images/spinner.svg',
  '/images/stripe.png',
  '/images/dk-credits.jpg'

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
  var dataUrl = 'https://dingdong-pwa.firebaseapp.com/api/data.json';
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