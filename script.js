// script.js - النسخة المصححة لمشاكل الصور والبحث
// GT-QURANREADER-WEB — نسخة محسنة مع إصلاحات شاملة

// ========================================
// إعدادات التطبيق (مصادر البيانات)
// ========================================
const APP_CONFIG = {
    // مصادر الصوت (سور كاملة)
    audio: {
        sources: [
            {
                name: "مشاري العفاسي",
                baseUrl: "https://server8.mp3quran.net/afs/",
                format: "mp3",
                    getUrl: (surahNumber) => {
                        const paddedNumber = surahNumber.toString().padStart(3, '0');
                        return `https://server8.mp3quran.net/afs/${paddedNumber}.mp3`;
                    }
            },
            {
                name: "عبد الباسط عبد الصمد",
                baseUrl: "https://server8.mp3quran.net/basit/",
                format: "mp3",
                    getUrl: (surahNumber) => {
                        const paddedNumber = surahNumber.toString().padStart(3, '0');
                        return `https://server8.mp3quran.net/basit/${paddedNumber}.mp3`;
                    }
            },
            {
                name: "سعد الغامدي",
                baseUrl: "https://server8.mp3quran.net/gaamdi/",
                format: "mp3",
                    getUrl: (surahNumber) => {
                        const paddedNumber = surahNumber.toString().padStart(3, '0');
                        return `https://server8.mp3quran.net/gaamdi/${paddedNumber}.mp3`;
                    }
            },
            {
                name: "محمود خليل الحصري",
                baseUrl: "https://server8.mp3quran.net/husr/",
                format: "mp3",
                    getUrl: (surahNumber) => {
                        const paddedNumber = surahNumber.toString().padStart(3, '0');
                        return `https://server8.mp3quran.net/husr/${paddedNumber}.mp3`;
                    }
            }
        ]
    },
    // *** تم التحديث هنا: المصدر الأساسي لصور المصحف ***
    image: {
        baseUrl: "https://raw.githubusercontent.com/SalehGNUTUX/Quran-PNG/master/"
    },
    // نص الآيات ومعلومات السور
    text: {
        baseUrlZstd: "./data/quran-uthmani-surahs.zst"
    }
};

