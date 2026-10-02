/* =====================================================
   HAT CANDY — DISCOUNT CODES SYSTEM
   أكواد الخصم — Core + UI + Cart + Owner
   يُحمَّل في: Store + Admin + Owner + POS
   ===================================================== */
(function () {
  'use strict';

  /* ============ Feature flag ============ */
  const CFG = window.HAT_CONFIG || {};
  if (CFG.features && CFG.features.discountCodes === false) {
    console.log('%c🏷️  Discounts: disabled by feature flag', 'color:#9ca3af;font-weight:bold;');
    return;
  }

  /* ============ Storage Keys (from config with fallback) ============ */
  const SK = CFG.storageKeys || {};
  const CODES_KEY   = SK.discountCodes   || 'hatcandy-discount-codes';
  const USAGE_KEY   = SK.discountUsage   || 'hatcandy-discount-usage';
  const APPLIED_KEY = SK.discountApplied || 'hatcandy-discount-applied';

  /* ============================================================
     CSS
     ============================================================ */
  const style = document.createElement('style');
  style.textContent = `
    .discount-box { background:linear-gradient(135deg,rgba(250,204,67,.12),rgba(226,1,93,.06));
      border:1.5px dashed rgba(226,1,93,.3); border-radius:12px; padding:10px 12px; margin:10px 0; }
    .discount-box.applied { border-style:solid; border-color:#22c55e;
      background:linear-gradient(135deg,rgba(34,197,94,.1),rgba(34,197,94,.02)); }
    .discount-row { display:flex; gap:6px; align-items:center; }
    .discount-row input { flex:1; padding:10px 12px; border:2px solid #f0e0e8; border-radius:10px;
      font-family:inherit; font-size:.85rem; text-transform:uppercase; letter-spacing:1px;
      background:#fff; outline:none; min-width:0; }
    .discount-row input:focus { border-color:#e2015d; }
    .discount-row button { padding:10px 14px; border-radius:10px; border:none;
      background:linear-gradient(135deg,#e2015d,#9f0b3b); color:#fff;
      font-weight:700; font-size:.8rem; cursor:pointer; white-space:nowrap; }
    .discount-row button:disabled { opacity:.5; cursor:not-allowed; }
    .discount-msg { font-size:.72rem; margin-top:6px; font-weight:600; min-height:14px; }
    .discount-msg.error { color:#dc2626; }
    .discount-msg.success { color:#15803d; }
    .discount-applied { display:flex; align-items:center; justify-content:space-between; gap:8px;
      font-size:.82rem; font-weight:700; color:#15803d; }
    .discount-applied i { font-size:1.1rem; }
    .discount-applied button { width:28px; height:28px; border-radius:50%; border:none;
      background:rgba(239,68,68,.1); color:#dc2626; cursor:pointer; font-size:1rem;
      display:flex; align-items:center; justify-content:center; }
    .cart-discount-row { display:flex; justify-content:space-between; font-size:.84rem;
      color:#15803d; padding:4px 0; font-weight:700; }
    .dc-chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
    .dc-chip { padding:4px 10px; border-radius:20px; background:rgba(226,1,93,.08);
      color:#9f0b3b; font-size:.7rem; font-weight:700; cursor:pointer;
      border:1.5px solid rgba(226,1,93,.15); }
    .dc-chip:hover { background:#e2015d; color:#fff; }
    /* Owner panel discount section */
    .owner-dc-list { display:grid; gap:8px; }
    .owner-dc-item { background:rgba(255,255,255,.04); border:1px solid rgba(139,92,246,.2);
      border-radius:12px; padding:12px 14px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
    .owner-dc-code { font-family:monospace; font-size:1rem; font-weight:900; color:#facc43;
      background:rgba(250,204,67,.15); padding:4px 10px; border-radius:8px; letter-spacing:1px; }
    .owner-dc-info { flex:1; min-width:140px; }
    .owner-dc-info strong { display:block; font-size:.85rem; color:#fff; }
    .owner-dc-info span { display:block; font-size:.7rem; color:#c4b5fd; margin-top:2px; }
    .owner-dc-badge { padding:3px 9px; border-radius:20px; font-size:.62rem; font-weight:700; }
    .owner-dc-badge.active { background:rgba(34,197,94,.18); color:#86efac; }
    .owner-dc-badge.expired { background:rgba(107,114,128,.2); color:#9ca3af; }
    .owner-dc-badge.used { background:rgba(239,68,68,.15); color:#fca5a5; }
  `;
  document.head.appendChild(style);

  /* ============================================================
     CORE API
     ============================================================ */
  const Discounts = {
    load() {
      try {
        const a = JSON.parse(localStorage.getItem(CODES_KEY) || '[]');
        return Array.isArray(a) ? a : [];
      } catch { return []; }
    },
    save(list) {
      try {
        localStorage.setItem(CODES_KEY, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent('discounts:changed'));
        return true;
      } catch { return false; }
    },
    loadUsage() {
      try { return JSON.parse(localStorage.getItem(USAGE_KEY) || '[]'); }
      catch { return []; }
    },
    saveUsage(list) {
      try { localStorage.setItem(USAGE_KEY, JSON.stringify(list.slice(-2000))); } catch {}
    },

    add(data) {
      const list = this.load();
      const code = String(data.code || '').toUpperCase().trim();
      if (!code) throw new Error('Code required');
      if (list.some(c => c.code === code)) throw new Error('Code already exists');
      const item = {
        id: 'dc-' + Date.now(),
        code,
        type: data.type || 'percent',
        value: Number(data.value) || 0,
        minOrder: Number(data.minOrder) || 0,
        maxUses: Number(data.maxUses) || 0,
        usedCount: 0,
        perUser: Number(data.perUser) || 1,
        expiresAt: data.expiresAt || '',
        active: data.active !== false,
        description: { ar: data.descriptionAr || '', en: data.descriptionEn || '' },
        createdAt: new Date().toISOString()
      };
      list.push(item);
      this.save(list);
      return item;
    },
    update(id, data) {
      const list = this.load();
      const i = list.findIndex(c => c.id === id);
      if (i === -1) return false;
      list[i] = { ...list[i], ...data };
      if (data.code) list[i].code = String(data.code).toUpperCase().trim();
      return this.save(list);
    },
    remove(id) { return this.save(this.load().filter(c => c.id !== id)); },
    get(id) { return this.load().find(c => c.id === id); },

    validate(code, orderAmount, userId) {
      const clean = String(code || '').toUpperCase().trim();
      if (!clean) return { ok: false, error: 'enterCode' };
      const dc = this.load().find(c => c.code === clean);
      if (!dc) return { ok: false, error: 'notFound' };
      if (!dc.active) return { ok: false, error: 'inactive' };
      if (dc.expiresAt) {
        const exp = new Date(dc.expiresAt + 'T23:59:59').getTime();
        if (Date.now() > exp) return { ok: false, error: 'expired' };
      }
      if (dc.minOrder > 0 && orderAmount < dc.minOrder)
        return { ok: false, error: 'minOrder', minOrder: dc.minOrder };
      if (dc.maxUses > 0 && dc.usedCount >= dc.maxUses)
        return { ok: false, error: 'maxedOut' };
      if (userId && dc.perUser > 0) {
        const u = this.loadUsage().filter(x => x.code === clean && x.userId === userId).length;
        if (u >= dc.perUser) return { ok: false, error: 'perUserLimit' };
      }
      return { ok: true, discount: dc };
    },

    calculate(dc, subtotal, shippingFee) {
      if (!dc) return 0;
      let amount = 0;
      if (dc.type === 'percent') amount = (subtotal * dc.value) / 100;
      else if (dc.type === 'fixed') amount = Math.min(dc.value, subtotal);
      else if (dc.type === 'shipping') amount = Math.min(dc.value || shippingFee, shippingFee);
      return Math.max(0, Math.round(amount * 100) / 100);
    },

    recordUsage(code, userId, orderId, amount) {
      const list = this.loadUsage();
      list.push({
        code: String(code || '').toUpperCase(),
        userId: userId || 'guest',
        orderId: orderId || '',
        amount: Number(amount) || 0,
        date: new Date().toISOString()
      });
      this.saveUsage(list);
      const codes = this.load();
      const i = codes.findIndex(c => c.code === String(code).toUpperCase());
      if (i !== -1) { codes[i].usedCount = (codes[i].usedCount || 0) + 1; this.save(codes); }
    },

    getApplied() {
      try { return JSON.parse(sessionStorage.getItem(APPLIED_KEY) || 'null'); }
      catch { return null; }
    },
    applyToCart(code, subtotal, shippingFee, userId) {
      const v = this.validate(code, subtotal, userId);
      if (!v.ok) return v;
      const amount = this.calculate(v.discount, subtotal, shippingFee);
      const applied = {
        code: v.discount.code,
        dcId: v.discount.id,
        type: v.discount.type,
        value: v.discount.value,
        amount
      };
      try { sessionStorage.setItem(APPLIED_KEY, JSON.stringify(applied)); } catch {}
      return { ok: true, applied };
    },
    removeFromCart() { try { sessionStorage.removeItem(APPLIED_KEY); } catch {} },

    errorMessage(err) {
      const lang = window.lang || 'ar';
      const msgs = {
        ar: {
          enterCode: 'الرجاء إدخال الكود',
          notFound: 'الكود غير صحيح',
          inactive: 'هذا الكود غير مُفعّل',
          expired: 'انتهت صلاحية هذا الكود',
          minOrder: 'الحد الأدنى للطلب {n} د.أ',
          maxedOut: 'تم استنفاد هذا الكود',
          perUserLimit: 'لقد استخدمت هذا الكود من قبل'
        },
        en: {
          enterCode: 'Please enter a code',
          notFound: 'Invalid code',
          inactive: 'This code is inactive',
          expired: 'This code has expired',
          minOrder: 'Minimum order is {n} JOD',
          maxedOut: 'This code has reached its limit',
          perUserLimit: 'You have already used this code'
        }
      };
      return (msgs[lang] || msgs.ar)[err] || err;
    }
  };
  window.Discounts = Discounts;

  /* ============================================================
     HELPERS
     ============================================================ */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g,
    m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  const fmt = (n) => (typeof window.formatPrice === 'function')
    ? window.formatPrice(n)
    : '$' + (Number(n) || 0).toFixed(2);

  /* ============================================================
     UI: DISCOUNT BOX (Store + POS)
     ============================================================ */
  function renderDiscountBox(target, container) {
    if (!container) return;
    const applied = Discounts.getApplied();
    if (applied) {
      container.classList.add('applied');
      container.innerHTML = `
        <div class="discount-applied">
          <div><i class='bx bx-purchase-tag-alt'></i> <strong>${esc(applied.code)}</strong>
            — ${applied.type === 'percent' ? applied.value + '%' : fmt(applied.amount)}</div>
          <button type="button" data-dc-remove="${target}"><i class='bx bx-x'></i></button>
        </div>`;
      container.querySelector('[data-dc-remove]').addEventListener('click', () => {
        Discounts.removeFromCart();
        renderDiscountBox(target, container);
        if (typeof window.renderCart === 'function') window.renderCart();
      });
    } else {
      container.classList.remove('applied');
      const ph = window.lang === 'ar' ? 'كود الخصم' : 'Discount code';
      const btnTxt = window.lang === 'ar' ? 'تطبيق' : 'Apply';
      container.innerHTML = `
        <div class="discount-row">
          <input type="text" placeholder="${ph}" autocomplete="off" maxlength="24">
          <button type="button">${btnTxt}</button>
        </div>
        <div class="discount-msg"></div>`;
      const input = container.querySelector('input');
      const btn = container.querySelector('button');
      const msg = container.querySelector('.discount-msg');
      const apply = () => {
        const code = input.value.trim();
        const subtotal = getSubtotal(target);
        const ship = getShipping(target);
        const userId = (window.currentUser && window.currentUser.id) || null;
        const res = Discounts.applyToCart(code, subtotal, ship, userId);
        if (!res.ok) {
          msg.className = 'discount-msg error';
          let text = Discounts.errorMessage(res.error);
          if (res.minOrder) text = text.replace('{n}', res.minOrder.toFixed(2));
          msg.textContent = text;
          input.focus();
          return;
        }
        msg.className = 'discount-msg success';
        msg.textContent = window.lang === 'ar' ? '✓ تم تطبيق الكود' : '✓ Code applied';
        if (typeof window.showToast === 'function') {
          window.showToast(window.lang === 'ar' ? 'تم تطبيق الكود ✨' : 'Code applied ✨', 'bx-purchase-tag');
        }
        renderDiscountBox(target, container);
        if (typeof window.renderCart === 'function') window.renderCart();
      };
      btn.addEventListener('click', apply);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); apply(); } });
    }
  }

  function getSubtotal(target) {
    if (target === 'store' && typeof window.getCartSubtotal === 'function')
      return window.getCartSubtotal();
    if (target === 'pos') {
      const el = document.getElementById('checkoutSubtotal');
      return el ? parseFloat(el.textContent.replace(/[^\d.]/g, '')) || 0 : 0;
    }
    return 0;
  }
  function getShipping(target) {
    if (target === 'store' && typeof window.getDeliveryFee === 'function')
      return window.getDeliveryFee();
    if (target === 'pos') {
      const el = document.getElementById('checkoutDeliveryFee');
      return el ? parseFloat(el.textContent.replace(/[^\d.]/g, '')) || 0 : 0;
    }
    return 0;
  }

  /* ---- Store Cart Injection ---- */
  function injectStoreDiscount() {
    const cartPanel = document.getElementById('cartPanel');
    if (!cartPanel) return;
    const footer = cartPanel.querySelector('.cart-footer');
    if (!footer) return;
    let box = cartPanel.querySelector('#discountBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'discountBox';
      box.className = 'discount-box';
      footer.parentNode.insertBefore(box, footer);
    }
    renderDiscountBox('store', box);
  }

  /* ---- Apply discount to cart total display ---- */
  function updateStoreTotals() {
    const applied = Discounts.getApplied();
    if (!applied) return;
    const footer = document.querySelector('#cartPanel .cart-footer');
    if (!footer) return;
    const old = footer.querySelector('.cart-discount-row');
    if (old) old.remove();

    const subtotal = window.getCartSubtotal ? window.getCartSubtotal() : 0;
    const fee = window.getDeliveryFee ? window.getDeliveryFee() : 0;
    const amount = Discounts.calculate(
      { type: applied.type, value: applied.value }, subtotal, fee);

    const row = document.createElement('div');
    row.className = 'cart-discount-row';
    row.innerHTML = `<span>${window.lang === 'ar' ? 'خصم' : 'Discount'} (${esc(applied.code)})</span>
                     <span>−${fmt(amount)}</span>`;
    const totalRow = footer.querySelector('.cart-total-row');
    if (totalRow) totalRow.parentNode.insertBefore(row, totalRow);

    const totalEl = document.getElementById('cartTotal');
    if (totalEl) {
      totalEl.textContent = fmt(Math.max(0, subtotal + fee - amount));
    }
  }

  /* ============================================================
     POS: INJECT DISCOUNT BOX
     ============================================================ */
  function injectPosDiscount() {
    const panel = document.querySelector('.customer-payment-panel');
    if (!panel) return;
    const checkoutBtn = panel.querySelector('#btnCheckout');
    if (!checkoutBtn) return;
    let box = panel.querySelector('#posDiscountBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'posDiscountBox';
      box.className = 'discount-box';
      checkoutBtn.parentNode.insertBefore(box, checkoutBtn);
    }
    renderDiscountBox('pos', box);
  }

  /* ============================================================
     OWNER PANEL: MANAGE DISCOUNTS
     ============================================================ */
  function injectOwnerDiscountSection() {
    const ownerPane = document.querySelector('#ownerPage [data-opane="addons"]');
    if (!ownerPane || document.getElementById('ownerDiscountsSection')) return;
    const section = document.createElement('div');
    section.id = 'ownerDiscountsSection';
    section.className = 'owner-subsection';
    section.style.marginTop = '20px';
    section.innerHTML = `
      <div class="owner-subsection-head">
        <h4><i class='bx bx-purchase-tag-alt'></i> Discount Codes</h4>
        <button class="owner-btn primary" id="ownerAddDiscount">
          <i class='bx bx-plus'></i> Add Code
        </button>
      </div>
      <div class="owner-dc-list" id="ownerDiscountsList"></div>`;
    ownerPane.appendChild(section);
    renderOwnerDiscounts();
    section.querySelector('#ownerAddDiscount').addEventListener('click', () => openDiscountModal());
  }

  function renderOwnerDiscounts() {
    const list = document.getElementById('ownerDiscountsList');
    if (!list) return;
    const codes = Discounts.load();
    if (!codes.length) {
      list.innerHTML = `<div class="owner-empty"><i class='bx bx-purchase-tag'></i><p>No codes yet</p></div>`;
      return;
    }
    const now = Date.now();
    list.innerHTML = codes.map(c => {
      const expired = c.expiresAt && new Date(c.expiresAt + 'T23:59:59').getTime() < now;
      const used = c.maxUses > 0 && c.usedCount >= c.maxUses;
      let badge = '<span class="owner-dc-badge active">Active</span>';
      if (!c.active) badge = '<span class="owner-dc-badge expired">Inactive</span>';
      else if (expired) badge = '<span class="owner-dc-badge expired">Expired</span>';
      else if (used) badge = '<span class="owner-dc-badge used">Used up</span>';

      const valueTxt = c.type === 'percent' ? `${c.value}%`
                     : c.type === 'shipping' ? `Free ship`
                     : `${c.value} JOD`;

      return `<div class="owner-dc-item">
        <div class="owner-dc-code">${esc(c.code)}</div>
        <div class="owner-dc-info">
          <strong>${valueTxt}</strong>
          <span>${c.usedCount}${c.maxUses ? '/' + c.maxUses : ''} uses · min ${c.minOrder || 0} JOD${c.expiresAt ? ' · exp ' + c.expiresAt : ''}</span>
        </div>
        ${badge}
        <div class="owner-list-actions">
          <button class="owner-icon-btn edit" data-dc-edit="${esc(c.id)}"><i class='bx bx-edit'></i></button>
          <button class="owner-icon-btn del" data-dc-del="${esc(c.id)}"><i class='bx bx-trash'></i></button>
        </div>
      </div>`;
    }).join('');

    list.querySelectorAll('[data-dc-edit]').forEach(b =>
      b.addEventListener('click', () => openDiscountModal(b.dataset.dcEdit)));
    list.querySelectorAll('[data-dc-del]').forEach(b =>
      b.addEventListener('click', () => {
        if (!confirm('Delete this code?')) return;
        Discounts.remove(b.dataset.dcDel);
        renderOwnerDiscounts();
      }));
  }

  function openDiscountModal(id) {
    let modal = document.getElementById('discountModal');
    if (modal) modal.remove();
    const dc = id ? Discounts.get(id) : null;

    modal = document.createElement('div');
    modal.id = 'discountModal';
    modal.className = 'owner-modal show';
    modal.innerHTML = `
      <div class="owner-modal-backdrop" data-close></div>
      <div class="owner-modal-card" style="max-width:560px;">
        <div class="owner-modal-head">
          <div><h3>${id ? 'Edit Code' : 'New Discount Code'}</h3>
          <p>Limited-time offers & promo codes</p></div>
          <button class="owner-modal-close" data-close><i class='bx bx-x'></i></button>
        </div>
        <div class="owner-modal-body">
          <form id="discountForm" class="owner-form">
            <input type="hidden" name="id" value="${dc ? esc(dc.id) : ''}">
            <div class="owner-form-grid">
              <div class="form-group full"><label>Code *</label>
                <input type="text" name="code" required maxlength="24"
                  value="${dc ? esc(dc.code) : ''}" placeholder="WELCOME10"
                  style="text-transform:uppercase;font-family:monospace;letter-spacing:2px;font-weight:900;"></div>
              <div class="form-group"><label>Type *</label>
                <select name="type">
                  <option value="percent" ${dc && dc.type === 'percent' ? 'selected' : ''}>Percent (%)</option>
                  <option value="fixed" ${dc && dc.type === 'fixed' ? 'selected' : ''}>Fixed Amount</option>
                  <option value="shipping" ${dc && dc.type === 'shipping' ? 'selected' : ''}>Free Shipping</option>
                </select></div>
              <div class="form-group"><label>Value *</label>
                <input type="number" name="value" step="0.01" min="0" required
                  value="${dc ? dc.value : ''}"></div>
              <div class="form-group"><label>Min Order (JOD)</label>
                <input type="number" name="minOrder" step="0.01" min="0"
                  value="${dc ? dc.minOrder : 0}"></div>
              <div class="form-group"><label>Max Uses (0=unlimited)</label>
                <input type="number" name="maxUses" step="1" min="0"
                  value="${dc ? dc.maxUses : 0}"></div>
              <div class="form-group"><label>Per User</label>
                <input type="number" name="perUser" step="1" min="1"
                  value="${dc ? dc.perUser : 1}"></div>
              <div class="form-group"><label>Expires At</label>
                <input type="date" name="expiresAt" value="${dc ? dc.expiresAt : ''}"></div>
              <div class="form-group full"><label>Description (AR)</label>
                <input type="text" name="descriptionAr" value="${dc ? esc(dc.description.ar) : ''}"></div>
              <div class="form-group full" style="display:flex;align-items:center;gap:10px;">
                <input type="checkbox" name="active" ${!dc || dc.active ? 'checked' : ''} style="width:auto;">
                <label style="margin:0;text-transform:none;">Active</label>
              </div>
            </div>
          </form>
        </div>
        <div class="owner-modal-foot">
          <button type="button" class="owner-btn ghost" data-close>Cancel</button>
          <button type="submit" form="discountForm" class="owner-btn primary"><i class='bx bx-save'></i> Save</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    modal.querySelectorAll('[data-close]').forEach(el =>
      el.addEventListener('click', () => modal.remove()));

    modal.querySelector('#discountForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = {
        code: fd.get('code'),
        type: fd.get('type'),
        value: Number(fd.get('value')),
        minOrder: Number(fd.get('minOrder')) || 0,
        maxUses: Number(fd.get('maxUses')) || 0,
        perUser: Number(fd.get('perUser')) || 1,
        expiresAt: fd.get('expiresAt') || '',
        active: fd.get('active') === 'on',
        descriptionAr: fd.get('descriptionAr') || ''
      };
      try {
        if (id) Discounts.update(id, data);
        else Discounts.add(data);
        modal.remove();
        renderOwnerDiscounts();
        if (typeof window.showToast === 'function')
          window.showToast('Saved ✨', 'bx-check-circle');
      } catch (err) { alert(err.message); }
    });
  }

  /* ============================================================
     HOOKS — deferred until all parts loaded
     ============================================================ */
  function installHooks() {
    /* --- Hook renderCart (defined in script.part2.js) --- */
    const origRenderCart = window.renderCart;
    if (typeof origRenderCart === 'function' && !origRenderCart._dcHooked) {
      const hooked = function () {
        const r = origRenderCart.apply(this, arguments);
        setTimeout(() => { injectStoreDiscount(); updateStoreTotals(); }, 50);
        return r;
      };
      hooked._dcHooked = true;
      window.renderCart = hooked;
    }

    /* --- Hook openOwnerPage (defined in script.part3.js) --- */
    const origOpenOwner = window.openOwnerPage;
    if (typeof origOpenOwner === 'function' && !origOpenOwner._dcHooked) {
      const hooked = function () {
        const r = origOpenOwner.apply(this, arguments);
        setTimeout(injectOwnerDiscountSection, 400);
        return r;
      };
      hooked._dcHooked = true;
      window.openOwnerPage = hooked;
    }

    /* --- Hook orderHistory.unshift for attaching discount on order --- */
    if (window.orderHistory && Array.isArray(window.orderHistory) && !window.orderHistory._dcHooked) {
      const origUnshift = window.orderHistory.unshift;
      window.orderHistory.unshift = function (...args) {
        const order = args[0];
        if (order && typeof order === 'object') {
          const applied = Discounts.getApplied();
          if (applied && !order.discountCode) {
            const amount = Discounts.calculate(
              { type: applied.type, value: applied.value },
              order.subtotal || 0,
              order.deliveryFee || 0
            );
            order.discountCode = applied.code;
            order.discountAmount = amount;
            order.total = Math.max(0, (order.total || 0) - amount);
            Discounts.recordUsage(
              applied.code,
              (window.currentUser && window.currentUser.id) || 'guest',
              order.id,
              amount
            );
            Discounts.removeFromCart();
          }
        }
        return origUnshift.apply(this, arguments);
      };
      window.orderHistory._dcHooked = true;
    }

    /* --- Initial injections --- */
    injectStoreDiscount();
    updateStoreTotals();
    setTimeout(injectPosDiscount, 800);
    setTimeout(() => {
      if (document.getElementById('ownerPage')) injectOwnerDiscountSection();
    }, 2000);
  }

  /* ============================================================
     WATCHERS (POS view changes) — ✅ إصلاح: استبدال MutationObserver بـ Hook
     ============================================================ */
  function watchPOSView() {
    const origNavigateTo = window.navigateTo;
    if (typeof origNavigateTo === 'function' && !origNavigateTo._dcHooked) {
      const hooked = function (viewId) {
        const r = origNavigateTo.apply(this, arguments);
        if (viewId === 'checkout') {
          setTimeout(injectPosDiscount, 300);
        }
        return r;
      };
      hooked._dcHooked = true;
      window.navigateTo = hooked;
    }
  }

  /* ============================================================
     INIT — deferred to let all parts register their globals
     ============================================================ */
  function boot() {
    installHooks();
    watchPOSView();
  }

  function scheduleBoot() {
    /* Short delay — ensures part0-3 IIFEs have all executed */
    setTimeout(boot, 300);
    /* Safety net — try again after full load in case of late race */
    window.addEventListener('load', () => {
      setTimeout(() => {
        /* Only re-install if a part isn't hooked yet */
        if (window.renderCart && !window.renderCart._dcHooked) installHooks();
        if (window.navigateTo && !window.navigateTo._dcHooked) watchPOSView();
      }, 200);
    }, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleBoot);
  } else {
    scheduleBoot();
  }

  console.log('%c🏷️  Discounts loaded', 'color:#22c55e;font-weight:bold;');
})();