// use a cacheName for cache versioning
var cacheName = ['v2_1:static'];

// during the install phase you usually want to cache static assets
self.addEventListener('install', function(e) {
    // once the SW is installed, go ahead and fetch the resources to make this work offline

    // https://stackoverflow.com/questions/45467842/how-to-clear-cache-of-service-worker
    // caches.keys().then(function(names){
    //     for(let name of names)
    //         caches.delete(name);
    //     console.log('caches deleted!')
    // });
    console.log(cacheName[0] + ' is now installing');

    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll([

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
              '/images/dk-credits.jpg',
              '/images/icon-search.svg',
              'images/icon-search-active.svg'

            ]).then(function() {
                self.skipWaiting();
            });
        })
    );
});

self.addEventListener('activate', function(event){

    // delete any caches that aren't in cacheName
    // https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle

    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if(!cacheName.includes(key)){
                    return caches.delete(key);
                }
            })
        )).then(() => {
            console.log(cacheName[0] + ' now ready to handle fetches!');
        })
    );
})

// when the browser fetches a url
self.addEventListener('fetch', function(event) {
    // either respond with the cached object or go ahead and fetch the actual url
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                // retrieve from cache
                return response;
            }
            // fetch as normal
            return fetch(event.request);
        })
    );
});