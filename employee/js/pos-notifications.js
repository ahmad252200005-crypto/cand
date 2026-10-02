/* =====================================================
   HAT CANDY — POS PUSH NOTIFICATIONS
   إشعارات الطلبات الجديدة + صوت + إشعارات المتصفح
   ===================================================== */
(function () {
  'use strict';

  /* ============ CONFIG BRIDGE ============ */
  const CFG = window.HAT_CONFIG || {};
  const FEAT = CFG.features || {};
  const SK = CFG.storageKeys || {};
  const POS_CFG = CFG.pos || {};
  const NOTIF_CFG = POS_CFG.notifications || {};

  /* Feature flag */
  if (FEAT.notifications === false) {
    console.log('%c🔔 Notifications: disabled by feature flag', 'color:#9ca3af;font-weight:bold;');
    return;
  }

  /* Storage keys (from config with fallback) */
  const SEEN_KEY  = SK.posSeenOrders  || 'hatcandy-pos-seen-orders';
  const PERM_KEY  = SK.posNotifPerm   || 'hatcandy-pos-notif-permission-asked';
  const SOUND_KEY = SK.posNotifSound  || 'hatcandy-pos-notif-sound';

  /* Tunables from config */
  const POLL_MS       = Number(NOTIF_CFG.pollMs)       || 3000;
  const BADGE_POLL_MS = Number(NOTIF_CFG.badgePollMs)  || 8000;
  const AUTO_DISMISS  = Number(NOTIF_CFG.autoDismissMs)|| 30000;
  const SEEN_LIMIT    = Number(NOTIF_CFG.seenLimit)    || 500;
  const SOUND_ENABLED_DEFAULT = NOTIF_CFG.soundEnabled !== false;

  /* ---------- STATE ---------- */
  const STATE = {
    seenIds: new Set(),
    lastOnlineCount: 0,
    soundEnabled: SOUND_ENABLED_DEFAULT,
    audioCtx: null,
    pollTimer: null
  };

  /* Load seen IDs */
  try {
    const raw = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]');
    STATE.seenIds = new Set(Array.isArray(raw) ? raw : []);
  } catch {}
  try {
    const s = localStorage.getItem(SOUND_KEY);
    if (s !== null) STATE.soundEnabled = s === '1';
  } catch {}

  /* ---------- CSS ---------- */
  const style = document.createElement('style');
  style.textContent = `
    .notif-bell {
      position: relative;
    }
    .notif-bell.has-new {
      animation: notifBellShake 0.8s ease-in-out 3;
    }
    @keyframes notifBellShake {
      0%, 100% { transform: rotate(0); }
      20% { transform: rotate(-15deg); }
      40% { transform: rotate(15deg); }
      60% { transform: rotate(-10deg); }
      80% { transform: rotate(10deg); }
    }
    .notif-badge {
      position: absolute;
      top: -6px; right: -6px;
      min-width: 20px; height: 20px;
      padding: 0 6px;
      background: linear-gradient(135deg, #ef4444, #b91c1c);
      color: #fff;
      font-size: .65rem;
      font-weight: 900;
      border-radius: 50px;
      display: none;
      align-items: center;
      justify-content: center;
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(239,68,68,.4);
      animation: notifPulse 1.4s ease-in-out infinite;
    }
    .notif-badge.show { display: flex; }
    @keyframes notifPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }

    /* Full-screen overlay alert */
    .pos-new-order-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15,8,25,.6);
      backdrop-filter: blur(6px);
      z-index: 5000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .pos-new-order-overlay.show { display: flex; animation: overlayIn .3s ease; }
    @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
    .pos-new-order-card {
      background: #fff;
      border-radius: 24px;
      max-width: 480px;
      width: 100%;
      padding: 26px 24px 22px;
      text-align: center;
      box-shadow: 0 30px 80px rgba(0,0,0,.5);
      animation: cardBounce .5s cubic-bezier(.34,1.56,.64,1);
      border-top: 6px solid #e2015d;
      position: relative;
      overflow: hidden;
    }
    @keyframes cardBounce {
      0% { transform: scale(.8) translateY(30px); opacity: 0; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    .pos-new-order-icon {
      width: 76px; height: 76px;
      margin: 0 auto 14px;
      border-radius: 50%;
      background: linear-gradient(135deg, #e2015d, #9f0b3b);
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 2.2rem;
      box-shadow: 0 12px 32px rgba(226,1,93,.4);
      animation: iconRing 1.2s ease-in-out infinite;
    }
    @keyframes iconRing {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }
    .pos-new-order-card h3 {
      font-family: 'Autolova', sans-serif;
      font-size: 1.5rem;
      color: #9f0b3b;
      font-weight: 400;
      margin-bottom: 6px;
    }
    .pos-new-order-card .order-id {
      font-family: 'Courier New', monospace;
      font-size: 1.1rem;
      font-weight: 900;
      color: #e2015d;
      letter-spacing: 1.5px;
      margin-bottom: 14px;
    }
    .pos-new-order-card .details {
      background: #fdf4e5;
      border-radius: 12px;
      padding: 12px 14px;
      font-size: .82rem;
      text-align: left;
      margin-bottom: 16px;
    }
    .pos-new-order-card .details div {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
    }
    .pos-new-order-card .details div span:first-child {
      color: #8a7a85;
      font-weight: 600;
    }
    .pos-new-order-card .details div span:last-child {
      font-weight: 800;
      color: #3d2c3a;
      text-align: right;
      max-width: 60%;
      word-break: break-word;
    }
    .pos-new-order-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .pos-new-order-actions button {
      flex: 1;
      padding: 13px 16px;
      border-radius: 50px;
      border: none;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: .88rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-width: 100px;
    }
    .pos-new-order-actions .view {
      background: linear-gradient(135deg, #e2015d, #9f0b3b);
      color: #fff;
      box-shadow: 0 8px 22px rgba(226,1,93,.35);
    }
    .pos-new-order-actions .dismiss {
      background: #fdf4e5;
      color: #3d2c3a;
    }
    .pos-new-order-actions .dismiss:hover {
      background: #f5e0d8;
    }

    /* Notif settings modal */
    .notif-settings-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      background: #fdf4e5;
      border-radius: 12px;
      margin-bottom: 10px;
    }
    .notif-settings-row .label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: .85rem;
      font-weight: 700;
      color: #3d2c3a;
    }
    .notif-settings-row .label i {
      font-size: 1.3rem;
      color: #e2015d;
    }
    .notif-toggle {
      position: relative;
      width: 46px;
      height: 26px;
      background: #d4c4cc;
      border-radius: 50px;
      cursor: pointer;
      transition: background .25s;
      border: none;
    }
    .notif-toggle::before {
      content: '';
      position: absolute;
      top: 3px; left: 3px;
      width: 20px; height: 20px;
      background: #fff;
      border-radius: 50%;
      transition: transform .25s;
      box-shadow: 0 2px 4px rgba(0,0,0,.15);
    }
    .notif-toggle.on {
      background: linear-gradient(135deg, #22c55e, #15803d);
    }
    .notif-toggle.on::before {
      transform: translateX(20px);
    }
  `;
  document.head.appendChild(style);

  /* ============================================================
     SOUND — generate beep via Web Audio (no files needed)
     ============================================================ */
  function playNotifSound() {
    if (!STATE.soundEnabled) return;
    try {
      if (!STATE.audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        STATE.audioCtx = new Ctx();
      }
      const ctx = STATE.audioCtx;
      if (ctx.state === 'suspended') ctx.resume();

      /* Two-tone chime: E6 → C6 → G6 */
      const playTone = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      playTone(1318.51, 0,    0.35);  /* E6 */
      playTone(1046.50, 0.18, 0.45);  /* C6 */
      playTone(1567.98, 0.36, 0.55);  /* G6 */

      if (navigator.vibrate) navigator.vibrate([180, 80, 180, 80, 260]);
    } catch (e) { console.warn('[Notif sound]', e); }
  }

  /* ============================================================
     BROWSER NOTIFICATION
     ============================================================ */
  function requestNotifPermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    return Notification.requestPermission().then(p => p === 'granted');
  }

  function sendBrowserNotification(order) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
      const title = `🔔 New Order ${order.id}`;
      const body = `${order.customerName || 'Guest'} — ${fmt(order.total)}${order.address ? ' · ' + order.address : ''}`;
      const notif = new Notification(title, {
        body,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23e2015d"/><text x="50" y="65" text-anchor="middle" font-size="55" fill="white" font-family="Arial" font-weight="bold">H</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23e2015d"/></svg>',
        tag: 'hc-order-' + order.id,
        requireInteraction: true,
        silent: false
      });
      notif.onclick = () => {
        window.focus();
        if (document.getElementById('posApp')?.classList.contains('active')) {
          if (typeof window.openDeliveryView === 'function') window.openDeliveryView();
        }
        notif.close();
      };
    } catch (e) { console.warn('[Browser notif]', e); }
  }

  /* ============================================================
     FULL-SCREEN NEW ORDER ALERT
     ============================================================ */
  function showNewOrderOverlay(order) {
    let overlay = document.getElementById('posNewOrderOverlay');
    if (overlay) overlay.remove();

    overlay = document.createElement('div');
    overlay.id = 'posNewOrderOverlay';
    overlay.className = 'pos-new-order-overlay show';
    const itemsCount = (order.itemsList || []).reduce((s, i) => s + (i.qty || 0), 0);

    overlay.innerHTML = `
      <div class="pos-new-order-card">
        <div class="pos-new-order-icon">
          <i class='bx bx-bell'></i>
        </div>
        <h3>New Order Received!</h3>
        <div class="order-id">${esc(order.id)}</div>
        <div class="details">
          <div><span>Customer</span><span>${esc(order.customerName || 'Guest')}</span></div>
          ${order.customerPhone ? `<div><span>Phone</span><span>${esc(order.customerPhone)}</span></div>` : ''}
          <div><span>Items</span><span>${itemsCount}</span></div>
          <div><span>Total</span><span>${fmt(order.total)}</span></div>
          ${order.address ? `<div><span>Address</span><span>${esc(order.address)}</span></div>` : ''}
          <div><span>Payment</span><span>${esc((order.payment || 'cash').toUpperCase())}</span></div>
        </div>
        <div class="pos-new-order-actions">
          <button type="button" class="dismiss" data-dismiss>
            <i class='bx bx-x'></i> Dismiss
          </button>
          <button type="button" class="view" data-view>
            <i class='bx bx-show'></i> View Order
          </button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    overlay.querySelector('[data-dismiss]').addEventListener('click', () => overlay.remove());
    overlay.querySelector('[data-view]').addEventListener('click', () => {
      overlay.remove();
      if (typeof window.openDeliveryView === 'function') window.openDeliveryView();
    });

    setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, AUTO_DISMISS);
  }

  /* ============================================================
     STORAGE POLLING
     ============================================================ */
  function loadOnlineOrders() {
    try {
      const raw = localStorage.getItem(SK.onlineOrders || 'hatcandy-online-orders');
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  }

  function checkForNewOrders() {
    const orders = loadOnlineOrders();
    if (!orders.length) return;

    const newOrders = orders.filter(o => !STATE.seenIds.has(o.id));

    /* First run — mark all as seen silently */
    if (STATE.seenIds.size === 0 && orders.length > 0) {
      orders.forEach(o => STATE.seenIds.add(o.id));
      persistSeen();
      return;
    }

    if (newOrders.length === 0) return;

    newOrders.forEach(o => STATE.seenIds.add(o.id));
    persistSeen();

    const posActive = document.getElementById('posApp')?.classList.contains('active');
    if (!posActive) return;

    const latest = newOrders[newOrders.length - 1];
    if (latest.status === 'cancelled') return;

    onNewOrder(latest);

    /* Notify remaining orders with delay */
    if (newOrders.length > 1) {
      for (let i = newOrders.length - 2; i >= 0; i--) {
        const delay = (newOrders.length - 1 - i) * 2200;
        setTimeout(() => onNewOrder(newOrders[i]), delay);
      }
    }
  }

  function persistSeen() {
    try {
      const arr = Array.from(STATE.seenIds).slice(-SEEN_LIMIT);
      localStorage.setItem(SEEN_KEY, JSON.stringify(arr));
    } catch {}
  }

  function onNewOrder(order) {
    playNotifSound();
    sendBrowserNotification(order);
    showNewOrderOverlay(order);
    flashBell();
    updateBadge();

    const delView = document.getElementById('view-delivery');
    if (delView && delView.classList.contains('active')) {
      if (typeof window.renderDeliveryCenter === 'function') window.renderDeliveryCenter();
    }
    if (typeof window.refreshDeliveryBadge === 'function') window.refreshDeliveryBadge();
  }

  /* ============================================================
     BELL UI (in topbar)
     ============================================================ */
  function injectBell() {
    const topbar = document.querySelector('.pos-topbar .nav-actions');
    if (!topbar || topbar.querySelector('.notif-bell')) return;

    const bell = document.createElement('button');
    bell.className = 'nav-btn notif-bell';
    bell.id = 'notifBell';
    bell.title = 'Notifications';
    bell.innerHTML = `
      <i class='bx bx-bell'></i>
      <span class="hide-xs">Alerts</span>
      <span class="notif-badge" id="notifBadge">0</span>`;
    topbar.insertBefore(bell, topbar.firstChild);

    bell.addEventListener('click', openNotifSettings);
  }

  function flashBell() {
    const bell = $('notifBell');
    if (!bell) return;
    bell.classList.add('has-new');
    setTimeout(() => bell.classList.remove('has-new'), 2500);
  }

  function updateBadge() {
    const badge = $('notifBadge');
    if (!badge) return;
    const orders = loadOnlineOrders();
    const active = orders.filter(o =>
      ['processing', 'packing', 'shipped', 'out_for_delivery'].includes(o.status)
    ).length;
    if (active > 0) {
      badge.textContent = active > 99 ? '99+' : active;
      badge.classList.add('show');
    } else {
      badge.classList.remove('show');
    }
  }

  /* ============================================================
     SETTINGS MODAL
     ============================================================ */
  function openNotifSettings() {
    const perm = ('Notification' in window) ? Notification.permission : 'unsupported';
    const permLabel = {
      granted: '✓ Enabled',
      denied: '✗ Blocked',
      default: '⚠ Not set',
      unsupported: '— Not supported'
    }[perm] || perm;

    const body = `
      <div class="notif-settings-row">
        <div class="label"><i class='bx bx-volume-full'></i> Sound Alerts</div>
        <button type="button" class="notif-toggle ${STATE.soundEnabled ? 'on' : ''}" id="soundToggle"></button>
      </div>
      <div class="notif-settings-row">
        <div class="label">
          <i class='bx bx-desktop'></i>
          <div>
            <div>Browser Notifications</div>
            <div style="font-size:.7rem;color:#8a7a85;font-weight:500;margin-top:2px;">${permLabel}</div>
          </div>
        </div>
        ${perm === 'granted'
          ? `<span style="color:#15803d;font-weight:800;font-size:.85rem;">✓</span>`
          : perm === 'denied'
            ? `<span style="color:#dc2626;font-weight:800;font-size:.75rem;">Blocked in browser</span>`
            : `<button type="button" class="owner-btn primary" id="enableBrowserNotif" style="padding:8px 14px;font-size:.75rem;">Enable</button>`}
      </div>
      <div class="notif-settings-row">
        <div class="label"><i class='bx bx-test-tube'></i> Test Notification</div>
        <button type="button" class="owner-btn ghost" id="testNotif" style="padding:8px 14px;font-size:.75rem;">Test</button>
      </div>
      <div style="background:linear-gradient(135deg,rgba(250,204,67,.15),rgba(226,1,93,.08));
        border:1.5px dashed rgba(226,1,93,.25);border-radius:12px;padding:12px;
        font-size:.75rem;color:#8a7a85;line-height:1.6;margin-top:8px;">
        <i class='bx bx-info-circle' style="color:#e2015d;"></i>
        Notifications appear when new orders arrive from the online store.
        Keep this tab open in the background to stay notified.
      </div>`;

    openNotifModal('Notification Settings', 'Stay updated with new orders', body);

    setTimeout(() => {
      const soundToggle = document.getElementById('soundToggle');
      if (soundToggle) {
        soundToggle.addEventListener('click', () => {
          STATE.soundEnabled = !STATE.soundEnabled;
          soundToggle.classList.toggle('on', STATE.soundEnabled);
          try { localStorage.setItem(SOUND_KEY, STATE.soundEnabled ? '1' : '0'); } catch {}
          if (STATE.soundEnabled) playNotifSound();
        });
      }

      const enableBtn = document.getElementById('enableBrowserNotif');
      if (enableBtn) {
        enableBtn.addEventListener('click', async () => {
          const ok = await requestNotifPermission();
          if (ok) {
            toast('Browser notifications enabled ✓', 'bx-check-circle');
            const modal = document.getElementById('notifModal');
            if (modal) modal.remove();
            openNotifSettings();
          } else {
            toast('Permission denied', 'bx-error-circle');
          }
        });
      }

      const testBtn = document.getElementById('testNotif');
      if (testBtn) {
        testBtn.addEventListener('click', () => {
          const fakeOrder = {
            id: 'HC-TEST-' + Date.now().toString().slice(-4),
            customerName: 'Test Customer',
            customerPhone: '0799999999',
            total: 24.99,
            payment: 'cash',
            address: 'Amman, Abdoun — Test St.',
            itemsList: [{ name: 'Test', qty: 2, price: 12.5 }]
          };
          playNotifSound();
          sendBrowserNotification(fakeOrder);
          showNewOrderOverlay(fakeOrder);
          const modal = document.getElementById('notifModal');
          if (modal) modal.remove();
        });
      }
    }, 60);
  }

  function openNotifModal(title, subtitle, body) {
    let modal = document.getElementById('notifModal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'notifModal';
    modal.style.cssText = `position:fixed;inset:0;z-index:3600;display:flex;align-items:center;
      justify-content:center;padding:16px;background:rgba(15,8,25,.75);backdrop-filter:blur(6px);`;
    modal.innerHTML = `
      <div style="background:#fff;border-radius:22px;width:100%;max-width:480px;
        max-height:92vh;display:flex;flex-direction:column;overflow:hidden;
        box-shadow:0 30px 80px rgba(0,0,0,.4);animation:cardBounce .3s cubic-bezier(.34,1.56,.64,1);">
        <div style="padding:16px 20px;display:flex;align-items:center;justify-content:space-between;
          background:linear-gradient(135deg,#e2015d,#9f0b3b);color:#fff;">
          <div>
            <h3 style="font-family:'Autolova',sans-serif;font-size:1.25rem;font-weight:400;">${esc(title)}</h3>
            <p style="font-size:.7rem;opacity:.85;margin-top:2px;">${esc(subtitle)}</p>
          </div>
          <button type="button" data-close-notif style="width:34px;height:34px;border-radius:50%;
            border:none;background:rgba(255,255,255,.18);color:#fff;font-size:1.3rem;cursor:pointer;
            display:flex;align-items:center;justify-content:center;">
            <i class='bx bx-x'></i></button>
        </div>
        <div style="padding:18px 20px;overflow-y:auto;flex:1;">${body}</div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('[data-close-notif]').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  /* ============================================================
     HELPERS
     ============================================================ */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g,
      m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
  function fmt(n) {
    if (typeof window.fmtMoney === 'function') return window.fmtMoney(n);
    if (typeof window.formatPrice === 'function') return window.formatPrice(n);
    return '$' + (Number(n) || 0).toFixed(2);
  }
  function $(id) { return document.getElementById(id); }
  function toast(msg, icon) {
    if (typeof window.showToast === 'function') window.showToast(msg, icon);
  }

  /* ============================================================
     INIT
     ============================================================ */
  function start() {
    injectBell();
    updateBadge();

    /* Silent first-run baseline */
    const initial = loadOnlineOrders();
    if (STATE.seenIds.size === 0 && initial.length > 0) {
      initial.forEach(o => STATE.seenIds.add(o.id));
      persistSeen();
    }

    /* Poll */
    clearInterval(STATE.pollTimer);
    STATE.pollTimer = setInterval(checkForNewOrders, POLL_MS);

    /* Cross-tab instant sync */
    window.addEventListener('storage', (e) => {
      if (e.key === (SK.onlineOrders || 'hatcandy-online-orders')) {
        setTimeout(checkForNewOrders, 150);
      }
    });

    /* Auto-request permission after user interaction */
    ['click', 'keydown', 'touchstart'].forEach(evt => {
      document.addEventListener(evt, () => {
        try {
          if (!localStorage.getItem(PERM_KEY)) {
            localStorage.setItem(PERM_KEY, '1');
            setTimeout(() => { requestNotifPermission(); }, 1200);
          }
        } catch {}
      }, { once: true, passive: true });
    });

    /* Periodic badge refresh */
    setInterval(updateBadge, BADGE_POLL_MS);

    console.log('%c🔔 Notifications ready — polling every ' + (POLL_MS / 1000) + 's', 'color:#22c55e;font-weight:bold;');
  }

  function watchPOS() {
    const posApp = document.getElementById('posApp');
    if (!posApp) { setTimeout(watchPOS, 500); return; }

    /* Start polling immediately (works even before login) */
    start();

    /* Re-inject bell when POS becomes active */
    const obs = new MutationObserver(() => {
      if (posApp.classList.contains('active')) {
        injectBell();
        updateBadge();
      }
    });
    obs.observe(posApp, { attributes: true, attributeFilter: ['class'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchPOS);
  } else {
    watchPOS();
  }

})();