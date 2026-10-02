/* =====================================================
   HAT CANDY — CUSTOMER STORE
   Part 1: Utilities, Public Renderers, Persistence
   يعتمد على part0
   ===================================================== */

(function () {
  'use strict';

  /* =====================================================
     EXTRA STORAGE KEYS (fallback for older config)
     ===================================================== */
  const KEY_CUSTOMERS     = LS_KEYS.customers       || 'hatcandy-customers';
  const KEY_CONTACT_MSGS  = LS_KEYS.contactMessages || 'hatcandy-contact-messages';
  const KEY_ORDER_HISTORY = LS_KEYS.orderHistory    || 'hatcandy-order-history';

  /* =====================================================
     1. UTILITIES
     ===================================================== */

  /* ============ I18N translate ============ */
  window.t = function (key, vars) {
    const dict = I18N[lang] || I18N.en;
    let s = dict[key] !== undefined ? dict[key]
          : (I18N.en[key] !== undefined ? I18N.en[key] : key);
    if (vars) {
      for (const k in vars) {
        s = s.split('{' + k + '}').join(vars[k]);
      }
    }
    return s;
  };

  /* ============ Localized field ============ */
  window.L = function (obj, field) {
    if (!obj) return '';
    return (lang === 'ar' && obj[field + '_ar']) ? obj[field + '_ar'] : obj[field];
  };

  /* ============ HTML escape ============ */
  window.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;',
      '"': '&quot;', "'": '&#39;'
    }[m]));
  };

  /* ============ Format date ============ */
  window.formatDate = function (d) {
    if (!d) return '—';
    const x = new Date(d);
    if (isNaN(x.getTime())) return '—';
    return x.toLocaleDateString(
      lang === 'ar' ? 'ar-JO' : 'en-GB',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };

  /* ============ Format price (JOD) ============ */
  window.formatPrice = function (amount) {
    const n = Number(amount) || 0;
    const sym = (lang === 'ar') ? CURRENCY_SYMBOL : CURRENCY_SYMBOL_EN;
    return n.toFixed(2) + ' ' + sym;
  };

  /* ============ Status icon ============ */
  window.statusIcon = function (s) {
    return {
      processing: 'bx bx-time-five', packing: 'bx bx-archive',
      shipped: 'bx bx-package', out_for_delivery: 'bx bx-cycling',
      delivered: 'bx bx-check-circle', cancelled: 'bx bx-x-circle'
    }[s] || 'bx bx-package';
  };

  /* ============ Customer helpers ============ */
  window.custById = function (id) {
    return customers.find(c => c.id === id)
      || { name: 'Guest', email: '—', phone: '—', city: '—' };
  };

  window.customerStats = function (id) {
    const l = orderHistory.filter(o => o.customerId === id && o.status !== 'cancelled');
    return {
      orders: l.length,
      spent: l.reduce((s, o) => s + (Number(o.total) || 0), 0)
    };
  };

  /* ============ Register customer (via API) ============ */
  window.registerCustomer = async function (u) {
    // 1) ابحث محلياً
    let c = customers.find(x =>
      x.email && u.email && x.email.toLowerCase() === u.email.toLowerCase()
    );

    if (!c) {
      c = {
        id: 'c-' + Date.now(),
        name: u.name || 'Guest',
        email: u.email || '',
        phone: u.phone || '',
        city: 'Amman',
        joined: new Date().toISOString().split('T')[0],
        tier: 'new'
      };
      customers.push(c);
      /* 💾 persist immediately */
      persistCustomers();
    } else if (u.phone) {
      c.phone = u.phone;
      persistCustomers();
    }

    // 2) زامن مع السحابة في الخلفية
    if (window.Api) {
      try {
        const res = await window.Api.registerCustomer({
          name: c.name, email: c.email, phone: c.phone, city: c.city
        });
        if (res && res.id && !c.id) c.id = res.id;
      } catch (err) {
        console.warn('[registerCustomer] cloud sync failed:', err.message);
      }
    }
    return c;
  };

  /* ============ Persist helpers (exposed for part2/part3) ============ */
  window.persistCustomers = function () {
    try {
      localStorage.setItem(KEY_CUSTOMERS, JSON.stringify(customers));
    } catch (e) { console.warn('[persistCustomers]', e); }
  };

  window.persistOrderHistory = function () {
    try {
      localStorage.setItem(KEY_ORDER_HISTORY, JSON.stringify(orderHistory));
    } catch (e) { console.warn('[persistOrderHistory]', e); }
  };

  window.persistContactMessages = function () {
    try {
      localStorage.setItem(KEY_CONTACT_MSGS, JSON.stringify(contactMessages));
    } catch (e) { console.warn('[persistContactMessages]', e); }
  };

  /* ============ Jordan phone validation ============ */
  window.validateJordanPhone = function (p) {
    const c = (p || '').replace(/\D/g, '');
    return (c.length === 9  && c.startsWith('7'))    ||
           (c.length === 10 && c.startsWith('07'))   ||
           (c.length === 12 && c.startsWith('9627'));
  };

  window.isOwnerPhone = function (p) {
    return OWNER_PHONE_DIGITS.includes((p || '').replace(/\D/g, ''));
  };

  /* ============ User orders ============ */
  window.getUserOrders = function () {
    if (!currentUser) return [];
    return orderHistory.filter(o => o.customerId === currentUser.id);
  };

  window.getUserStats = function () {
    const all = getUserOrders();
    const nonCancelled = all.filter(o => o.status !== 'cancelled');
    return {
      total: all.length,
      active: all.filter(o => ['processing', 'packing', 'shipped', 'out_for_delivery'].includes(o.status)).length,
      delivered: all.filter(o => o.status === 'delivered').length,
      spent: nonCancelled.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
    };
  };

  /* =====================================================
     2. TIERED PRICING
     ===================================================== */

  window.getProductBasePrice = function (p) {
    if (!p) return 0;
    if (p.pricingType === 'tiered') return Number(p.price250) || 0;
    return Number(p.price) || 0;
  };

  window.getTierForWeight = function (p, weightGrams) {
    if (!p || p.pricingType !== 'tiered') return null;
    if (weightGrams >= 1000) return { tier: 1000, price: Number(p.price1000) || 0 };
    if (weightGrams >= 500)  return { tier: 500,  price: Number(p.price500)  || 0 };
    return { tier: 250, price: Number(p.price250) || 0 };
  };

  window.calcProductPriceForWeight = function (p, weightGrams) {
    if (!p) return 0;
    if (p.pricingType === 'tiered') {
      const tier = getTierForWeight(p, weightGrams);
      return tier ? tier.price : 0;
    }
    return Number(p.price) || 0;
  };

  /* =====================================================
     3. PERSISTENCE (localStorage + Apps Script)
     ===================================================== */

  window.saveAll = async function () {
    try {
      /* احفظ محلياً كنسخة احتياطية فورية */
      localStorage.setItem(LS_KEYS.products,      JSON.stringify(products));
      localStorage.setItem(LS_KEYS.offers,        JSON.stringify(offers));
      localStorage.setItem(LS_KEYS.gallery,       JSON.stringify(galleryImages));
      localStorage.setItem(LS_KEYS.content,       JSON.stringify(contentOverrides));
      localStorage.setItem(LS_KEYS.mixWeights,    JSON.stringify(mixWeights));
      localStorage.setItem(LS_KEYS.mixPackaging,  JSON.stringify(mixPackaging));
      localStorage.setItem(LS_KEYS.candyTypes,    JSON.stringify(candyTypes));
      localStorage.setItem(LS_KEYS.addons,        JSON.stringify(addons));
      localStorage.setItem(LS_KEYS.deliveryZones, JSON.stringify(deliveryZones));
      localStorage.setItem(LS_KEYS.storeHours,    JSON.stringify(storeHours));
      localStorage.setItem(LS_KEYS.siteConfig,    JSON.stringify(siteConfig));

      /* 💾 NEW — البيانات الحرجة اللي كانت مفقودة */
      localStorage.setItem(KEY_CUSTOMERS,     JSON.stringify(customers));
      localStorage.setItem(KEY_CONTACT_MSGS,  JSON.stringify(contactMessages));
      localStorage.setItem(KEY_ORDER_HISTORY, JSON.stringify(orderHistory));
      localStorage.setItem(LS_KEYS.googleAccounts, JSON.stringify(googleAccounts));

      /* 💾 Saved addresses + cards via helpers */
      if (typeof window.saveAddresses === 'function') window.saveAddresses();
      if (typeof window.saveCards     === 'function') window.saveCards();

      /* Contact info (from DOM if present) */
      try {
        const ph = document.querySelector('[data-contact-phone]');
        const em = document.querySelector('[data-contact-email]');
        if (ph || em) {
          localStorage.setItem(LS_KEYS.contact, JSON.stringify({
            phone: ph ? ph.textContent : '',
            email: em ? em.textContent : ''
          }));
        }
      } catch (e) { /* silent */ }

      /* امسح الكاش لإعادة الجلب من السيرفر */
      if (window.Cache) window.Cache.clear();

    } catch (e) {
      console.warn('[saveAll]', e);
    }
  };

  window.loadAll = async function () {
    try {
      /* 1) حمّل من localStorage أولاً (سريع + offline) */
      const local = (key) => {
        try {
          const raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
      };

      const lp  = local(LS_KEYS.products);
      const lo  = local(LS_KEYS.offers);
      const lg  = local(LS_KEYS.gallery);
      const lmw = local(LS_KEYS.mixWeights);
      const lmp = local(LS_KEYS.mixPackaging);
      const lct = local(LS_KEYS.candyTypes);
      const lad = local(LS_KEYS.addons);
      const ldz = local(LS_KEYS.deliveryZones);
      const lsh = local(LS_KEYS.storeHours);
      const lc  = local(LS_KEYS.content);
      const lsc = local(LS_KEYS.siteConfig);

      /* 💾 NEW — البيانات الحرجة */
      const lcu = local(KEY_CUSTOMERS);
      const lcm = local(KEY_CONTACT_MSGS);
      const loh = local(KEY_ORDER_HISTORY);
      const lga = local(LS_KEYS.googleAccounts);

      if (Array.isArray(lp))  products      = lp;
      if (Array.isArray(lo))  offers        = lo;
      if (Array.isArray(lg))  galleryImages = lg;
      if (Array.isArray(lmw)) mixWeights    = lmw;
      if (Array.isArray(lmp)) mixPackaging  = lmp;
      if (Array.isArray(lct)) candyTypes    = lct;
      if (Array.isArray(lad)) addons        = lad;
      if (Array.isArray(ldz)) deliveryZones = ldz;
      if (lsh && typeof lsh === 'object') storeHours = lsh;

      /* 💾 NEW — restore critical arrays */
      if (Array.isArray(lcu)) customers       = lcu;
      if (Array.isArray(lcm)) contactMessages = lcm;
      if (Array.isArray(loh)) orderHistory    = loh;
      if (Array.isArray(lga)) googleAccounts  = lga;

      if (lsc && typeof lsc === 'object') {
        Object.assign(siteConfig, lsc);
      }

      if (lc && typeof lc === 'object') {
        contentOverrides = lc;
        Object.keys(contentOverrides).forEach(k => {
          const v = contentOverrides[k];
          if (I18N.en[k] !== undefined && v.en !== undefined) I18N.en[k] = v.en;
          if (I18N.ar[k] !== undefined && v.ar !== undefined) I18N.ar[k] = v.ar;
        });
      }

      /* 2) 🔄 دمج الطلبات الخارجية في orderHistory (online + POS) */
      if (typeof window.syncAllOrders === 'function') {
        const merged = window.syncAllOrders();
        if (merged > 0) {
          console.log('%c🔄 Merged ' + merged + ' external orders into history',
            'color:#22c55e;font-weight:bold;');
        }
      }

      /* 3) اجلب من السحابة في الخلفية */
      if (window.Api) {
        window.Api.getAll(true)
          .then(cloud => {
            if (!cloud) return;

            if (Array.isArray(cloud.products))      products      = cloud.products;
            if (Array.isArray(cloud.offers))        offers        = cloud.offers;
            if (Array.isArray(cloud.gallery))       galleryImages = cloud.gallery;
            if (Array.isArray(cloud.candyTypes))    candyTypes    = cloud.candyTypes;
            if (Array.isArray(cloud.mixPackaging))  mixPackaging  = cloud.mixPackaging;
            if (Array.isArray(cloud.mixWeights))    mixWeights    = cloud.mixWeights;
            if (Array.isArray(cloud.addons))        addons        = cloud.addons;
            if (Array.isArray(cloud.deliveryZones)) deliveryZones = cloud.deliveryZones;

            /* احفظها محلياً */
            localStorage.setItem(LS_KEYS.products,      JSON.stringify(products));
            localStorage.setItem(LS_KEYS.offers,        JSON.stringify(offers));
            localStorage.setItem(LS_KEYS.gallery,       JSON.stringify(galleryImages));
            localStorage.setItem(LS_KEYS.candyTypes,    JSON.stringify(candyTypes));
            localStorage.setItem(LS_KEYS.mixPackaging,  JSON.stringify(mixPackaging));
            localStorage.setItem(LS_KEYS.mixWeights,    JSON.stringify(mixWeights));
            localStorage.setItem(LS_KEYS.addons,        JSON.stringify(addons));
            localStorage.setItem(LS_KEYS.deliveryZones, JSON.stringify(deliveryZones));

            /* أعد الرسم */
            if (typeof renderOffers       === 'function') renderOffers();
            if (typeof renderCandies      === 'function') renderCandies();
            if (typeof renderGallery      === 'function') renderGallery();
            if (typeof renderMixPackaging === 'function') renderMixPackaging();
            if (typeof renderMixWeights   === 'function') renderMixWeights();
            if (typeof renderMixTypesGrid === 'function') renderMixTypesGrid();
            if (typeof renderMixAddons    === 'function') renderMixAddons();

            console.log('%c☁️ Synced from cloud', 'color:#0ea5e9;font-weight:bold;');
          })
          .catch(err => {
            console.warn('[loadAll] cloud sync failed — using local cache:', err.message);
          });
      }

    } catch (e) {
      console.warn('[loadAll]', e);
    }
  };

  /* =====================================================
     4. ORDER SYNC — Merge external orders into orderHistory
     ===================================================== */

  /**
   * 🆕 دمج طلبات المتجر (onlineOrders) في orderHistory
   * + إنشاء سجلات العملاء إذا لزم الأمر
   */
  window.syncOnlineOrdersToHistory = function () {
    let added = 0;
    try {
      const raw = localStorage.getItem(LS_KEYS.onlineOrders);
      if (!raw) return 0;
      const online = JSON.parse(raw);
      if (!Array.isArray(online)) return 0;

      const existingIds = new Set(orderHistory.map(o => o.id));

      online.forEach(o => {
        if (!o || !o.id) return;
        if (existingIds.has(o.id)) return;

        /* Push to orderHistory in normalized shape */
        orderHistory.push({
          id: o.id,
          customerId: o.customerId || 'c-guest-online',
          date: o.date || (o.placedAt || '').split('T')[0],
          status: o.status || 'processing',
          payment: o.payment || 'cash',
          itemsList: o.itemsList || [],
          subtotal: Number(o.subtotal) || 0,
          tax: Number(o.tax) || 0,
          deliveryFee: Number(o.deliveryFee) || 0,
          total: Number(o.total) || 0,
          address: o.address || '',
          tracking: o.tracking || null,
          placedAt: o.placedAt || o.date,
          packedAt: o.packedAt || null,
          shippedAt: o.shippedAt || null,
          outAt: o.outAt || null,
          deliveredAt: o.deliveredAt || null,
          eta: o.eta || null,
          channel: 'online',
          ...(o.discountCode ? {
            discountCode: o.discountCode,
            discountAmount: Number(o.discountAmount) || 0
          } : {})
        });
        existingIds.add(o.id);
        added++;

        /* Register customer if not exists */
        if (o.customerName && o.customerPhone) {
          const exists = customers.find(c =>
            (o.customerPhone && c.phone === o.customerPhone) ||
            (o.customerEmail && c.email && c.email === o.customerEmail)
          );
          if (!exists) {
            customers.push({
              id: o.customerId || ('c-online-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6)),
              name: o.customerName,
              email: o.customerEmail || '',
              phone: o.customerPhone || '',
              city: 'Amman',
              joined: o.date || new Date().toISOString().split('T')[0],
              tier: 'new'
            });
          }
        }
      });

      if (added > 0) {
        persistOrderHistory();
        persistCustomers();
      }
    } catch (e) {
      console.warn('[syncOnlineOrdersToHistory]', e);
    }
    return added;
  };

  /**
   * 🆕 Master sync — يستدعي كل مصادر الطلبات الخارجية
   * يُستدعى من part3's init
   */
  window.syncAllOrders = function () {
    const before = orderHistory.length;
    if (typeof syncOnlineOrdersToHistory === 'function') syncOnlineOrdersToHistory();
    if (typeof syncEmployeeDataToOrders     === 'function') syncEmployeeDataToOrders();
    return orderHistory.length - before;
  };

  /* =====================================================
     5. TOAST & PANELS
     ===================================================== */

  let _toastTimer = null;

  window.showToast = function (msg, icon = 'bx-check-circle') {
    const toast = $('toast');
    const msgEl = $('toastMessage');
    const iconEl = toast ? toast.querySelector('i') : null;
    if (!toast || !msgEl || !iconEl) {
      console.log('[toast]', msg);
      return;
    }
    iconEl.className = 'bx ' + icon;
    msgEl.textContent = msg;
    toast.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  };

  let _savedScrollY = 0;

  window.lockBodyScroll = function () {
    _savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + _savedScrollY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.classList.add('no-scroll');
  };

  window.unlockBodyScroll = function () {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.classList.remove('no-scroll');
    window.scrollTo(0, _savedScrollY);
  };

  window.openPanel = function (panel) {
    panel.classList.add('show');
    $('overlay').classList.add('show');
    lockBodyScroll();
    const fs = $('floatingSign');
    if (fs) fs.classList.add('hide');
  };

  window.closeAllPanels = function () {
    $('cartPanel').classList.remove('show');
    $('loginPanel').classList.remove('show');
    $('overlay').classList.remove('show');
    unlockBodyScroll();
    const fs = $('floatingSign');
    if (fs) fs.classList.remove('hide');
  };

  /* =====================================================
     6. EMPLOYEE MANAGEMENT (shared with POS)
     ===================================================== */

  window.loadEmployees = function () {
    try {
      const raw = localStorage.getItem(LS_KEYS.employees);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  };

  window.saveEmployees = function (list) {
    try {
      localStorage.setItem(LS_KEYS.employees, JSON.stringify(list));
    } catch (e) {}
  };

  window.loadEmployeeData = function () {
    try {
      const orders = JSON.parse(localStorage.getItem(LS_KEYS.employeeOrders) || '[]');
      const shifts = JSON.parse(localStorage.getItem(LS_KEYS.employeeShifts) || '[]');
      return {
        orders: Array.isArray(orders) ? orders : [],
        shifts: Array.isArray(shifts) ? shifts : []
      };
    } catch (e) {
      return { orders: [], shifts: [] };
    }
  };

  window.syncEmployeeDataToOrders = function () {
    const { orders: empOrders } = loadEmployeeData();
    const existingIds = new Set(orderHistory.map(o => o.id));
    let added = 0;

    empOrders.forEach(eo => {
      if (existingIds.has(eo.id)) return;

      orderHistory.push({
        id: eo.id,
        customerId: eo.customerId || 'c-guest-pos',
        date: eo.date,
        status: eo.status || 'delivered',
        payment: eo.payment || 'cash',
        itemsList: eo.itemsList || [],
        total: Number(eo.total) || 0,
        subtotal: Number(eo.subtotal) || 0,
        tax: Number(eo.tax) || 0,
        address: eo.address || 'In-store',
        tracking: eo.tracking || null,
        placedAt: eo.date,
        packedAt: eo.date,
        shippedAt: eo.date,
        outAt: eo.date,
        deliveredAt: eo.date,
        eta: eo.date,
        servedBy: eo.servedBy || '',
        servedByUsername: eo.employeeUsername || '',
        channel: 'pos'
      });
      existingIds.add(eo.id);
      added++;

      if (eo.customerInfo && eo.customerInfo.name) {
        const exists = customers.find(c =>
          (eo.customerInfo.email && c.email && c.email === eo.customerInfo.email) ||
          (c.name === eo.customerInfo.name && c.phone === eo.customerInfo.phone)
        );
        if (!exists) {
          customers.push({
            id: eo.customerId || ('c-pos-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6)),
            name: eo.customerInfo.name,
            email: eo.customerInfo.email || '',
            phone: eo.customerInfo.phone || '',
            city: 'Amman',
            joined: eo.date,
            tier: 'new'
          });
        }
      }
    });

    if (added > 0) {
      persistOrderHistory();
      persistCustomers();
    }
    return added;
  };

  window.getEmployeeStats = function () {
    const employees = loadEmployees();
    const { orders: empOrders, shifts } = loadEmployeeData();
    return employees.map(emp => {
      const myOrders = empOrders.filter(o => o.employeeUsername === emp.username);
      const myShifts = shifts
        .filter(s => s.username === emp.username)
        .sort((a, b) => (b.checkIn || '').localeCompare(a.checkIn || ''));
      const lastShift = myShifts[0];
      const totalRevenue = myOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      const totalItems = myOrders.reduce((sum, o) =>
        sum + (o.itemsList || []).reduce((s, i) => s + Number(i.qty || 0), 0), 0);
      return {
        ...emp,
        orderCount: myOrders.length,
        revenue: totalRevenue,
        itemsSold: totalItems,
        lastShift,
        isActive: lastShift && !lastShift.checkOut
      };
    });
  };

  window.renderAdminEmployees = function () {
    const stats = getEmployeeStats();
    const tbody = $('adminEmployeesBody');
    const kpis = $('adminEmployeeKpis');
    if (!tbody || !kpis) return;

    const totalRevenue = stats.reduce((s, e) => s + e.revenue, 0);
    const totalSales = stats.reduce((s, e) => s + e.orderCount, 0);
    const activeCount = stats.filter(e => e.isActive).length;

    kpis.innerHTML = `
      <div class="kpi-card"><div class="kpi-icon"><i class='bx bx-id-card'></i></div><div><div class="kpi-value">${stats.length}</div><div class="kpi-label">${t('admin.kpiTotalEmployees')}</div></div></div>
      <div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#22c55e,#15803d);"><i class='bx bx-user-check'></i></div><div><div class="kpi-value">${activeCount}</div><div class="kpi-label">${t('admin.kpiActiveNow')}</div></div></div>
      <div class="kpi-card"><div class="kpi-icon"><i class='bx bx-receipt'></i></div><div><div class="kpi-value">${totalSales}</div><div class="kpi-label">${t('admin.kpiTotalSales')}</div></div></div>
      <div class="kpi-card"><div class="kpi-icon" style="background:linear-gradient(135deg,#facc43,#e2015d);"><i class='bx bx-dollar-circle'></i></div><div><div class="kpi-value">${formatPrice(totalRevenue)}</div><div class="kpi-label">${t('admin.kpiTotalRevenue')}</div></div></div>
    `;

    if (!stats.length) {
      tbody.innerHTML = `<tr><td colspan="8"><div class="admin-empty-note">${t('admin.noEmployees')}</div></td></tr>`;
      return;
    }

    tbody.innerHTML = stats.map(e => {
      const shift = e.lastShift;
      let shiftText = '—';
      let status = `<span class="admin-tier" style="background:rgba(107,114,128,0.15);color:#4b5563;">${t('admin.offline')}</span>`;

      if (shift) {
        const startStr = new Date(shift.checkIn).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        if (shift.checkOut) {
          const endStr = new Date(shift.checkOut).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          shiftText = `${startStr} → ${endStr}`;
        } else {
          shiftText = `${startStr} → ${t('admin.now')}`;
          status = `<span class="admin-tier active" style="background:rgba(34,197,94,0.15);color:#15803d;">● ${t('admin.online')}</span>`;
        }
      }

      return `<tr>
        <td><div class="admin-user"><div class="admin-user-avatar">${esc((e.name || 'E').charAt(0))}</div><div><div class="admin-user-name">${esc(e.name)}</div><div class="admin-sub">${esc(e.role || 'Cashier')}</div></div></div></td>
        <td><strong>${esc(e.username)}</strong></td>
        <td>${esc(e.phone || '—')}</td>
        <td>${esc(e.address || '—')}</td>
        <td>${e.orderCount}</td>
        <td><strong>${formatPrice(e.revenue)}</strong></td>
        <td>${status}<div class="admin-sub" style="margin-top:4px;">${shiftText}</div></td>
        <td><div class="admin-row-actions">
          <button class="admin-mini-btn primary" data-edit-employee="${esc(e.id)}"><i class='bx bx-edit'></i></button>
          <button class="admin-mini-btn danger" data-del-employee="${esc(e.id)}"><i class='bx bx-trash'></i></button>
        </div></td>
      </tr>`;
    }).join('');
  };

  window.openAdminEmployeeModal = function (id) {
    const modal = $('adminEmployeeModal');
    const f = $('adminEmployeeForm');
    f.reset();
    $('empId').value = '';
    $('adminEmployeeModalTitle').textContent = id ? t('admin.editEmployee') : t('admin.addEmployee');

    if (id) {
      const emp = loadEmployees().find(e => e.id === id);
      if (emp) {
        $('empId').value = emp.id;
        $('empName').value = emp.name || '';
        $('empUsername').value = emp.username || '';
        $('empPassword').value = emp.password || '';
        $('empPhone').value = emp.phone || '';
        $('empRole').value = emp.role || 'Cashier';
        $('empAddress').value = emp.address || '';
      }
    } else {
      $('empRole').value = 'Cashier';
    }
    modal.classList.add('show');
  };

  window.handleAdminEmployeeSubmit = async function (e) {
    e.preventDefault();
    const id = $('empId').value;
    const list = loadEmployees();

    const data = {
      id: id || 'emp-' + Date.now(),
      name: $('empName').value.trim(),
      username: $('empUsername').value.trim().toLowerCase(),
      password: $('empPassword').value.trim(),
      phone: $('empPhone').value.trim(),
      role: $('empRole').value.trim() || 'Cashier',
      address: $('empAddress').value.trim()
    };

    if (!data.name || !data.username || !data.password) {
      showToast(t('toast.employeeFields'), 'bx-error-circle');
      return;
    }

    const duplicate = list.find(x => x.username === data.username && x.id !== data.id);
    if (duplicate) {
      showToast(t('toast.employeeExists'), 'bx-error-circle');
      return;
    }

    if (id) {
      const i = list.findIndex(x => x.id === id);
      if (i !== -1) list[i] = { ...list[i], ...data };
      showToast(t('toast.employeeUpdated'), 'bx-check-circle');
    } else {
      list.push(data);
      showToast(t('toast.employeeAdded'), 'bx-check-circle');
    }
    saveEmployees(list);

    /* زامن مع السحابة */
    if (window.Api) {
      try {
        await window.Api.saveEmployee(data);
      } catch (err) {
        console.warn('[employee] cloud sync failed:', err.message);
      }
    }

    renderAdminEmployees();
    $('adminEmployeeModal').classList.remove('show');
  };

  /* =====================================================
     7. GOOGLE AUTH
     ===================================================== */

  window.loadGoogleAccounts = function () {
    try {
      const raw = localStorage.getItem(LS_KEYS.googleAccounts);
      googleAccounts = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(googleAccounts)) googleAccounts = [];
    } catch (err) {
      googleAccounts = [];
    }
  };

  window.persistGoogleAccounts = function () {
    try {
      localStorage.setItem(LS_KEYS.googleAccounts, JSON.stringify(googleAccounts));
    } catch (err) {}
  };

  window.rememberGoogleAccount = function (account) {
    if (!account || !account.email) return;
    if (!googleAccounts.some(a => a.email === account.email)) {
      googleAccounts.push({
        name: account.name || 'User',
        email: account.email
      });
      persistGoogleAccounts();
    }
  };

  window.openGoogleChooser = function () {
    pendingGoogleAccount = null;
    renderGoogleChooser();
    $('gChooser').classList.add('show');
  };

  window.closeGoogleChooser = function () {
    $('gChooser').classList.remove('show');
  };

  window.renderGoogleChooser = function () {
    const list = $('gChooserList');
    if (!list) return;

    if (!googleAccounts.length) {
      list.innerHTML = `<div style="padding:24px;text-align:center;font-size:.85rem;color:#5f6368;">No saved accounts on this device.</div>`;
      return;
    }

    list.innerHTML = googleAccounts.map((acc, i) => `
      <div class="gchooser-item" data-google-account="${i}" role="option" tabindex="0">
        <div class="gchooser-avatar">${esc((acc.name || 'G').charAt(0))}</div>
        <div class="gchooser-info"><strong>${esc(acc.name)}</strong><span>${esc(acc.email)}</span></div>
        <button class="gchooser-del" data-google-remove="${i}" aria-label="Remove"><i class='bx bx-x'></i></button>
      </div>
    `).join('');
  };

  window.handleGoogleAccountSelected = function (index) {
    const acc = googleAccounts[index];
    if (!acc) return;
    closeGoogleChooser();

    const linked = customers.find(c =>
      c.email && c.email.toLowerCase() === acc.email.toLowerCase() && c.phone
    );

    if (linked) {
      onSignInSuccess({ name: acc.name, email: acc.email, phone: linked.phone });
    } else {
      pendingGoogleAccount = acc;
      openGooglePhoneStep(acc);
    }
  };

  window.openGooglePhoneStep = function (acc) {
    $('googleName').textContent = acc.name;
    $('googleEmail').textContent = acc.email;
    $('googleAvatar').textContent = (acc.name || 'G').charAt(0).toUpperCase();
    $('googleBtn').style.display = 'none';
    $('loginDivider').style.display = 'none';
    $('loginForm').style.display = 'none';
    $('googlePreview').classList.add('show');
    $('googlePhoneReveal').classList.add('show');
    $('googlePhone').value = '';
    setTimeout(() => $('googlePhone').focus(), 220);
  };

  window.resetGoogleSignInUI = function () {
    $('googlePreview').classList.remove('show');
    $('googlePhoneReveal').classList.remove('show');
    $('googleBtn').style.display = 'flex';
    $('loginDivider').style.display = 'flex';
    $('loginForm').style.display = 'flex';
    $('googlePhone').value = '';
    pendingGoogleAccount = null;
  };

  /* =====================================================
     8. USER CARDS
     ===================================================== */

  window.loadUserCards = function () {
    if (!currentUser) { savedCards = []; return; }
    try {
      const all = JSON.parse(localStorage.getItem(LS_KEYS.cards) || '[]');
      savedCards = Array.isArray(all)
        ? all.filter(c => c.customerId === currentUser.id)
        : [];
    } catch (err) {
      savedCards = [];
    }
  };

  window.persistUserCards = function () {
    if (!currentUser) return;
    try {
      const all = JSON.parse(localStorage.getItem(LS_KEYS.cards) || '[]');
      const others = Array.isArray(all)
        ? all.filter(c => c.customerId !== currentUser.id)
        : [];
      localStorage.setItem(LS_KEYS.cards, JSON.stringify([...others, ...savedCards]));
    } catch (err) {}
  };

  window.saveCardForCurrentUser = function (card) {
    if (!currentUser || !card) return;
    const duplicate = savedCards.some(c => c.last4 === card.last4 && c.brand === card.brand);
    if (duplicate) return;
    savedCards.push({
      id: 'card-' + Date.now(),
      customerId: currentUser.id,
      brand: card.brand || 'Card',
      last4: card.last4,
      name: card.name,
      expiry: card.expiry
    });
    persistUserCards();
  };

  window.removeSavedCard = function (cardId) {
    savedCards = savedCards.filter(c => c.id !== cardId);
    persistUserCards();
  };

  /* =====================================================
     9. PUBLIC RENDERERS
     ===================================================== */

  window.renderOffers = function () {
    const active = offers.filter(o => o.isActive !== false && o.isActive !== 'false');
    const el = $('offersGrid');
    if (!el) return;

    if (!active.length) {
      el.innerHTML = `<div class="offers-empty"><i class='bx bx-time-five'></i><p>${t('offers.empty')}</p></div>`;
      return;
    }

    el.innerHTML = active.map(o => `
      <article class="offer-card reveal">
        <div class="offer-img-wrap">
          <span class="offer-sparkle"><i class='bx bxs-star'></i></span>
          <div class="offer-discount-ribbon"><i class='bx bxs-flame'></i> ${esc(L(o, 'discount') || '')}</div>
          <div class="offer-timer"><i class='bx bx-time-five'></i> ${esc(L(o, 'ends') || '')}</div>
          <img src="${esc(o.img)}" alt="${esc(L(o, 'name'))}">
        </div>
        <div class="offer-body">
          <span class="offer-category">${esc(L(o, 'category') || '')}</span>
          <h3 class="offer-title">${esc(L(o, 'name'))}</h3>
          <p class="offer-desc">${esc(L(o, 'desc') || '')}</p>
          <div class="offer-price-row">
            <span class="offer-new-price">${formatPrice(o.price)}</span>
            <span class="offer-old-price">${formatPrice(o.oldPrice || o.price)}</span>
            <span class="offer-save-badge">${t('offers.save')} ${formatPrice(Math.max(0, (Number(o.oldPrice || o.price) - Number(o.price))))}</span>
          </div>
          <button class="offer-cta add-to-cart-btn" data-id="${esc(o.id)}"><i class='bx bx-cart-add'></i> ${t('offers.grab')}</button>
        </div>
      </article>`).join('');

    if (typeof revealOnScroll === 'function') revealOnScroll();
  };

  window.renderCandies = function () {
    const grid = $('candyGrid');
    if (!grid) return;

    const total = products.length;
    const candies = products.filter(p => (p.category || 'candy') === 'candy').length;
    const chocs = products.filter(p => p.category === 'chocolate').length;

    if ($('catCountAll')) $('catCountAll').textContent = total;
    if ($('catCountCandy')) $('catCountCandy').textContent = candies;
    if ($('catCountChocolate')) $('catCountChocolate').textContent = chocs;

    document.querySelectorAll('.cat-circle').forEach(c =>
      c.classList.toggle('active', c.dataset.cat === candyFilter)
    );

    const list = products.filter(p => {
      if (candyFilter === 'all') return true;
      return (p.category || 'candy') === candyFilter;
    });

    if (!list.length) {
      grid.innerHTML = `<div class="offers-empty" style="grid-column:1/-1;">
        <i class='bx bx-cookie'></i>
        <p>${lang === 'ar' ? 'لا توجد منتجات ✨' : 'No products yet ✨'}</p>
      </div>`;
      return;
    }

    grid.innerHTML = list.map((p, i) => {
      const isTiered = p.pricingType === 'tiered';
      const priceHtml = isTiered
        ? `<span class="price">${formatPrice(p.price250)} <span style="font-size:.7em;opacity:.7;">/ 250g+</span>${p.oldPrice ? ` <s>${formatPrice(p.oldPrice)}</s>` : ''}</span>`
        : `<span class="price">${formatPrice(p.price)}${p.oldPrice ? ` <s>${formatPrice(p.oldPrice)}</s>` : ''}</span>`;

      return `
        <div class="candy-card reveal" style="animation-delay:${i * 0.05}s;">
          <div class="candy-card-img">
            <span class="candy-badge">${esc(L(p, 'badge') || '')}</span>
            <img src="${esc(p.img)}" alt="${esc(L(p, 'name'))}">
          </div>
          <div class="candy-card-body">
            <h3>${esc(L(p, 'name'))}</h3>
            <p>${esc(L(p, 'desc') || '')}</p>
            <div class="candy-price-row">
              ${priceHtml}
              <button class="add-to-cart-btn" data-id="${esc(p.id)}"><i class='bx bx-cart-add'></i> ${t('candies.add')}</button>
            </div>
          </div>
        </div>`;
    }).join('');

    if (typeof revealOnScroll === 'function') revealOnScroll();
  };

  window.renderGallery = function () {
    const el = $('galleryGrid');
    if (!el) return;
    el.innerHTML = galleryImages.map(g =>
      `<div class="gallery-item reveal"><img src="${esc(g.img)}" alt="${esc(g.alt || '')}"></div>`
    ).join('');
    if (typeof revealOnScroll === 'function') revealOnScroll();
  };

  /* =====================================================
     10. MIX BUILDERS (helpers)
     ===================================================== */

  window.effectiveKgPrice = function (c) {
    const sale = Number(c.sale_price_per_kg) || 0;
    const base = Number(c.price_per_kg) || 0;
    return sale > 0 ? sale : base;
  };

  window.getSelectedAddonsObjects = function () {
    return mixState.selectedAddons
      .map(id => addons.find(a => a.id === id))
      .filter(Boolean);
  };

  window.getAddonsTotal = function () {
    return getSelectedAddonsObjects()
      .reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  };

  window.calcMixPrice = function () {
    if (!mixState.weight || !mixState.packaging || !mixState.selectedTypes.length) return 0;
    const sel = mixState.selectedTypes
      .map(id => candyTypes.find(c => c.id === id))
      .filter(Boolean);
    if (!sel.length) return 0;

    const avg = sel.reduce((s, tp) => s + effectiveKgPrice(tp), 0) / sel.length;
    return (avg * (mixState.weight / 1000))
         + (Number(mixState.packaging.extra) || 0)
         + getAddonsTotal();
  };

  window.getCartSubtotal = function () {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  };

  console.log('%c🍬 Part 1 loaded — utilities, renderers, persistence', 'color:#e2015d;font-weight:bold;');

})();