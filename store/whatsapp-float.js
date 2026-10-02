/* =====================================================
   HAT CANDY — WHATSAPP FLOAT BUTTON
   زر واتساب عائم + طلب سريع عبر واتساب
   ===================================================== */
(function () {
  'use strict';

  /* ============ Feature flag ============ */
  const CFG = window.HAT_CONFIG || {};
  const FEAT = CFG.features || {};
  if (FEAT.whatsappFloat === false) {
    console.log('%c💬 WhatsApp float: disabled by feature flag', 'color:#9ca3af;font-weight:bold;');
    return;
  }

  /* ============ Storage key ============ */
  const SK = CFG.storageKeys || {};
  const WA_KEY = SK.whatsapp || 'hatcandy-whatsapp';

  /* ============================================================
     CONFIG
     ============================================================ */
  const DEFAULT_CFG = {
    phone: '962798765432',       // بدون + أو أصفار
    enabled: true,
    message: {
      en: 'Hello Hat Candy! 👋\nI would like to order some sweets.',
      ar: 'مرحباً هات كاندي! 👋\nأرغب بطلب بعض الحلويات.'
    },
    productMessage: {
      en: 'Hello Hat Candy! 👋\nI\'m interested in: *{name}*\nPrice: {price}\n\nCan you help me order?',
      ar: 'مرحباً هات كاندي! 👋\nأنا مهتم بـ: *{name}*\nالسعر: {price}\n\nهل يمكنكم مساعدتي بالطلب؟'
    },
    businessHours: {
      enabled: true,
      open: 8,
      close: 17,
      autoSync: true              // ✅ يقرأ من storeHours تلقائياً
    },
    greeting: {
      en: 'Need help? Chat with us!',
      ar: 'تحتاج مساعدة؟ تواصل معنا!'
    }
  };

  /* Read saved config, with defaults */
  function getCfg() {
    let saved = {};
    try {
      const raw = localStorage.getItem(WA_KEY);
      if (raw) saved = JSON.parse(raw) || {};
    } catch {}
    /* Deep merge: keep DEFAULT for any missing key */
    return {
      ...DEFAULT_CFG,
      ...saved,
      message:        { ...DEFAULT_CFG.message,        ...(saved.message || {}) },
      productMessage: { ...DEFAULT_CFG.productMessage, ...(saved.productMessage || {}) },
      businessHours:  { ...DEFAULT_CFG.businessHours,  ...(saved.businessHours || {}) },
      greeting:       { ...DEFAULT_CFG.greeting,       ...(saved.greeting || {}) }
    };
  }

  const cfg = getCfg();
  if (!cfg.enabled) {
    console.log('%c💬 WhatsApp float: disabled by user config', 'color:#9ca3af;font-weight:bold;');
    return;
  }

  const lang = () => window.lang || CFG.site?.defaultLang || 'ar';
  const tr   = (obj) => obj[lang()] || obj.en || '';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g,
      m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
  function fmt(n) {
    if (typeof window.formatPrice === 'function') return window.formatPrice(n);
    return '$' + (Number(n) || 0).toFixed(2);
  }

  /* ============================================================
     EFFECTIVE CONFIG HELPERS
     ============================================================ */

  /* Resolve phone: saved config → storeInfo → HAT_CONFIG.site → default */
  function resolvePhone() {
    if (cfg.phone && cfg.phone.trim() && cfg.phone !== DEFAULT_CFG.phone) {
      return cfg.phone.trim();
    }
    /* Try dynamic storeInfo */
    try {
      const raw = localStorage.getItem(SK.storeInfo || 'hatcandy-store-info');
      if (raw) {
        const info = JSON.parse(raw);
        if (info.phone) {
          return String(info.phone).replace(/\D/g, '');
        }
      }
    } catch {}
    /* Try config.site.phone */
    if (CFG.site && CFG.site.phone) {
      return String(CFG.site.phone).replace(/\D/g, '');
    }
    return cfg.phone.trim() || DEFAULT_CFG.phone;
  }

  /* Resolve business hours: cfg.businessHours → storeHours → defaults */
  function resolveHours() {
    if (!cfg.businessHours.enabled) return null;
    /* If autoSync, read from storeHours */
    if (cfg.businessHours.autoSync) {
      try {
        const raw = localStorage.getItem(SK.storeHours || 'hatcandy-store-hours');
        if (raw) {
          const h = JSON.parse(raw);
          if (typeof h.open === 'number' && typeof h.close === 'number') {
            return { open: h.open, close: h.close };
          }
        }
      } catch {}
    }
    return { open: cfg.businessHours.open, close: cfg.businessHours.close };
  }

  function isStoreOpen() {
    const hours = resolveHours();
    if (!hours) return null;
    const h = new Date().getHours();
    return h >= hours.open && h < hours.close;
  }

  /* ============================================================
     CSS
     ============================================================ */
  const style = document.createElement('style');
  style.textContent = `
    /* ============ FLOAT BUTTON ============ */
    .wa-float {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
      pointer-events: none;
    }
    .wa-float > * { pointer-events: auto; }

    .wa-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #25D366, #128C7E);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.9rem;
      cursor: pointer;
      border: none;
      box-shadow: 0 10px 30px rgba(37,211,102,.4),
                  0 0 0 0 rgba(37,211,102,.5);
      animation: waPulse 2.4s ease-in-out infinite;
      transition: transform .25s;
      position: relative;
    }
    .wa-btn:hover { transform: scale(1.08); }
    .wa-btn:active { transform: scale(.96); }
    @keyframes waPulse {
      0%, 100% {
        box-shadow: 0 10px 30px rgba(37,211,102,.4),
                    0 0 0 0 rgba(37,211,102,.5);
      }
      50% {
        box-shadow: 0 10px 30px rgba(37,211,102,.4),
                    0 0 0 14px rgba(37,211,102,0);
      }
    }

    .wa-tooltip {
      background: #fff;
      border-radius: 16px;
      padding: 10px 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,.15);
      font-size: .82rem;
      font-weight: 700;
      color: #3d2c3a;
      white-space: nowrap;
      position: relative;
      opacity: 0;
      transform: translateX(10px);
      transition: opacity .3s, transform .3s;
      pointer-events: none;
      max-width: calc(100vw - 120px);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .wa-tooltip::after {
      content: '';
      position: absolute;
      right: -6px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      width: 12px; height: 12px;
      background: #fff;
    }
    .wa-float:hover .wa-tooltip {
      opacity: 1;
      transform: translateX(0);
    }
    .wa-tooltip .wa-status {
      display: inline-block;
      margin-inline-start: 6px;
      font-size: .68rem;
      padding: 2px 8px;
      border-radius: 20px;
      font-weight: 800;
    }
    .wa-tooltip .wa-status.open {
      background: rgba(34,197,94,.15);
      color: #15803d;
    }
    .wa-tooltip .wa-status.closed {
      background: rgba(107,114,128,.15);
      color: #4b5563;
    }

    /* Show tooltip automatically first time */
    .wa-float.show-hint .wa-tooltip {
      opacity: 1;
      transform: translateX(0);
      animation: waHintFade 5s ease-in-out forwards;
    }
    @keyframes waHintFade {
      0% { opacity: 0; transform: translateX(10px); }
      10%, 80% { opacity: 1; transform: translateX(0); }
      100% { opacity: 0; transform: translateX(10px); }
    }

    /* ============ PRODUCT CARD WA BUTTON ============ */
    .candy-card-wa {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #25D366, #128C7E);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      cursor: pointer;
      border: 2px solid #fff;
      box-shadow: 0 4px 12px rgba(37,211,102,.4);
      transition: all .25s;
      z-index: 3;
      opacity: 0;
      transform: scale(.85);
    }
    .candy-card:hover .candy-card-wa,
    .offer-card:hover .candy-card-wa {
      opacity: 1;
      transform: scale(1);
    }
    .candy-card-wa:hover {
      transform: scale(1.1) rotate(-8deg);
    }
    /* Always visible on touch devices */
    @media (hover: none) {
      .candy-card-wa { opacity: .9; transform: scale(.95); }
    }

    /* ============ FLOAT ON MOBILE ============ */
    @media (max-width: 768px) {
      .wa-float { bottom: 16px; right: 16px; }
      .wa-btn { width: 54px; height: 54px; font-size: 1.7rem; }
      .wa-tooltip { font-size: .74rem; padding: 8px 14px; }
      .candy-card-wa { width: 34px; height: 34px; font-size: 1.1rem; }
    }

    /* ============ RTL ============ */
    [dir="rtl"] .wa-float {
      right: auto;
      left: 24px;
      align-items: flex-start;
    }
    [dir="rtl"] .wa-tooltip {
      transform: translateX(-10px);
    }
    [dir="rtl"] .wa-float:hover .wa-tooltip {
      transform: translateX(0);
    }
    [dir="rtl"] .wa-tooltip::after {
      right: auto;
      left: -6px;
    }
    [dir="rtl"] .wa-float.show-hint .wa-tooltip {
      animation: waHintFadeRtl 5s ease-in-out forwards;
    }
    @keyframes waHintFadeRtl {
      0% { opacity: 0; transform: translateX(-10px); }
      10%, 80% { opacity: 1; transform: translateX(0); }
      100% { opacity: 0; transform: translateX(-10px); }
    }
    [dir="rtl"] .candy-card-wa {
      right: auto;
      left: 12px;
    }
    @media (max-width: 768px) {
      [dir="rtl"] .wa-float { left: 16px; right: auto; }
    }

    /* Don't clash with floating sign */
    @media (max-width: 768px) {
      body.wa-active .floating-sign { display: none; }
    }
  `;
  document.head.appendChild(style);

  /* ============================================================
     OPEN WHATSAPP
     ============================================================ */
  function openWhatsApp(text) {
    const phone = resolvePhone().replace(/\D/g, '');
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text || tr(cfg.message))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  window.WhatsApp = {
    open: openWhatsApp,
    openForProduct: (product) => {
      if (!product) return openWhatsApp();
      const template = tr(cfg.productMessage);
      const txt = template
        .replace('{name}', (lang() === 'ar' && product.name_ar) ? product.name_ar : product.name)
        .replace('{price}', fmt(product.pricingType === 'tiered' ? product.price250 : product.price));
      openWhatsApp(txt);
    }
  };

  /* ============================================================
     INJECT FLOAT BUTTON
     ============================================================ */
  function injectFloat() {
    if (document.querySelector('.wa-float')) return;

    const isOpen = isStoreOpen();
    const statusHtml = isOpen === null ? '' :
      isOpen
        ? `<span class="wa-status open">● ${lang() === 'ar' ? 'مفتوح' : 'Open'}</span>`
        : `<span class="wa-status closed">● ${lang() === 'ar' ? 'مغلق' : 'Closed'}</span>`;

    const float = document.createElement('div');
    float.className = 'wa-float';
    float.innerHTML = `
      <div class="wa-tooltip">
        ${esc(tr(cfg.greeting))}${statusHtml}
      </div>
      <button type="button" class="wa-btn" id="waFloatBtn" aria-label="Chat on WhatsApp">
        <i class='bx bxl-whatsapp'></i>
      </button>`;
    document.body.appendChild(float);
    document.body.classList.add('wa-active');

    const btn = document.getElementById('waFloatBtn');
    if (btn) btn.addEventListener('click', () => openWhatsApp());

    /* Auto-hint on first visit */
    try {
      const hinted = sessionStorage.getItem('hatcandy-wa-hinted');
      if (!hinted) {
        setTimeout(() => {
          float.classList.add('show-hint');
          sessionStorage.setItem('hatcandy-wa-hinted', '1');
        }, 6000);
      }
    } catch {}
  }

  /* ============================================================
     INJECT WA BUTTON ON PRODUCT CARDS
     ============================================================ */
  function injectProductButtons() {
    /* Candy cards */
    document.querySelectorAll('.candy-card').forEach(card => {
      if (card.querySelector('.candy-card-wa')) return;

      const addBtn = card.querySelector('.add-to-cart-btn');
      const pid = addBtn && addBtn.dataset ? addBtn.dataset.id : null;
      if (!pid) return;

      const product = (window.products || []).find(p => p.id === pid)
                   || (window.offers   || []).find(o => o.id === pid);
      if (!product) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'candy-card-wa';
      btn.title = lang() === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp';
      btn.innerHTML = `<i class='bx bxl-whatsapp'></i>`;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.WhatsApp.openForProduct(product);
      });

      const imgWrap = card.querySelector('.candy-card-img');
      if (imgWrap) imgWrap.appendChild(btn);
      else card.appendChild(btn);
    });

    /* Offer cards */
    document.querySelectorAll('.offer-card').forEach(card => {
      if (card.querySelector('.candy-card-wa')) return;
      const addBtn = card.querySelector('.add-to-cart-btn');
      const pid = addBtn && addBtn.dataset ? addBtn.dataset.id : null;
      if (!pid) return;
      const offer = (window.offers || []).find(o => o.id === pid);
      if (!offer) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'candy-card-wa';
      btn.title = lang() === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp';
      btn.innerHTML = `<i class='bx bxl-whatsapp'></i>`;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.WhatsApp.openForProduct(offer);
      });

      const imgWrap = card.querySelector('.offer-img-wrap');
      if (imgWrap) imgWrap.appendChild(btn);
      else card.appendChild(btn);
    });
  }

  /* ============================================================
     HOOKS — deferred
     ============================================================ */
  function hookRenderer(name) {
    const orig = window[name];
    if (typeof orig === 'function' && !orig._waHooked) {
      const hooked = function () {
        const r = orig.apply(this, arguments);
        setTimeout(injectProductButtons, 60);
        return r;
      };
      hooked._waHooked = true;
      window[name] = hooked;
    }
  }

  function installHooks() {
    /* Hook renderers that produce product cards */
    hookRenderer('renderCandies');
    hookRenderer('renderOffers');

    /* Hook applyLanguage — re-inject everything on language change */
    const origApplyLang = window.applyLanguage;
    if (typeof origApplyLang === 'function' && !origApplyLang._waHooked) {
      const hooked = function () {
        const r = origApplyLang.apply(this, arguments);
        setTimeout(() => {
          /* Refresh float button */
          const f = document.querySelector('.wa-float');
          if (f) f.remove();
          document.body.classList.remove('wa-active');
          injectFloat();
          /* Refresh product buttons */
          document.querySelectorAll('.candy-card-wa').forEach(b => b.remove());
          injectProductButtons();
        }, 250);
        return r;
      };
      hooked._waHooked = true;
      window.applyLanguage = hooked;
    }

    /* Hook openOwnerPage — inject settings section */
    const origOpenOwner = window.openOwnerPage;
    if (typeof origOpenOwner === 'function' && !origOpenOwner._waHooked) {
      const hooked = function () {
        const r = origOpenOwner.apply(this, arguments);
        setTimeout(injectOwnerWhatsApp, 500);
        return r;
      };
      hooked._waHooked = true;
      window.openOwnerPage = hooked;
    }
  }

  /* ============================================================
     OWNER PANEL: WHATSAPP SETTINGS
     ============================================================ */
  function injectOwnerWhatsApp() {
    const pane = document.querySelector('#ownerPage [data-opane="delivery"]');
    if (!pane || document.getElementById('ownerWaSection')) return;

    const cur = getCfg();
    const section = document.createElement('div');
    section.id = 'ownerWaSection';
    section.className = 'owner-subsection';
    section.style.marginTop = '20px';
    section.innerHTML = `
      <div class="owner-subsection-head">
        <h4><i class='bx bxl-whatsapp'></i> WhatsApp Settings</h4>
        <button class="owner-btn primary" id="saveWaBtn">
          <i class='bx bx-save'></i> Save
        </button>
      </div>
      <p class="owner-p" style="margin-bottom:14px;">
        Floating WhatsApp button shown on the store for instant chat.
      </p>
      <div class="owner-form">
        <div class="owner-form-grid">
          <div class="form-group full">
            <label>WhatsApp Number (with country code, no +)</label>
            <input type="text" id="waPhone" value="${esc(cur.phone)}" placeholder="962798765432">
            <p class="owner-form-hint">Example: 962798765432 (Jordan)</p>
          </div>
          <div class="form-group full">
            <label>Greeting (English)</label>
            <input type="text" id="waGreetEn" value="${esc(cur.greeting.en)}">
          </div>
          <div class="form-group full">
            <label>Greeting (Arabic)</label>
            <input type="text" id="waGreetAr" value="${esc(cur.greeting.ar)}">
          </div>
          <div class="form-group full">
            <label>Default Message (English)</label>
            <textarea id="waMsgEn" rows="2">${esc(cur.message.en)}</textarea>
          </div>
          <div class="form-group full">
            <label>Default Message (Arabic)</label>
            <textarea id="waMsgAr" rows="2">${esc(cur.message.ar)}</textarea>
          </div>
          <div class="form-group full">
            <label>Product Message (English)</label>
            <textarea id="waProdEn" rows="3">${esc(cur.productMessage.en)}</textarea>
            <p class="owner-form-hint">Use <code>{name}</code> and <code>{price}</code> as placeholders</p>
          </div>
          <div class="form-group full">
            <label>Product Message (Arabic)</label>
            <textarea id="waProdAr" rows="3">${esc(cur.productMessage.ar)}</textarea>
          </div>
          <div class="form-group full" style="display:flex;align-items:center;gap:10px;">
            <input type="checkbox" id="waEnabled" ${cur.enabled ? 'checked' : ''} style="width:auto;">
            <label style="margin:0;text-transform:none;">Enable WhatsApp button</label>
          </div>
        </div>
      </div>`;
    pane.appendChild(section);

    document.getElementById('saveWaBtn').addEventListener('click', () => {
      const data = {
        phone: document.getElementById('waPhone').value.trim(),
        enabled: document.getElementById('waEnabled').checked,
        greeting: {
          en: document.getElementById('waGreetEn').value.trim(),
          ar: document.getElementById('waGreetAr').value.trim()
        },
        message: {
          en: document.getElementById('waMsgEn').value.trim(),
          ar: document.getElementById('waMsgAr').value.trim()
        },
        productMessage: {
          en: document.getElementById('waProdEn').value.trim(),
          ar: document.getElementById('waProdAr').value.trim()
        },
        businessHours: cur.businessHours
      };
      try {
        localStorage.setItem(WA_KEY, JSON.stringify(data));
        if (typeof window.showToast === 'function')
          window.showToast('WhatsApp settings saved ✨', 'bx-check-circle');
        /* Refresh live config */
        Object.assign(cfg, getCfg());
      } catch (e) {
        alert('Save failed');
      }
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    injectFloat();
    /* First attempts — after renderers run */
    setTimeout(injectProductButtons, 1500);
    setTimeout(injectProductButtons, 3000);
    /* Owner section (if page already exists) */
    setTimeout(() => {
      if (document.getElementById('ownerPage')) injectOwnerWhatsApp();
    }, 2000);
  }

  function boot() {
    installHooks();
    init();
  }

  function scheduleBoot() {
    setTimeout(boot, 800);
    /* Safety net */
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (window.renderCandies && !window.renderCandies._waHooked) installHooks();
        if (!document.querySelector('.wa-float')) injectFloat();
      }, 300);
    }, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleBoot);
  } else {
    scheduleBoot();
  }

  console.log('%c💬 WhatsApp float loaded', 'color:#25D366;font-weight:bold;');
})();