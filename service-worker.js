// service-worker.js - الإصدار النهائي
const CACHE_NAME = 'quran-reader-v4.1';
const SCOPE_PATHNAME = new URL(self.registration.scope).pathname;
const BASE = SCOPE_PATHNAME.endsWith('/') ? SCOPE_PATHNAME : `${SCOPE_PATHNAME}/`;
const STATIC_FILES = [
    BASE,
    `${BASE}index.html`,
    `${BASE}errors.html`,
    `${BASE}style.css`,
    `${BASE}script.js`,
    `${BASE}pwa.js`,
    `${BASE}manifest.json`,
    `${BASE}service-worker.js`,
    `${BASE}icons/icon-128x128.png`,
    `${BASE}icons/icon-512x512.png`
];

// التثبيت
self.addEventListener('install', (event) => {
    console.log('🔄 Service Worker: جاري التثبيت...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('✅ فتح الذاكرة المؤقتة');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => self.skipWaiting())
    );
});

// التفعيل
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker: جاري التفعيل...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ حذف الكاش القديم:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => self.clients.claim())
    );
});

// اعتراض الطلبات
self.addEventListener('fetch', (event) => {
    // للملفات المحلية ضمن نطاق الـ Service Worker فقط
    if (event.request.url.startsWith(self.registration.scope)) {
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
    }
});
