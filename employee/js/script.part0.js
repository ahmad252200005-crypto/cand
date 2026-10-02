/* =====================================================
   HAT CANDY — EMPLOYEE POS
   Part 0: Config bridge, constants, global state
   ===================================================== */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     1. CONFIG BRIDGE
     ═══════════════════════════════════════════════════════════ */
  if (!window.HAT_CONFIG) {
    console.error(
      '%c🍬 [Part 0] FATAL: HAT_CONFIG is not loaded!\n' +
      'Ensure <script src="../config.js"></script> is present.',
      'color:#ef4444;font-weight:bold;font-size:14px;'
    );
    return;
  }

  const CFG  = window.HAT_CONFIG;
  const POS  = CFG.pos         || {};
  const FEAT = CFG.features    || {};
  const SK   = CFG.storageKeys || {};
  const SITE = CFG.site        || {};

  window._CFG     = CFG;
  window._POS_CFG = POS;
  window.LS_KEYS  = SK;

  /* ═══════════════════════════════════════════════════════════
     2. FEATURE FLAGS
     ═══════════════════════════════════════════════════════════ */
  window.FEAT_INVENTORY      = FEAT.inventoryModule !== false;
  window.FEAT_CAMERA_SCANNER = FEAT.cameraScanner   !== false;
  window.FEAT_FULLSCREEN     = FEAT.fullscreenMode  !== false;
  window.FEAT_INVOICE_EDIT   = FEAT.invoiceEdit     !== false;

  /* ═══════════════════════════════════════════════════════════
     3. POS CONSTANTS
     ═══════════════════════════════════════════════════════════ */
  window.STATUS_FLOW = Array.isArray(POS.statusFlow) && POS.statusFlow.length
    ? POS.statusFlow.slice()
    : ['processing', 'packing', 'shipped', 'out_for_delivery', 'delivered'];

  window.EDIT_WINDOW_MS     = Number(POS.editWindowMs) || (10 * 60 * 1000);
  window.ADMIN_OVERRIDE_PIN = String(POS.adminOverridePin || '1234');

  window.CATEGORY_CODES = POS.categoryCodes
    ? Object.assign({}, POS.categoryCodes)
    : {
        candy:       '100',
        chocolate:   '200',
        gummy:       '300',
        lollipop:    '400',
        marshmallow: '500',
        other:       '900'
      };

  window.SCAN_COOLDOWN_MS =
    (POS.scanner && Number(POS.scanner.scanCooldownMs)) || 1800;

  /* ═══════════════════════════════════════════════════════════
     4. DEFAULT STORE INFO
     ═══════════════════════════════════════════════════════════ */
  const def = CFG.defaultStoreInfo || {};

  window.DEFAULT_STORE_INFO = {
    name:      def.name      || SITE.name      || 'Hat Candy',
    nameAr:    def.nameAr    || SITE.nameAr    || 'هات كاندي',
    slogan:    def.slogan    || SITE.tagline   || 'Every Candy Begins with Magic',
    sloganAr:  def.sloganAr  || SITE.taglineAr || 'كل قطعة حلوى تبدأ بالسحر',
    address:   def.address   || SITE.addressEn || 'Amman, Jordan — Magic Avenue',
    addressAr: def.addressAr || SITE.address   || 'عمّان، الأردن — شارع السحر',
    phone:     def.phone     || SITE.phone     || '+962 7 9876 5432',
    email:     def.email     || SITE.email     || 'hello@hatcandy.jo',
    logo:      def.logo      || '',
    taxRate:   Number(def.taxRate) || Number(SITE.taxRate) || 0.10
  };

  /* ═══════════════════════════════════════════════════════════
     5. MUTABLE STORE STATE
     ═══════════════════════════════════════════════════════════ */
  window.STORE_INFO = Object.assign({}, window.DEFAULT_STORE_INFO);
  window.TAX_RATE   = window.STORE_INFO.taxRate;

  /* ═══════════════════════════════════════════════════════════
     6. PRODUCTS / OFFERS / BOX_TYPES
     ═══════════════════════════════════════════════════════════ */
  window.PRODUCTS = [];

  window.DEFAULT_PRODUCTS = [
    { id: 'p1', name: 'Gummy Bears',    price: 2.50,
      img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400',
      stock: 50, pricingType: 'fixed' },
    { id: 'p2', name: 'Sour Worms',     price: 3.00,
      img: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=400',
      stock: 40, pricingType: 'fixed' },
    { id: 'p3', name: 'Milk Chocolate', price: 4.50,
      img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400',
      stock: 30, pricingType: 'fixed' },
    { id: 'p4', name: 'Dark Chocolate', price: 5.00,
      img: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
      stock: 25, pricingType: 'fixed' },
    { id: 'p5', name: 'Marshmallow',    price: 2.00,
      img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=400',
      stock: 60, pricingType: 'fixed' },
    { id: 'p6', name: 'Lollipops',      price: 1.50,
      img: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400',
      stock: 80, pricingType: 'fixed' }
  ];

  // ✅ إصلاح: ضمان أن OFFERS و BOX_TYPES عبارة عن Arrays دائماً
  window.OFFERS = Array.isArray(window.OFFERS) ? window.OFFERS : [
    { id: 'offer-1', name: 'Family Mix',      discount: '25% OFF',
      price: 12.99, oldPrice: 17.32,
      img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400' },
    { id: 'offer-2', name: 'Chocolate Dream', discount: 'SAVE 3 JOD',
      price: 9.99, oldPrice: 12.99,
      img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400' }
  ];

  window.BOX_TYPES = Array.isArray(window.BOX_TYPES) ? window.BOX_TYPES : [
    { id: 'small',  name: 'Small Box',  icon: 'bx-box',     price: 0   },
    { id: 'medium', name: 'Medium Box', icon: 'bx-package', price: 1.5 },
    { id: 'large',  name: 'Large Box',  icon: 'bx-archive', price: 3.0 },
    { id: 'gift',   name: 'Gift Box',   icon: 'bx-gift',    price: 5.0 }
  ];

  /* ═══════════════════════════════════════════════════════════
     7. ORDERS
     ═══════════════════════════════════════════════════════════ */
  window.onlineOrders = [];
  window.manualOrders = [];

  /* ═══════════════════════════════════════════════════════════
     8. INVENTORY
     ═══════════════════════════════════════════════════════════ */
  window.invItems                 = [];
  window.invMovements             = [];
  window.invReceiveBatch          = [];
  window.invTransferBatch         = [];
  window.invCurrentTab            = 'receive';
  window.invHistoryFilter         = 'all';
  window.invHistoryEmployeeFilter = 'all';
  window.invEditingItemId         = null;

  /* ═══════════════════════════════════════════════════════════
     9. SESSION / SHIFT
     ═══════════════════════════════════════════════════════════ */
  window.currentEmployee = null;
  window.currentShiftId  = null;

  /* ═══════════════════════════════════════════════════════════
     10. CURRENT ORDER / BOX
     ═══════════════════════════════════════════════════════════ */
  window.currentOrder     = { items: [], customer: { name: '', phone: '' } };
  window.currentBox       = null;
  window.currentOrderType = 'in-store';
  window.autoPrint        = true;

  /* ═══════════════════════════════════════════════════════════
     11. DELIVERY CENTER
     ═══════════════════════════════════════════════════════════ */
  window.activeDeliveryTab = 'online';
  window.onlineFilter      = 'all';
  window.manualFilter      = 'all';

  /* ═══════════════════════════════════════════════════════════
     12. MODAL DRAFTS
     ═══════════════════════════════════════════════════════════ */
  window.selectedProductForGram = null;

  window.manualDraft = {
    items: [],
    deliveryMethod: 'delivery',
    paymentMethod: 'cash'
  };

  window.boxBuilderState = {
    boxType: null,
    items: []
  };

  /* ═══════════════════════════════════════════════════════════
     13. RECEIPT
     ═══════════════════════════════════════════════════════════ */
  window.lastReceiptData = null;

  /* ═══════════════════════════════════════════════════════════
     14. INVOICE EDIT
     ═══════════════════════════════════════════════════════════ */
  window.editingOrder         = null;
  window.editingOrderOriginal = null;
  window.editingDraft         = null;
  window.editingIsUnlocked    = false;
  window.editTimerInterval    = null;

  /* ═══════════════════════════════════════════════════════════
     15. BARCODE SCANNER
     ═══════════════════════════════════════════════════════════ */
  window.html5QrCode         = null;
  window.scannerRunning      = false;
  window.scannerCameras      = [];
  window.currentCameraIndex  = 0;
  window.scannerMode         = null;
  window.lastScannedBarcode  = null;
  window.lastScanTimestamp   = 0;
  window.barcodeLookupTarget = null;
  window.labelPrintItem      = null;

  /* ═══════════════════════════════════════════════════════════
     16. DOM REFERENCES
     ═══════════════════════════════════════════════════════════ */
  function grabDOMRefs() {
    window.loginScreen = document.getElementById('loginScreen');
    window.posApp      = document.getElementById('posApp');
    window.loginForm   = document.getElementById('loginForm');
    window.loginError  = document.getElementById('loginError');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', grabDOMRefs);
  } else {
    grabDOMRefs();
  }

  /* ═══════════════════════════════════════════════════════════
     17. STARTUP LOG
     ═══════════════════════════════════════════════════════════ */
  console.log(
    '%c🍬 [Employee POS] Part 0 loaded — config bridge + constants + state',
    'color:#e2015d;font-weight:bold;'
  );

})();