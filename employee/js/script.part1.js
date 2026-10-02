// Part 1: part1

// Auto-generated from script.js

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, m =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m])
  );
}
window.esc = window.esc || esc;

function fmtMoney(n) { return '$' + (Number(n) || 0).toFixed(2); }
window.fmtMoney = fmtMoney;

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtDateTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function statusIcon(s) {
  return {
    processing: 'bx bx-time-five', packing: 'bx bx-archive',
    shipped: 'bx bx-package', out_for_delivery: 'bx bx-cycling',
    delivered: 'bx bx-check-circle', cancelled: 'bx bx-x-circle'
  }[s] || 'bx bx-package';
}

function statusLabel(s) {
  return {
    processing: 'Processing', packing: 'Packaging', shipped: 'Shipped',
    out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled'
  }[s] || s;
}

function sourceIcon(s) {
  return { phone: '📞', whatsapp: '💬', instagram: '📷', facebook: '👍', 'walk-in': '🏬', other: '✨' }[s] || '📦';
}

function sourceLabel(s) {
  return { phone: 'Phone Call', whatsapp: 'WhatsApp', instagram: 'Instagram', facebook: 'Facebook', 'walk-in': 'Walk-in', other: 'Other' }[s] || 'Other';
}

function showToast(msg, icon = 'bx-check-circle') {
  let toast = document.getElementById('posToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'posToast';
    toast.style.cssText = `
      position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(120px);
      background:#9f0b3b;color:#fff;padding:12px 20px;border-radius:50px;
      box-shadow:0 10px 30px rgba(159,11,59,.35);z-index:99999;
      display:flex;align-items:center;gap:10px;font-family:'Montserrat',sans-serif;
      font-size:.85rem;font-weight:500;transition:transform .4s cubic-bezier(.4,0,.2,1);
      max-width:calc(100vw - 32px);`;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class='bx ${icon}' style="color:#facc43;font-size:1.2rem;flex-shrink:0;"></i><span>${esc(msg)}</span>`;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(120px)';
  }, 2400);
}
window.showToast = showToast;

/* =====================================================
   DYNAMIC STORE INFO
   ===================================================== */

function loadStoreInfoFromLocalStorage() {
  /* 1) Defaults from HAT_CONFIG first */
  if (_CFG && _CFG.site) {
    const s = _CFG.site;
    DEFAULT_STORE_INFO.name      = s.name      || DEFAULT_STORE_INFO.name;
    DEFAULT_STORE_INFO.nameAr    = s.nameAr    || DEFAULT_STORE_INFO.nameAr;
    DEFAULT_STORE_INFO.slogan    = s.tagline   || DEFAULT_STORE_INFO.slogan;
    DEFAULT_STORE_INFO.sloganAr  = s.taglineAr || DEFAULT_STORE_INFO.sloganAr;
    DEFAULT_STORE_INFO.phone     = s.phone     || DEFAULT_STORE_INFO.phone;
    DEFAULT_STORE_INFO.email     = s.email     || DEFAULT_STORE_INFO.email;
    DEFAULT_STORE_INFO.address   = s.addressEn || DEFAULT_STORE_INFO.address;
    DEFAULT_STORE_INFO.addressAr = s.address   || DEFAULT_STORE_INFO.addressAr;
  }
  /* Also from defaultStoreInfo */
  if (_CFG && _CFG.defaultStoreInfo) {
    Object.assign(DEFAULT_STORE_INFO, _CFG.defaultStoreInfo, {
      taxRate: DEFAULT_STORE_INFO.taxRate  // keep as-is (already set)
    });
  }

  /* 2) Load from localStorage (overrides defaults) */
  try {
    const raw = localStorage.getItem(LS_KEYS.storeInfo);
    STORE_INFO = raw
      ? { ...DEFAULT_STORE_INFO, ...JSON.parse(raw) }
      : { ...DEFAULT_STORE_INFO };
  } catch (e) {
    console.warn('[StoreInfo] Parse failed:', e);
    STORE_INFO = { ...DEFAULT_STORE_INFO };
  }

  /* 3) Update tax rate dynamically */
  TAX_RATE = Number(STORE_INFO.taxRate) || DEFAULT_STORE_INFO.taxRate || 0.10;

  /* 4) Apply branding to UI */
  applyStoreBranding();

  return STORE_INFO;
}
window.loadStoreInfoFromLocalStorage = loadStoreInfoFromLocalStorage;

function applyStoreBranding() {
  const name = STORE_INFO.name || 'HAT CANDY';

  document.querySelectorAll('[data-store-name]').forEach(el => {
    if (STORE_INFO.logo) {
      el.innerHTML = `<img src="${STORE_INFO.logo}" alt="${esc(name)}">`;
    } else {
      el.innerHTML = `${esc(name)}<span>.</span>`;
    }
  });

  const taxSpan = document.getElementById('checkoutTax');
  if (taxSpan && taxSpan.previousElementSibling) {
    taxSpan.previousElementSibling.textContent = `Tax (${Math.round(TAX_RATE * 100)}%)`;
  }

  if (name) document.title = name + ' | Employee POS';
}
window.applyStoreBranding = applyStoreBranding;

/* ============ LOADERS (Shared with Store) ============ */

function loadEmployeesFromAdmin() {
  try {
    const raw = localStorage.getItem(LS_KEYS.employees);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    }
  } catch (e) {}
  return [];
}
window.loadEmployeesFromAdmin = loadEmployeesFromAdmin;

function loadProductsFromAdmin() {
  try {
    const raw = localStorage.getItem(LS_KEYS.products);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) {
        PRODUCTS = arr.map(p => {
          let price = Number(p.price) || 0;
          if (p.pricingType === 'tiered') price = Number(p.price250) || price;
          return {
            id: p.id,
            name: p.name,
            price: price,
            img: p.img || '',
            stock: Number(p.stock) || 0,
            pricingType: p.pricingType || 'fixed'
          };
        });
        return;
      }
    }
  } catch (e) {}
  PRODUCTS = DEFAULT_PRODUCTS.map(p => ({ ...p }));
}
window.loadProductsFromAdmin = loadProductsFromAdmin;

function loadOnlineOrders() {
  try {
    const raw = localStorage.getItem(LS_KEYS.onlineOrders);
    const arr = raw ? JSON.parse(raw) : [];
    onlineOrders = Array.isArray(arr) ? arr : [];
  } catch (e) { onlineOrders = []; }
}
window.loadOnlineOrders = loadOnlineOrders;

function saveOnlineOrders() {
  try { localStorage.setItem(LS_KEYS.onlineOrders, JSON.stringify(onlineOrders)); } catch (e) {}
}
window.saveOnlineOrders = saveOnlineOrders;

function loadEmployeeOrders() {
  try {
    const raw = localStorage.getItem(LS_KEYS.employeeOrders);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}
window.loadEmployeeOrders = loadEmployeeOrders;

function saveEmployeeOrders(list) {
  try { localStorage.setItem(LS_KEYS.employeeOrders, JSON.stringify(list)); } catch (e) {}
}
window.saveEmployeeOrders = saveEmployeeOrders;

function loadManualOrders() {
  manualOrders = loadEmployeeOrders().filter(o => o.channel === 'manual');
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(LS_KEYS.posSettings);
    if (raw) {
      const obj = JSON.parse(raw);
      if (typeof obj.autoPrint === 'boolean') autoPrint = obj.autoPrint;
    }
  } catch (e) {}
}

function saveSettings() {
  try { localStorage.setItem(LS_KEYS.posSettings, JSON.stringify({ autoPrint })); } catch (e) {}
}

function loadInventoryItems() {
  try {
    const raw = localStorage.getItem(LS_KEYS.inventoryItems);
    const arr = raw ? JSON.parse(raw) : [];
    invItems = Array.isArray(arr) ? arr : [];
  } catch (e) { invItems = []; }
}

function saveInventoryItems() {
  try { localStorage.setItem(LS_KEYS.inventoryItems, JSON.stringify(invItems)); } catch (e) {}
}

function loadInventoryMovements() {
  try {
    const raw = localStorage.getItem(LS_KEYS.inventoryMoves);
    const arr = raw ? JSON.parse(raw) : [];
    invMovements = Array.isArray(arr) ? arr : [];
  } catch (e) { invMovements = []; }
}

function saveInventoryMovements() {
  try { localStorage.setItem(LS_KEYS.inventoryMoves, JSON.stringify(invMovements.slice(0, 1000))); } catch (e) {}
}

/* ============ VIEWPORT FIX ============ */

function setVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => setTimeout(setVH, 200));

/* ============ INIT ============ */
document.addEventListener('DOMContentLoaded', () => {
  /* Load store info FIRST (before anything else) */
  loadStoreInfoFromLocalStorage();

  loadProductsFromAdmin();
  loadOnlineOrders();
  loadManualOrders();
  loadSettings();
  loadInventoryItems();
  loadInventoryMovements();

  loginScreen.style.display = 'flex';
  posApp.classList.remove('active');

  const empList = loadEmployeesFromAdmin();
  if (!empList.length) {
    loginError.textContent = 'No employees registered yet. Ask the administrator to add one.';
  }

  setTimeout(() => {
    const u = document.getElementById('username');
    if (u) u.focus();
  }, 100);

  bindLoginForm();
  bindTopBar();
  bindGramModal();
  bindFinishBox();
  bindBackToBoxes();
  bindOrderTypeAndPayment();
  bindCheckout();
  bindReceiptActions();
  bindAutoPrintToggle();
  bindDeliveryCenter();
  bindManualOrderModal();
  bindPickItemModal();
  bindPickOfferModal();
  bindPickBoxModal();
  bindOrderDetailsModal();
  bindRecentOrders();
  bindEditFormInteractions();
  bindEditHistoryModal();
  if (FEAT_INVENTORY) bindInventoryEvents();
  bindInventoryItemModal();
  bindBarcodeLookupModal();
  bindLabelPrintModal();
  if (FEAT_CAMERA_SCANNER) bindScannerEvents();
  if (FEAT_FULLSCREEN) bindFullscreenEvents();

  refreshDeliveryBadge();
  updateInventoryBadge();
  updateFullscreenUI();
});

window.addEventListener('beforeunload', () => {
  if (currentEmployee && currentShiftId) recordShiftEnd(currentEmployee.username);
  stopScanner();
});

/* =====================================================
   LIVE SYNC WITH CUSTOMER STORE
   ===================================================== */
window.addEventListener('storage', (e) => {
  if (!e.key) return;

  /* Store info changed */
  if (e.key === LS_KEYS.storeInfo) {
    loadStoreInfoFromLocalStorage();
    showToast('Store info updated ✨', 'bx-store');
    return;
  }

  /* Products changed */
  if (e.key === LS_KEYS.products) {
    loadProductsFromAdmin();
    if (document.getElementById('view-products').classList.contains('active')) {
      renderProducts();
    }
    if (document.getElementById('view-offers').classList.contains('active')) {
      renderOffers();
    }
    showToast('Products synced from admin', 'bx-refresh');
    return;
  }

  /* Employees list changed */
  if (e.key === LS_KEYS.employees) {
    const list = loadEmployeesFromAdmin();

    if (currentEmployee) {
      const updated = list.find(x =>
        (x.username || '').toLowerCase() === currentEmployee.username.toLowerCase()
      );

      if (!updated) {
        alert('⚠️ Your account has been removed by the administrator.\nYou will be logged out.');
        forceLogout();
        return;
      }

      currentEmployee = updated;
      const display = document.getElementById('employeeNameDisplay');
      if (display) display.textContent = `${updated.name} (${updated.role || 'Cashier'})`;
      showToast('Employee data synced', 'bx-user-check');
    }
    return;
  }

  /* New online orders from customer store */
  if (e.key === LS_KEYS.onlineOrders) {
    loadOnlineOrders();
    refreshDeliveryBadge();

    if (document.getElementById('view-delivery').classList.contains('active')) {
      renderDeliveryCenter();
    } else {
      showToast('🌐 New online order received!', 'bx-globe');
    }
    return;
  }
});

/* Force logout when employee is deleted by admin */

function forceLogout() {
  if (currentEmployee && currentShiftId) recordShiftEnd(currentEmployee.username);
  currentEmployee = null;
  currentShiftId = null;
  currentOrder = { items: [], customer: { name: '', phone: '' } };
  currentBox = null;
  if (posApp) posApp.classList.remove('active');
  if (loginScreen) loginScreen.style.display = 'flex';
  if (loginForm) loginForm.reset();
}

/* ============ LOGIN ============ */

function bindLoginForm() {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const employees = loadEmployeesFromAdmin();
    if (!employees.length) {
      loginError.textContent = 'No employees registered. Ask the administrator.';
      return;
    }
    const emp = employees.find(x =>
      (x.username || '').toLowerCase() === user.toLowerCase() && x.password === pass
    );
    if (!emp) {
      loginError.textContent = 'Invalid username or password.';
      document.getElementById('password').value = '';
      document.getElementById('password').focus();
      return;
    }
    currentEmployee = emp;
    currentShiftId = recordShiftStart(emp.username, emp.name);
    loginError.textContent = '';
    document.getElementById('employeeNameDisplay').textContent = `${emp.name} (${emp.role || 'Cashier'})`;
    showPOS();
  });
}

function bindTopBar() {
  document.getElementById('btnLogout').addEventListener('click', () => {
    if (currentEmployee && currentShiftId) recordShiftEnd(currentEmployee.username);
    currentEmployee = null;
    currentShiftId = null;
    currentOrder = { items: [], customer: { name: '', phone: '' } };
    currentBox = null;
    posApp.classList.remove('active');
    loginScreen.style.display = 'flex';
    loginForm.reset();
    document.getElementById('username').focus();
  });
  document.getElementById('btnHome').addEventListener('click', () => navigateTo('home'));
}

function showPOS() {
  loginScreen.style.display = 'none';
  posApp.classList.add('active');

  loadStoreInfoFromLocalStorage();
  loadProductsFromAdmin();
  loadOnlineOrders();
  loadManualOrders();
  loadInventoryItems();
  loadInventoryMovements();
  renderOffers();
  renderBoxTypes();
  renderProducts();
  refreshDeliveryBadge();
  updateInventoryBadge();
  updateAutoPrintUI();
  renderRecentOrders();
  navigateTo('home');
  if (FEAT_FULLSCREEN) setTimeout(startFullscreenTimer, 8000);
}

/* ============ SHIFTS ============ */

function recordShiftStart(username, name) {
  const id = 'shift-' + Date.now();
  try {
    const shifts = JSON.parse(localStorage.getItem(LS_KEYS.employeeShifts) || '[]');
    shifts.push({ id, username, name, checkIn: new Date().toISOString(), checkOut: null });
    localStorage.setItem(LS_KEYS.employeeShifts, JSON.stringify(shifts));
  } catch (e) {}
  return id;
}

function recordShiftEnd(username) {
  try {
    const shifts = JSON.parse(localStorage.getItem(LS_KEYS.employeeShifts) || '[]');
    for (let i = shifts.length - 1; i >= 0; i--) {
      if (shifts[i].username === username && !shifts[i].checkOut) {
        shifts[i].checkOut = new Date().toISOString();
        break;
      }
    }
    localStorage.setItem(LS_KEYS.employeeShifts, JSON.stringify(shifts));
  } catch (e) {}
}

/* ============ NAVIGATION ============ */
window.navigateTo = function(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + viewId);
  if (target) target.classList.add('active');

  if (viewId !== 'products') {
    const fbs = document.getElementById('floatingBoxSummary');
    if (fbs) fbs.classList.remove('active');
  }

  if (viewId === 'offers') renderOffers();
  if (viewId === 'box-types') renderBoxTypes();
  if (viewId === 'products') { renderProducts(); updateCurrentBoxStats(); }
  if (viewId === 'checkout') renderCheckout();
  if (viewId === 'delivery') renderDeliveryCenter();
  if (viewId === 'home') renderRecentOrders();
  if (viewId === 'inventory' && FEAT_INVENTORY) renderInventory();
};

window.openDeliveryView = function() {
  loadOnlineOrders();
  loadManualOrders();
  navigateTo('delivery');
  renderDeliveryCenter();
};
window.openInventoryView = function() {
  if (!FEAT_INVENTORY) return;
  loadInventoryItems();
  loadInventoryMovements();
  navigateTo('inventory');
  renderInventory();
};
window.startNewBoxFlow = function() {
  currentBox = null;
  updateCurrentBoxStats();
  navigateTo('box-types');
};

/* ============ RENDERERS ============ */

function renderOffers() {
  const grid = document.getElementById('offersGrid');
  if (!grid) return;
  if (!OFFERS.length) {
    grid.innerHTML = `<div class="delivery-empty"><i class='bx bx-purchase-tag'></i><h3>No offers available</h3></div>`;
    return;
  }
  grid.innerHTML = OFFERS.map(o => `
    <div class="card" data-offer-id="${esc(o.id)}" onclick="addOfferToOrder('${esc(o.id)}')">
      <div class="badge-discount">${esc(o.discount)}</div>
      <img src="${esc(o.img)}" alt="${esc(o.name)}">
      <h4>${esc(o.name)}</h4>
      <div class="price">${fmtMoney(o.price)} <span class="old-price">${fmtMoney(o.oldPrice)}</span></div>
      <span class="card-add-hint"><i class='bx bx-cart-add'></i> Tap to add</span>
    </div>
  `).join('');
}

function renderBoxTypes() {
  const grid = document.getElementById('boxTypesGrid');
  if (!grid) return;
  grid.innerHTML = BOX_TYPES.map(b => `
    <div class="box-card" onclick="startNewBox('${esc(b.id)}')">
      <div class="box-card-icon"><i class='bx ${b.icon}'></i></div>
      <h4>${esc(b.name)}</h4>
      <div class="price">${b.price === 0 ? 'Free' : '+$' + b.price.toFixed(2)}</div>
    </div>
  `).join('');
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(p => {
    const outOfStock = p.stock <= 0;
    return `
    <div class="card ${outOfStock ? 'out-of-stock' : ''}" ${outOfStock ? '' : `onclick="openGramModal('${esc(p.id)}')"`}>
      <img src="${esc(p.img)}" alt="${esc(p.name)}">
      <h4>${esc(p.name)}</h4>
      <div class="price">${fmtMoney(p.price)}</div>
      <span class="price-note">${outOfStock ? 'Out of stock' : 'per 100g · Stock: ' + p.stock}</span>
      ${!outOfStock ? `<span class="card-add-hint"><i class='bx bx-plus-circle'></i> Tap to add</span>` : ''}
    </div>`;
  }).join('');
}

/* ============ OFFERS + BOXES ============ */
window.addOfferToOrder = function(offerId) {
  const offer = OFFERS.find(o => o.id === offerId);
  if (!offer) { showToast('Offer not found', 'bx-error-circle'); return; }
  currentOrder.items.push({ type: 'offer', data: offer });
  showToast(`${offer.name} added`, 'bx-cart-add');
  const card = document.querySelector(`[data-offer-id="${offerId}"]`);
  if (card) {
    card.style.transform = 'scale(.96)';
    card.style.borderColor = '#22c55e';
    setTimeout(() => {
      card.style.transform = '';
      card.style.borderColor = '';
    }, 350);
  }
  renderCheckout();
  setTimeout(() => navigateTo('checkout'), 250);
};

window.startNewBox = function(boxTypeId) {
  const boxType = BOX_TYPES.find(b => b.id === boxTypeId);
  if (!boxType) { showToast('Box type not found', 'bx-error-circle'); return; }
  currentBox = { type: boxType, items: [] };
  document.getElementById('currentBoxName').textContent = boxType.name;
  document.getElementById('floatingBoxSummary').classList.remove('active');
  updateCurrentBoxStats();
  showToast(`Started: ${boxType.name}`, 'bx-box');
  navigateTo('products');
};

window.removeOrderItem = function(index) {
  currentOrder.items.splice(index, 1);
  renderCheckout();
  showToast('Item removed', 'bx-trash');
};

/* ============ GRAM MODAL ============ */

function bindGramModal() {
  document.querySelectorAll('.gram-presets button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gram-presets button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('gramInput').value = btn.dataset.gram;
      updateGramPrice();
    });
  });
  document.getElementById('gramMinus').addEventListener('click', () => {
    const input = document.getElementById('gramInput');
    let val = parseInt(input.value) || 50;
    if (val > 50) {
      input.value = val - 50;
      updateGramPrice();
      document.querySelectorAll('.gram-presets button').forEach(b => b.classList.remove('active'));
    }
  });
  document.getElementById('gramPlus').addEventListener('click', () => {
    const input = document.getElementById('gramInput');
    let val = parseInt(input.value) || 50;
    input.value = val + 50;
    updateGramPrice();
    document.querySelectorAll('.gram-presets button').forEach(b => b.classList.remove('active'));
  });
  document.getElementById('gramInput').addEventListener('input', () => {
    updateGramPrice();
    document.querySelectorAll('.gram-presets button').forEach(b => b.classList.remove('active'));
  });
  document.getElementById('closeGramModal').addEventListener('click', closeGramModal);
  document.getElementById('cancelGram').addEventListener('click', closeGramModal);
  document.getElementById('confirmGram').addEventListener('click', () => {
    if (!selectedProductForGram || !currentBox) {
      showToast('Please start a box first', 'bx-error-circle');
      return;
    }
    const grams = parseInt(document.getElementById('gramInput').value);
    if (!grams || grams < 50) { alert('Minimum weight is 50g'); return; }
    const price = (selectedProductForGram.price / 100) * grams;
    const existing = currentBox.items.find(i => i.id === selectedProductForGram.id && i.grams === grams);
    if (existing) existing.qty += 1;
    else currentBox.items.push({
      id: selectedProductForGram.id,
      name: selectedProductForGram.name,
      grams, price, qty: 1,
      img: selectedProductForGram.img
    });
    showToast(`${selectedProductForGram.name} × ${grams}g added`, 'bx-check-circle');
    closeGramModal();
    updateFloatingBoxSummary();
    updateCurrentBoxStats();
  });
  document.getElementById('gramModal').addEventListener('click', (e) => {
    if (e.target.id === 'gramModal') closeGramModal();
  });
}

window.openGramModal = function(productId) {
  if (!currentBox) {
    showToast('Please select a box type first', 'bx-info-circle');
    navigateTo('box-types');
    return;
  }
  selectedProductForGram = PRODUCTS.find(p => p.id === productId);
  if (!selectedProductForGram) { showToast('Product not found', 'bx-error-circle'); return; }
  if (selectedProductForGram.stock <= 0) { showToast('This product is out of stock', 'bx-error-circle'); return; }
  document.getElementById('gramProductName').textContent = selectedProductForGram.name;
  document.getElementById('gramInput').value = 100;
  updateGramPrice();
  document.querySelectorAll('.gram-presets button').forEach(b => b.classList.remove('active'));
  const dflt = document.querySelector('.gram-presets button[data-gram="100"]');
  if (dflt) dflt.classList.add('active');
  document.getElementById('gramModal').classList.add('active');
};

function closeGramModal() {
  document.getElementById('gramModal').classList.remove('active');
  selectedProductForGram = null;
}

function updateGramPrice() {
  const grams = parseInt(document.getElementById('gramInput').value) || 0;
  if (selectedProductForGram) {
    const price = (selectedProductForGram.price / 100) * grams;
    document.getElementById('gramPricePreview').textContent = fmtMoney(price);
  }
}

/* ============ FINISH BOX ============ */

function bindFinishBox() {
  document.getElementById('btnFinishBox').addEventListener('click', () => {
    if (!currentBox || currentBox.items.length === 0) {
      showToast('Add at least one item', 'bx-error-circle');
      return;
    }
    currentOrder.items.push({ type: 'box', data: JSON.parse(JSON.stringify(currentBox)) });
    showToast('Box finished', 'bx-check-circle');
    currentBox = null;
    updateCurrentBoxStats();
    renderCheckout();
    setTimeout(() => navigateTo('checkout'), 200);
  });
}

function bindBackToBoxes() {
  document.getElementById('btnBackToBoxes').addEventListener('click', () => {
    if (currentBox && currentBox.items.length > 0) {
      if (confirm('Discard this box?')) {
        currentBox = null;
        updateCurrentBoxStats();
        navigateTo('box-types');
      }
    } else {
      currentBox = null;
      updateCurrentBoxStats();
      navigateTo('box-types');
    }
  });
}

function updateFloatingBoxSummary() {
  const summary = document.getElementById('floatingBoxSummary');
  if (!currentBox || currentBox.items.length === 0) {
    summary.classList.remove('active');
    return;
  }
  let itemCount = 0, total = currentBox.type.price;
  currentBox.items.forEach(item => {
    itemCount += item.qty;
    total += (item.price * item.qty);
  });
  document.getElementById('boxItemCount').textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
  document.getElementById('boxTotalPrice').textContent = fmtMoney(total);
  summary.classList.add('active');
}

function updateCurrentBoxStats() {
  const el = document.getElementById('currentBoxStats');
  if (!el) return;
  if (!currentBox) { el.classList.add('hidden'); return; }
  const count = currentBox.items.reduce((s, i) => s + i.qty, 0);
  if (count === 0) { el.classList.add('hidden'); return; }
  const total = currentBox.type.price + currentBox.items.reduce((s, i) => s + i.price * i.qty, 0);
  el.classList.remove('hidden');
  el.innerHTML = `<i class='bx bx-cart'></i> <span>${count} item${count !== 1 ? 's' : ''}</span> <span class="stat-strong">${fmtMoney(total)}</span>`;
}

/* ============ CHECKOUT ============ */

function getOrderSubtotal() {
  let subtotal = 0;
  currentOrder.items.forEach(item => {
    if (item.type === 'offer') subtotal += item.data.price;
    else {
      const b = item.data;
      subtotal += b.type.price;
      b.items.forEach(i => { subtotal += (i.price * i.qty); });
    }
  });
  return subtotal;
}
window.getOrderSubtotal = getOrderSubtotal;

function renderCheckout() {
  const list = document.getElementById('orderItemsList');

  const taxSpan = document.getElementById('checkoutTax');
  if (taxSpan && taxSpan.previousElementSibling) {
    taxSpan.previousElementSibling.textContent = `Tax (${Math.round(TAX_RATE * 100)}%)`;
  }

  let subtotal = 0;
  if (currentOrder.items.length === 0) {
    list.innerHTML = `<div style="text-align:center; padding:40px 20px; color:#8a7a85;">
      <i class='bx bx-cart' style="font-size:3rem; opacity:.3; display:block; margin-bottom:10px;"></i>
      <p style="font-weight:600; margin-bottom:4px;">No items yet</p>
      <p style="font-size:.82rem;">Use the buttons above to add items</p>
    </div>`;
  } else {
    list.innerHTML = currentOrder.items.map((item, index) => {
      if (item.type === 'offer') {
        const o = item.data;
        subtotal += o.price;
        return `<div class="order-item">
          <div class="order-item-info"><h4>${esc(o.name)}</h4><span>Offer · ${esc(o.discount)}</span></div>
          <div class="order-item-right"><div class="order-item-price">${fmtMoney(o.price)}</div>
          <button class="remove-item-btn" onclick="removeOrderItem(${index})"><i class='bx bx-trash'></i></button></div>
        </div>`;
      } else {
        const b = item.data;
        let boxTotal = b.type.price;
        let itemsHtml = b.items.map(i => {
          boxTotal += (i.price * i.qty);
          return `<div class="box-item-line">${i.qty}× ${esc(i.name)} (${i.grams}g) — ${fmtMoney(i.price * i.qty)}</div>`;
        }).join('');
        subtotal += boxTotal;
        return `<div class="order-item order-item-box">
          <div class="order-item-box-head">
            <div class="order-item-info"><h4>${esc(b.type.name)}</h4><span>Custom Box · ${b.items.length} type${b.items.length !== 1 ? 's' : ''}</span></div>
            <div class="order-item-right"><div class="order-item-price">${fmtMoney(boxTotal)}</div>
            <button class="remove-item-btn" onclick="removeOrderItem(${index})"><i class='bx bx-trash'></i></button></div>
          </div>
          <div class="box-items-detail">${itemsHtml}</div>
        </div>`;
      }
    }).join('');
  }
  const fee = currentOrderType === 'delivery'
    ? (parseFloat(document.getElementById('deliveryFee')?.value) || 0)
    : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + fee + tax;
  document.getElementById('checkoutSubtotal').textContent = fmtMoney(subtotal);
  document.getElementById('checkoutDeliveryFee').textContent = fmtMoney(fee);
  document.getElementById('checkoutTax').textContent = fmtMoney(tax);
  document.getElementById('checkoutTotal').textContent = fmtMoney(total);
  document.getElementById('checkoutFeeRow').style.display = fee > 0 ? 'flex' : 'none';
}
window.renderCheckout = renderCheckout;

function bindOrderTypeAndPayment() {
  document.querySelectorAll('.order-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.order-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentOrderType = btn.dataset.ordertype;
      applyOrderTypeUI();
    });
  });
  document.querySelectorAll('.pay-method').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  const feeInput = document.getElementById('deliveryFee');
  if (feeInput) feeInput.addEventListener('input', renderCheckout);
  applyOrderTypeUI();
}

function applyOrderTypeUI() {
  const isDelivery = currentOrderType === 'delivery';
  document.getElementById('deliveryDetailsSection').style.display = isDelivery ? 'block' : 'none';
  document.getElementById('paymentSection').style.display = isDelivery ? 'none' : 'block';
  renderCheckout();
  const btn = document.getElementById('btnCheckout');
  if (btn) {
    btn.innerHTML = isDelivery
      ? `Create Delivery Order <i class='bx bx-cycling'></i>`
      : `Complete Order <i class='bx bx-check-shield'></i>`;
  }
}