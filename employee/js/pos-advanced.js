/* =====================================================
   HAT CANDY — POS ADVANCED FEATURES
   Split Payment · Refund · Hold Sale · Loyalty Lookup
   Cash Drawer · Employee Discount · Quick Keys
   يحقن نفسه تلقائياً في POS الموجود
   ===================================================== */
(function () {
  'use strict';

  /* ============ CONFIG BRIDGE ============ */
  const CFG = window.HAT_CONFIG || {};
  const FEAT = CFG.features || {};
  const SK = CFG.storageKeys || {};

  /* If all features disabled, exit early */
  const ANY_ENABLED = FEAT.splitPayment !== false
                    || FEAT.refunds      !== false
                    || FEAT.holdSale     !== false
                    || FEAT.loyaltyProgram !== false
                    || FEAT.cashDrawer   !== false
                    || FEAT.employeeDiscount !== false
                    || FEAT.quickKeys    !== false;

  if (!ANY_ENABLED) {
    console.log('%c🚀 POS Advanced: all features disabled by feature flags', 'color:#9ca3af;font-weight:bold;');
    return;
  }

  /* ============ KEYS & STATE ============ */
  const KEYS = {
    held:        SK.posHeldSales    || 'hatcandy-pos-held-sales',
    drawer:      SK.posDrawer       || 'hatcandy-pos-drawer',
    loyalty:     SK.posLoyalty      || 'hatcandy-loyalty-customers',
    refunds:     SK.posRefunds      || 'hatcandy-pos-refunds',
    empDiscount: SK.posEmpDiscounts || 'hatcandy-pos-employee-discounts'
  };

  const STATE = {
    splitPayment: null,
    heldSales: [],
    loyalty: {},
    drawer: null,
    refunds: [],
    empDiscount: null,
    quickKeysBound: false,
    loyaltyMatch: null
  };

  /* ============================================================
     HELPERS
     ============================================================ */
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g,
    m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const fmt = (n) => (typeof window.fmtMoney === 'function')
    ? window.fmtMoney(n)
    : '$' + (Number(n) || 0).toFixed(2);
  const num = (n) => Number(n) || 0;
  const toast = (msg, icon) => {
    if (typeof window.showToast === 'function') window.showToast(msg, icon || 'bx-check-circle');
    else console.log('[POS]', msg);
  };
  const today = () => new Date().toISOString().split('T')[0];
  const nowISO = () => new Date().toISOString();

  /* Load/save helpers */
  const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  STATE.heldSales = load(KEYS.held, []);
  STATE.loyalty   = load(KEYS.loyalty, {});
  STATE.drawer    = load(KEYS.drawer, null);
  STATE.refunds   = load(KEYS.refunds, []);

  /* ============================================================
     CSS (كل شي يحقن مرة واحدة)
     ============================================================ */
  const style = document.createElement('style');
  style.textContent = `
  /* ---- SPLIT PAYMENT ---- */
  .split-pay-panel { background:linear-gradient(135deg,rgba(250,204,67,.15),rgba(226,1,93,.08));
    border:2px dashed rgba(226,1,93,.3); border-radius:16px; padding:14px; margin-bottom:12px; }
  .split-pay-title { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
  .split-pay-title strong { color:#9f0b3b; font-size:.88rem; display:flex; align-items:center; gap:6px; }
  .split-pay-title button { padding:5px 12px; border-radius:20px; border:none;
    background:rgba(226,1,93,.1); color:#e2015d; font-size:.7rem; font-weight:700; cursor:pointer; }
  .split-pay-row { display:grid; grid-template-columns:80px 1fr; gap:8px; align-items:center; margin-bottom:6px; }
  .split-pay-row label { font-size:.76rem; font-weight:700; color:#3d2c3a; display:flex; align-items:center; gap:5px; }
  .split-pay-row label i { font-size:1rem; color:#e2015d; }
  .split-pay-row input { width:100%; padding:8px 12px; border:2px solid #f0e0e8; border-radius:10px;
    font-family:inherit; font-size:.9rem; font-weight:700; text-align:right; background:#fff; outline:none; }
  .split-pay-row input:focus { border-color:#e2015d; }
  .split-pay-summary { margin-top:10px; padding-top:10px; border-top:1.5px dashed rgba(226,1,93,.2);
    display:flex; justify-content:space-between; font-size:.8rem; font-weight:700; }
  .split-pay-summary.ok { color:#15803d; }
  .split-pay-summary.err { color:#dc2626; }

  /* ---- REFUND ---- */
  .refund-badge { display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:20px;
    background:rgba(239,68,68,.12); color:#b91c1c; font-size:.62rem; font-weight:800; text-transform:uppercase; }
  .refund-modal-summary { background:#f5f0f2; border-radius:12px; padding:12px; margin-bottom:12px;
    font-size:.82rem; }
  .refund-modal-summary div { display:flex; justify-content:space-between; padding:3px 0; }
  .refund-modal-summary strong { color:#b91c1c; }

  /* ---- HOLD SALE ---- */
  .hold-sale-btn { padding:9px 14px; border-radius:50px; border:2px solid rgba(250,204,67,.5);
    background:rgba(250,204,67,.15); color:#a16207;
    font-family:inherit; font-weight:700; font-size:.78rem; cursor:pointer;
    display:inline-flex; align-items:center; gap:6px; }
  .hold-sale-btn:hover { background:#facc43; color:#3d2c3a; }
  .held-sale-card { background:#fff; border:2px solid #facc43; border-radius:14px;
    padding:12px 14px; margin-bottom:10px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
  .held-sale-card .info { flex:1; min-width:140px; }
  .held-sale-card .info strong { display:block; font-size:.88rem; color:#9f0b3b; }
  .held-sale-card .info span { font-size:.7rem; color:#8a7a85; }
  .held-sale-card .actions { display:flex; gap:6px; }
  .held-sale-card button { padding:7px 12px; border-radius:50px; border:none;
    font-size:.72rem; font-weight:700; cursor:pointer; }
  .held-sale-card button.resume { background:linear-gradient(135deg,#22c55e,#15803d); color:#fff; }
  .held-sale-card button.del { background:rgba(239,68,68,.1); color:#dc2626; }
  .held-badge { position:absolute; top:-6px; right:-6px; min-width:20px; height:20px;
    background:#facc43; color:#3d2c3a; font-size:.65rem; font-weight:900;
    border-radius:50%; display:flex; align-items:center; justify-content:center;
    border:2px solid #fff; padding:0 5px; }

  /* ---- LOYALTY ---- */
  .loyalty-lookup-btn { position:absolute; right:6px; top:50%; transform:translateY(-50%);
    padding:6px 10px; border-radius:20px; border:none; background:linear-gradient(135deg,#facc43,#f97316);
    color:#fff; font-size:.7rem; font-weight:700; cursor:pointer;
    display:flex; align-items:center; gap:4px; }
  .loyalty-card { background:linear-gradient(135deg,#facc43,#e2015d); color:#fff;
    border-radius:14px; padding:12px 14px; margin-bottom:10px; display:flex;
    align-items:center; justify-content:space-between; gap:12px; }
  .loyalty-card .lc-info strong { display:block; font-size:.95rem; font-weight:800; }
  .loyalty-card .lc-info span { font-size:.74rem; opacity:.9; }
  .loyalty-card .lc-points { font-family:'Autolova',sans-serif; font-size:1.6rem; }
  .loyalty-tier { display:inline-block; padding:2px 8px; border-radius:20px;
    background:rgba(255,255,255,.25); font-size:.62rem; font-weight:800;
    text-transform:uppercase; letter-spacing:.5px; margin-top:4px; }
  .loyalty-suggest { position:absolute; top:100%; left:0; right:0; background:#fff;
    border:2px solid #e2015d; border-radius:12px; box-shadow:0 10px 30px rgba(226,1,93,.2);
    z-index:100; max-height:220px; overflow-y:auto; margin-top:4px; display:none; }
  .loyalty-suggest.show { display:block; }
  .loyalty-suggest-item { padding:10px 14px; cursor:pointer; border-bottom:1px solid #f0e0e8;
    font-size:.85rem; display:flex; justify-content:space-between; gap:8px; }
  .loyalty-suggest-item:hover { background:#fdf4e5; }
  .loyalty-suggest-item:last-child { border-bottom:none; }
  .loyalty-suggest-item strong { color:#9f0b3b; }
  .loyalty-suggest-item span { color:#8a7a85; font-size:.75rem; }

  /* ---- CASH DRAWER ---- */
  .drawer-btn { position:relative; }
  .drawer-btn.active { background:linear-gradient(135deg,#22c55e,#15803d) !important; color:#fff !important; }
  .drawer-panel { background:#fff; border-radius:16px; padding:18px; max-width:480px; width:100%; }
  .drawer-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:14px 0; }
  .drawer-grid label { font-size:.72rem; font-weight:700; color:#8a7a85;
    text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px; display:block; }
  .drawer-grid input { width:100%; padding:11px 13px; border:2px solid #f0e0e8; border-radius:12px;
    font-family:inherit; font-size:.95rem; font-weight:700; background:#fdf4e5; outline:none; }
  .drawer-grid input:focus { border-color:#e2015d; background:#fff; }
  .drawer-summary { background:linear-gradient(135deg,rgba(250,204,67,.15),rgba(226,1,93,.08));
    border:2px dashed rgba(226,1,93,.25); border-radius:12px; padding:12px; margin:14px 0; }
  .drawer-summary div { display:flex; justify-content:space-between; padding:3px 0; font-size:.85rem; }
  .drawer-summary div.total { border-top:1.5px solid rgba(226,1,93,.2);
    margin-top:6px; padding-top:8px; font-weight:900; font-size:1rem; color:#9f0b3b; }
  .drawer-diff.pos { color:#15803d; font-weight:900; }
  .drawer-diff.neg { color:#dc2626; font-weight:900; }

  /* ---- EMPLOYEE DISCOUNT ---- */
  .emp-disc-btn { width:100%; padding:10px; border-radius:12px; border:2px dashed rgba(139,92,246,.5);
    background:rgba(139,92,246,.06); color:#6d28d9; font-family:inherit;
    font-weight:700; font-size:.82rem; cursor:pointer; margin-top:8px;
    display:flex; align-items:center; justify-content:center; gap:6px; }
  .emp-disc-btn.active { border-style:solid; background:linear-gradient(135deg,#a855f7,#6d28d9);
    color:#fff; border-color:transparent; }
  .emp-disc-btn:disabled { opacity:.5; cursor:not-allowed; }

  /* ---- QUICK KEYS HINT ---- */
  .qk-hint { position:fixed; bottom:14px; left:14px; background:rgba(26,15,35,.9);
    color:#fff; padding:8px 14px; border-radius:50px; font-size:.68rem;
    display:none; align-items:center; gap:10px; z-index:400; }
  .qk-hint.show { display:flex; }
  .qk-hint kbd { background:rgba(255,255,255,.18); padding:2px 6px;
    border-radius:4px; font-family:monospace; font-weight:700; font-size:.65rem; }

  /* ---- MODAL WRAPPER ---- */
  .pos-modal-wrap { position:fixed; inset:0; z-index:3200; display:none;
    align-items:center; justify-content:center; padding:16px;
    background:rgba(15,8,25,.75); backdrop-filter:blur(6px); }
  .pos-modal-wrap.show { display:flex; }
  .pos-modal-card { background:#fff; border-radius:22px; width:100%; max-width:520px;
    max-height:92vh; display:flex; flex-direction:column; overflow:hidden;
    box-shadow:0 30px 80px rgba(0,0,0,.4); animation:posModalIn .3s cubic-bezier(.34,1.56,.64,1); }
  @keyframes posModalIn { from { transform:scale(.9) translateY(20px); opacity:0; }
    to { transform:scale(1) translateY(0); opacity:1; } }
  .pos-modal-head { padding:16px 20px; display:flex; align-items:center;
    justify-content:space-between; background:linear-gradient(135deg,#e2015d,#9f0b3b); color:#fff; }
  .pos-modal-head h3 { font-family:'Autolova',sans-serif; font-size:1.25rem; font-weight:400; }
  .pos-modal-head p { font-size:.7rem; opacity:.85; margin-top:2px; }
  .pos-modal-head button { width:34px; height:34px; border-radius:50%; border:none;
    background:rgba(255,255,255,.18); color:#fff; font-size:1.3rem; cursor:pointer;
    display:flex; align-items:center; justify-content:center; }
  .pos-modal-body { padding:18px 20px; overflow-y:auto; flex:1; }
  .pos-modal-foot { padding:14px 20px; border-top:1.5px dashed rgba(226,1,93,.15);
    display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; }
  .pos-modal-foot button { padding:11px 20px; border-radius:50px; border:none;
    font-family:inherit; font-weight:700; font-size:.85rem; cursor:pointer; }
  .pos-modal-foot .cancel { background:#fdf4e5; color:#3d2c3a; }
  .pos-modal-foot .primary { background:linear-gradient(135deg,#e2015d,#9f0b3b); color:#fff; }
  .pos-modal-foot .primary:disabled { opacity:.5; cursor:not-allowed; }
  `;
  document.head.appendChild(style);

  /* ============================================================
     MODAL FACTORY
     ============================================================ */
  function openModal(id, title, subtitle, bodyHTML, footHTML) {
    let modal = document.getElementById(id);
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = id;
    modal.className = 'pos-modal-wrap show';
    modal.innerHTML = `
      <div class="pos-modal-card">
        <div class="pos-modal-head">
          <div><h3>${esc(title)}</h3>${subtitle ? `<p>${esc(subtitle)}</p>` : ''}</div>
          <button data-close-modal><i class='bx bx-x'></i></button>
        </div>
        <div class="pos-modal-body">${bodyHTML}</div>
        ${footHTML ? `<div class="pos-modal-foot">${footHTML}</div>` : ''}
      </div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-close-modal]').forEach(b =>
      b.addEventListener('click', () => modal.remove()));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    return modal;
  }

  /* ============================================================
     #1 — SPLIT PAYMENT
     ============================================================ */
  function injectSplitPayment() {
    if (FEAT.splitPayment === false) return;
    const panel = document.querySelector('.customer-payment-panel');
    if (!panel || panel.querySelector('.split-pay-panel')) return;
    const paySection = panel.querySelector('#paymentSection');
    if (!paySection) return;

    const wrap = document.createElement('div');
    wrap.className = 'split-pay-panel';
    wrap.style.display = 'none';
    wrap.innerHTML = `
      <div class="split-pay-title">
        <strong><i class='bx bx-git-branch'></i> Split Payment</strong>
        <button type="button" id="clearSplitBtn">Clear</button>
      </div>
      <div class="split-pay-row">
        <label><i class='bx bx-money'></i> Cash</label>
        <input type="number" id="splitCash" step="0.01" min="0" value="0" inputmode="decimal">
      </div>
      <div class="split-pay-row">
        <label><i class='bx bx-mobile-alt'></i> Click</label>
        <input type="number" id="splitClick" step="0.01" min="0" value="0" inputmode="decimal">
      </div>
      <div class="split-pay-row">
        <label><i class='bx bx-credit-card-front'></i> Visa</label>
        <input type="number" id="splitVisa" step="0.01" min="0" value="0" inputmode="decimal">
      </div>
      <div class="split-pay-summary" id="splitSummary">
        <span>Remaining</span>
        <span id="splitRemaining">$0.00</span>
      </div>`;

    paySection.parentNode.insertBefore(wrap, paySection.nextSibling);

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'emp-disc-btn';
    toggleBtn.id = 'toggleSplitBtn';
    toggleBtn.style.cssText = 'border-color:rgba(250,204,67,.6);background:rgba(250,204,67,.12);color:#a16207;';
    toggleBtn.innerHTML = `<i class='bx bx-git-branch'></i> Split Payment (F3)`;
    paySection.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => {
      const isOpen = wrap.style.display !== 'none';
      wrap.style.display = isOpen ? 'none' : 'block';
      toggleBtn.classList.toggle('active', !isOpen);
      if (!isOpen) {
        updateSplitRemaining();
        setTimeout(() => $('splitCash').focus(), 100);
      }
    });

    ['splitCash', 'splitClick', 'splitVisa'].forEach(id => {
      const el = $(id);
      if (el) el.addEventListener('input', updateSplitRemaining);
    });

    const clearBtn = wrap.querySelector('#clearSplitBtn');
    if (clearBtn) clearBtn.addEventListener('click', () => {
      ['splitCash', 'splitClick', 'splitVisa'].forEach(id => { if ($(id)) $(id).value = 0; });
      updateSplitRemaining();
    });
  }

  function getCheckoutTotal() {
    const el = $('checkoutTotal');
    if (!el) return 0;
    return parseFloat(String(el.textContent).replace(/[^\d.-]/g, '')) || 0;
  }

  function updateSplitRemaining() {
    const cash = num($('splitCash')?.value);
    const click = num($('splitClick')?.value);
    const visa = num($('splitVisa')?.value);
    const total = getCheckoutTotal();
    const paid = cash + click + visa;
    const remaining = Math.max(0, Math.round((total - paid) * 100) / 100);
    const summary = $('splitSummary');
    const remEl = $('splitRemaining');
    if (!summary || !remEl) return;
    remEl.textContent = fmt(remaining);
    summary.classList.toggle('ok', remaining < 0.01);
    summary.classList.toggle('err', remaining >= 0.01);
    summary.firstElementChild.textContent = remaining < 0.01 ? '✓ Fully Paid' : 'Remaining';
    return { cash, click, visa, total, paid, remaining };
  }

  /* Hook into checkout to allow split */
  const origHandleInStore = window.handleInStoreCheckout;
  if (typeof origHandleInStore === 'function' && !origHandleInStore._paHooked) {
    const hooked = function () {
      const split = updateSplitRemaining();
      const cash = split.cash, click = split.click, visa = split.visa;

      if (cash + click + visa > 0) {
        if (split.remaining > 0.01) {
          alert(`⚠️ Remaining ${fmt(split.remaining)} not paid yet.\nPlease complete or clear the split.`);
          return;
        }

        const methods = [];
        if (cash > 0) methods.push(`Cash: ${fmt(cash)}`);
        if (click > 0) methods.push(`Click: ${fmt(click)}`);
        if (visa > 0) methods.push(`Visa: ${fmt(visa)}`);
        STATE.splitPayment = { cash, click, visa, method: methods.join(' + ') };

        const origPayActive = document.querySelector('.pay-method.active');
        const origAttr = origPayActive ? origPayActive.dataset.method : null;
        if (origPayActive) origPayActive.dataset.method = 'split';

        const r = origHandleInStore.apply(this, arguments);

        if (origPayActive) origPayActive.dataset.method = origAttr || 'cash';
        return r;
      }

      return origHandleInStore.apply(this, arguments);
    };
    hooked._paHooked = true;
    window.handleInStoreCheckout = hooked;
  }

  /* Attach split info to saved orders */
  const origSaveEmpOrders = window.saveEmployeeOrders;
  if (typeof origSaveEmpOrders === 'function' && !origSaveEmpOrders._paHooked) {
    const hooked = function (list) {
      if (STATE.splitPayment && Array.isArray(list) && list.length) {
        const latest = list[list.length - 1];
        if (latest && !latest.splitPayment) {
          latest.splitPayment = { ...STATE.splitPayment };
          latest.payment = 'split';
          latest.paymentBreakdown = STATE.splitPayment.method;
          STATE.splitPayment = null;
        }
      }
      return origSaveEmpOrders.apply(this, arguments);
    };
    hooked._paHooked = true;
    window.saveEmployeeOrders = hooked;
  }

  /* ============================================================
     #2 — REFUND PROCESSING
     ============================================================ */
  function injectRefundButton(orderCard) {
    if (FEAT.refunds === false) return;
    if (!orderCard || orderCard.querySelector('.refund-btn')) return;
    const id = orderCard.querySelector('.order-card-del-id')?.textContent.trim().split(/\s+/)[0];
    if (!id || !id.startsWith('HC-')) return;
    const actions = orderCard.querySelector('.order-actions-del');
    if (!actions) return;
    if (orderCard.classList.contains('status-cancelled')) return;

    const btn = document.createElement('button');
    btn.className = 'order-action-btn-del danger refund-btn';
    btn.title = 'Refund this order';
    btn.innerHTML = `<i class='bx bx-undo'></i>`;
    btn.addEventListener('click', (e) => { e.stopPropagation(); openRefundModal(id); });
    actions.appendChild(btn);
  }

  function openRefundModal(orderId) {
    const orders = (typeof window.loadEmployeeOrders === 'function')
      ? window.loadEmployeeOrders() : [];
    let order = orders.find(o => o.id === orderId);
    if (!order && window.onlineOrders) order = window.onlineOrders.find(o => o.id === orderId);
    if (!order && window.manualOrders) order = window.manualOrders.find(o => o.id === orderId);
    if (!order) { toast('Order not found', 'bx-error-circle'); return; }

    const alreadyRefunded = STATE.refunds.filter(r => r.orderId === orderId && r.status === 'completed');
    const refundedAmount = alreadyRefunded.reduce((s, r) => s + r.amount, 0);
    const remainingRefundable = Math.max(0, num(order.total) - refundedAmount);

    if (remainingRefundable < 0.01) {
      toast('Already fully refunded', 'bx-info-circle');
      return;
    }

    const ar = window.lang === 'ar';
    const body = `
      <div class="refund-modal-summary">
        <div><span>Order ID</span><strong>${esc(order.id)}</strong></div>
        <div><span>Date</span><span>${esc(order.date || '')}</span></div>
        <div><span>Customer</span><span>${esc(order.customerInfo?.name || order.customerName || 'Guest')}</span></div>
        <div><span>Original Total</span><strong>${fmt(order.total)}</strong></div>
        ${refundedAmount > 0 ? `<div><span>Already Refunded</span><strong style="color:#b91c1c;">-${fmt(refundedAmount)}</strong></div>` : ''}
        <div style="border-top:1px dashed rgba(226,1,93,.2);margin-top:6px;padding-top:8px;">
          <span><strong>Refundable</strong></span><strong>${fmt(remainingRefundable)}</strong></div>
      </div>
      <div class="form-group">
        <label style="font-size:.75rem;font-weight:700;color:#8a7a85;text-transform:uppercase;">Refund Amount</label>
        <input type="number" id="refundAmount" step="0.01" min="0.01" max="${remainingRefundable}"
          value="${remainingRefundable.toFixed(2)}"
          style="width:100%;padding:12px 14px;border:2px solid #f0e0e8;border-radius:12px;
                 font-family:inherit;font-size:1.1rem;font-weight:700;text-align:right;outline:none;">
      </div>
      <div class="form-group">
        <label style="font-size:.75rem;font-weight:700;color:#8a7a85;text-transform:uppercase;">Reason</label>
        <select id="refundReason" style="width:100%;padding:11px 14px;border:2px solid #f0e0e8;
          border-radius:12px;font-family:inherit;font-size:.88rem;background:#fdf4e5;outline:none;">
          <option value="customer_request">${ar ? 'طلب العميل' : 'Customer request'}</option>
          <option value="damaged">${ar ? 'منتج تالف' : 'Damaged product'}</option>
          <option value="wrong_item">${ar ? 'منتج خاطئ' : 'Wrong item'}</option>
          <option value="late_delivery">${ar ? 'تأخر التوصيل' : 'Late delivery'}</option>
          <option value="other">${ar ? 'سبب آخر' : 'Other'}</option>
        </select>
      </div>
      <div class="form-group">
        <label style="font-size:.75rem;font-weight:700;color:#8a7a85;text-transform:uppercase;">Notes (optional)</label>
        <textarea id="refundNotes" rows="2" style="width:100%;padding:10px 14px;
          border:2px solid #f0e0e8;border-radius:12px;font-family:inherit;font-size:.85rem;
          resize:vertical;outline:none;"></textarea>
      </div>
      <div style="display:flex;gap:8px;margin-top:10px;">
        <button type="button" id="refundFullBtn" style="flex:1;padding:10px;border-radius:10px;
          border:2px solid rgba(226,1,93,.25);background:#fff;color:#e2015d;font-weight:700;
          font-size:.8rem;cursor:pointer;">Full ${fmt(remainingRefundable)}</button>
        <button type="button" id="refundHalfBtn" style="flex:1;padding:10px;border-radius:10px;
          border:2px solid rgba(226,1,93,.25);background:#fff;color:#e2015d;font-weight:700;
          font-size:.8rem;cursor:pointer;">Half ${fmt(remainingRefundable / 2)}</button>
      </div>`;

    const modal = openModal('refundModal', 'Refund Order', order.id, body,
      `<button class="cancel" data-close-modal>Cancel</button>
       <button class="primary" id="confirmRefundBtn">
         <i class='bx bx-undo'></i> Process Refund</button>`);

    const amtIn = modal.querySelector('#refundAmount');
    modal.querySelector('#refundFullBtn').addEventListener('click', () => {
      amtIn.value = remainingRefundable.toFixed(2);
    });
    modal.querySelector('#refundHalfBtn').addEventListener('click', () => {
      amtIn.value = (remainingRefundable / 2).toFixed(2);
    });

    modal.querySelector('#confirmRefundBtn').addEventListener('click', () => {
      const amount = num(amtIn.value);
      if (amount <= 0) { alert('Enter a valid amount'); return; }
      if (amount > remainingRefundable) {
        alert(`Max refundable: ${fmt(remainingRefundable)}`); return;
      }
      const reason = modal.querySelector('#refundReason').value;
      const notes = modal.querySelector('#refundNotes').value.trim();

      const refund = {
        id: 'ref-' + Date.now(),
        orderId: order.id,
        orderTotal: num(order.total),
        amount, reason, notes,
        employee: window.currentEmployee?.username || 'unknown',
        employeeName: window.currentEmployee?.name || 'Unknown',
        date: nowISO(),
        status: 'completed'
      };
      STATE.refunds.push(refund);
      save(KEYS.refunds, STATE.refunds);

      const list = window.loadEmployeeOrders();
      const i = list.findIndex(o => o.id === order.id);
      if (i !== -1) {
        list[i].refundedAmount = (list[i].refundedAmount || 0) + amount;
        if (list[i].refundedAmount >= num(list[i].total)) {
          list[i].status = 'refunded';
        }
        window.saveEmployeeOrders(list);
      }

      modal.remove();
      toast(`Refunded ${fmt(amount)}`, 'bx-check-circle');

      if (typeof window.renderDeliveryCenter === 'function') window.renderDeliveryCenter();
      if (typeof window.renderRecentOrders === 'function') window.renderRecentOrders();
    });
  }

  /* Hook into order card rendering to add refund button */
  const origOrderCard = window.orderCardHtml;
  if (typeof origOrderCard === 'function' && !origOrderCard._paHooked) {
    const hooked = function (order, isManual) {
      let html = origOrderCard.apply(this, arguments);
      if (order && order.refundedAmount > 0) {
        html = html.replace(
          /<div class="order-card-del-id">/,
          `<div class="order-card-del-id"><span class="refund-badge">
            <i class='bx bx-undo'></i> Refunded ${fmt(order.refundedAmount)}</span> `
        );
      }
      return html;
    };
    hooked._paHooked = true;
    window.orderCardHtml = hooked;
  }

  /* Watch for order cards to inject refund buttons */
  document.addEventListener('DOMContentLoaded', () => {
    const obs = new MutationObserver((muts) => {
      muts.forEach(m => {
        m.addedNodes.forEach(n => {
          if (n.nodeType === 1 && n.classList?.contains('order-card-del')) {
            injectRefundButton(n);
          }
        });
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => document.querySelectorAll('.order-card-del').forEach(injectRefundButton), 800);
  });

  /* ============================================================
     #3 — HOLD / PARK SALE
     ============================================================ */
  function injectHoldButton() {
    if (FEAT.holdSale === false) return;
    const header = document.querySelector('#view-checkout .checkout-header-actions');
    if (!header || header.querySelector('.hold-sale-btn')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hold-sale-btn';
    btn.id = 'holdSaleBtn';
    btn.innerHTML = `<i class='bx bx-pause-circle'></i> <span class="hide-xs">Hold</span>`;
    btn.title = 'Hold this sale (F4)';
    header.insertBefore(btn, header.firstChild);

    btn.addEventListener('click', holdCurrentSale);

    const badge = document.createElement('span');
    badge.className = 'held-badge';
    badge.id = 'heldBadge';
    badge.style.display = 'none';
    btn.style.position = 'relative';
    btn.appendChild(badge);
    updateHeldBadge();
  }

  function holdCurrentSale() {
    if (!window.currentOrder || !window.currentOrder.items.length) {
      toast('Cart is empty', 'bx-info-circle');
      return;
    }
    const customerName = $('customerName')?.value.trim() || '';
    const customerPhone = $('customerPhone')?.value.trim() || '';
    const note = prompt('Add a note (optional):', customerName || '') || '';
    const held = {
      id: 'hold-' + Date.now(),
      items: JSON.parse(JSON.stringify(window.currentOrder.items)),
      customerName, customerPhone, note,
      employee: window.currentEmployee?.username || '',
      employeeName: window.currentEmployee?.name || '',
      createdAt: nowISO(),
      total: (function () {
        let s = 0;
        window.currentOrder.items.forEach(it => {
          if (it.type === 'offer') s += it.data.price;
          else {
            s += it.data.type.price;
            it.data.items.forEach(i => s += i.price * i.qty);
          }
        });
        return s;
      })()
    };
    STATE.heldSales.push(held);
    save(KEYS.held, STATE.heldSales);

    if (typeof window.resetOrderState === 'function') window.resetOrderState();
    if (typeof window.navigateTo === 'function') window.navigateTo('home');
    updateHeldBadge();
    toast('Sale held — find it on Home', 'bx-pause-circle');
  }

  function updateHeldBadge() {
    const badge = $('heldBadge');
    if (!badge) return;
    if (STATE.heldSales.length > 0) {
      badge.textContent = STATE.heldSales.length;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
    const homeCard = document.querySelector('[data-held-card]');
    if (homeCard) {
      const cntEl = homeCard.querySelector('.held-count');
      if (cntEl) cntEl.textContent = STATE.heldSales.length;
    }
  }

  function injectHeldSalesCard() {
    if (FEAT.holdSale === false) return;
    const home = document.querySelector('#view-home .home-options');
    if (!home || document.querySelector('[data-held-card]')) return;
    const card = document.createElement('div');
    card.className = 'home-card';
    card.setAttribute('data-held-card', '1');
    card.style.border = '2px solid rgba(250,204,67,.5)';
    card.style.background = 'linear-gradient(135deg,#fff 0%,#fffaf0 100%)';
    card.innerHTML = `
      <div class="home-card-icon" style="background:linear-gradient(135deg,#facc43,#f97316);">
        <i class='bx bx-pause-circle'></i>
      </div>
      <h3>Held Sales</h3>
      <p>Parked & waiting</p>
      <span class="home-card-badge held-count" style="background:linear-gradient(135deg,#facc43,#f97316);color:#3d2c3a;">0</span>`;
    card.addEventListener('click', openHeldSalesModal);
    home.appendChild(card);
    updateHeldBadge();
  }

  function openHeldSalesModal() {
    const ar = window.lang === 'ar';
    if (!STATE.heldSales.length) {
      toast(ar ? 'لا توجد طلبات محفوظة' : 'No held sales', 'bx-info-circle');
      return;
    }
    const items = STATE.heldSales.map(h => `
      <div class="held-sale-card">
        <div class="info">
          <strong>${esc(h.customerName || h.note || 'Walk-in')}</strong>
          <span>${h.items.length} item${h.items.length !== 1 ? 's' : ''} · ${fmt(h.total)} · ${new Date(h.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}${h.customerPhone ? ' · ' + esc(h.customerPhone) : ''}</span>
        </div>
        <div class="actions">
          <button class="resume" data-resume="${h.id}"><i class='bx bx-play'></i> Resume</button>
          <button class="del" data-del="${h.id}"><i class='bx bx-trash'></i></button>
        </div>
      </div>`).join('');

    const modal = openModal('heldSalesModal', 'Held Sales', `${STATE.heldSales.length} parked`,
      items, `<button class="cancel" data-close-modal>Close</button>`);

    modal.querySelectorAll('[data-resume]').forEach(b => b.addEventListener('click', () => {
      const h = STATE.heldSales.find(x => x.id === b.dataset.resume);
      if (!h) return;
      window.currentOrder.items = JSON.parse(JSON.stringify(h.items));
      if ($('customerName')) $('customerName').value = h.customerName || '';
      if ($('customerPhone')) $('customerPhone').value = h.customerPhone || '';
      STATE.heldSales = STATE.heldSales.filter(x => x.id !== h.id);
      save(KEYS.held, STATE.heldSales);
      if (typeof window.renderCheckout === 'function') window.renderCheckout();
      if (typeof window.navigateTo === 'function') window.navigateTo('checkout');
      modal.remove();
      updateHeldBadge();
      toast('Sale resumed', 'bx-play-circle');
    }));

    modal.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      if (!confirm('Delete this held sale?')) return;
      STATE.heldSales = STATE.heldSales.filter(x => x.id !== b.dataset.del);
      save(KEYS.held, STATE.heldSales);
      modal.remove();
      updateHeldBadge();
      openHeldSalesModal();
    }));
  }

  /* ============================================================
     #4 — LOYALTY LOOKUP
     ============================================================ */
  const TIERS = {
    bronze: { min: 0,    label: 'Bronze', discount: 0,  color: '#cd7f32' },
    silver: { min: 500,  label: 'Silver', discount: 3,  color: '#94a3b8' },
    gold:   { min: 1500, label: 'Gold',   discount: 5,  color: '#facc43' },
    vip:    { min: 3000, label: 'VIP',    discount: 10, color: '#a855f7' }
  };

  function getTier(points) {
    const p = num(points);
    if (p >= TIERS.vip.min) return 'vip';
    if (p >= TIERS.gold.min) return 'gold';
    if (p >= TIERS.silver.min) return 'silver';
    return 'bronze';
  }

  function normalizePhone(p) {
    return String(p || '').replace(/\D/g, '').replace(/^962/, '').replace(/^0/, '');
  }

  function injectLoyaltyUI() {
    if (FEAT.loyaltyProgram === false) return;
    const phone = $('customerPhone');
    if (!phone || phone.dataset.loyaltyBound === '1') return;
    phone.dataset.loyaltyBound = '1';

    const parent = phone.parentElement;
    if (!parent) return;
    if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
    phone.style.paddingRight = '90px';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'loyalty-lookup-btn';
    btn.innerHTML = `<i class='bx bxs-star'></i> Lookup`;
    btn.title = 'Lookup loyalty customer (F5)';
    parent.appendChild(btn);

    const suggest = document.createElement('div');
    suggest.className = 'loyalty-suggest';
    suggest.id = 'loyaltySuggest';
    parent.appendChild(suggest);

    btn.addEventListener('click', () => {
      const v = phone.value.trim();
      if (!v) { phone.focus(); return; }
      doLoyaltyLookup(v);
    });

    let debounce;
    phone.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const v = phone.value.trim();
        if (v.length >= 4) showLoyaltySuggestions(v);
        else suggest.classList.remove('show');
      }, 250);
    });

    document.addEventListener('click', (e) => {
      if (!parent.contains(e.target)) suggest.classList.remove('show');
    });
  }

  function showLoyaltySuggestions(query) {
    const q = normalizePhone(query);
    const suggest = $('loyaltySuggest');
    if (!suggest) return;
    const matches = Object.entries(STATE.loyalty)
      .filter(([phone]) => phone.includes(q) || q.includes(phone))
      .slice(0, 5);
    if (!matches.length) {
      suggest.classList.remove('show');
      return;
    }
    suggest.innerHTML = matches.map(([phone, c]) => `
      <div class="loyalty-suggest-item" data-phone="${esc(phone)}">
        <div><strong>${esc(c.name || 'Customer')}</strong><br><span>${esc(phone)}</span></div>
        <div style="text-align:right;">
          <strong style="color:#facc43;">${c.points || 0}</strong>
          <div style="font-size:.65rem;color:#8a7a85;">${TIERS[getTier(c.points)].label}</div>
        </div>
      </div>`).join('');
    suggest.classList.add('show');
    suggest.querySelectorAll('.loyalty-suggest-item').forEach(item =>
      item.addEventListener('click', () => {
        const p = item.dataset.phone;
        const cust = STATE.loyalty[p];
        if (!cust) return;
        $('customerPhone').value = p;
        $('customerName').value = cust.name || '';
        STATE.loyaltyMatch = { phone: p, ...cust, tier: getTier(cust.points) };
        suggest.classList.remove('show');
        renderLoyaltyCard();
        applyLoyaltyDiscount();
      }));
  }

  function doLoyaltyLookup(phone) {
    const p = normalizePhone(phone);
    const c = STATE.loyalty[p];
    if (!c) {
      const ar = window.lang === 'ar';
      if (confirm(ar ? 'عميل جديد — إضافة إلى برنامج الولاء؟' : 'New customer — add to loyalty program?')) {
        const name = $('customerName')?.value.trim() || prompt(ar ? 'اسم العميل:' : 'Customer name:') || 'Customer';
        STATE.loyalty[p] = { name, phone: p, points: 0, joinedAt: nowISO(), visits: 0 };
        save(KEYS.loyalty, STATE.loyalty);
        STATE.loyaltyMatch = { phone: p, ...STATE.loyalty[p], tier: 'bronze' };
        renderLoyaltyCard();
        toast(ar ? 'تمت الإضافة لبرنامج الولاء ✨' : 'Added to loyalty ✨', 'bx-star');
      }
      return;
    }
    STATE.loyaltyMatch = { phone: p, ...c, tier: getTier(c.points) };
    renderLoyaltyCard();
    applyLoyaltyDiscount();
    toast(`${c.name} · ${c.points} points`, 'bx-star');
  }

  function renderLoyaltyCard() {
    const panel = document.querySelector('.customer-payment-panel .panel-section');
    if (!panel) return;
    let card = document.getElementById('loyaltyCardEl');
    if (!STATE.loyaltyMatch) {
      if (card) card.remove();
      return;
    }
    const m = STATE.loyaltyMatch;
    const tier = TIERS[m.tier];
    if (!card) {
      card = document.createElement('div');
      card.id = 'loyaltyCardEl';
      panel.appendChild(card);
    }
    card.className = 'loyalty-card';
    card.innerHTML = `
      <div class="lc-info">
        <strong>${esc(m.name || 'Customer')}</strong>
        <span>${esc(m.phone)} · ${m.visits || 0} visits</span>
        <span class="loyalty-tier" style="background:${tier.color};">
          <i class='bx bxs-crown'></i> ${tier.label}
        </span>
      </div>
      <div style="text-align:right;">
        <div class="lc-points">${m.points || 0}</div>
        <div style="font-size:.6rem;opacity:.85;text-transform:uppercase;font-weight:700;">Points</div>
      </div>`;
  }

  function applyLoyaltyDiscount() {
    if (!STATE.loyaltyMatch) return;
    const tier = TIERS[STATE.loyaltyMatch.tier];
    if (!tier || tier.discount <= 0) return;
    toast(`${tier.label} → ${tier.discount}% eligible`, 'bx-crown');
  }

  /* Award points on order completion */
  const origSaveEmpOrders2 = window.saveEmployeeOrders;
  if (typeof origSaveEmpOrders2 === 'function' && !origSaveEmpOrders2._paLoyaltyHooked) {
    const hooked = function (list) {
      if (STATE.loyaltyMatch && Array.isArray(list) && list.length) {
        const latest = list[list.length - 1];
        if (latest && !latest.loyaltyAwarded) {
          const pts = Math.floor(num(latest.total));
          const p = STATE.loyaltyMatch.phone;
          if (STATE.loyalty[p]) {
            STATE.loyalty[p].points = num(STATE.loyalty[p].points) + pts;
            STATE.loyalty[p].visits = num(STATE.loyalty[p].visits) + 1;
            STATE.loyalty[p].lastOrder = nowISO();
            save(KEYS.loyalty, STATE.loyalty);
            latest.loyaltyAwarded = pts;
            latest.loyaltyCustomer = p;
          }
        }
      }
      return origSaveEmpOrders2.apply(this, arguments);
    };
    hooked._paLoyaltyHooked = true;
    window.saveEmployeeOrders = hooked;
  }

  /* ============================================================
     #5 — CASH DRAWER COUNT
     ============================================================ */
  function injectDrawerButton() {
    if (FEAT.cashDrawer === false) return;
    const topbar = document.querySelector('.pos-topbar .nav-actions');
    if (!topbar || topbar.querySelector('.drawer-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'nav-btn drawer-btn';
    btn.id = 'drawerBtn';
    btn.innerHTML = `<i class='bx bx-wallet'></i> <span class="hide-xs">Drawer</span>`;
    btn.title = 'Cash Drawer (F6)';
    topbar.insertBefore(btn, topbar.querySelector('#btnLogout') || null);

    btn.addEventListener('click', () => {
      if (STATE.drawer && !STATE.drawer.closedAt) {
        openDrawerCloseModal();
      } else {
        openDrawerOpenModal();
      }
    });
    updateDrawerUI();
  }

  function updateDrawerUI() {
    const btn = $('drawerBtn');
    if (!btn) return;
    const open = STATE.drawer && !STATE.drawer.closedAt;
    btn.classList.toggle('active', open);
  }

  function getTodayCashSales() {
    const list = (typeof window.loadEmployeeOrders === 'function')
      ? window.loadEmployeeOrders() : [];
    const t = today();
    const empUser = window.currentEmployee?.username || '';
    let cashIn = 0, refunded = 0, count = 0;
    list.forEach(o => {
      if (o.date !== t) return;
      if (empUser && o.employeeUsername && o.employeeUsername !== empUser) return;
      if (o.status === 'cancelled') return;
      const method = (o.payment || 'cash').toLowerCase();
      if (method === 'cash' || method === 'split') {
        if (method === 'split' && o.splitPayment) cashIn += num(o.splitPayment.cash);
        else cashIn += num(o.total);
        count++;
      }
      refunded += num(o.refundedAmount);
    });
    return { cashIn, refunded, count };
  }

  function openDrawerOpenModal() {
    const ar = window.lang === 'ar';
    const opening = num(prompt(ar ? 'المبلغ الافتتاحي في الصندوق:' : 'Opening cash amount:', '0')) || 0;
    STATE.drawer = {
      id: 'dr-' + Date.now(),
      openedAt: nowISO(),
      openingCash: opening,
      employee: window.currentEmployee?.username || '',
      employeeName: window.currentEmployee?.name || '',
      closedAt: null,
      closingCash: null,
      expected: null,
      difference: null
    };
    save(KEYS.drawer, STATE.drawer);
    updateDrawerUI();
    toast(ar ? 'تم فتح الصندوق' : 'Drawer opened', 'bx-wallet');
  }

  function openDrawerCloseModal() {
    const ar = window.lang === 'ar';
    const sales = getTodayCashSales();
    const expected = num(STATE.drawer.openingCash) + sales.cashIn - sales.refunded;

    const body = `
      <div style="background:#fdf4e5;border-radius:12px;padding:14px;margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;font-size:.82rem;padding:3px 0;">
          <span>Opening Cash</span><span>${fmt(STATE.drawer.openingCash)}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:.82rem;padding:3px 0;">
          <span>Cash Sales (${sales.count})</span><span>+${fmt(sales.cashIn)}</span></div>
        ${sales.refunded > 0 ? `<div style="display:flex;justify-content:space-between;font-size:.82rem;padding:3px 0;color:#b91c1c;">
          <span>Refunds</span><span>-${fmt(sales.refunded)}</span></div>` : ''}
      </div>
      <div style="margin-bottom:14px;">
        <label style="font-size:.72rem;font-weight:700;color:#8a7a85;text-transform:uppercase;
                      letter-spacing:.5px;display:block;margin-bottom:6px;">
          Actual Cash in Drawer</label>
        <input type="number" id="actualCash" step="0.01" min="0" value="0" inputmode="decimal"
          style="width:100%;padding:14px;border:2px solid #f0e0e8;border-radius:12px;
                 font-family:inherit;font-size:1.4rem;font-weight:900;text-align:right;
                 outline:none;background:#fff;">
      </div>
      <div class="drawer-summary" id="drawerSummary">
        <div><span>Expected</span><strong>${fmt(expected)}</strong></div>
        <div><span>Actual</span><strong id="drawerActual">${fmt(0)}</strong></div>
        <div class="total"><span>Difference</span>
          <span id="drawerDiff" class="drawer-diff">${fmt(0)}</span></div>
      </div>
      <div style="font-size:.72rem;color:#8a7a85;padding:8px 12px;background:#f5f0f2;border-radius:10px;">
        <i class='bx bx-info-circle'></i>
        ${ar ? 'لا يمكن التراجع عن إغلاق الصندوق.' : 'Closing drawer cannot be undone.'}
      </div>`;

    const modal = openModal('drawerCloseModal', ar ? 'إغلاق الصندوق' : 'Close Drawer',
      STATE.drawer.id, body,
      `<button class="cancel" data-close-modal>${ar ? 'إلغاء' : 'Cancel'}</button>
       <button class="primary" id="confirmCloseBtn">
         <i class='bx bx-lock-alt'></i> ${ar ? 'إغلاق' : 'Close Drawer'}</button>`);

    const actual = modal.querySelector('#actualCash');
    actual.focus();
    actual.addEventListener('input', () => {
      const v = num(actual.value);
      const diff = v - expected;
      modal.querySelector('#drawerActual').textContent = fmt(v);
      const diffEl = modal.querySelector('#drawerDiff');
      diffEl.textContent = (diff >= 0 ? '+' : '') + fmt(diff);
      diffEl.className = 'drawer-diff ' + (diff >= 0 ? 'pos' : 'neg');
    });

    modal.querySelector('#confirmCloseBtn').addEventListener('click', () => {
      const v = num(actual.value);
      STATE.drawer.closedAt = nowISO();
      STATE.drawer.closingCash = v;
      STATE.drawer.expected = expected;
      STATE.drawer.difference = v - expected;
      save(KEYS.drawer, STATE.drawer);
      updateDrawerUI();
      modal.remove();
      toast(`${ar ? 'تم إغلاق الصندوق' : 'Drawer closed'} · ${STATE.drawer.difference >= 0 ? '+' : ''}${fmt(STATE.drawer.difference)}`,
        STATE.drawer.difference >= 0 ? 'bx-check-circle' : 'bx-error-circle');
    });
  }

  /* ============================================================
     #6 — EMPLOYEE DISCOUNT
     ============================================================ */
  function injectEmployeeDiscountButton() {
    if (FEAT.employeeDiscount === false) return;
    const paySection = document.querySelector('.customer-payment-panel #paymentSection');
    if (!paySection || paySection.querySelector('#empDiscBtn')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'empDiscBtn';
    btn.className = 'emp-disc-btn';
    btn.innerHTML = `<i class='bx bx-user-check'></i> Employee Discount`;
    paySection.appendChild(btn);

    btn.addEventListener('click', () => {
      if (STATE.empDiscount) {
        STATE.empDiscount = null;
        btn.classList.remove('active');
        btn.innerHTML = `<i class='bx bx-user-check'></i> Employee Discount`;
        if (typeof window.renderCheckout === 'function') window.renderCheckout();
        toast('Employee discount removed', 'bx-x-circle');
        return;
      }
      const code = prompt('Enter employee discount code:', '');
      if (!code) return;
      const pct = validateEmpCode(code);
      if (!pct) { alert('Invalid code'); return; }
      STATE.empDiscount = { code: code.toUpperCase(), percent: pct };
      btn.classList.add('active');
      btn.innerHTML = `<i class='bx bxs-badge-check'></i> Employee −${pct}%`;
      if (typeof window.renderCheckout === 'function') window.renderCheckout();
      toast(`Employee discount ${pct}% applied`, 'bx-check-shield');
    });
  }

  function validateEmpCode(code) {
    const list = load(KEYS.empDiscount, [
      { code: 'EMP10', percent: 10, active: true },
      { code: 'STAFF15', percent: 15, active: true }
    ]);
    const c = list.find(x => x.code.toUpperCase() === code.toUpperCase() && x.active !== false);
    return c ? c.percent : 0;
  }

  /* Apply to checkout totals */
  const origRenderCheckout = window.renderCheckout;
  if (typeof origRenderCheckout === 'function' && !origRenderCheckout._paHooked) {
    const hooked = function () {
      const r = origRenderCheckout.apply(this, arguments);
      if (STATE.empDiscount) {
        setTimeout(() => {
          const taxEl = $('checkoutTax');
          const totalEl = $('checkoutTotal');
          const subEl = $('checkoutSubtotal');
          if (!subEl || !totalEl) return;

          const subtotal = parseFloat(String(subEl.textContent).replace(/[^\d.-]/g, '')) || 0;
          const discount = (subtotal * STATE.empDiscount.percent) / 100;

          let row = document.querySelector('.emp-discount-row');
          if (!row) {
            const parent = totalEl.parentElement;
            row = document.createElement('div');
            row.className = 'emp-discount-row';
            row.style.cssText = 'display:flex;justify-content:space-between;font-size:.85rem;color:#6d28d9;font-weight:700;padding:4px 0;';
            parent.insertBefore(row, totalEl.parentElement);
          }
          row.innerHTML = `<span>Employee (${STATE.empDiscount.percent}%)</span><span>−${fmt(discount)}</span>`;

          const taxRate = (typeof window.TAX_RATE === 'number') ? window.TAX_RATE : 0.10;
          const fee = (window.currentOrderType === 'delivery')
            ? (parseFloat($('deliveryFee')?.value) || 0) : 0;
          const newTax = (subtotal - discount) * taxRate;
          const newTotal = subtotal - discount + fee + newTax;
          if (taxEl) taxEl.textContent = fmt(newTax);
          totalEl.textContent = fmt(newTotal);
        }, 60);
      } else {
        const row = document.querySelector('.emp-discount-row');
        if (row) row.remove();
      }
      return r;
    };
    hooked._paHooked = true;
    window.renderCheckout = hooked;
  }

  /* Attach to saved orders */
  const origSaveEmpOrders3 = window.saveEmployeeOrders;
  if (typeof origSaveEmpOrders3 === 'function' && !origSaveEmpOrders3._paEmpDiscHooked) {
    const hooked = function (list) {
      if (STATE.empDiscount && Array.isArray(list) && list.length) {
        const latest = list[list.length - 1];
        if (latest && !latest.employeeDiscount) {
          latest.employeeDiscount = { ...STATE.empDiscount };
          latest.discountAmount = (latest.discountAmount || 0) +
            ((latest.subtotal || 0) * STATE.empDiscount.percent) / 100;
        }
      }
      return origSaveEmpOrders3.apply(this, arguments);
    };
    hooked._paEmpDiscHooked = true;
    window.saveEmployeeOrders = hooked;
  }

  /* ============================================================
     #7 — QUICK KEYS
     ============================================================ */
  function bindQuickKeys() {
    if (FEAT.quickKeys === false) return;
    if (STATE.quickKeysBound) return;
    STATE.quickKeysBound = true;

    document.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key;

      if (key === 'F1') {
        e.preventDefault();
        selectPaymentMethod('cash');
        toast('Cash selected', 'bx-money');
      } else if (key === 'F2') {
        e.preventDefault();
        selectPaymentMethod('click');
        toast('Click selected', 'bx-mobile-alt');
      } else if (key === 'F3') {
        e.preventDefault();
        const btn = $('toggleSplitBtn');
        if (btn) btn.click();
      } else if (key === 'F4') {
        e.preventDefault();
        const btn = $('holdSaleBtn');
        if (btn) btn.click();
      } else if (key === 'F5') {
        e.preventDefault();
        const phone = $('customerPhone');
        if (phone && phone.value.trim()) {
          const btn = document.querySelector('.loyalty-lookup-btn');
          if (btn) btn.click();
        } else if (phone) {
          phone.focus();
        }
      } else if (key === 'F6') {
        e.preventDefault();
        const btn = $('drawerBtn');
        if (btn) btn.click();
      } else if (key === 'F9') {
        e.preventDefault();
        const btn = $('btnCheckout');
        if (btn && !btn.disabled) btn.click();
      } else if (key === 'Escape') {
        const m = document.querySelector('.pos-modal-wrap.show');
        if (m) { m.remove(); e.stopPropagation(); }
      } else if (key === '?' || (e.shiftKey && key === '/')) {
        showQuickKeysHelp();
      }
    });

    const hint = document.createElement('div');
    hint.className = 'qk-hint';
    hint.id = 'qkHint';
    hint.innerHTML = `<span>Press <kbd>?</kbd> for shortcuts</span>`;
    document.body.appendChild(hint);

    setTimeout(() => {
      hint.classList.add('show');
      setTimeout(() => hint.classList.remove('show'), 5000);
    }, 3000);
  }

  function selectPaymentMethod(method) {
    const btn = document.querySelector(`.pay-method[data-method="${method}"]`);
    if (btn) btn.click();
  }

  function showQuickKeysHelp() {
    const body = `
      <div style="display:grid;gap:10px;font-size:.85rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;
          padding:10px 14px;background:#fdf4e5;border-radius:10px;">
          <span>Cash</span><kbd style="background:#e2015d;color:#fff;padding:4px 10px;
          border-radius:6px;font-family:monospace;font-weight:700;">F1</kbd></div>
        <div style="display:flex;justify-content:space-between;align-items:center;
          padding:10px 14px;background:#fdf4e5;border-radius:10px;">
          <span>Click</span><kbd style="background:#e2015d;color:#fff;padding:4px 10px;
          border-radius:6px;font-family:monospace;font-weight:700;">F2</kbd></div>
        <div style="display:flex;justify-content:space-between;align-items:center;
          padding:10px 14px;background:#fdf4e5;border-radius:10px;">
          <span>Split Payment</span><kbd style="background:#e2015d;color:#fff;padding:4px 10px;
          border-radius:6px;font-family:monospace;font-weight:700;">F3</kbd></div>
        <div style="display:flex;justify-content:space-between;align-items:center;
          padding:10px 14px;background:#fdf4e5;border-radius:10px;">
          <span>Hold Sale</span><kbd style="background:#e2015d;color:#fff;padding:4px 10px;
          border-radius:6px;font-family:monospace;font-weight:700;">F4</kbd></div>
        <div style="display:flex;justify-content:space-between;align-items:center;
          padding:10px 14px;background:#fdf4e5;border-radius:10px;">
          <span>Loyalty Lookup</span><kbd style="background:#e2015d;color:#fff;padding:4px 10px;
          border-radius:6px;font-family:monospace;font-weight:700;">F5</kbd></div>
        <div style="display:flex;justify-content:space-between;align-items:center;
          padding:10px 14px;background:#fdf4e5;border-radius:10px;">
          <span>Cash Drawer</span><kbd style="background:#e2015d;color:#fff;padding:4px 10px;
          border-radius:6px;font-family:monospace;font-weight:700;">F6</kbd></div>
        <div style="display:flex;justify-content:space-between;align-items:center;
          padding:10px 14px;background:linear-gradient(135deg,#facc43,#e2015d);color:#fff;
          border-radius:10px;font-weight:700;">
          <span>Complete Order</span><kbd style="background:rgba(255,255,255,.25);color:#fff;
          padding:4px 10px;border-radius:6px;font-family:monospace;font-weight:700;">F9</kbd></div>
      </div>`;
    openModal('qkHelpModal', 'Keyboard Shortcuts', 'Speed up your checkout',
      body, `<button class="cancel" data-close-modal>Close</button>`);
  }

  /* ============================================================
     INIT — Wait for POS DOM, then inject everything
     ============================================================ */
  function initAll() {
    injectSplitPayment();
    injectHoldButton();
    injectHeldSalesCard();
    injectLoyaltyUI();
    injectDrawerButton();
    injectEmployeeDiscountButton();
    bindQuickKeys();
    updateHeldBadge();
  }

  // ✅ إصلاح: استبدال MutationObserver الثقيل بـ Hook على navigateTo
  function hookNavigateTo() {
    const origNavigateTo = window.navigateTo;
    if (typeof origNavigateTo === 'function' && !origNavigateTo._paHooked) {
      const hooked = function (viewId) {
        const r = origNavigateTo.apply(this, arguments);
        if (viewId === 'checkout') {
          setTimeout(() => {
            injectSplitPayment();
            injectHoldButton();
            injectEmployeeDiscountButton();
            injectLoyaltyUI();
          }, 300);
        }
        if (viewId === 'home') {
          setTimeout(injectHeldSalesCard, 300);
        }
        return r;
      };
      hooked._paHooked = true;
      window.navigateTo = hooked;
    }
  }

  function watchPOSReady() {
    const posApp = document.getElementById('posApp');
    if (!posApp) return;

    const check = () => {
      if (posApp.classList.contains('active')) {
        setTimeout(initAll, 400);
      }
    };

    const obs = new MutationObserver(check);
    obs.observe(posApp, { attributes: true, attributeFilter: ['class'] });
    check();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      watchPOSReady();
      hookNavigateTo();
    });
  } else {
    watchPOSReady();
    hookNavigateTo();
  }

  console.log('%c🚀 POS Advanced loaded — Split · Refund · Hold · Loyalty · Drawer · EmpDisc · QuickKeys',
    'color:#e2015d;font-weight:bold;font-size:13px;');
})();