// ========================================
// بيانات السور المضمنة (كاملة)
// ========================================
const EMBEDDED_SURAHS_DATA = [  // TODO: كل هذه المعلومات في ملف بيانات القرآن الذي الآن في المستودع
    { number: 1, name: { ar: "الفاتحة", en: "Al-Fatiha" }, verses_count: 7, revelation_place: { ar: "مكية" }, start_page: 1 },
{ number: 2, name: { ar: "البقرة", en: "Al-Baqarah" }, verses_count: 286, revelation_place: { ar: "مدنية" }, start_page: 2 },
{ number: 3, name: { ar: "آل عمران", en: "Aal-Imran" }, verses_count: 200, revelation_place: { ar: "مدنية" }, start_page: 50 },
{ number: 4, name: { ar: "النساء", en: "An-Nisa" }, verses_count: 176, revelation_place: { ar: "مدنية" }, start_page: 77 },
{ number: 5, name: { ar: "المائدة", en: "Al-Ma'idah" }, verses_count: 120, revelation_place: { ar: "مدنية" }, start_page: 106 },
{ number: 6, name: { ar: "الأنعام", en: "Al-An'am" }, verses_count: 165, revelation_place: { ar: "مكية" }, start_page: 128 },
{ number: 7, name: { ar: "الأعراف", en: "Al-A'raf" }, verses_count: 206, revelation_place: { ar: "مكية" }, start_page: 151 },
{ number: 8, name: { ar: "الأنفال", en: "Al-Anfal" }, verses_count: 75, revelation_place: { ar: "مدنية" }, start_page: 177 },
{ number: 9, name: { ar: "التوبة", en: "At-Tawbah" }, verses_count: 129, revelation_place: { ar: "مدنية" }, start_page: 187 },
{ number: 10, name: { ar: "يونس", en: "Yunus" }, verses_count: 109, revelation_place: { ar: "مكية" }, start_page: 208 },
{ number: 11, name: { ar: "هود", en: "Hud" }, verses_count: 123, revelation_place: { ar: "مكية" }, start_page: 221 },
{ number: 12, name: { ar: "يوسف", en: "Yusuf" }, verses_count: 111, revelation_place: { ar: "مكية" }, start_page: 235 },
{ number: 13, name: { ar: "الرعد", en: "Ar-Ra'd" }, verses_count: 43, revelation_place: { ar: "مدنية" }, start_page: 249 },
{ number: 14, name: { ar: "إبراهيم", en: "Ibrahim" }, verses_count: 52, revelation_place: { ar: "مكية" }, start_page: 255 },
{ number: 15, name: { ar: "الحجر", en: "Al-Hijr" }, verses_count: 99, revelation_place: { ar: "مكية" }, start_page: 262 },
{ number: 16, name: { ar: "النحل", en: "An-Nahl" }, verses_count: 128, revelation_place: { ar: "مكية" }, start_page: 267 },
{ number: 17, name: { ar: "الإسراء", en: "Al-Isra" }, verses_count: 111, revelation_place: { ar: "مكية" }, start_page: 282 },
{ number: 18, name: { ar: "الكهف", en: "Al-Kahf" }, verses_count: 110, revelation_place: { ar: "مكية" }, start_page: 293 },
{ number: 19, name: { ar: "مريم", en: "Maryam" }, verses_count: 98, revelation_place: { ar: "مكية" }, start_page: 305 },
{ number: 20, name: { ar: "طه", en: "Taha" }, verses_count: 135, revelation_place: { ar: "مكية" }, start_page: 312 },
{ number: 21, name: { ar: "الأنبياء", en: "Al-Anbiya" }, verses_count: 112, revelation_place: { ar: "مكية" }, start_page: 322 },
{ number: 22, name: { ar: "الحج", en: "Al-Hajj" }, verses_count: 78, revelation_place: { ar: "مدنية" }, start_page: 332 },
{ number: 23, name: { ar: "المؤمنون", en: "Al-Mu'minun" }, verses_count: 118, revelation_place: { ar: "مكية" }, start_page: 342 },
{ number: 24, name: { ar: "النور", en: "An-Nur" }, verses_count: 64, revelation_place: { ar: "مدنية" }, start_page: 350 },
{ number: 25, name: { ar: "الفرقان", en: "Al-Furqan" }, verses_count: 77, revelation_place: { ar: "مكية" }, start_page: 359 },
{ number: 26, name: { ar: "الشعراء", en: "Ash-Shu'ara" }, verses_count: 227, revelation_place: { ar: "مكية" }, start_page: 367 },
{ number: 27, name: { ar: "النمل", en: "An-Naml" }, verses_count: 93, revelation_place: { ar: "مكية" }, start_page: 377 },
{ number: 28, name: { ar: "القصص", en: "Al-Qasas" }, verses_count: 88, revelation_place: { ar: "مكية" }, start_page: 385 },
{ number: 29, name: { ar: "العنكبوت", en: "Al-Ankabut" }, verses_count: 69, revelation_place: { ar: "مكية" }, start_page: 396 },
{ number: 30, name: { ar: "الروم", en: "Ar-Rum" }, verses_count: 60, revelation_place: { ar: "مكية" }, start_page: 404 },
{ number: 31, name: { ar: "لقمان", en: "Luqman" }, verses_count: 34, revelation_place: { ar: "مكية" }, start_page: 411 },
{ number: 32, name: { ar: "السجدة", en: "As-Sajdah" }, verses_count: 30, revelation_place: { ar: "مكية" }, start_page: 415 },
{ number: 33, name: { ar: "الأحزاب", en: "Al-Ahzab" }, verses_count: 73, revelation_place: { ar: "مدنية" }, start_page: 418 },
{ number: 34, name: { ar: "سبأ", en: "Saba" }, verses_count: 54, revelation_place: { ar: "مكية" }, start_page: 428 },
{ number: 35, name: { ar: "فاطر", en: "Fatir" }, verses_count: 45, revelation_place: { ar: "مكية" }, start_page: 434 },
{ number: 36, name: { ar: "يس", en: "Ya-Sin" }, verses_count: 83, revelation_place: { ar: "مكية" }, start_page: 440 },
{ number: 37, name: { ar: "الصافات", en: "As-Saffat" }, verses_count: 182, revelation_place: { ar: "مكية" }, start_page: 446 },
{ number: 38, name: { ar: "ص", en: "Sad" }, verses_count: 88, revelation_place: { ar: "مكية" }, start_page: 453 },
{ number: 39, name: { ar: "الزمر", en: "Az-Zumar" }, verses_count: 75, revelation_place: { ar: "مكية" }, start_page: 458 },
{ number: 40, name: { ar: "غافر", en: "Ghafir" }, verses_count: 85, revelation_place: { ar: "مكية" }, start_page: 467 },
{ number: 41, name: { ar: "فصلت", en: "Fussilat" }, verses_count: 54, revelation_place: { ar: "مكية" }, start_page: 477 },
{ number: 42, name: { ar: "الشورى", en: "Ash-Shura" }, verses_count: 53, revelation_place: { ar: "مكية" }, start_page: 483 },
{ number: 43, name: { ar: "الزخرف", en: "Az-Zukhruf" }, verses_count: 89, revelation_place: { ar: "مكية" }, start_page: 489 },
{ number: 44, name: { ar: "الدخان", en: "Ad-Dukhan" }, verses_count: 59, revelation_place: { ar: "مكية" }, start_page: 496 },
{ number: 45, name: { ar: "الجاثية", en: "Al-Jathiyah" }, verses_count: 37, revelation_place: { ar: "مكية" }, start_page: 499 },
{ number: 46, name: { ar: "الأحقاف", en: "Al-Ahqaf" }, verses_count: 35, revelation_place: { ar: "مكية" }, start_page: 502 },
{ number: 47, name: { ar: "محمد", en: "Muhammad" }, verses_count: 38, revelation_place: { ar: "مدنية" }, start_page: 507 },
{ number: 48, name: { ar: "الفتح", en: "Al-Fath" }, verses_count: 29, revelation_place: { ar: "مدنية" }, start_page: 511 },
{ number: 49, name: { ar: "الحجرات", en: "Al-Hujurat" }, verses_count: 18, revelation_place: { ar: "مدنية" }, start_page: 515 },
{ number: 50, name: { ar: "ق", en: "Qaf" }, verses_count: 45, revelation_place: { ar: "مكية" }, start_page: 518 },
{ number: 51, name: { ar: "الذاريات", en: "Adh-Dhariyat" }, verses_count: 60, revelation_place: { ar: "مكية" }, start_page: 520 },
{ number: 52, name: { ar: "الطور", en: "At-Tur" }, verses_count: 49, revelation_place: { ar: "مكية" }, start_page: 523 },
{ number: 53, name: { ar: "النجم", en: "An-Najm" }, verses_count: 62, revelation_place: { ar: "مكية" }, start_page: 526 },
{ number: 54, name: { ar: "القمر", en: "Al-Qamar" }, verses_count: 55, revelation_place: { ar: "مكية" }, start_page: 528 },
{ number: 55, name: { ar: "الرحمن", en: "Ar-Rahman" }, verses_count: 78, revelation_place: { ar: "مدنية" }, start_page: 531 },
{ number: 56, name: { ar: "الواقعة", en: "Al-Waqi'ah" }, verses_count: 96, revelation_place: { ar: "مكية" }, start_page: 534 },
{ number: 57, name: { ar: "الحديد", en: "Al-Hadid" }, verses_count: 29, revelation_place: { ar: "مدنية" }, start_page: 537 },
{ number: 58, name: { ar: "المجادلة", en: "Al-Mujadilah" }, verses_count: 22, revelation_place: { ar: "مدنية" }, start_page: 542 },
{ number: 59, name: { ar: "الحشر", en: "Al-Hashr" }, verses_count: 24, revelation_place: { ar: "مدنية" }, start_page: 545 },
{ number: 60, name: { ar: "الممتحنة", en: "Al-Mumtahanah" }, verses_count: 13, revelation_place: { ar: "مدنية" }, start_page: 549 },
{ number: 61, name: { ar: "الصف", en: "As-Saff" }, verses_count: 14, revelation_place: { ar: "مدنية" }, start_page: 551 },
{ number: 62, name: { ar: "الجمعة", en: "Al-Jumu'ah" }, verses_count: 11, revelation_place: { ar: "مدنية" }, start_page: 553 },
{ number: 63, name: { ar: "المنافقون", en: "Al-Munafiqun" }, verses_count: 11, revelation_place: { ar: "مدنية" }, start_page: 554 },
{ number: 64, name: { ar: "التغابن", en: "At-Taghabun" }, verses_count: 18, revelation_place: { ar: "مدنية" }, start_page: 556 },
{ number: 65, name: { ar: "الطلاق", en: "At-Talaq" }, verses_count: 12, revelation_place: { ar: "مدنية" }, start_page: 558 },
{ number: 66, name: { ar: "التحريم", en: "At-Tahrim" }, verses_count: 12, revelation_place: { ar: "مدنية" }, start_page: 560 },
{ number: 67, name: { ar: "الملك", en: "Al-Mulk" }, verses_count: 30, revelation_place: { ar: "مكية" }, start_page: 562 },
{ number: 68, name: { ar: "القلم", en: "Al-Qalam" }, verses_count: 52, revelation_place: { ar: "مكية" }, start_page: 564 },
{ number: 69, name: { ar: "الحاقة", en: "Al-Haqqah" }, verses_count: 52, revelation_place: { ar: "مكية" }, start_page: 566 },
{ number: 70, name: { ar: "المعارج", en: "Al-Ma'arij" }, verses_count: 44, revelation_place: { ar: "مكية" }, start_page: 568 },
{ number: 71, name: { ar: "نوح", en: "Nuh" }, verses_count: 28, revelation_place: { ar: "مكية" }, start_page: 570 },
{ number: 72, name: { ar: "الجن", en: "Al-Jinn" }, verses_count: 28, revelation_place: { ar: "مكية" }, start_page: 572 },
{ number: 73, name: { ar: "المزمل", en: "Al-Muzzammil" }, verses_count: 20, revelation_place: { ar: "مكية" }, start_page: 574 },
{ number: 74, name: { ar: "المدثر", en: "Al-Muddathir" }, verses_count: 56, revelation_place: { ar: "مكية" }, start_page: 575 },
{ number: 75, name: { ar: "القيامة", en: "Al-Qiyamah" }, verses_count: 40, revelation_place: { ar: "مكية" }, start_page: 577 },
{ number: 76, name: { ar: "الإنسان", en: "Al-Insan" }, verses_count: 31, revelation_place: { ar: "مدنية" }, start_page: 578 },
{ number: 77, name: { ar: "المرسلات", en: "Al-Mursalat" }, verses_count: 50, revelation_place: { ar: "مكية" }, start_page: 580 },
{ number: 78, name: { ar: "النبأ", en: "An-Naba" }, verses_count: 40, revelation_place: { ar: "مكية" }, start_page: 582 },
{ number: 79, name: { ar: "النازعات", en: "An-Nazi'at" }, verses_count: 46, revelation_place: { ar: "مكية" }, start_page: 583 },
{ number: 80, name: { ar: "عبس", en: "Abasa" }, verses_count: 42, revelation_place: { ar: "مكية" }, start_page: 585 },
{ number: 81, name: { ar: "التكوير", en: "At-Takwir" }, verses_count: 29, revelation_place: { ar: "مكية" }, start_page: 586 },
{ number: 82, name: { ar: "الإنفطار", en: "Al-Infitar" }, verses_count: 19, revelation_place: { ar: "مكية" }, start_page: 587 },
{ number: 83, name: { ar: "المطففين", en: "Al-Mutaffifin" }, verses_count: 36, revelation_place: { ar: "مكية" }, start_page: 587 },
{ number: 84, name: { ar: "الانشقاق", en: "Al-Inshiqaq" }, verses_count: 25, revelation_place: { ar: "مكية" }, start_page: 589 },
{ number: 85, name: { ar: "البروج", en: "Al-Buruj" }, verses_count: 22, revelation_place: { ar: "مكية" }, start_page: 590 },
{ number: 86, name: { ar: "الطارق", en: "At-Tariq" }, verses_count: 17, revelation_place: { ar: "مكية" }, start_page: 591 },
{ number: 87, name: { ar: "الأعلى", en: "Al-A'la" }, verses_count: 19, revelation_place: { ar: "مكية" }, start_page: 591 },
{ number: 88, name: { ar: "الغاشية", en: "Al-Ghashiyah" }, verses_count: 26, revelation_place: { ar: "مكية" }, start_page: 592 },
{ number: 89, name: { ar: "الفجر", en: "Al-Fajr" }, verses_count: 30, revelation_place: { ar: "مكية" }, start_page: 593 },
{ number: 90, name: { ar: "البلد", en: "Al-Balad" }, verses_count: 20, revelation_place: { ar: "مكية" }, start_page: 594 },
{ number: 91, name: { ar: "الشمس", en: "Ash-Shams" }, verses_count: 15, revelation_place: { ar: "مكية" }, start_page: 595 },
{ number: 92, name: { ar: "الليل", en: "Al-Layl" }, verses_count: 21, revelation_place: { ar: "مكية" }, start_page: 595 },
{ number: 93, name: { ar: "الضحى", en: "Ad-Duha" }, verses_count: 11, revelation_place: { ar: "مكية" }, start_page: 596 },
{ number: 94, name: { ar: "الشرح", en: "Ash-Sharh" }, verses_count: 8, revelation_place: { ar: "مكية" }, start_page: 596 },
{ number: 95, name: { ar: "التين", en: "At-Tin" }, verses_count: 8, revelation_place: { ar: "مكية" }, start_page: 597 },
{ number: 96, name: { ar: "العلق", en: "Al-Alaq" }, verses_count: 19, revelation_place: { ar: "مكية" }, start_page: 597 },
{ number: 97, name: { ar: "القدر", en: "Al-Qadr" }, verses_count: 5, revelation_place: { ar: "مكية" }, start_page: 598 },
{ number: 98, name: { ar: "البينة", en: "Al-Bayyinah" }, verses_count: 8, revelation_place: { ar: "مدنية" }, start_page: 598 },
{ number: 99, name: { ar: "الزلزلة", en: "Az-Zalzalah" }, verses_count: 8, revelation_place: { ar: "مدنية" }, start_page: 599 },
{ number: 100, name: { ar: "العاديات", en: "Al-Adiyat" }, verses_count: 11, revelation_place: { ar: "مكية" }, start_page: 599 },
{ number: 101, name: { ar: "القارعة", en: "Al-Qari'ah" }, verses_count: 11, revelation_place: { ar: "مكية" }, start_page: 600 },
{ number: 102, name: { ar: "التكاثر", en: "At-Takathur" }, verses_count: 8, revelation_place: { ar: "مكية" }, start_page: 600 },
{ number: 103, name: { ar: "العصر", en: "Al-Asr" }, verses_count: 3, revelation_place: { ar: "مكية" }, start_page: 601 },
{ number: 104, name: { ar: "الهمزة", en: "Al-Humazah" }, verses_count: 9, revelation_place: { ar: "مكية" }, start_page: 601 },
{ number: 105, name: { ar: "الفيل", en: "Al-Fil" }, verses_count: 5, revelation_place: { ar: "مكية" }, start_page: 601 },
{ number: 106, name: { ar: "قريش", en: "Quraysh" }, verses_count: 4, revelation_place: { ar: "مكية" }, start_page: 602 },
{ number: 107, name: { ar: "الماعون", en: "Al-Ma'un" }, verses_count: 7, revelation_place: { ar: "مكية" }, start_page: 602 },
{ number: 108, name: { ar: "الكوثر", en: "Al-Kawthar" }, verses_count: 3, revelation_place: { ar: "مكية" }, start_page: 602 },
{ number: 109, name: { ar: "الكافرون", en: "Al-Kafirun" }, verses_count: 6, revelation_place: { ar: "مكية" }, start_page: 603 },
{ number: 110, name: { ar: "النصر", en: "An-Nasr" }, verses_count: 3, revelation_place: { ar: "مدنية" }, start_page: 603 },
{ number: 111, name: { ar: "المسد", en: "Al-Masad" }, verses_count: 5, revelation_place: { ar: "مكية" }, start_page: 603 },
{ number: 112, name: { ar: "الإخلاص", en: "Al-Ikhlas" }, verses_count: 4, revelation_place: { ar: "مكية" }, start_page: 604 },
{ number: 113, name: { ar: "الفلق", en: "Al-Falaq" }, verses_count: 5, revelation_place: { ar: "مكية" }, start_page: 604 },
{ number: 114, name: { ar: "الناس", en: "An-Nas" }, verses_count: 6, revelation_place: { ar: "مكية" }, start_page: 604 }
];

