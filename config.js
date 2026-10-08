/* =====================================================
   HAT CANDY — CONFIG.JS (v2.0.0)
   الإعدادات المركزية — يُحمَّل أولاً قبل أي سكربت آخر
   Shared between Customer Store & Employee POS
   ===================================================== */

'use strict';

/**
 * @file Central configuration for the Hat Candy application.
 * Must be loaded FIRST before any other script.
 */

window.HAT_CONFIG = {
  /* ============ ENVIRONMENT ============ */
  env: 'production',              // 'development' | 'production'
  version: '2.0.0',

  /* ============ SITE / BRAND ============ */
  site: {
    name: 'Hat Candy',
    nameAr: 'هات كاندي',
    tagline: 'Every Candy Begins with Magic',
    taglineAr: 'كل قطعة حلوى تبدأ بالسحر',
    url: 'https://hatcandy.jo',
    locale: 'ar-JO',
    timezone: 'Asia/Amman',
    defaultLang: 'ar',
    supportedLangs: ['ar', 'en'],

    /* Currency */
    currency: 'JOD',
    currencySymbol: 'د.أ',
    currencySymbolEn: 'JOD',

    /* Contact */
    phone: '+962 7 9876 5432',
    email: 'hello@hatcandy.jo',
    address: 'عمّان، الأردن — شارع السحر',
    addressEn: 'Amman, Jordan — Magic Avenue',

    /* Business defaults */
    taxRate: 0.10,          // 10% tax rate
    defaultDeliveryFee: 2.00
  },

  /* ============ BACKEND API (Google Apps Script) ============ */
api: {
  provider: 'apps-script',
  url: 'https://script.google.com/macros/s/AKfycbw-AfF5nnrFPp4z8lCIZrn_lYvtAMARPIz0ZB9QKqIPzJFsQGTJ1eO00QTmZjSO866U/exec',
  adminToken: 'hatcandy-admin-2025-CHANGE-ME', // ← يجب أن يطابق ADMIN_TOKEN في Code.gs
  timeout: 15000,
  retries: 2,
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000        // 5 minutes
  }
},

  /* ============ FEATURE FLAGS ============ */
  features: {
    /* Core */
    multiLanguage: true,
    multiCurrency: false,
    pwa: true,
    cookieConsent: false,
    offlineCache: true,

    /* Store */
    reviews: false,
    wishlist: false,
    recentlyViewed: true,
    trustBadges: true,
    whatsappFloat: true,
    discountCodes: true,

    /* Sync */
    liveSync: true,
    forceLogout: true,
    dynamicStoreInfo: true,

    /* POS */
    cameraScanner: true,
    fullscreenMode: true,
    autoPrint: true,
    invoiceEdit: true,
    inventoryModule: true,
    splitPayment: true,
    refunds: true,
    holdSale: true,
    loyaltyProgram: true,
    cashDrawer: true,
    employeeDiscount: true,
    quickKeys: true,
    notifications: true
  },

  /* ============ SECURITY ============ */
  security: {
    adminEmail: 'admin',         // ⚠️ قم بتغييره في الإنتاج
    adminPassword: 'admin',      // ⚠️ قم بتغييره في الإنتاج
    overviewSecret: '1234',      // ⚠️ قم بتغييره في الإنتاج
    employeeUser: 'user',        
    employeePass: 'user'         
  },

  /* ============ EMPLOYEE POS SPECIFIC ============ */
  pos: {
    editWindowMs: 10 * 60 * 1000, // 10 minutes
    adminOverridePin: '1234',
    employeeRedirect: './employee/index.html',
    
    receipt: {
      thermalWidth: '72mm',
      paperWidth: '80mm',
      showBarcode: true,
      showQR: false,
      footerMessage: 'Thank you for your purchase!',
      returnPolicy: 'Keep this receipt for returns (7 days)'
    },

    scanner: {
      fps: 15, // تم تحسين الإطارات لسرعة القراءة
      qrboxRatio: 0.75,
      aspectRatio: 1.333,
      scanCooldownMs: 1800,
      vibrateOnScan: true,
      formats: [
        'QR_CODE', 'EAN_13', 'EAN_8', 'UPC_A', 'UPC_E', 
        'CODE_128', 'CODE_39', 'CODE_93', 'ITF', 'CODABAR', 
        'DATA_MATRIX', 'PDF_417'
      ]
    },

    fullscreenDelayMs: 8000,
    statusFlow: ['processing', 'packing', 'shipped', 'out_for_delivery', 'delivered'],
    barcodePrefix: 'HC',

    categoryCodes: {
      candy: '100',
      chocolate: '200',
      gummy: '300',
      lollipop: '400',
      marshmallow: '500',
      other: '900'
    },

    shops: [
      { id: 'main', name: 'Main Boutique (Amman)', nameAr: 'المتجر الرئيسي (عمان)' },
      { id: 'shop2', name: 'Shop 2 (Zarqa)', nameAr: 'فرع 2 (الزرقاء)' },
      { id: 'shop3', name: 'Shop 3 (Irbid)', nameAr: 'فرع 3 (إربد)' }
    ]
  },

  /* ============ STORAGE KEYS ============ */
  storageKeys: {
    /* Store Data */
    products: 'hatcandy-products',
    offers: 'hatcandy-offers',
    gallery: 'hatcandy-gallery',
    content: 'hatcandy-content',
    siteConfig: 'hatcandy-site-config',

    /* Mix Builder */
    mixWeights: 'hatcandy-mix-weights',
    mixPackaging: 'hatcandy-mix-packaging',
    candyTypes: 'hatcandy-candy-types',
    addons: 'hatcandy-addons',
    deliveryZones: 'hatcandy-delivery-zones',
    storeHours: 'hatcandy-store-hours',
    contact: 'hatcandy-contact',
    storeInfo: 'hatcandy-store-info',

    /* POS Data */
    employees: 'hatcandy-employees',
    employeeOrders: 'hatcandy-employee-orders',
    employeeShifts: 'hatcandy-employee-shifts',
    posSettings: 'hatcandy-pos-settings',

    /* Online Sync */
    onlineOrders: 'hatcandy-online-orders',

    /* Security & Logs */
    editLog: 'hatcandy-invoice-edits',
    editUnlocks: 'hatcandy-edit-unlocks',

    /* Inventory */
    inventoryItems: 'hatcandy-inventory-items',
    inventoryMoves: 'hatcandy-inventory-movements',

    /* User Accounts */
    googleAccounts: 'hatcandy-google-accounts',
    cards: 'hatcandy-cards',
    savedAddresses: 'hatcandy-saved-addresses',

    /* Modules */
    discountCodes: 'hatcandy-discount-codes',
    discountUsage: 'hatcandy-discount-usage',
    discountApplied: 'hatcandy-discount-applied',
    recentlyViewed: 'hatcandy-recently-viewed',
    whatsapp: 'hatcandy-whatsapp',

    /* POS Advanced */
    posHeldSales: 'hatcandy-pos-held-sales',
    posDrawer: 'hatcandy-pos-drawer',
    posLoyalty: 'hatcandy-loyalty-customers',
    posRefunds: 'hatcandy-pos-refunds',
    posEmpDiscounts: 'hatcandy-pos-employee-discounts',

    /* Notifications */
    posSeenOrders: 'hatcandy-pos-seen-orders',
    posNotifPerm: 'hatcandy-pos-notif-permission-asked',
    posNotifSound: 'hatcandy-pos-notif-sound',

    /* Core */
    cache: 'hatcandy-cache',
    lang: 'hatcandy-lang'
  },

  /* ============ UI DEFAULTS ============ */
  ui: {
    toastDurationMs: 2400,
    animationDuration: 300,
    debounceMs: 300,
    revealOffsetPx: 100
  },

  /* ============ LOGGING ============ */
  logging: {
    enabled: true,
    prefix: '🍬 [HAT]',
    colors: {
      info: 'color:#0ea5e9;font-weight:bold;',
      success: 'color:#22c55e;font-weight:bold;',
      warn: 'color:#f59e0b;font-weight:bold;',
      error: 'color:#ef4444;font-weight:bold;',
      brand: 'color:#e2015d;font-weight:bold;font-size:14px;'
    }
  },

  /* ============ DEFAULT STORE INFO ============ */
  defaultStoreInfo: {
    name: 'Hat Candy',
    nameAr: 'هات كاندي',
    slogan: 'Every Candy Begins with Magic',
    sloganAr: 'كل قطعة حلوى تبدأ بالسحر',
    address: 'Amman, Jordan — Magic Avenue',
    addressAr: 'عمّان، الأردن — شارع السحر',
    phone: '+962 7 9876 5432',
    email: 'hello@hatcandy.jo',
    logo: '',
    taxRate: 0.10
  }
};

