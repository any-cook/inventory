// キャッシュバージョンを上げると古いキャッシュが自動削除される
const CACHE_NAME = 'anycook-inventory-v4';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  // v3以外のキャッシュを全削除
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) {
              console.log('[SW] 古いキャッシュ削除:', k);
              return caches.delete(k);
            })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  // Firebase・外部CDNはキャッシュしない
  var url = e.request.url;
  if (url.indexOf('firestore.googleapis.com') !== -1 ||
      url.indexOf('firebase') !== -1 ||
      url.indexOf('gstatic.com') !== -1) {
    return;
  }

  // ネットワーク優先（失敗時だけキャッシュ）
  e.respondWith(
    fetch(e.request).then(function(response) {
      // 成功したらキャッシュに保存
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, clone);
        });
      }
      return response;
    }).catch(function() {
      // オフライン時だけキャッシュを使う
      return caches.match(e.request);
    })
  );
});