// قائمة الخطوط المعتمدة
const AVAILABLE_FONTS = [
    { id: 'UthmanicHafs1', name: 'خط عثماني (المصحف)', style: 'UthmanicHafs1 Ver13.otf' },
    { id: 'AmiriQuran', name: 'خط أميري', style: 'ArbFONTS-Amiri Quran.ttf' },
{ id: 'AmiriQuranColored', name: 'خط أميري ملون', style: 'amiri-quran-colored.ttf' },
];

// =======================================
// Zstd fetch & uncompress
// =======================================
function unzstd (path) {
  return fetch(path)
    .then((res) => res.ok ? res.arrayBuffer() : null)
    .then((buf) => (new TextDecoder).decode( fzstd.decompress(new Uint8Array(buf)) ) );
}

// ========================================
// QuranDataManager - مع تحسينات الأداء
// ========================================
class QuranDataManager {
    constructor() {
        this.textApiUrlZstd = APP_CONFIG.text.baseUrlZstd;
        this.imageUrlBase = APP_CONFIG.image.baseUrl;
        this.cache = new Map();
        this.pagesData = this.generatePagesData();
        this.surahsData = EMBEDDED_SURAHS_DATA;
    }

    generatePagesData() {
        const pages = [];
        for (let page = 1; page <= 604; page++) {
            const surah = getSurahByPage(page);
            const juz = calculateJuzFromPage(page);
            pages.push({
                page: page,
                start: {
                    surah_number: surah.number,
                    name: { ar: surah.name.ar },
                    juz: juz
                },
                end: {
                    surah_number: surah.number,
                    name: { ar: surah.name.ar }
                }
            });
        }
        return pages;
    }

