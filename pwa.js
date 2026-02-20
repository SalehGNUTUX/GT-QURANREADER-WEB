// pwa.js - الإصدار المصحح
class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        
        this.init();
    }
    
    init() {
        this.registerServiceWorker();
        this.hideInstallButton();
        this.detectStandaloneMode();
    }
    
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            const swUrl = this.getServiceWorkerUrl();
            navigator.serviceWorker.register(swUrl)
                .then(registration => {
                    console.log('✅ Service Worker مسجل بنجاح:', registration);
                    
                    // التحقق من التحديثات
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('🔄 تم العثور على تحديث جديد');
                        
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                this.showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('❌ فشل تسجيل Service Worker:', error);
                });
            
            // الاستماع للتغييرات
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('🔄 تغيير في Service Worker controller');
            });
        }
    }

    getServiceWorkerUrl() {
        // Prefer registering relative to the current subfolder for GitHub Pages.
        // Example: /GT-QURANREADER-WEB/index.html -> /GT-QURANREADER-WEB/service-worker.js
        const pathname = window.location.pathname || '/';
        const segments = pathname.split('/').filter(Boolean);

        // If the app is served from a subfolder, use that as scope base.
        // If served from domain root, keep it at '/service-worker.js'.
        if (segments.length > 0) {
            const base = `/${segments[0]}/`;
            return `${base}service-worker.js`;
        }

        // If served from domain root
        if (pathname === '/' || pathname === '') {
            return '/service-worker.js';
        }

        // Legacy fallback default (historical app folder)
        return '/GT-QURANREADER-WEB/service-worker.js';
    }
    
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.hideInstallButton();
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('✅ التطبيق مثبت بنجاح');
            this.hideInstallButton();
            this.deferredPrompt = null;
        });
    }
    
    showInstallButton() {
        let installBtn = document.getElementById('pwa-install');
        if (!installBtn) {
            installBtn = document.createElement('button');
            installBtn.id = 'pwa-install';
            installBtn.innerHTML = '<i class="fas fa-download"></i>';
            installBtn.className = 'floating-btn';
            installBtn.title = 'تثبيت التطبيق';
            installBtn.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 20px;
                z-index: 1000;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                font-size: 24px;
                cursor: pointer;
                box-shadow: var(--shadow-dark);
                transition: all 0.3s ease;
            `;
            
            installBtn.addEventListener('click', () => this.installApp());
            document.body.appendChild(installBtn);
        }
    }
    
    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install');
        if (installBtn) {
            installBtn.remove();
        }
    }
    
    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('✅ المستخدم قبل تثبيت التطبيق');
            } else {
                console.log('❌ المستخدم رفض تثبيت التطبيق');
            }
            
            this.deferredPrompt = null;
            this.hideInstallButton();
        }
    }
    
    detectStandaloneMode() {
        if (this.isStandalone) {
            console.log('📱 التطبيق يعمل في وضع standalone');
            document.body.classList.add('standalone-mode');
        }
    }
    
    showUpdateNotification() {
        if (confirm('توجد نسخة جديدة من التطبيق. هل تريد تحديثه الآن؟')) {
            window.location.reload();
        }
    }
}

// تهيئة PWA عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new PWAInstaller();
});
