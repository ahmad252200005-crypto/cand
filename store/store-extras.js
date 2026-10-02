/* =====================================================
   HAT CANDY — STORE EXTRAS
   Recently Viewed + Trust Badges
   ===================================================== */
(function () {
  'use strict';

  /* ============ Feature flags ============ */
  const CFG = window.HAT_CONFIG || {};
  const FEAT = CFG.features || {};
  const ENABLE_RV     = FEAT.recentlyViewed !== false;
  const ENABLE_TRUST  = FEAT.trustBadges    !== false;

  if (!ENABLE_RV && !ENABLE_TRUST) {
    console.log('%c✨ Store extras: both disabled by feature flags', 'color:#9ca3af;font-weight:bold;');
    return;
  }

  /* ============ Storage key ============ */
  const SK = CFG.storageKeys || {};
  const RV_KEY = SK.recentlyViewed || 'hatcandy-recently-viewed';

  /* ============================================================
     CSS
     ============================================================ */
  const style = document.createElement('style');
  style.textContent = `
    /* Recently Viewed */
    .recently-viewed-section { padding: 40px 0 60px; background: var(--ivory-cream); }
    .rv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; }
    .rv-card { background: #fff; border-radius: 14px; padding: 12px; text-align: center;
      box-shadow: 0 4px 14px rgba(226,1,93,.08); cursor: pointer; transition: all .3s; }
    .rv-card:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(226,1,93,.18); }
    .rv-card img { width: 100%; height: 110px; object-fit: cover; border-radius: 10px; margin-bottom: 8px; }
    .rv-card h4 { font-size: .82rem; font-weight: 700; margin-bottom: 4px; line-height: 1.2; }
    .rv-card .price { font-size: .9rem; font-weight: 700; color: var(--primary); }

    /* Trust Badges */
    .trust-badges { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px; margin: 24px auto; padding: 18px;
      background: linear-gradient(135deg, #fff, var(--ivory-cream));
      border-radius: 18px; box-shadow: 0 6px 20px rgba(226,1,93,.06);
      max-width: 1200px; }
    .tb-item { display: flex; align-items: center; gap: 10px; padding: 8px; }
    .tb-icon { width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
      background: linear-gradient(135deg, var(--honey-yellow), var(--hot-pink));
      color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
    .tb-text { font-size: .78rem; line-height: 1.3; }
    .tb-text strong { display: block; color: var(--primary-dark); font-weight: 800; font-size: .85rem; }
    .tb-text span { color: var(--text-light); }
    .cart-trust { display: flex; justify-content: center; gap: 14px; padding: 8px 0 12px;
      font-size: .68rem; color: var(--text-light);
      border-top: 1px dashed rgba(226,1,93,.12); margin-top: 8px; flex-wrap: wrap; }
    .cart-trust span { display: inline-flex; align-items: center; gap: 4px; }
    .cart-trust i { color: #15803d; font-size: .95rem; }
    @media (max-width: 480px) {
      .trust-badges { grid-template-columns: 1fr 1fr; padding: 12px; gap: 8px; margin: 16px 12px; }
      .tb-icon { width: 34px; height: 34px; font-size: 1.1rem; }
      .tb-text { font-size: .7rem; }
      .tb-text strong { font-size: .76rem; }
    }
    /* RTL adjustments */
    [dir="rtl"] .tb-item { flex-direction: row-reverse; text-align: right; }
  `;
  document.head.appendChild(style);

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g,
    m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  const fmtSafe = (n) => (typeof window.formatPrice === 'function')
    ? window.formatPrice(n)
    : '$' + (Number(n) || 0).toFixed(2);

  /* ============================================================
     RECENTLY VIEWED
     ============================================================ */
  function loadRV() {
    try {
      const a = JSON.parse(localStorage.getItem(RV_KEY) || '[]');
      return Array.isArray(a) ? a : [];
    } catch { return []; }
  }

  function pushRV(product) {
    if (!product || !product.id) return;
    let list = loadRV().filter(x => x.id !== product.id);
    list.unshift({
      id: product.id,
      name: product.name,
      name_ar: product.name_ar,
      /* safe for both fixed and tiered products */
      price:    product.pricingType === 'tiered' ? product.price250 : product.price,
      price250: product.price250,
      img: product.img,
      pricingType: product.pricingType || 'fixed'
    });
    list = list.slice(0, 8);
    try { localStorage.setItem(RV_KEY, JSON.stringify(list)); } catch {}
  }

  window.RecentlyViewed = {
    load: loadRV,
    push: pushRV,
    clear: () => { try { localStorage.removeItem(RV_KEY); } catch {} }
  };

  /* Hook product clicks — deferred, safe with _hooked flag */
  function hookProductOpeners() {
    ['openWeightModal', 'openProductModal'].forEach(fn => {
      const orig = window[fn];
      if (typeof orig === 'function' && !orig._rvHooked) {
        const hooked = function (productId) {
          const p = (window.products || []).find(x => x.id === productId);
          if (p) pushRV(p);
          return orig.apply(this, arguments);
        };
        hooked._rvHooked = true;
        window[fn] = hooked;
      }
    });
  }

  function renderRV() {
    if (!ENABLE_RV) return;
    const list = loadRV();
    const container = document.getElementById('recentlyViewedSection');
    if (!container) return;
    if (!list.length) { container.style.display = 'none'; return; }
    container.style.display = 'block';

    const lang = window.lang || 'ar';
    const grid = container.querySelector('.rv-grid');
    if (!grid) return;

    grid.innerHTML = list.map(p => `
      <div class="rv-card" data-rv-id="${esc(p.id)}">
        <img src="${esc(p.img || '')}" alt="${esc(p.name)}">
        <h4>${esc(lang === 'ar' && p.name_ar ? p.name_ar : p.name)}</h4>
        <div class="price">${fmtSafe(p.price)}</div>
      </div>`).join('');

    grid.querySelectorAll('[data-rv-id]').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.rvId;
        if (typeof window.openWeightModal === 'function') {
          window.openWeightModal(id);
        } else {
          /* Fallback: scroll to candies section and highlight */
          const target = document.getElementById('candies');
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function injectRV() {
    if (!ENABLE_RV) return;
    if (document.getElementById('recentlyViewedSection')) return;
    const candies = document.getElementById('candies');
    if (!candies) return;
    const section = document.createElement('section');
    section.id = 'recentlyViewedSection';
    section.className = 'recently-viewed-section';
    section.style.display = 'none';
    section.innerHTML = `
      <div class="container">
        <h2 class="section-title" style="font-size:clamp(1.6rem,4vw,2.4rem);">
          ${window.lang === 'ar' ? 'شاهدتها حديثاً' : 'Recently Viewed'}
        </h2>
        <div class="rv-grid"></div>
      </div>`;
    /* Insert AFTER candies section (before trust badges) */
    candies.parentNode.insertBefore(section, candies.nextSibling);
  }

  /* ============================================================
     TRUST BADGES
     ============================================================ */
  function injectTrustBadges() {
    if (!ENABLE_TRUST) return;
    if (document.querySelector('.trust-badges')) return;
    const candies = document.getElementById('candies');
    if (!candies) return;
    const ar = window.lang === 'ar';
    const badges = document.createElement('div');
    badges.className = 'trust-badges';
    badges.innerHTML = `
      <div class="tb-item">
        <div class="tb-icon"><i class='bx bx-shield-quarter'></i></div>
        <div class="tb-text"><strong>${ar ? 'دفع آمن' : 'Secure Payment'}</strong>
          <span>${ar ? 'تشفير 100%' : '100% encrypted'}</span></div>
      </div>
      <div class="tb-item">
        <div class="tb-icon" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8);">
          <i class='bx bx-cycling'></i></div>
        <div class="tb-text"><strong>${ar ? 'توصيل سريع' : 'Fast Delivery'}</strong>
          <span>${ar ? 'خلال 24 ساعة' : 'Within 24h'}</span></div>
      </div>
      <div class="tb-item">
        <div class="tb-icon" style="background:linear-gradient(135deg,#22c55e,#15803d);">
          <i class='bx bx-check-shield'></i></div>
        <div class="tb-text"><strong>${ar ? 'ضمان الجودة' : 'Quality Guarantee'}</strong>
          <span>${ar ? 'أو استرداد المبلغ' : 'Or money back'}</span></div>
      </div>
      <div class="tb-item">
        <div class="tb-icon" style="background:linear-gradient(135deg,#a855f7,#6d28d9);">
          <i class='bx bx-support'></i></div>
        <div class="tb-text"><strong>${ar ? 'دعم 24/7' : 'Support 24/7'}</strong>
          <span>${ar ? 'واتساب فوري' : 'Instant WhatsApp'}</span></div>
      </div>`;
    /* Insert after candies OR after RV (whichever comes later) */
    const rvSection = document.getElementById('recentlyViewedSection');
    const anchor = rvSection || candies;
    anchor.parentNode.insertBefore(badges, anchor.nextSibling);
  }

  function injectCartTrust() {
    if (!ENABLE_TRUST) return;
    const footer = document.querySelector('#cartPanel .cart-footer');
    if (!footer || footer.querySelector('.cart-trust')) return;
    const ar = window.lang === 'ar';
    const t = document.createElement('div');
    t.className = 'cart-trust';
    t.innerHTML = `
      <span><i class='bx bx-lock-alt'></i> ${ar ? 'دفع آمن' : 'Secure'}</span>
      <span><i class='bx bx-undo'></i> ${ar ? 'إرجاع 7 أيام' : '7-day returns'}</span>
      <span><i class='bx bx-cycling'></i> ${ar ? 'توصيل سريع' : 'Fast ship'}</span>`;
    footer.appendChild(t);
  }

  /* ============================================================
     HOOKS
     ============================================================ */
  function installHooks() {
    /* Hook renderCart — refresh cart trust after cart renders */
    const origRenderCart = window.renderCart;
    if (typeof origRenderCart === 'function' && !origRenderCart._seHooked) {
      const hooked = function () {
        const r = origRenderCart.apply(this, arguments);
        setTimeout(injectCartTrust, 100);
        return r;
      };
      hooked._seHooked = true;
      window.renderCart = hooked;
    }

    /* Hook applyLanguage — re-inject dynamic text on language change */
    const origApplyLang = window.applyLanguage;
    if (typeof origApplyLang === 'function' && !origApplyLang._seHooked) {
      const hooked = function () {
        const r = origApplyLang.apply(this, arguments);
        setTimeout(() => {
          /* Refresh RV */
          if (ENABLE_RV) {
            const rv = document.querySelector('#recentlyViewedSection .section-title');
            if (rv) rv.textContent = window.lang === 'ar' ? 'شاهدتها حديثاً' : 'Recently Viewed';
            renderRV();
          }
          /* Refresh trust badges + cart trust */
          if (ENABLE_TRUST) {
            const tb = document.querySelector('.trust-badges'); if (tb) tb.remove();
            const ct = document.querySelector('.cart-trust');  if (ct) ct.remove();
            injectTrustBadges();
            injectCartTrust();
          }
        }, 200);
        return r;
      };
      hooked._seHooked = true;
      window.applyLanguage = hooked;
    }
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    if (ENABLE_RV)    { injectRV(); renderRV(); }
    if (ENABLE_TRUST) { injectTrustBadges(); setTimeout(injectCartTrust, 800); }
    hookProductOpeners();
  }

  function boot() {
    installHooks();
    init();
  }

  function scheduleBoot() {
    /* Defer — lets all parts (0-3) finish executing their IIFEs */
    setTimeout(boot, 1200);
    /* Safety net */
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (!window.renderCart || !window.renderCart._seHooked) installHooks();
      }, 300);
    }, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleBoot);
  } else {
    scheduleBoot();
  }

  console.log('%c✨ Store extras loaded', 'color:#22c55e;font-weight:bold;');
})();