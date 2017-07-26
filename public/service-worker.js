/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["css/character-icons.css","ec8a4a737e3468d7c2b2524adec1f255"],["css/fonts/roboto.woff","e5d1ccfbe43c8138e553093300603815"],["css/style-minified.css","219713cf47119d12d3b8826c5fb10aef"],["css/style.css","d0de7f63dd81792d27a845664d0e3b25"],["images/characters/convert-to-webp.exe","8eaf892b2b34d8775c59e181914f4995"],["images/characters/cwebp.exe","dcd762b6afcd607942090e5476f20b03"],["images/characters/png/bayonetta.png","ad686f303bca17d7f66ba9365615c5ee"],["images/characters/png/bowser.png","7f575bf6f6f7cbf149929f80c63527e5"],["images/characters/png/bowserjr.png","3b66f8aa9745cea780804a35a4f21d4f"],["images/characters/png/cfalcon.png","f85bb5a9bc8d095045b62348e3e858f8"],["images/characters/png/charizard.png","5a723d786c00bd96b00cc15727305cb3"],["images/characters/png/cloud.png","11565fe037248da53454b3e7ae373529"],["images/characters/png/cloudlimit.png","4071bc1e74ac4aa7a20ca0e821cb05d7"],["images/characters/png/corrin.png","10ee1a3fd8d6d646fddbb9bef4aa8e80"],["images/characters/png/darkpit.png","d78ef5c77e1abf7fa2d8ba90c3a25852"],["images/characters/png/diddykong.png","e4cfcb245de449cb69cfa1426797edcb"],["images/characters/png/donkeykong.png","0e852ba3cf97ab51c1d0df5fe40e08c5"],["images/characters/png/drmario.png","1c14385f0330b15c33038ad5405438ea"],["images/characters/png/duckhunt.png","b76a7a74ba87749e11a3a10a41d67642"],["images/characters/png/falco.png","6c6cb5c672f47a1657d6a8c9b5ab248a"],["images/characters/png/fox.png","f919d5c4d9cb06be07b6d9701012ef13"],["images/characters/png/gameandwatch.png","033a35b0fffa7d6b7ecaac5013404fd6"],["images/characters/png/ganondorf.png","dbdcc64c5b368b03f7f72f9728abe35b"],["images/characters/png/greninja.png","25e7dca4fe5894ea75eed55747551dbf"],["images/characters/png/ike.png","4eddcea35ffa65a8b9f427ca5fe68065"],["images/characters/png/jigglypuff.png","c6a117e74b4e70a09b63ab177c6f76eb"],["images/characters/png/kingdedede.png","e2c3cd593f653d341c83b8346d7cb297"],["images/characters/png/kirby.png","cd0578e5934ec5f0784846f172d72b33"],["images/characters/png/link.png","ca76dc37a1dc0da6a22d7d60969e9e44"],["images/characters/png/littlemac.png","842cfd96f16f14d84739d6b6a58e9400"],["images/characters/png/lucario.png","77725477a9c5471fbbd901de4a27e1ca"],["images/characters/png/lucas.png","7a0b9401630dfb8577cb3567d0df13dd"],["images/characters/png/lucina.png","aa01546a7aa8be733fb3b240331230df"],["images/characters/png/luigi.png","87241b3b97e8c01572bdde723233a3af"],["images/characters/png/mario.png","0fe31f68e608b44041f550c8c89e8d3c"],["images/characters/png/marth.png","8b07e6ce66c0eed164f166da8efa103b"],["images/characters/png/megaman.png","24f02949dabd3696d8c7c56501114772"],["images/characters/png/metaknight.png","a33ee076f6492f014c465bf8b704c53d"],["images/characters/png/mewtwo.png","0dbb7deb329e34e9ee2935873da40c85"],["images/characters/png/miibrawler.png","aae23b2308a7e5913727d32df0a962c3"],["images/characters/png/miigunner.png","aaec02d3a5f736e5523bbffbc9d52f10"],["images/characters/png/miiswordfighter.png","d292b21b1402a6ece64728d0ce05e35b"],["images/characters/png/ness.png","8090453f7176946e10d35952d38d514d"],["images/characters/png/olimar.png","535b74c4c11507b1ca2c58f83ac4deff"],["images/characters/png/pacman.png","1aa2257c4f8b33a51ca92f54ee9a410e"],["images/characters/png/palutena.png","dab3917d608b905ac70128eba3e58448"],["images/characters/png/peach.png","5ac137804a83500b04b4c3047f98913d"],["images/characters/png/pikachu.png","6d8961c299d681778d916c8c5c7e91e1"],["images/characters/png/pit.png","ca2c3ea1340fd33b3eb218af2adca62c"],["images/characters/png/rob.png","ef0b4becfb46e39ae9754701bea164aa"],["images/characters/png/robin.png","1cab385e6eb8289f2feafc133dd017be"],["images/characters/png/rosalina.png","68425661b0b2de4946417dc3e95da97e"],["images/characters/png/roy.png","0a4b1a4cab46310da7c081de52721c24"],["images/characters/png/ryu.png","cc086824abe0d0e1baa82a1cef032626"],["images/characters/png/samus.png","464b88e402da1a6de8ad0ed8a03fd96c"],["images/characters/png/sheik.png","dc72d67dde18aceaa5c6d5d2522f19be"],["images/characters/png/shulk.png","7332106910a90b3b6c36c8e5ce8cadad"],["images/characters/png/shulkbuster.png","be0c30e452c3be2759cc57476882b6e2"],["images/characters/png/shulkjump.png","7fb2d11c7e441d8a5d0055eee37e4308"],["images/characters/png/shulkshield.png","268debb9aa10dd0ca46832853b1eb958"],["images/characters/png/shulksmash.png","f682b06e6e1ebda4734d37ec6f2ee6a4"],["images/characters/png/shulkspeed.png","97861845d6438b1030f0b0e022948eb2"],["images/characters/png/sonic.png","6374f2beceec6be238e290ef9ae6bc2c"],["images/characters/png/toonlink.png","d9cc3f4a229a9d742bf4ea586a1985ca"],["images/characters/png/villager.png","f7b7946a581c0cca672ff884ca1ddfe6"],["images/characters/png/wario.png","ed597032d15b044e65ead5a3cfa766d7"],["images/characters/png/wiifittrainer.png","bef8a9affb24720cf5e925d7cf3539e5"],["images/characters/png/yoshi.png","4359af340465563b3eea6baee4dff5ba"],["images/characters/png/zelda.png","f6af3acd7fb14c7f1bc0ff5e405fde11"],["images/characters/png/zerosuitsamus.png","554873f2003b6487b3dc3daa37f41d09"],["images/characters/webp/bayonetta.webp","101461a1d5f906034890158aa4b78bef"],["images/characters/webp/bowser.webp","c96563cd54a53cde0245e382203f0d29"],["images/characters/webp/bowserjr.webp","047a14b183604eb50484eb906252ff97"],["images/characters/webp/cfalcon.webp","6e5ed809af429ef46e69d123127d0b99"],["images/characters/webp/charizard.webp","6b817f6ddcf01166a3fedf5c807e7433"],["images/characters/webp/cloud.webp","84e761ae5efb381b315c17edbc4c2b33"],["images/characters/webp/cloudlimit.webp","54721ff714efef9f424ad8f1b1795897"],["images/characters/webp/corrin.webp","1d817543e91cec1407541c09ba59a668"],["images/characters/webp/darkpit.webp","58b51552d3e2d820ec40ab593c983c05"],["images/characters/webp/diddykong.webp","16e9cc3ff0724e801c803d1b555db25d"],["images/characters/webp/donkeykong.webp","71c4a0006acea16557466f453c5fc6b0"],["images/characters/webp/drmario.webp","2e0a1db97a53e9a67f1619e758baff86"],["images/characters/webp/duckhunt.webp","ac0a6be7a82a4709001edd4a61911bb0"],["images/characters/webp/falco.webp","bf77c6611caa9a1972eb3f3e00932dfb"],["images/characters/webp/fox.webp","4dd6384cb7d5881e22a58cdf6ae2c4db"],["images/characters/webp/gameandwatch.webp","91e67c5f60d6d2fd9d617f290af301b7"],["images/characters/webp/ganondorf.webp","0f2542f0c2bb82e4eea746720ce574d8"],["images/characters/webp/greninja.webp","a9d137e77a9eb70e6cb8e79dde10bc06"],["images/characters/webp/ike.webp","f57a79399eab9277c941b73fe6557b11"],["images/characters/webp/jigglypuff.webp","f77d8f365c0cfaf04000acedab8ea5b2"],["images/characters/webp/kingdedede.webp","d1219b1ee0edd6853568645a1fe0cf77"],["images/characters/webp/kirby.webp","905d61454cc63f02f4b0e63364f0d6f6"],["images/characters/webp/link.webp","cf7d3bed4743b2a9bee29edefff1541a"],["images/characters/webp/littlemac.webp","a7a33a3af22f5ab2db9869af2b09f8af"],["images/characters/webp/lucario.webp","02a8a47407a2b53144c2178883c3db60"],["images/characters/webp/lucas.webp","8bafeeea245d36d22b9bbd6a5dfb255e"],["images/characters/webp/lucina.webp","6199537a1ce9673fdb18f1c727f76e63"],["images/characters/webp/luigi.webp","dd1e9d0cd1e84807aa362745fc9c2ef6"],["images/characters/webp/mario.webp","6edc634781e6473e05b405f70606ef4b"],["images/characters/webp/marth.webp","892978b78bf6e799dc87e2e3ac098510"],["images/characters/webp/megaman.webp","d95ba8c46bcffe2fae637dfe71a193f4"],["images/characters/webp/metaknight.webp","5a30b41adf3c8edd7b3d58a56a9eae21"],["images/characters/webp/mewtwo.webp","65e5f0b04eafbe40d1d7efc9f5768dc9"],["images/characters/webp/miibrawler.webp","e1f49a3e46f7a5ebac5e5b6bfb7adaac"],["images/characters/webp/miigunner.webp","b11c8794a3285e22b0b3c983cd3142bf"],["images/characters/webp/miiswordfighter.webp","a9e642250636da1a2d247c751e7fb22f"],["images/characters/webp/ness.webp","bb34bc6426c0cf538aeab4b1edeb9309"],["images/characters/webp/olimar.webp","d7d7ef71fbcc8fc089b3eba816260d38"],["images/characters/webp/pacman.webp","c3a839ca92f98f77422e6a43ed044ba0"],["images/characters/webp/palutena.webp","5b6499bfaeb03a42686e920716f6bc75"],["images/characters/webp/peach.webp","89277c123b7c90a9a28dc7a47499780d"],["images/characters/webp/pikachu.webp","e7d1b2e54d1b025e255082c77289842d"],["images/characters/webp/pit.webp","e9699982dc4f37766268debc87c10a5c"],["images/characters/webp/rob.webp","96b56b7466298442d1453c09cd4f1a7f"],["images/characters/webp/robin.webp","db58f42aab138bae8a6d996def304287"],["images/characters/webp/rosalina.webp","1d1e32d2593fa21d042a5f343838d077"],["images/characters/webp/roy.webp","8ed959bf76d4b6829e7cd5607c58cca8"],["images/characters/webp/ryu.webp","18f57d3f4d95a5a0e5b846688aab07cd"],["images/characters/webp/samus.webp","77712860732d0234397cbfb7ea302c84"],["images/characters/webp/sheik.webp","0d0ec6dbe26e6eafd75bd45c0e82d6fe"],["images/characters/webp/shulk.webp","afa9724b7c8dce00d9d67c50c7a33299"],["images/characters/webp/shulkbuster.webp","4c12858e1c8d55caaa87e845c40af891"],["images/characters/webp/shulkjump.webp","390c538826f710b90be4adbaf6918669"],["images/characters/webp/shulkshield.webp","b1f7d2fe5d1e015c96ba2a7ef543d28a"],["images/characters/webp/shulksmash.webp","797ee1e7136423261c777756a8d7577d"],["images/characters/webp/shulkspeed.webp","74fbccfd9505eb5ee00b597818f20483"],["images/characters/webp/sonic.webp","f565c748c8e9f69a9b68bad8a14ac884"],["images/characters/webp/toonlink.webp","aea365164e3c0a176826c6497943d588"],["images/characters/webp/villager.webp","70a44ad1da8ad92899bf00c5dcc1b869"],["images/characters/webp/wario.webp","7042a73f06f5219547f2e4cd26d5a18d"],["images/characters/webp/wiifittrainer.webp","be66aaa1f14641330b7fbb3c24d30a5c"],["images/characters/webp/yoshi.webp","4ca3f3c270247b6ab3a941870c77ac81"],["images/characters/webp/zelda.webp","f8d26609f90d9fca3bb97dd4a5a6ae05"],["images/characters/webp/zerosuitsamus.webp","47a392c944abff4e3529827147de3e58"],["images/dk-credits.jpg","ca6cbb27e1899021aec4dc67a42d2afc"],["images/dk-credits.webp","479d797f62a5b1c8477fe0c6b90fc7f9"],["images/icons/favicon.png","a74205f1c471a710eb8d5cbdabf4c67e"],["images/icons/launcher-icon-128x128.png","2323d53f5a46beee117e6667add687ef"],["images/icons/launcher-icon-144x144.png","852611c4be49a2e6dc4ed6ae827a98e1"],["images/icons/launcher-icon-152x152.png","c354a0b966c9a37cd5de4ae5128b4859"],["images/icons/launcher-icon-192x192.png","273f9dc404f23cbd47e317e8e0a92069"],["images/icons/launcher-icon-256x256.png","48d0a921a5154b17d1ce237b7bb6e08c"],["images/icons/launcher-icon-32x32.png","4ffde612072a7639ace3b7de7a9433f7"],["images/icons/launcher-icon-48x48.png","78ece7450975d3928ecc12062c550c01"],["images/icons/launcher-icon-512x512.png","2c28c1b6a6978b6dc73d90f64cedaec3"],["images/icons/launcher-icon-96x96.png","a3bdd8b6d255e475284493e13b1e90ce"],["images/loader.svg","19a10dffa4a51e9c6d9af7bf2badd394"],["images/spinner.svg","d7475a50ce7da510f787ac41203b038a"],["images/stages/stage_bf.jpg","9455f6419bdecd01c1f21474239a4765"],["images/stages/stage_dl.jpg","6d5f2e04652248e9c4b2763bbfd295f1"],["images/stages/stage_fd.jpg","30e61ec27ec98d8178ea5303513cba2a"],["images/stages/stage_ly.jpg","317f50d2a3a2f8a400de13d282f50c8c"],["images/stages/stage_sv.jpg","56b62342afa4acb6ad94e56aa587496e"],["images/stages/stage_sv2.jpg","f446cb5a4689792beac1deb026d1a992"],["images/stages/stage_tc.jpg","4c055a4ff35666861889d5be5369f841"],["images/stripe.png","e9e067edf63c732fb8c9293d48c2caf4"],["index.html","fb00d54dca4e81e6085c1318f94bb9b6"],["js/build/script.min.js","9c7799ea9b695ec4d8d1abf5073c8b2a"],["js/characters.js","fb12411f55642fd1e9276d3326a5d170"],["js/custom.js","75059e1dfca35161406c4361f36a5c80"],["js/main.js","ba2a199e99809c666ed9cfdc7079a075"],["js/page.js","2c5b8f4bc9cfb217321b126de1745405"],["js/vendor/classlist.min.js","e4e65696a17e84b7255325983281a7b8"],["js/vendor/countUp-jquery.js","6e4c206f76d1ab76df7dc78f0c1b5de2"],["js/vendor/countUp.min.js","b691eaa1cdfa4f4e542d5538321d1d5d"],["js/vendor/jquery-3.2.1.min.js","473957cfb255a781b42cb2af51d54a3b"],["js/vendor/jquery.animateNumber.min.js","c46a5138afcd0ac989037e5bc908bcac"],["js/vendor/jquery.sticky-kit.min.js","d61a7b888967697179c82adc5e7fc18d"],["js/vendor/jquery.waypoints.min.js","cebc34dedef229a98275955df75e20e5"],["js/vendor/knockout-3.3.0.js","0d5287807c6ba5e440445933688c233a"],["js/vendor/sticky.min.js","78646397a965971ef399c53e4c7d427d"],["manifest.json","53f66c7a21c7f69033b0f4d8976f34ab"],["offline.html","7df33eed1c9758a96830a197a4d3d237"],["sw.js","9b346164a935eb95e24d690a0d5b8e28"]];
var cacheName = 'sw-precache-v4-sw-precache-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