    async loadData(type, params = {}) {
        const cacheKey = `${type}-${JSON.stringify(params)}`;
        if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

        if (!navigator.onLine && type !== 'pages' && type !== 'surahs') {
            console.warn(`❌ لا يوجد اتصال. لا يمكن جلب ${type} من الإنترنت.`);
            return this.getEmbeddedData(type);
        }

        try {
            let data;
            switch(type) {
                case 'pages':
                    data = this.pagesData;
                    break;
                case 'surahs':
                    data = this.surahsData;
                    break;
                case 'audio':
                    data = await this.loadAudioData(params.surah, params.reciterName);
                    break;
                case 'text':
                    data = await this.loadTextData();
                    break;
                default:
                    throw new Error(`نوع غير معروف: ${type}`);
            }
            this.cache.set(cacheKey, data);
            return data;
        } catch (err) {
            console.error(`❌ فشل تحميل ${type}:`, err);
            return this.getEmbeddedData(type);
        }
    }

    async loadTextData() {
        const url = this.textApiUrlZstd;
        try {
            return JSON.parse(await unzstd(url));
        } catch (err) {
            console.error('❌ خطأ في جلب نص القرآن:', err);
            return null;
        }
    }

    async loadAudioData(surahNumber, reciterName = 'مشاري العفاسي') {
        const reciter = APP_CONFIG.audio.sources.find(r => r.name === reciterName) || APP_CONFIG.audio.sources[0];
        const audioLink = reciter.getUrl(surahNumber);

        console.log(`📻 استخدام رابط الصوت: ${audioLink} للقارئ ${reciter.name}`);

        return {
            link: audioLink,
            name: reciter.name,
            reciterName: reciter.name
        };
    }

    getPageImageUrl(page) {
        const pageStr = String(page).padStart(3, '0');

        // المصدر الأساسي الجديد (تم التحديث)
        return `${this.imageUrlBase}${pageStr}.png`;
    }

    getEmbeddedData(type) {
        switch(type) {
            case 'pages': return this.pagesData;
            case 'surahs': return this.surahsData;
            default: return null;
        }
    }
}

// ========================================
// دوال مساعدة عامة
// ========================================
function getSurahByPage(page) {
    for (let i = EMBEDDED_SURAHS_DATA.length - 1; i >= 0; i--) {
        if (EMBEDDED_SURAHS_DATA[i].start_page <= page) {
            return EMBEDDED_SURAHS_DATA[i];
        }
    }
    return EMBEDDED_SURAHS_DATA[0];
}

function calculateJuzFromPage(page) {
    const juzPages = [1, 22, 42, 62, 82, 102, 122, 142, 162, 182, 202, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582];
    for (let i = juzPages.length - 1; i >= 0; i--) {
        if (page >= juzPages[i]) return i + 1;
    }
    return 1;
}

function getJuzStartPage(juz) {
    const juzPages = [1, 22, 42, 62, 82, 102, 122, 142, 162, 182, 202, 222, 242, 262, 282, 302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582];
    return juzPages[juz - 1] || 1;
}

// *** دالة تطبيع نص أقوى للبحث (إصلاح مشكلة البحث) ***
function normalizeText(text) {
    if (!text) return "";

    // 1. إزالة كل أشكال الألف (أ, إ, آ, ٱ, ا, ٰ) والهمزة (ء)
    // هذا يوحد "الرحمن" و "ٱلرَّحْمَٰنِ" إلى "لرحمن"
    text = text.replace(/[\u0621\u0622\u0623\u0625\u0671\u0627\u0670]/g, '');

    // 2. إزالة التشكيل (الحركات، التنوين، الشدة، السكون)
    text = text.normalize("NFD").replace(/[\u064b-\u0652]/g, "");

    // 3. توحيد الياء والتاء المربوطة
    text = text.replace(/[\u0649]/g, '\u064a'); // ى (ألف مقصورة) -> ي (ياء)
    text = text.replace(/[\u0629]/g, '\u0647'); // ة (تاء مربوطة) -> ه (هاء)

    // 4. إزالة الحركات الإضافية (واو صغيرة، ياء صغيرة)
    text = text.replace(/[\u06E5\u06E6]/g, '');

    // 5. إزالة التطويل (ـ)
    text = text.replace(/[\u0640]/g, '');

    return text;
}

// ========================================
// الفئة الرئيسية - QuranReader مع إصلاحات شاملة
// ========================================
class QuranReader {
    constructor() {
        this.currentPage = parseInt(localStorage.getItem('gt_quran_page')) || 1;
        this.totalPages = 604;
        this.zoomLevel = parseInt(localStorage.getItem('gt_text_zoom')) || 100;
        this.isPlaying = false;
        this.currentAudioSurah = null;
        this.autoPlayNext = localStorage.getItem('gt_autoplay') !== 'false';
        this.selectedReciterName = localStorage.getItem('gt_reciter_name') || 'مشاري العفاسي';
        this.selectedFont = localStorage.getItem('gt_quran_font') || 'UthmanicHafs1';

        this.dataManager = new QuranDataManager();
        this.isOnline = navigator.onLine;
        this.pagesData = null;
        this.surahsData = null;
        this.quranText = null;
        this.viewMode = localStorage.getItem('gt_quran_view') || 'text';

        this.initializeElements();
        this.setupEventListeners();
        this.setupOnlineHandler();
        this.setDefaultTheme();
        this.loadInitialData();
    }

    initializeElements() {
        // العناصر الأساسية
        this.quranImg = document.getElementById('quran-img');
        this.pageNumber = document.getElementById('page-number');
        this.surahInfo = document.getElementById('surah-info');
        this.juzInfo = document.getElementById('juz-info');
        this.audioPlayer = document.getElementById('quran-audio');
        this.loadingScreen = document.getElementById('loading-screen');
        this.container = document.querySelector('.container');
        this.connectionStatus = document.getElementById('connection-status');
        this.connectionIcon = document.getElementById('connection-icon');

        // عناصر التحكم
        this.zoomInBtn = document.getElementById('zoom-in');
        this.zoomOutBtn = document.getElementById('zoom-out');
        this.resetZoomBtn = document.getElementById('reset-zoom');
        this.zoomLevelDisplay = document.getElementById('zoom-level');

        // الأزرار الرئيسية
        this.prevBtn = document.getElementById('prev-page-btn');
        this.nextBtn = document.getElementById('next-page-btn');
        this.themeBtn = document.getElementById('toggle-theme');
        this.audioBtn = document.getElementById('audio-toggle');
        this.scrollTopBtn = document.getElementById('scroll-to-top');

        // الأزرار العائمة
        this.floatingPrevBtn = document.getElementById('floating-prev-btn');
        this.floatingNextBtn = document.getElementById('floating-next-btn');
        this.audioStopBtn = document.getElementById('audio-stop-btn');

        // مشغل الصوت
        this.audioFloating = document.querySelector('.audio-player-floating');
        this.closeAudioBtn = document.getElementById('close-audio');
        this.audioInfo = document.getElementById('audio-info');

        // التنقل
        this.navSurah = document.getElementById('nav-surah');
        this.navJuz = document.getElementById('nav-juz');
        this.navSajda = document.getElementById('nav-sajda');

        // البحث
        this.searchInput = document.getElementById('search-input');
        this.searchBtn = document.getElementById('search-btn');
        this.searchModal = document.getElementById('search-modal');
        this.searchResultsContent = document.getElementById('search-results-content');

        // النص
        this.textContainer = document.getElementById('quran-text');
        if (!this.textContainer) {
            const qPage = document.querySelector('.quran-page');
            this.textContainer = document.createElement('div');
            this.textContainer.id = 'quran-text';
            this.textContainer.className = 'quran-text-content';
            qPage.appendChild(this.textContainer);
        }

        // زر تبديل العرض
        this.viewToggleBtn = document.getElementById('toggle-view');
        this.fontSelectBtn = document.getElementById('font-select-btn');
        this.reciterSelectBtn = document.getElementById('reciter-select-btn');
    }

