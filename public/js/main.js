// Register the service worker (if available).
// Updating this to include push manager for updating the PWA
// https://developers.google.com/web/fundamentals/getting-started/codelabs/push-notifications/
if('serviceWorker' in navigator && 'PushManager' in window){
    console.log('Service Worker and Push is supported');
    navigator.serviceWorker.register('./service-worker.js').then(function(reg){
        console.log('Successfully registered service worker', reg);
    }).catch(function(err){
        console.warn('Error while registering service worker', err);
    });
} else {
    console.warn('Push messaging is not supported');
    pushButton.textContent = 'Push Not Supported';
}

window.addEventListener('online', function(e) {
    // re-sync data with server
    console.log("You are online");
    Page.hideOfflineWarning();
    characters.loadData();
}, false);

window.addEventListener('offline', function(e) {
    // queue up events for server
    console.log("You are offline");
    Page.showOfflineWarning();
}, false);


// check if the user is connected
if (navigator.onLine) {
    characters.loadData();
} else {
    characters.loadData();
    // show offline message
    Page.showOfflineWarning();
}


// set knockout view model bindings
ko.applyBindings(Page.vm);