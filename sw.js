const CACHE_NAME = 'zenith-journal-cache-v1';

// On install, cache the app shell
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Service Worker: Caching app shell');
            // These are the minimal files required to display the app's "shell".
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                'https://cdn.tailwindcss.com'
            ]);
        })
    );
});

// On activate, clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// On fetch, use a stale-while-revalidate strategy
self.addEventListener('fetch', event => {
    // Let the browser handle non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Always fetch API requests from the network
    if (event.request.url.includes('googleapis.com')) {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    // If we get a valid response, cache it for future offline use
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(err => {
                    console.error('Service Worker: Fetch failed', err);
                    // If fetch fails (e.g., offline) and we have a cached response, the cached response is still returned.
                    // If there's no cached response either, the browser will show its default offline page.
                });

                // Return the cached response immediately if available, otherwise wait for the network
                return response || fetchPromise;
            });
        })
    );
});