    setupEventListeners() {
        // التنقل بين الصفحات
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.previousPage());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextPage());

        // الأزرار العائمة للتنقل
        if (this.floatingPrevBtn) {
            this.floatingPrevBtn.addEventListener('click', () => this.previousPage());
        }
        if (this.floatingNextBtn) {
            this.floatingNextBtn.addEventListener('click', () => this.nextPage());
        }

        // تبديل الوضع
        if (this.themeBtn) this.themeBtn.addEventListener('click', () => this.toggleTheme());

        // التحكم الصوتي
        if (this.audioBtn) this.audioBtn.addEventListener('click', () => this.toggleAudio());
        if (this.audioStopBtn) {
            this.audioStopBtn.addEventListener('click', () => this.stopAudio());
        }
        if (this.closeAudioBtn) this.closeAudioBtn.addEventListener('click', () => this.hideAudioPlayer());
        if (this.reciterSelectBtn) {
            this.reciterSelectBtn.addEventListener('click', () => this.showReciterSelector());
        }

        // أحداث مشغل الصوت
        if (this.audioPlayer) {
            this.audioPlayer.addEventListener('ended', () => this.onAudioEnded());
            this.audioPlayer.addEventListener('play', () => this.onAudioPlay());
            this.audioPlayer.addEventListener('pause', () => this.onAudioPause());
        }

        // التحكم في التكبير
        if (this.zoomInBtn) this.zoomInBtn.addEventListener('click', () => this.zoomIn());
        if (this.zoomOutBtn) this.zoomOutBtn.addEventListener('click', () => this.zoomOut());
        if (this.resetZoomBtn) this.resetZoomBtn.addEventListener('click', () => this.resetZoom());
        this.updateZoomDisplay();

        // تبديل العرض
        if (this.viewToggleBtn) {
            this.viewToggleBtn.addEventListener('click', () => this.toggleView());
        }

        // اختيار الخط
        if (this.fontSelectBtn) {
            this.fontSelectBtn.addEventListener('click', () => this.showFontSelector());
        }

        // الصعود للأعلى
        if (this.scrollTopBtn) this.scrollTopBtn.addEventListener('click', () => this.scrollToTop());

        // البحث
        if (this.searchBtn) this.searchBtn.addEventListener('click', () => this.performSearch());
        if (this.searchInput) this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch();
            }
        });

        // التنقل السريع
        if (this.navSurah) this.navSurah.addEventListener('click', () => this.showSurahList());
        if (this.navJuz) this.navJuz.addEventListener('click', () => this.showJuzList());
        if (this.navSajda) this.navSajda.addEventListener('click', () => this.showSajdaInfo());

        // إغلاق النوافذ
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) modal.style.display = 'none';
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList && e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // اختصارات لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if (e.target === this.searchInput) return;

            if (e.key === 'ArrowRight') this.nextPage();
            if (e.key === 'ArrowLeft') this.previousPage();
            if (e.key === ' ') {
                e.preventDefault();
                this.toggleAudio();
            }
            if (e.key === 'Escape') this.hideAudioPlayer();
            if (e.key === 'v') this.toggleView();
            if (e.key === 'f') this.showFontSelector();
            if (e.key === 'r') this.showReciterSelector();
        });

            window.addEventListener('scroll', () => this.toggleScrollTopButton());
    }

    setupOnlineHandler() {
        window.addEventListener('online', () => this.updateConnectionStatus(true));
        window.addEventListener('offline', () => this.updateConnectionStatus(false));
        this.updateConnectionStatus(navigator.onLine);
    }

    updateConnectionStatus(online) {
        this.isOnline = online;
        if (!this.connectionStatus || !this.connectionIcon) return;
        if (online) {
            this.connectionStatus.textContent = 'متصل بالإنترنت';
            this.connectionIcon.className = 'fas fa-wifi';
            this.connectionStatus.parentElement.classList.remove('offline');
            this.connectionStatus.parentElement.classList.add('online');
        } else {
            this.connectionStatus.textContent = 'غير متصل بالإنترنت';
            this.connectionIcon.className = 'fas fa-wifi-slash';
            this.connectionStatus.parentElement.classList.remove('online');
            this.connectionStatus.parentElement.classList.add('offline');
        }
    }

    setDefaultTheme() {
        const storedTheme = localStorage.getItem('gt_theme') || 'dark';
        document.body.classList.add(`${storedTheme}-mode`);
        this.updateThemeButton(storedTheme);
        this.applyImageFilter();
    }

    updateThemeButton(theme) {
        if (this.themeBtn) {
            const icon = this.themeBtn.querySelector('i');
            if (icon) {
                if (theme === 'dark') {
                    icon.className = 'fas fa-sun';
                    this.themeBtn.title = 'الوضع النهاري';
                } else {
                    icon.className = 'fas fa-moon';
                    this.themeBtn.title = 'الوضع الليلي';
                }
            }
        }
    }

    toggleTheme() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (isDarkMode) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            localStorage.setItem('gt_theme', 'light');
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('gt_theme', 'dark');
        }
        this.updateThemeButton(isDarkMode ? 'light' : 'dark');
        this.applyImageFilter();
    }

    // تطبيق فلتر الصور للوضع الداكن
    applyImageFilter() {
        if (this.quranImg) {
            if (document.body.classList.contains('dark-mode')) {
                // في الوضع الداكن: عكس الألوان (الأبيض -> أسود، الأسود -> أبيض)
                this.quranImg.style.filter = 'invert(1)';
            } else {
                // في الوضع الفاتح: إزالة الفلتر
                this.quranImg.style.filter = 'none';
            }
        }
    }

    // ========================================
    // منطق تبديل وضع العرض (صورة/نص)
    // ========================================
    toggleView() {
        this.viewMode = this.viewMode === 'image' ? 'text' : 'image';
        localStorage.setItem('gt_quran_view', this.viewMode);
        this.updateToggleButtonUI();
        this.updatePage();
    }

    updateToggleButtonUI() {
        if (!this.viewToggleBtn) return;

        if (this.viewMode === 'text') {
            this.viewToggleBtn.innerHTML = '<i class="fas fa-image"></i>';
            this.viewToggleBtn.title = 'معاينة المصحف المصوّر';
        } else {
            this.viewToggleBtn.innerHTML = '<i class="fas fa-file-alt"></i>';
            this.viewToggleBtn.title = 'معاينة النص العثماني';
        }
    }

    // ========================================
    // منطق التكبير والتصغير للنص
    // ========================================
    zoomIn() {
        if (this.viewMode !== 'text') return;
        this.zoomLevel = Math.min(200, this.zoomLevel + 10);
        this.applyZoom();
    }

    zoomOut() {
        if (this.viewMode !== 'text') return;
        this.zoomLevel = Math.max(80, this.zoomLevel - 10);
        this.applyZoom();
    }

    resetZoom() {
        if (this.viewMode === 'image') return;
        this.zoomLevel = 100;
        this.applyZoom();
    }

    applyZoom() {
        if (this.textContainer) {
            const baseFontSize = 18;
            const newFontSize = baseFontSize * (this.zoomLevel / 100);
            this.textContainer.style.fontSize = `${newFontSize}px`;
            localStorage.setItem('gt_text_zoom', this.zoomLevel);
            this.updateZoomDisplay();
        }
    }

    updateZoomDisplay() {
        if (this.zoomLevelDisplay) {
            this.zoomLevelDisplay.textContent = `${this.zoomLevel}%`;
        }
    }

    // ========================================
    // التحميل المبدئي للبيانات
    // ========================================
    async loadInitialData() {
        try {
            this.showLoadingScreen('جاري تحميل بيانات القرآن...');
            const [pagesData, surahsData, quranText] = await Promise.all([
                this.dataManager.loadData('pages'),
                                                                         this.dataManager.loadData('surahs'),
                                                                         this.dataManager.loadData('text')
            ]);

            this.pagesData = pagesData;
            this.surahsData = surahsData;
            this.quranText = quranText;

            this.hideLoadingScreen();
            // تحديث واجهة زر التبديل بناءً على الوضع المحفوظ
            this.updateToggleButtonUI();
            // تطبيق الخط المحفوظ
            this.applyFont(this.selectedFont);
            // عرض الصفحة
            this.updatePage();
        } catch (err) {
            console.error('❌ خطأ في تحميل البيانات:', err);
            this.hideLoadingScreen();
            this.updatePage();
        }
    }

    showLoadingScreen(message = 'جاري التحميل...') {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'flex';
            const h2 = this.loadingScreen.querySelector('h2');
            if (h2) h2.textContent = message;
        }
        if (this.container) this.container.style.display = 'none';
    }

    hideLoadingScreen() {
        setTimeout(() => {
            if (this.loadingScreen) this.loadingScreen.style.display = 'none';
            if (this.container) this.container.style.display = 'flex';
        }, 700);
    }

    // ========================================
    // تغيير الصفحة (تحديث العرض: نص أو صورة)
    // ========================================
    async updatePage() {
        this.currentPage = Math.max(1, Math.min(this.totalPages, this.currentPage));
        localStorage.setItem('gt_quran_page', this.currentPage);

        this.pageNumber.textContent = `الصفحة: ${this.currentPage}`;
        this.updatePageInfo();

        if (this.viewMode === 'image') {
            await this.displayImagePage();
        } else {
            await this.displayTextPage();
        }
    }

    // *** تم إصلاح مشكلة "Race Condition" سابقاً، والآن تم تحديث المصدر في DataManager ***
    async displayImagePage() {
        this.quranImg.style.display = 'block';
        this.textContainer.style.display = 'none';

        const imageUrl = this.dataManager.getPageImageUrl(this.currentPage);
        console.log(`🖼️ جاري تحميل الصورة: ${imageUrl}`);

        // 1. تعيين معالج النجاح (يجب أن يتم قبل تحديد المصدر)
        this.quranImg.onload = () => {
            console.log(`✅ تم تحميل صفحة ${this.currentPage} بنجاح (المصدر الأساسي)`);
            this.applyImageFilter(); // تطبيق الفلتر عند النجاح
        };

        // 2. تعيين معالج الفشل (يجب أن يتم قبل تحديد المصدر)
        this.quranImg.onerror = () => {
            console.error(`❌ فشل تحميل صفحة ${this.currentPage} من المصدر الأساسي. المحاولة في مصادر بديلة...`);
            this.tryAlternativeImageSources();
        };

        // 3. الآن، قم بتعيين المصدر لبدء التحميل
        this.quranImg.src = imageUrl;
        this.quranImg.alt = `صفحة القرآن ${this.currentPage}`;
    }

    // دالة المصادر البديلة (محتفظ بها كخيار احتياطي)
    tryAlternativeImageSources() {
        const pageStr = String(this.currentPage).padStart(3, '0');
        const alternativeSources = [
            `https://quranpages.github.io/pages/page_${pageStr}.png`,
            `https://www.everyayah.com/data/images_png/${pageStr}.png`,
            `https://raw.githubusercontent.com/risan/quran-images/master/images/${pageStr}.png`
        ];

        let currentSourceIndex = 0;

        const tryNextSource = () => {
            if (currentSourceIndex >= alternativeSources.length) {
                console.error('❌ جميع مصادر الصور فشلت');
                this.showImageError();
                return;
            }

            const nextSource = alternativeSources[currentSourceIndex];
            console.log(`🔄 محاولة المصدر البديل ${currentSourceIndex + 1}: ${nextSource}`);

            this.quranImg.src = nextSource;
            currentSourceIndex++;
        };

        // إعادة تعيين معالج الأخطاء للمحاولات البديلة
        this.quranImg.onerror = () => {
            tryNextSource();
        };

        this.quranImg.onload = () => {
            console.log(`✅ تم تحميل الصورة من مصدر بديل: ${this.quranImg.src}`);
            // التأكد من تطبيق الفلتر على الصورة الجديدة
            this.applyImageFilter();
        };

        // بدء المحاولة الأولى بالمصدر البديل
        tryNextSource();
    }

    async displayTextPage() {
        this.quranImg.style.display = 'none';
        this.textContainer.style.display = 'block';

        if (!this.quranText) {
            this.textContainer.innerHTML = '<p class="text-error">⚠️ تعذر تحميل النص القرآني. يُرجى التحقق من اتصالك.</p>';
            return;
        }

        this.renderTextPage();
        this.applyZoom();
        this.applyFont(this.selectedFont);
    }

    // عرض النص على الصفحة الحالية
    renderTextPage() {
        const pageContent = document.createElement('div');
        pageContent.className = 'text-page-content';
        let foundContent = false;

        this.quranText.forEach(surah => {
            surah.ayahs.forEach(ayah => {
                if (ayah.page === this.currentPage) {
                    foundContent = true;
                    const ayahElement = document.createElement('p');
                    ayahElement.className = 'quran-ayah';
                    ayahElement.innerHTML = `${ayah.text} <span class="ayah-number">﴿${ayah.numberInSurah}﴾</span>`;
                    pageContent.appendChild(ayahElement);
                }
            });
        });

        if (foundContent) {
            this.textContainer.innerHTML = '';
            this.textContainer.appendChild(pageContent);
        } else {
            this.textContainer.innerHTML = '<p class="text-info">لا يوجد محتوى نصي مباشر لعرضه في هذه الصفحة.</p>';
        }
    }

    showImageError() {
        this.quranImg.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="900" viewBox="0 0 700 900"><rect width="100%" height="100%" fill="%231a1a2e"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="%23e9ecef">صفحة ${this.currentPage}</text></svg>`;
        // تطبيق الفلتر على صورة الخطأ أيضاً لضمان التوافق مع الوضع
        this.applyImageFilter();
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.updatePage();
            this.scrollToTop();
        }
    }

    nextPage() {
        this.goToPage(this.currentPage + 1);
    }

    previousPage() {
        this.goToPage(this.currentPage - 1);
    }

    updatePageInfo() {
        const pageData = this.pagesData.find(p => p.page === this.currentPage);
        if (pageData) {
            this.surahInfo.textContent = `السورة: ${pageData.start.name.ar}`;
            this.juzInfo.textContent = `الجزء: ${pageData.start.juz}`;
        }
    }

    // ========================================
    // منطق تشغيل الصوت
    // ========================================
    async toggleAudio() {
        if (this.isPlaying) {
            this.pauseAudio();
        } else {
            if (this.audioPlayer.src && this.audioPlayer.currentTime > 0) {
                await this.resumeAudio();
            } else {
                const surahOnPage = getSurahByPage(this.currentPage);
                await this.loadAndPlayAudioForSurah(surahOnPage.number);
            }
        }
    }

    pauseAudio() {
        this.audioPlayer.pause();
    }

    async resumeAudio() {
        try {
            await this.audioPlayer.play();
        } catch (error) {
            console.error('❌ فشل استئناف الصوت:', error);
        }
    }

    stopAudio() {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.isPlaying = false;
        this.updateAudioButton();
        this.showMessage('تم إيقاف التشغيل');
    }

    onAudioPlay() {
        this.isPlaying = true;
        this.updateAudioButton();
        this.audioFloating.classList.add('show');

        const surahName = this.surahsData.find(s => s.number === this.currentAudioSurah)?.name.ar || '...';
        this.audioInfo.textContent = `تلاوة: ${surahName} | القارئ: ${this.selectedReciterName}`;
    }

    onAudioPause() {
        this.isPlaying = false;
        this.updateAudioButton();
    }

    updateAudioButton() {
        if (this.audioBtn) {
            if (this.isPlaying) {
                this.audioBtn.innerHTML = '<i class="fas fa-pause"></i>';
                this.audioBtn.title = 'إيقاف مؤقت';
            } else {
                this.audioBtn.innerHTML = '<i class="fas fa-play"></i>';
                this.audioBtn.title = 'تشغيل التلاوة';
            }
        }
    }

    async onAudioEnded() {
        this.onAudioPause();
        if (this.autoPlayNext) {
            const nextSurahNumber = (this.currentAudioSurah || 0) + 1;
            if (nextSurahNumber <= 114) {
                console.log(`تم إنهاء سورة ${this.currentAudioSurah}. بدء تشغيل السورة ${nextSurahNumber}...`);
                await this.loadAndPlayAudioForSurah(nextSurahNumber);
            } else {
                this.hideAudioPlayer();
                this.showMessage('تم الانتهاء من القرآن الكريم', 'success');
            }
        }
    }

    async loadAndPlayAudioForSurah(surahNumber) {
        if (this.isPlaying && this.currentAudioSurah === surahNumber) {
            return;
        }

        try {
            const audioData = await this.dataManager.loadData('audio', {
                surah: surahNumber,
                reciterName: this.selectedReciterName
            });
            this.audioPlayer.src = audioData.link;
            this.audioPlayer.load();
            await this.audioPlayer.play();
            this.currentAudioSurah = surahNumber;
        } catch (error) {
            console.error('❌ فشل تشغيل الصوت:', error);
            this.showMessage('تعذر تشغيل الصوت. قد يكون الملف غير متوفر أو هناك مشكلة في الشبكة.', 'error');
            this.onAudioPause();
        }
    }

    hideAudioPlayer() {
        this.audioPlayer.pause();
        this.onAudioPause();
        this.audioFloating.classList.remove('show');
    }

    // ========================================
    // اختيار الخط والقارئ
    // ========================================
    showFontSelector() {
        const modal = document.getElementById('font-modal');
        const list = document.getElementById('font-selection-list');
        if (!modal || !list) {
            console.error('Modal or list not found for fonts');
            return;
        }

        list.innerHTML = '';
        AVAILABLE_FONTS.forEach(font => {
            const item = document.createElement('div');
            item.className = `font-option ${this.selectedFont === font.id ? 'selected' : ''}`;
            item.dataset.font = font.id;
            item.style.fontFamily = `'${font.id}', 'UthmanicHafs1'`; // Fallback
            item.innerHTML = `
            <div class="font-preview">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
            <div class="font-name">${font.name}</div>
            `;
            item.addEventListener('click', () => {
                this.applyFont(font.id);
                modal.style.display = 'none';
            });
            list.appendChild(item);
        });

        modal.style.display = 'flex';
    }

    applyFont(fontName) {
        this.selectedFont = fontName;
        if (this.textContainer) {
            this.textContainer.style.fontFamily = fontName;
        }
        localStorage.setItem('gt_quran_font', fontName);
        this.showMessage(`تم تطبيق الخط: ${AVAILABLE_FONTS.find(f => f.id === fontName)?.name}`);
    }

    showReciterSelector() {
        const modal = document.getElementById('reciter-modal');
        const list = document.getElementById('reciter-selection-list');
        if (!modal || !list) {
            console.error('Modal or list not found for reciters');
            return;
        }

        list.innerHTML = '';
        APP_CONFIG.audio.sources.forEach(reciter => {
            const item = document.createElement('div');
            item.className = `reciter-option ${this.selectedReciterName === reciter.name ? 'selected' : ''}`;
            item.dataset.reciter = reciter.name;
            item.innerHTML = `
            <div class="reciter-name">${reciter.name}</div>
            `;
            item.addEventListener('click', () => {
                this.selectReciter(reciter.name);
                modal.style.display = 'none';
            });
            list.appendChild(item);
        });

        modal.style.display = 'flex';
    }

    selectReciter(reciterName) {
        this.selectedReciterName = reciterName;
        localStorage.setItem('gt_reciter_name', reciterName);
        this.showMessage(`تم اختيار القارئ: ${reciterName}`);

        // إذا كان هناك سورة مشغلة حالياً، إعادة تحميلها بالقارئ الجديد
        if (this.currentAudioSurah) {
            this.loadAndPlayAudioForSurah(this.currentAudioSurah);
        }
    }

    // ========================================
    // قوائم السور والأجزاء والسجدات
    // ========================================
    showSurahList() {
        const modal = document.getElementById('surah-list');
        const list = document.getElementById('surah-list-content');
        if (!modal || !list) return;

        list.innerHTML = '';
        this.surahsData.forEach(surah => {
            const item = document.createElement('div');
            item.className = 'surah-item';
            item.innerHTML = `
            <div class="surah-name">${surah.name.ar}</div>
            <div class="surah-details">آيات: ${surah.verses_count} | ${surah.revelation_place.ar} | تبدأ من صفحة: ${surah.start_page}</div>
            `;
            item.addEventListener('click', () => {
                this.goToPage(surah.start_page);
                modal.style.display = 'none';
            });
            list.appendChild(item);
        });

        modal.style.display = 'flex';
    }

    showJuzList() {
        const modal = document.getElementById('juz-list');
        const list = document.getElementById('juz-list-content');
        if (!modal || !list) return;

        list.innerHTML = '';
        for (let j = 1; j <= 30; j++) {
            const startPage = getJuzStartPage(j);
            const surahStart = getSurahByPage(startPage);

            const item = document.createElement('div');
            item.className = 'juz-item';
            item.innerHTML = `
            <div class="surah-name">الجزء ${j}</div>
            <div class="surah-details">يبدأ من صفحة: ${startPage} | السورة: ${surahStart.name.ar}</div>
            `;
            item.addEventListener('click', () => {
                this.goToPage(startPage);
                modal.style.display = 'none';
            });
            list.appendChild(item);
        }

        modal.style.display = 'flex';
    }

    showSajdaInfo() {
        const sajdaAyahs = [
            { surah: 7, ayah: 206, page: 35, type: "تلاوة" },
            { surah: 13, ayah: 15, page: 253, type: "تلاوة" },
            { surah: 16, ayah: 50, page: 267, type: "تلاوة" },
            { surah: 17, ayah: 109, page: 293, type: "تلاوة" },
            { surah: 19, ayah: 58, page: 308, type: "تلاوة" },
            { surah: 22, ayah: 18, page: 337, type: "تلاوة" },
            { surah: 25, ayah: 60, page: 363, type: "تلاوة" },
            { surah: 27, ayah: 26, page: 385, type: "تلاوة" },
            { surah: 32, ayah: 15, page: 418, type: "تلاوة" },
            { surah: 38, ayah: 24, page: 455, type: "تلاوة" },
            { surah: 41, ayah: 38, page: 479, type: "تلاوة" },
            { surah: 53, ayah: 62, page: 526, type: "تلاوة" },
            { surah: 84, ayah: 21, page: 589, type: "تلاوة" },
            { surah: 96, ayah: 19, page: 597, type: "تلاوة" }
        ];

        // لا يوجد مودال للسجدات في HTML، سنستخدم مودال البحث كمؤقت
        const modal = document.getElementById('search-modal');
        const list = document.getElementById('search-results-content');
        if (!modal || !list) return;

        modal.querySelector('h3').innerHTML = '<i class="fas fa-prostrate"></i> مواضع السجود';

        list.innerHTML = '';
        sajdaAyahs.forEach(sajda => {
            const surah = this.surahsData.find(s => s.number === sajda.surah);
            const item = document.createElement('div');
            item.className = 'sajda-item'; // قد تحتاج لإضافة تنسيق .sajda-item
            item.dataset.page = sajda.page;
            item.innerHTML = `
            <div class="surah-name">سورة ${surah.name.ar} (آية ${sajda.ayah})</div>
            <div class="surah-details">الصفحة: ${sajda.page} | نوع السجود: ${sajda.type}</div>
            `;
            item.addEventListener('click', () => {
                this.goToPage(sajda.page);
                modal.style.display = 'none';
                // إعادة عنوان مودال البحث
                modal.querySelector('h3').innerHTML = '<i class="fas fa-search"></i> نتائج البحث';
            });
            list.appendChild(item);
        });

        modal.style.display = 'flex';
    }

    // ========================================
    // وظيفة البحث في النص القرآني
    // ========================================
    async performSearch() {
        const query = this.searchInput.value.trim();
        if (!query) {
            this.showMessage('يرجى إدخال كلمة للبحث');
            return;
        }

        if (!this.quranText) {
            this.showMessage('لم يتم تحميل النص القرآني بعد', 'error');
            return;
        }

        this.showLoadingScreen('جاري البحث...');

        try {
            // استخدام setTimeout لضمان عرض شاشة التحميل قبل بدء البحث المكثف
            setTimeout(() => {
                const results = this.searchInQuranText(query);
                this.displaySearchResults(results, query);
                this.hideLoadingScreen();
            }, 50);

        } catch (error) {
            console.error('❌ خطأ في البحث:', error);
            this.showMessage('حدث خطأ أثناء البحث', 'error');
            this.hideLoadingScreen();
        }
    }

    searchInQuranText(query) {
        // *** تم إصلاح مشكلة البحث هنا: باستخدام دالة تطبيع نص أقوى ***
        const normalizedQuery = normalizeText(query);
        console.log(`البحث عن النص الموحد: ${normalizedQuery}`);
        const results = [];

        if (!normalizedQuery) return [];

        this.quranText.forEach(surah => {
            surah.ayahs.forEach(ayah => {
                const normalizedText = normalizeText(ayah.text);
                if (normalizedText.includes(normalizedQuery)) {
                    results.push({
                        surahNumber: surah.number,
                        surahName: surah.name.ar, // استخدام الاسم العربي مباشرة
                        ayahNumber: ayah.numberInSurah,
                        ayahText: ayah.text,
                        page: ayah.page
                    });
                }
            });
        });

        console.log(`تم العثور على ${results.length} نتيجة`);
        return results;
    }

    displaySearchResults(results, query) {
        this.searchModal.style.display = 'flex';
        const modalTitle = this.searchModal.querySelector('h3');
        if (modalTitle) modalTitle.innerHTML = '<i class="fas fa-search"></i> نتائج البحث';

        if (results.length === 0) {
            this.searchResultsContent.innerHTML = `
            <div class="no-results" style="text-align: center; padding: 20px; color: var(--warning-color);">
            <i class="fas fa-search" style="font-size: 2em; margin-bottom: 10px;"></i>
            <p>لم يتم العثور على نتائج للبحث: "${query}"</p>
            </div>
            `;
            return;
        }

        // استخدام innerHTML مرة واحدة لتحسين الأداء
        this.searchResultsContent.innerHTML = `
        <div class="search-header" style="padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px; text-align: center;">
        <h4>نتائج البحث عن: "${query}"</h4>
        <div class="results-count" style="font-size: 0.9em; opacity: 0.8;">${results.length} نتيجة</div>
        </div>
        <div class="search-results-list">
        ${results.map(result => `
            <div class="search-result-item" data-page="${result.page}" style="cursor: pointer; padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div class="result-surah" style="font-weight: bold; color: var(--accent-color); margin-bottom: 5px;">سورة ${result.surahName} (آية ${result.ayahNumber})</div>
            <div class="result-text" style="font-family: 'UthmanicHafs1'; font-size: 1.2em; line-height: 1.8; margin-top: 10px;">${result.ayahText}</div>
            <div class="result-meta" style="font-size: 0.8em; opacity: 0.7; margin-top: 10px;">الصفحة: ${result.page}</div>
            </div>
            `).join('')}
            </div>
            `;

            // إضافة أحداث النقر للنتائج
            this.searchResultsContent.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const page = parseInt(item.dataset.page);
                    this.goToPage(page);
                    this.searchModal.style.display = 'none';
                });
            });
    }

    // ========================================
    // وظائف مساعدة إضافية
    // ========================================
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    toggleScrollTopButton() {
        if (this.scrollTopBtn) {
            if (window.scrollY > 300) {
                this.scrollTopBtn.classList.add('show');
            } else {
                this.scrollTopBtn.classList.remove('show');
            }
        }
    }

    showMessage(message, type = 'info') {
        // إزالة أي رسالة قديمة أولاً
        const oldMessage = document.querySelector('.floating-message');
        if (oldMessage) oldMessage.remove();

        const messageEl = document.createElement('div');
        messageEl.className = `floating-message ${type}`;
        messageEl.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        `;

        // إضافة الأنماط
        messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-50px);
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--accent-color)'};
        color: white;
        padding: 14px 22px;
        border-radius: var(--border-radius);
        z-index: 10000;
        font-size: 15px;
        font-weight: 600;
        opacity: 0;
        transition: all 0.4s ease;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        `;

        document.body.appendChild(messageEl);

        // إظهار الرسالة
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(-50%) translateY(0)';
        }, 50);

        // إخفاء الرسالة بعد 3 ثوان
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(-50%) translateY(-50px)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 400);
        }, 3000);
    }
}

// ========================================
// تهيئة التطبيق عند تحميل الصفحة
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة قارئ القرآن
    window.quranReader = new QuranReader();

    console.log('🚀 Quran Reader initialized successfully!');
});
