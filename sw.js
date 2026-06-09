/* ============================================================
   PAISLEY PIE CO. — SERVICE WORKER
   Handles offline caching + push notifications for the PWA.
   ============================================================ */

const CACHE_NAME = 'ppc-v2';

/* Files to precache so the app works offline */
const PRECACHE = [
  '/index.html',
  '/menu.html',
  '/order.html',
  '/deals.html',
  '/news.html',
  '/track.html',
  '/staff-app.html',
  '/data.js',
  '/orders.js',
  '/config.js',
  '/audit.js',
  '/manifest.json',
  '/logo.png',
  '/pie.jpg'
];

/* ----------------------------------------------------------
   INSTALL — precache core assets
---------------------------------------------------------- */
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(PRECACHE.map(url => cache.add(new Request(url, { cache: 'reload' }))))
    )
  );
});

/* ----------------------------------------------------------
   ACTIVATE — delete old caches
---------------------------------------------------------- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* ----------------------------------------------------------
   FETCH — network-first with cache fallback
   Always network for API calls (Supabase, EmailJS, fonts, maps)
---------------------------------------------------------- */
const NETWORK_ONLY = /supabase\.co|emailjs\.com|fonts\.(google|gstatic)apis\.com|maps\.google|googleapis\.com/;

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (NETWORK_ONLY.test(event.request.url)) return; // let through to network untouched

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Stash a fresh copy in the cache
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        // Network failed — serve from cache, fall back to homepage
        caches.match(event.request).then(cached => cached || caches.match('/index.html'))
      )
  );
});

/* ----------------------------------------------------------
   PUSH NOTIFICATIONS
   Payload JSON:  { title, body, url, tag, actions }
---------------------------------------------------------- */
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body:    data.body    || 'You have an update from Paisley Pie Co.',
    icon:    '/logo.png',
    badge:   '/logo.png',
    tag:     data.tag     || 'ppc-update',
    data:    data,
    vibrate: [150, 50, 150],
    actions: data.actions || []
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'Paisley Pie Co. 🥧', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/index.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(wins => {
      for (const w of wins) {
        if (w.url.startsWith(self.location.origin) && 'focus' in w) {
          w.focus();
          w.navigate(url);
          return;
        }
      }
      return clients.openWindow(url);
    })
  );
});