/* =====================================================
   DEEP FREEZE — منع التعديل العرضي على الإعدادات
   ===================================================== */
const deepFreeze = (obj) => {
  if (!obj || typeof obj !== 'object' || Object.isFrozen(obj)) return obj;
  
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const propVal = obj[prop];
    if (propVal !== null && (typeof propVal === 'object' || typeof propVal === 'function') && !Object.isFrozen(propVal)) {
      deepFreeze(propVal);
    }
  });
  
  return obj;
};

deepFreeze(window.HAT_CONFIG);

/* ============ STARTUP LOG ============ */
if (window.HAT_CONFIG.logging.enabled) {
  const cfg = window.HAT_CONFIG;
  console.log(
    `%c${cfg.logging.prefix} CONFIG v${cfg.version} LOADED`,
    cfg.logging.colors.brand,
    `\n→ Environment: ${cfg.env}`,
    `\n→ Store: ${cfg.site.name} / ${cfg.site.nameAr}`,
    `\n→ Currency: ${cfg.site.currency} (${cfg.site.currencySymbol})`,
    `\n→ Default Lang: ${cfg.site.defaultLang}`,
    `\n→ POS Edit Window: ${cfg.pos.editWindowMs / 60000} mins`,
    `\n→ Live Sync: ${cfg.features.liveSync ? 'ON' : 'OFF'}`,
    `\n→ Discounts: ${cfg.features.discountCodes ? 'ON' : 'OFF'}`
  );
}