// Part 2: part2

// Auto-generated from script.js

function bindCheckout() {
  document.getElementById('btnCheckout').addEventListener('click', () => {
    if (currentOrder.items.length === 0) { showToast('Order is empty!', 'bx-error-circle'); return; }
    if (!currentEmployee) { showToast('Please sign in again', 'bx-error-circle'); return; }
    if (currentOrderType === 'delivery') handleDeliveryCheckout();
    else handleInStoreCheckout();
  });
}

function handleInStoreCheckout() {
  const customerName = document.getElementById('customerName').value.trim() || 'Walk-in Customer';
  const customerPhone = document.getElementById('customerPhone').value.trim() || '';
  const payBtn = document.querySelector('.pay-method.active');
  const paymentMethod = (payBtn && payBtn.dataset.method) || 'cash';
  const receiptId = 'HC-POS-' + Date.now().toString().slice(-6);
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  let subtotal = 0;
  const itemsList = [];
  currentOrder.items.forEach(item => {
    if (item.type === 'offer') {
      const o = item.data;
      subtotal += o.price;
      itemsList.push({ name: o.name, qty: 1, price: o.price, isOffer: true, kind: 'offer' });
    } else {
      const b = item.data;
      let boxTotal = b.type.price;
      b.items.forEach(i => {
        boxTotal += (i.price * i.qty);
        itemsList.push({
          name: i.name, qty: i.qty, price: i.price,
          productId: i.id, grams: i.grams,
          isBoxItem: true, boxName: b.type.name, kind: 'box'
        });
      });
      subtotal += boxTotal;
    }
  });

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const customerId = 'c-pos-' + Date.now();
  const orderObject = {
    id: receiptId, channel: 'pos',
    employeeUsername: currentEmployee.username,
    servedBy: currentEmployee.name,
    date: today, status: 'delivered',
    payment: paymentMethod,
    itemsList, subtotal, tax, total, deliveryFee: 0,
    customerId: customerName !== 'Walk-in Customer' ? customerId : 'c-guest-pos',
    customerInfo: customerName !== 'Walk-in Customer'
      ? { name: customerName, phone: customerPhone, email: '' }
      : null,
    address: 'In-store', shiftId: currentShiftId,
    placedAt: now.toISOString()
  };

  const empOrders = loadEmployeeOrders();
  empOrders.push(orderObject);
  saveEmployeeOrders(empOrders);

  deductStockFromAdmin(itemsList);

  buildReceiptView({
    receiptId, date: now, customer: customerName, customerPhone,
    employee: currentEmployee.name,
    paymentLabel: paymentMethod.toUpperCase(),
    items: currentOrder.items,
    subtotal, fee: 0, tax, total, isDelivery: false
  });

  resetOrderState();
  renderRecentOrders();
  navigateTo('receipt');
  showToast('Order completed!', 'bx-party');
  if (autoPrint) setTimeout(() => printThermalReceipt(), 400);
}

function handleDeliveryCheckout() {
  const customerName = document.getElementById('customerName').value.trim();
  const customerPhone = document.getElementById('customerPhone').value.trim();
  const source = document.getElementById('deliverySource').value || 'other';
  const address = document.getElementById('deliveryAddress').value.trim();
  const fee = parseFloat(document.getElementById('deliveryFee').value) || 0;
  const notes = document.getElementById('deliveryNotes').value.trim();

  if (!customerName) { alert('Please enter the customer name'); document.getElementById('customerName').focus(); return; }
  if (!customerPhone) { alert('Please enter the customer phone'); document.getElementById('customerPhone').focus(); return; }
  if (!address) { alert('Please enter the delivery address'); document.getElementById('deliveryAddress').focus(); return; }

  const orderId = 'HC-DEL-' + Date.now().toString().slice(-6);
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  let subtotal = 0;
  const itemsList = [];
  currentOrder.items.forEach(item => {
    if (item.type === 'offer') {
      const o = item.data;
      subtotal += o.price;
      itemsList.push({ name: o.name, qty: 1, price: o.price, isOffer: true, kind: 'offer' });
    } else {
      const b = item.data;
      let boxTotal = b.type.price;
      b.items.forEach(i => {
        boxTotal += (i.price * i.qty);
        itemsList.push({
          name: i.name, qty: i.qty, price: i.price,
          productId: i.id, grams: i.grams,
          isBoxItem: true, boxName: b.type.name, kind: 'box'
        });
      });
      subtotal += boxTotal;
    }
  });

  const tax = subtotal * TAX_RATE;
  const total = subtotal + fee + tax;

  const orderObject = {
    id: orderId, channel: 'manual',
    employeeUsername: currentEmployee.username,
    servedBy: currentEmployee.name,
    date: today, status: 'processing', payment: 'pending',
    itemsList, subtotal, tax, deliveryFee: fee, total,
    customerId: 'c-del-' + Date.now(),
    customerInfo: { name: customerName, phone: customerPhone, email: '' },
    address, notes, source, deliveryMethod: 'delivery',
    shiftId: currentShiftId, placedAt: now.toISOString()
  };

  const empOrders = loadEmployeeOrders();
  empOrders.push(orderObject);
  saveEmployeeOrders(empOrders);
  deductStockFromAdmin(itemsList);
  loadManualOrders();
  refreshDeliveryBadge();

  buildReceiptView({
    receiptId: orderId, date: now,
    customer: customerName, customerPhone,
    employee: currentEmployee.name,
    paymentLabel: 'ON DELIVERY',
    items: currentOrder.items,
    subtotal, fee, tax, total,
    isDelivery: true, address
  });

  resetOrderState();
  renderRecentOrders();
  navigateTo('receipt');
  showToast(`Delivery order ${orderId} created`, 'bx-cycling');
  if (autoPrint) setTimeout(() => printThermalReceipt(), 400);
}

function resetOrderState() {
  currentOrder = { items: [], customer: { name: '', phone: '' } };
  currentBox = null;
  document.getElementById('customerName').value = '';
  document.getElementById('customerPhone').value = '';
  document.getElementById('deliveryAddress').value = '';
  document.getElementById('deliveryNotes').value = '';
  document.getElementById('deliveryFee').value = '2.00';
  document.getElementById('floatingBoxSummary').classList.remove('active');
  updateCurrentBoxStats();
  currentOrderType = 'in-store';
  document.querySelectorAll('.order-type-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.ordertype === 'in-store')
  );
  document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('active'));
  const cashBtn = document.querySelector('.pay-method[data-method="cash"]');
  if (cashBtn) cashBtn.classList.add('active');
  applyOrderTypeUI();
}
window.resetOrderState = resetOrderState;

/* ============ RECEIPT BUILDER ============ */

function buildReceiptView(data) {
  lastReceiptData = data;
  const pr = document.getElementById('printableReceipt');
  const tr = document.getElementById('thermalReceipt');
  if (pr) pr.innerHTML = buildReceiptHTML(data, false);
  if (tr) tr.innerHTML = buildReceiptHTML(data, true);
}
window.buildReceiptView = buildReceiptView;

function buildReceiptHTML(data, isThermal) {
  const wrapRow = (label, value) => isThermal
    ? `<div class="t-row"><span class="label">${label}</span><span class="value">${value}</span></div>`
    : `<div class="receipt-row"><span>${label}</span><span>${value}</span></div>`;
  const divider = isThermal ? `<hr class="t-divider">` : `<hr class="receipt-divider">`;
  const dividerDouble = isThermal ? `<hr class="t-divider-double">` : `<hr class="receipt-divider double">`;

  const storeName = STORE_INFO.name || 'HAT CANDY';
  const storeSlogan = STORE_INFO.slogan || 'Every Candy Begins with Magic';
  const storeAddress = STORE_INFO.address || 'Amman, Jordan';
  const storePhone = STORE_INFO.phone || '';

  let html = `<div class="${isThermal ? 't-center' : 'receipt-header'}">
    <div class="${isThermal ? 't-brand' : 'brand-line'}">${esc(storeName)}</div>
    <div class="${isThermal ? 't-slogan' : 'slogan'}">${esc(storeSlogan)}</div>
    <div class="${isThermal ? 't-address' : 'address'}">${esc(storeAddress)}</div>
    ${storePhone ? `<div class="${isThermal ? 't-address' : 'address'}">${esc(storePhone)}</div>` : ''}
  </div>
  ${dividerDouble}
  ${wrapRow('Receipt #:', esc(data.receiptId))}
  ${wrapRow('Date:', esc(data.date.toLocaleString()))}
  ${wrapRow('Customer:', esc(data.customer))}
  ${data.customerPhone ? wrapRow('Phone:', esc(data.customerPhone)) : ''}
  ${wrapRow('Served by:', esc(data.employee))}
  ${wrapRow('Payment:', esc(data.paymentLabel))}
  ${data.isDelivery && data.address ? wrapRow('Delivery to:', esc(data.address)) : ''}
  ${divider}
  <div class="${isThermal ? '' : 'receipt-items'}">`;

  data.items.forEach(item => {
    if (item.type === 'offer') {
      const o = item.data;
      html += isThermal
        ? `<div class="t-item"><span class="name">1× ${esc(o.name)}</span><span class="price">${fmtMoney(o.price)}</span></div>`
        : `<div class="receipt-item"><span class="item-name">1× ${esc(o.name)}</span><span class="item-price">${fmtMoney(o.price)}</span></div>`;
    } else {
      const b = item.data;
      let boxTotal = b.type.price;
      html += isThermal
        ? `<div class="t-item t-item-box-title"><span class="name">▶ ${esc(b.type.name)}</span><span class="price">${b.type.price > 0 ? fmtMoney(b.type.price) : 'Free'}</span></div>`
        : `<div class="receipt-item box-title"><span class="item-name">▶ ${esc(b.type.name)}</span><span class="item-price">${b.type.price > 0 ? fmtMoney(b.type.price) : 'Free'}</span></div>`;
      b.items.forEach(i => {
        boxTotal += (i.price * i.qty);
        const line = `${i.qty}× ${esc(i.name)} (${i.grams}g)`;
        html += isThermal
          ? `<div class="t-item t-item-sub"><span class="name">${line}</span><span class="price">${fmtMoney(i.price * i.qty)}</span></div>`
          : `<div class="receipt-item sub"><span class="item-name">${line}</span><span class="item-price">${fmtMoney(i.price * i.qty)}</span></div>`;
      });
      html += isThermal
        ? `<div class="t-item t-item-sub" style="font-weight:700;"><span class="name">Box total:</span><span class="price">${fmtMoney(boxTotal)}</span></div>`
        : `<div class="receipt-item sub" style="font-weight:700;"><span class="item-name">Box total:</span><span class="item-price">${fmtMoney(boxTotal)}</span></div>`;
    }
  });

  html += `</div>${divider}`;
  const taxLabel = `Tax (${Math.round(TAX_RATE * 100)}%)`;

  if (isThermal) {
    html += `<div class="t-total-row"><span>Subtotal</span><span>${fmtMoney(data.subtotal)}</span></div>
      ${data.fee > 0 ? `<div class="t-total-row"><span>Delivery Fee</span><span>${fmtMoney(data.fee)}</span></div>` : ''}
      <div class="t-total-row"><span>${taxLabel}</span><span>${fmtMoney(data.tax)}</span></div>
      <div class="t-total-row grand"><span>TOTAL</span><span>${fmtMoney(data.total)}</span></div>`;
  } else {
    html += `<div class="receipt-totals">
      <div class="receipt-total-row"><span>Subtotal</span><span>${fmtMoney(data.subtotal)}</span></div>
      ${data.fee > 0 ? `<div class="receipt-total-row"><span>Delivery Fee</span><span>${fmtMoney(data.fee)}</span></div>` : ''}
      <div class="receipt-total-row"><span>${taxLabel}</span><span>${fmtMoney(data.tax)}</span></div>
      <div class="receipt-total-row grand"><span>TOTAL</span><span>${fmtMoney(data.total)}</span></div>
    </div>`;
  }

  html += `<div class="${isThermal ? 't-footer' : 'receipt-footer'}">
    ${divider}
    <p>Thank you for your purchase!</p>
    <p>Keep this receipt for returns (7 days)</p>
    <p class="magic-line">✨ ${esc(storeSlogan)} ✨</p>
    <p style="margin-top:6px;font-size:.9em;">${esc(data.receiptId)}</p>
  </div>`;

  return html;
}

function printThermalReceipt() {
  if (!lastReceiptData) { showToast('No receipt to print', 'bx-error-circle'); return; }
  window.print();
}

function bindAutoPrintToggle() {
  const btn = document.getElementById('btnAutoPrint');
  if (!btn) return;
  btn.addEventListener('click', () => {
    autoPrint = !autoPrint;
    saveSettings();
    updateAutoPrintUI();
    showToast(`Auto-Print ${autoPrint ? 'ON' : 'OFF'}`, 'bx-printer');
  });
  updateAutoPrintUI();
}

function updateAutoPrintUI() {
  const btn = document.getElementById('btnAutoPrint');
  const state = document.getElementById('autoPrintState');
  if (!btn || !state) return;
  state.textContent = autoPrint ? 'ON' : 'OFF';
  btn.classList.toggle('off', !autoPrint);
}

function bindReceiptActions() {
  document.getElementById('btnPrint').addEventListener('click', printThermalReceipt);
  document.getElementById('btnNewOrder').addEventListener('click', () => {
    resetOrderState();
    loadProductsFromAdmin();
    renderProducts();
    refreshDeliveryBadge();
    renderRecentOrders();
    navigateTo('home');
  });
}

/* ============ STOCK ============ */

function deductStockFromAdmin(itemsList) {
  try {
    const raw = localStorage.getItem(LS_KEYS.products);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return;
    itemsList.forEach(it => {
      if (!it.productId) return;
      const p = arr.find(x => x.id === it.productId);
      if (p) {
        const gramsTotal = (it.grams || 100) * it.qty;
        p.stock = Math.max(0, (Number(p.stock) || 0) - gramsTotal / 100);
      }
    });
    localStorage.setItem(LS_KEYS.products, JSON.stringify(arr));
    loadProductsFromAdmin();
  } catch (e) {}
}

function adjustStockForEdit(origItems, newItems) {
  try {
    const raw = localStorage.getItem(LS_KEYS.products);
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return;
    const origMap = {}, newMap = {};
    origItems.forEach(i => {
      if (!i.productId) return;
      const g = (i.grams || 100) * i.qty;
      origMap[i.productId] = (origMap[i.productId] || 0) + g;
    });
    newItems.forEach(i => {
      if (!i.productId) return;
      const g = (i.grams || 100) * i.qty;
      newMap[i.productId] = (newMap[i.productId] || 0) + g;
    });
    const allIds = new Set([...Object.keys(origMap), ...Object.keys(newMap)]);
    allIds.forEach(pid => {
      const diff = (newMap[pid] || 0) - (origMap[pid] || 0);
      if (diff === 0) return;
      const p = arr.find(x => x.id === pid);
      if (!p) return;
      p.stock = Math.max(0, (Number(p.stock) || 0) - diff / 100);
    });
    localStorage.setItem(LS_KEYS.products, JSON.stringify(arr));
    loadProductsFromAdmin();
  } catch (e) {}
}

/* ============ DELIVERY CENTER ============ */

function refreshDeliveryBadge() {
  loadOnlineOrders();
  loadManualOrders();
  const activeOnline = onlineOrders.filter(o =>
    ['processing', 'packing', 'shipped', 'out_for_delivery'].includes(o.status)
  ).length;
  const activeManual = manualOrders.filter(o =>
    ['processing', 'packing', 'shipped', 'out_for_delivery'].includes(o.status)
  ).length;
  const total = activeOnline + activeManual;
  const badge = document.getElementById('deliveryBadge');
  if (badge) {
    badge.textContent = total;
    badge.classList.toggle('hidden', total === 0);
  }
  const oc = document.getElementById('onlineOrdersCount');
  const mc = document.getElementById('manualOrdersCount');
  if (oc) oc.textContent = onlineOrders.length;
  if (mc) mc.textContent = manualOrders.length;
}
window.refreshDeliveryBadge = refreshDeliveryBadge;

function bindDeliveryCenter() {
  document.querySelectorAll('.delivery-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.delivery-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeDeliveryTab = tab.dataset.dtab;
      document.querySelectorAll('.delivery-pane').forEach(p =>
        p.classList.toggle('active', p.dataset.dpane === activeDeliveryTab)
      );
    });
  });

  document.getElementById('onlineFilters').addEventListener('click', (e) => {
    const btn = e.target.closest('.dfilter');
    if (!btn) return;
    onlineFilter = btn.dataset.ofilter;
    document.querySelectorAll('#onlineFilters .dfilter').forEach(b =>
      b.classList.toggle('active', b.dataset.ofilter === onlineFilter)
    );
    renderOnlineOrders();
  });

  document.getElementById('manualFilters').addEventListener('click', (e) => {
    const btn = e.target.closest('.mfilter');
    if (!btn) return;
    manualFilter = btn.dataset.mfilter;
    document.querySelectorAll('#manualFilters .mfilter').forEach(b =>
      b.classList.toggle('active', b.dataset.mfilter === manualFilter)
    );
    renderManualOrders();
  });

  document.getElementById('btnRefreshDelivery').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    btn.style.transform = 'rotate(180deg)';
    loadOnlineOrders();
    loadManualOrders();
    renderDeliveryCenter();
    refreshDeliveryBadge();
    showToast('Refreshed', 'bx-refresh');
    setTimeout(() => btn.style.transform = '', 500);
  });

  document.getElementById('btnNewManualOrder').addEventListener('click', () => openManualOrderModal());

  document.getElementById('view-delivery').addEventListener('click', (e) => {
    const adv = e.target.closest('[data-del-advance]');
    if (adv) { advanceOrderStatus(adv.dataset.delAdvance); return; }
    const can = e.target.closest('[data-del-cancel]');
    if (can) {
      if (confirm('Cancel this order?')) cancelOrder(can.dataset.delCancel);
      return;
    }
    const vw = e.target.closest('[data-del-view]');
    if (vw) { openOrderDetails(vw.dataset.delView); return; }
    const del = e.target.closest('[data-order-delete]');
    if (del) {
      if (confirm('Delete this order permanently?')) deleteOrderPermanent(del.dataset.orderDelete);
      return;
    }
    const ed = e.target.closest('[data-order-edit]');
    if (ed) { openEditInvoiceModal(ed.dataset.orderEdit); return; }
  });
}

function renderDeliveryCenter() {
  renderOnlineOrders();
  renderManualOrders();
  refreshDeliveryBadge();
}
window.renderDeliveryCenter = renderDeliveryCenter;

function renderOnlineOrders() {
  const list = document.getElementById('onlineOrdersList');
  if (!list) return;
  let filtered = onlineOrders;
  if (onlineFilter !== 'all') filtered = onlineOrders.filter(o => o.status === onlineFilter);
  filtered = [...filtered].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (!filtered.length) {
    list.innerHTML = `<div class="delivery-empty"><i class='bx bx-inbox'></i><h3>No online orders${onlineFilter !== 'all' ? ' in this status' : ''}</h3><p>${onlineFilter !== 'all' ? 'Try a different filter.' : 'Orders from website will appear here.'}</p></div>`;
    return;
  }
  list.innerHTML = filtered.map(o => orderCardHtml(o, false)).join('');
}

function renderManualOrders() {
  const list = document.getElementById('manualOrdersList');
  if (!list) return;
  let filtered = manualOrders;
  if (manualFilter !== 'all') filtered = manualOrders.filter(o => o.status === manualFilter);
  filtered = [...filtered].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (!filtered.length) {
    list.innerHTML = `<div class="delivery-empty"><i class='bx bx-edit'></i><h3>No manual orders${manualFilter !== 'all' ? ' in this status' : ''}</h3><p>${manualFilter !== 'all' ? 'Try a different filter.' : 'Click "New Manual Order" to create one.'}</p></div>`;
    return;
  }
  list.innerHTML = filtered.map(o => orderCardHtml(o, true)).join('');
}

function orderCardHtml(o, isManual) {
  const items = (o.itemsList || []).slice(0, 4);
  const totalQty = (o.itemsList || []).reduce((s, i) => s + (i.qty || 0), 0);
  const more = (o.itemsList || []).length - items.length;

  const itemsHtml = items.map(i =>
    `<div class="order-items-preview-line"><span>${esc(i.name)} × ${i.qty}</span><span>${fmtMoney((i.price || 0) * (i.qty || 0))}</span></div>`
  ).join('') + (more > 0
    ? `<div class="order-items-preview-line" style="opacity:.6;"><span>+${more} more</span><span>—</span></div>`
    : '');

  const canAdvance = o.status !== 'delivered' && o.status !== 'cancelled';
  const nextIdx = STATUS_FLOW.indexOf(o.status);
  const nextStatus = nextIdx >= 0 && nextIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[nextIdx + 1] : null;
  const source = o.source || 'other';

  const sourceBar = isManual
    ? `<div class="order-card-del-date">${fmtDate(o.date)} · ${sourceIcon(source)} ${sourceLabel(source)}</div>`
    : `<div class="order-card-del-date">${fmtDate(o.date)}${o.placedAt ? ' · ' + fmtDateTime(o.placedAt) : ''}</div>`;

  const iconLeft = isManual
    ? `<i class='bx bx-edit' style="color:#0891b2;"></i>`
    : `<i class='bx bx-globe' style="color:#1d4ed8;"></i>`;

  const sourceChip = isManual && source !== 'other'
    ? `<span class="order-source-chip ${source}">${sourceIcon(source)} ${sourceLabel(source)}</span>`
    : '';

  return `<div class="order-card-del ${isManual ? 'source-manual' : ''} status-${o.status}">
    <div class="order-card-del-head">
      <div>
        <div class="order-card-del-id">${iconLeft} ${esc(o.id)} ${sourceChip}</div>
        ${sourceBar}
      </div>
      <span class="order-status-pill status-${o.status}"><i class='${statusIcon(o.status)}'></i> ${statusLabel(o.status)}</span>
    </div>
    <div class="order-customer-block">
      <div class="order-customer-avatar">${esc((o.customerInfo?.name || o.customerName || 'G').charAt(0).toUpperCase())}</div>
      <div class="order-customer-info">
        <div class="order-customer-name">${esc(o.customerInfo?.name || o.customerName || 'Guest')}</div>
        <div class="order-customer-meta">
          <span><i class='bx bx-phone'></i> ${esc(o.customerInfo?.phone || o.customerPhone || '—')}</span>
          <span><i class='bx bx-map'></i> ${esc(o.address || '—')}</span>
        </div>
      </div>
    </div>
    <div class="order-items-preview">
      <div class="order-items-preview-title">Items (${totalQty})</div>
      ${itemsHtml || '<div style="opacity:.6;font-size:.78rem;">No items</div>'}
    </div>
    <div class="order-total-row">
      <span class="order-total-row-label">Total</span>
      <span class="order-total-row-value">${fmtMoney(o.total)}</span>
    </div>
    <div class="order-actions-del">
      <button class="order-action-btn-del ghost" data-del-view="${esc(o.id)}"><i class='bx bx-show'></i> Details</button>
      ${canAdvance && nextStatus ? `<button class="order-action-btn-del ${nextStatus === 'delivered' ? 'green' : 'primary'}" data-del-advance="${esc(o.id)}"><i class='bx ${statusIcon(nextStatus)}'></i> ${nextStatus === 'delivered' ? 'Deliver' : statusLabel(nextStatus)}</button>` : ''}
      <button class="order-action-btn-del ghost" data-order-edit="${esc(o.id)}" title="Edit"><i class='bx bx-edit'></i></button>
      ${canAdvance ? `<button class="order-action-btn-del danger" data-del-cancel="${esc(o.id)}" title="Cancel"><i class='bx bx-x'></i></button>` : ''}
      <button class="order-action-btn-del danger" data-order-delete="${esc(o.id)}" title="Delete"><i class='bx bx-trash'></i></button>
    </div>
  </div>`;
}
window.orderCardHtml = orderCardHtml;

function advanceOrderStatus(orderId) {
  let o = onlineOrders.find(x => x.id === orderId);
  let isOnline = !!o;
  if (!o) o = manualOrders.find(x => x.id === orderId);
  if (!o) return;
  const idx = STATUS_FLOW.indexOf(o.status);
  if (idx === -1 || idx >= STATUS_FLOW.length - 1) return;
  const next = STATUS_FLOW[idx + 1];
  o.status = next;
  const today = new Date().toISOString().split('T')[0];
  if (next === 'packing' && !o.packedAt) o.packedAt = today;
  if (next === 'shipped') {
    o.shippedAt = o.shippedAt || today;
    if (!o.tracking) o.tracking = 'JD-EXP-' + Math.floor(100000 + Math.random() * 899999);
  }
  if (next === 'out_for_delivery') o.outAt = o.outAt || today;
  if (next === 'delivered') { o.deliveredAt = o.deliveredAt || today; o.eta = o.eta || today; }

  if (isOnline) saveOnlineOrders();
  else {
    const emp = loadEmployeeOrders();
    const i = emp.findIndex(x => x.id === orderId);
    if (i !== -1) { emp[i] = o; saveEmployeeOrders(emp); }
    loadManualOrders();
  }
  renderDeliveryCenter();
  renderRecentOrders();
  showToast(`Order ${o.id} → ${statusLabel(next)}`, 'bx-check-circle');
}

function cancelOrder(orderId) {
  let o = onlineOrders.find(x => x.id === orderId);
  let isOnline = !!o;
  if (!o) o = manualOrders.find(x => x.id === orderId);
  if (!o) return;
  o.status = 'cancelled';
  if (isOnline) saveOnlineOrders();
  else {
    const emp = loadEmployeeOrders();
    const i = emp.findIndex(x => x.id === orderId);
    if (i !== -1) { emp[i] = o; saveEmployeeOrders(emp); }
    loadManualOrders();
  }
  renderDeliveryCenter();
  renderRecentOrders();
  showToast(`Order ${o.id} cancelled`, 'bx-x-circle');
}

function deleteOrderPermanent(orderId) {
  const empOrders = loadEmployeeOrders().filter(o => o.id !== orderId);
  saveEmployeeOrders(empOrders);
  try {
    const raw = localStorage.getItem(LS_KEYS.onlineOrders);
    const arr = raw ? JSON.parse(raw) : [];
    localStorage.setItem(LS_KEYS.onlineOrders, JSON.stringify(arr.filter(o => o.id !== orderId)));
  } catch (e) {}
  loadManualOrders();
  loadOnlineOrders();
  renderDeliveryCenter();
  renderRecentOrders();
  refreshDeliveryBadge();
  showToast(`Order ${orderId} deleted`, 'bx-trash');
}

/* ============ MANUAL ORDER MODAL ============ */

function openManualOrderModal(editId) {
  manualDraft = { items: [], deliveryMethod: 'delivery', paymentMethod: 'cash' };
  document.getElementById('manualCustomerName').value = '';
  document.getElementById('manualCustomerPhone').value = '';
  document.getElementById('manualOrderSource').value = 'phone';
  document.getElementById('manualAddress').value = '';
  document.getElementById('manualDeliveryFee').value = '2.00';
  document.getElementById('manualNotes').value = '';
  document.getElementById('manualModalTitle').textContent = 'New Manual Order';
  document.querySelectorAll('.manual-del-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.dmethod === 'delivery')
  );
  document.querySelectorAll('.manual-pay-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.method === 'cash')
  );
  document.getElementById('manualAddressWrap').style.display = 'block';
  document.getElementById('manualFeeWrap').style.display = 'block';
  renderManualDraftItems();
  updateManualTotals();
  document.getElementById('manualOrderModal').dataset.editId = editId || '';

  if (editId) {
    const o = manualOrders.find(x => x.id === editId);
    if (o) {
      document.getElementById('manualModalTitle').textContent = 'Edit Manual Order';
      document.getElementById('manualCustomerName').value = o.customerInfo?.name || '';
      document.getElementById('manualCustomerPhone').value = o.customerInfo?.phone || '';
      document.getElementById('manualOrderSource').value = o.source || 'other';
      document.getElementById('manualAddress').value = o.address || '';
      document.getElementById('manualDeliveryFee').value = (o.deliveryFee || 0).toFixed(2);
      document.getElementById('manualNotes').value = o.notes || '';
      manualDraft.items = (o.itemsList || []).map(i => {
        if (i.isOffer) return { kind: 'offer', data: { name: i.name, price: i.price, img: '' }, qty: i.qty || 1 };
        if (i.isBox) return { kind: 'box', data: { type: { name: i.name }, items: [], totalPrice: i.price }, qty: i.qty || 1 };
        return {
          kind: 'item',
          data: {
            id: i.productId, name: i.name, price: i.price,
            grams: i.grams || 100,
            img: (PRODUCTS.find(p => p.id === i.productId) || {}).img || ''
          },
          qty: i.qty || 1
        };
      });
      manualDraft.deliveryMethod = o.deliveryMethod || 'delivery';
      manualDraft.paymentMethod = o.payment || 'cash';
      document.querySelectorAll('.manual-del-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.dmethod === manualDraft.deliveryMethod)
      );
      document.querySelectorAll('.manual-pay-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.method === manualDraft.paymentMethod)
      );
      document.getElementById('manualAddressWrap').style.display =
        manualDraft.deliveryMethod === 'pickup' ? 'none' : 'block';
      document.getElementById('manualFeeWrap').style.display =
        manualDraft.deliveryMethod === 'pickup' ? 'none' : 'block';
      renderManualDraftItems();
      updateManualTotals();
    }
  }
  document.getElementById('manualOrderModal').classList.add('active');
}

function closeManualOrderModal() {
  document.getElementById('manualOrderModal').classList.remove('active');
}

function renderManualDraftItems() {
  const list = document.getElementById('manualItemsList');
  const empty = document.getElementById('manualItemsEmpty');
  if (!manualDraft.items.length) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = manualDraft.items.map((it, i) => {
    let img = 'https://via.placeholder.com/80';
    let meta = '';
    let typeCls = '';
    if (it.kind === 'offer') {
      img = it.data.img || img;
      meta = `Offer · ${esc(it.data.discount || '')}`;
      typeCls = 'type-offer';
    } else if (it.kind === 'box') {
      meta = `Box · ${it.data.items?.length || 0} types`;
      typeCls = 'type-box';
    } else {
      img = it.data.img || img;
      meta = `${it.data.grams || 100}g per unit`;
    }
    return `<div class="manual-item-row ${typeCls}">
      <img class="manual-item-thumb" src="${esc(img)}" alt="">
      <div class="manual-item-info">
        <div class="manual-item-name">${esc(it.data.name || it.data.type?.name || 'Item')}</div>
        <div class="manual-item-meta">${meta}</div>
      </div>
      <div class="manual-item-qty">
        <button type="button" data-manual-dec="${i}">−</button>
        <span>${it.qty}</span>
        <button type="button" data-manual-inc="${i}">+</button>
      </div>
      <div class="manual-item-price">${fmtMoney((it.data.price || 0) * it.qty)}</div>
      <button type="button" class="manual-item-remove" data-manual-remove="${i}"><i class='bx bx-x'></i></button>
    </div>`;
  }).join('');
}

function updateManualTotals() {
  const subtotal = manualDraft.items.reduce((s, it) => s + (it.data.price || 0) * it.qty, 0);
  const fee = manualDraft.deliveryMethod === 'pickup'
    ? 0
    : (parseFloat(document.getElementById('manualDeliveryFee').value) || 0);
  const total = subtotal + fee;
  document.getElementById('manualSubtotal').textContent = fmtMoney(subtotal);
  document.getElementById('manualFeeDisplay').textContent = fmtMoney(fee);
  document.getElementById('manualTotal').textContent = fmtMoney(total);
}

function bindManualOrderModal() {
  document.getElementById('closeManualModal').addEventListener('click', closeManualOrderModal);
  document.getElementById('manualCancelBtn').addEventListener('click', closeManualOrderModal);
  document.getElementById('manualOrderModal').addEventListener('click', (e) => {
    if (e.target.id === 'manualOrderModal') closeManualOrderModal();
  });

  document.querySelectorAll('.manual-del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.manual-del-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      manualDraft.deliveryMethod = btn.dataset.dmethod;
      const show = manualDraft.deliveryMethod === 'delivery';
      document.getElementById('manualAddressWrap').style.display = show ? 'block' : 'none';
      document.getElementById('manualFeeWrap').style.display = show ? 'block' : 'none';
      updateManualTotals();
    });
  });

  document.querySelectorAll('.manual-pay-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.manual-pay-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      manualDraft.paymentMethod = btn.dataset.method;
    });
  });

  document.getElementById('manualDeliveryFee').addEventListener('input', updateManualTotals);
  document.getElementById('manualAddItemBtn').addEventListener('click', () => openPickItemModal('manual'));
  document.getElementById('manualAddOfferBtn').addEventListener('click', () => openPickOfferModal('manual'));
  document.getElementById('manualAddBoxBtn').addEventListener('click', () => openPickBoxModal('manual'));

  document.getElementById('manualItemsList').addEventListener('click', (e) => {
    const inc = e.target.closest('[data-manual-inc]');
    if (inc) {
      manualDraft.items[+inc.dataset.manualInc].qty++;
      renderManualDraftItems();
      updateManualTotals();
      return;
    }
    const dec = e.target.closest('[data-manual-dec]');
    if (dec) {
      const i = +dec.dataset.manualDec;
      if (manualDraft.items[i].qty > 1) manualDraft.items[i].qty--;
      else manualDraft.items.splice(i, 1);
      renderManualDraftItems();
      updateManualTotals();
      return;
    }
    const rm = e.target.closest('[data-manual-remove]');
    if (rm) {
      manualDraft.items.splice(+rm.dataset.manualRemove, 1);
      renderManualDraftItems();
      updateManualTotals();
    }
  });

  document.getElementById('manualSaveBtn').addEventListener('click', saveManualOrder);
}

function saveManualOrder() {
  const name = document.getElementById('manualCustomerName').value.trim();
  const phone = document.getElementById('manualCustomerPhone').value.trim();
  if (!name) { alert('Please enter customer name'); return; }
  if (!phone) { alert('Please enter customer phone'); return; }
  if (!manualDraft.items.length) { alert('Please add at least one item'); return; }
  const source = document.getElementById('manualOrderSource').value;
  const notes = document.getElementById('manualNotes').value.trim();
  const fee = manualDraft.deliveryMethod === 'pickup'
    ? 0
    : (parseFloat(document.getElementById('manualDeliveryFee').value) || 0);
  const address = manualDraft.deliveryMethod === 'pickup'
    ? 'Pickup from boutique'
    : (document.getElementById('manualAddress').value.trim() || 'Amman');
  const subtotal = manualDraft.items.reduce((s, it) => s + (it.data.price || 0) * it.qty, 0);
  const total = subtotal + fee;
  const today = new Date().toISOString().split('T')[0];
  const editId = document.getElementById('manualOrderModal').dataset.editId;

  const itemsList = [];
  manualDraft.items.forEach(it => {
    if (it.kind === 'offer') {
      itemsList.push({ name: it.data.name, qty: it.qty, price: it.data.price, isOffer: true, kind: 'offer' });
    } else if (it.kind === 'box') {
      itemsList.push({ name: it.data.type.name, qty: it.qty, price: it.data.totalPrice, isBox: true, kind: 'box' });
    } else {
      itemsList.push({
        name: it.data.name, qty: it.qty, price: it.data.price,
        productId: it.data.id, grams: it.data.grams || 100, kind: 'item'
      });
    }
  });

  const empOrders = loadEmployeeOrders();
  if (editId) {
    const idx = empOrders.findIndex(o => o.id === editId);
    if (idx !== -1) {
      empOrders[idx] = {
        ...empOrders[idx],
        customerInfo: { name, phone, email: '' },
        itemsList, subtotal,
        deliveryFee: fee, total, address, notes, source,
        deliveryMethod: manualDraft.deliveryMethod,
        payment: manualDraft.paymentMethod
      };
    }
    showToast('Manual order updated', 'bx-check-circle');
  } else {
    const orderId = 'HC-MAN-' + Date.now().toString().slice(-6);
    empOrders.push({
      id: orderId, channel: 'manual',
      employeeUsername: currentEmployee.username,
      servedBy: currentEmployee.name,
      date: today, status: 'processing',
      payment: manualDraft.paymentMethod,
      itemsList, subtotal,
      deliveryFee: fee, total,
      customerInfo: { name, phone, email: '' },
      customerId: 'c-man-' + Date.now(),
      address, notes, source,
      deliveryMethod: manualDraft.deliveryMethod,
      shiftId: currentShiftId,
      placedAt: new Date().toISOString()
    });
    showToast('Manual order created', 'bx-check-circle');
  }
  saveEmployeeOrders(empOrders);
  deductStockFromAdmin(itemsList);
  loadManualOrders();
  renderManualOrders();
  refreshDeliveryBadge();
  renderRecentOrders();
  closeManualOrderModal();
}

/* ============ PICK ITEM MODAL ============ */
let pickItemTarget = 'manual';

function bindPickItemModal() {
  document.getElementById('closePickItemModal').addEventListener('click', () =>
    document.getElementById('pickItemModal').classList.remove('active')
  );
  document.getElementById('pickItemCancel').addEventListener('click', () =>
    document.getElementById('pickItemModal').classList.remove('active')
  );
  document.getElementById('pickItemModal').addEventListener('click', (e) => {
    if (e.target.id === 'pickItemModal') document.getElementById('pickItemModal').classList.remove('active');
  });
  document.getElementById('pickItemSearch').addEventListener('input', (e) =>
    renderPickItemGrid(e.target.value.trim().toLowerCase())
  );
  document.getElementById('pickItemGrid').addEventListener('click', (e) => {
    const card = e.target.closest('[data-pick-id]');
    if (!card) return;
    addPickedItem(card.dataset.pickId, pickItemTarget);
  });
}

function openPickItemModal(target) {
  pickItemTarget = target || 'manual';
  document.getElementById('pickItemSearch').value = '';
  renderPickItemGrid('');
  document.getElementById('pickItemModal').classList.add('active');
  setTimeout(() => document.getElementById('pickItemSearch').focus(), 200);
}

function renderPickItemGrid(query) {
  const grid = document.getElementById('pickItemGrid');
  const list = PRODUCTS.filter(p => !query || p.name.toLowerCase().includes(query));
  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px 20px;color:#8a7a85;"><i class='bx bx-search' style="font-size:2.2rem;opacity:.3;display:block;margin-bottom:8px;"></i><p style="font-weight:600;font-size:.9rem;">No products found</p></div>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="pick-item-card" data-pick-id="${esc(p.id)}">
      <img src="${esc(p.img)}" alt="${esc(p.name)}">
      <div class="pick-item-card-info">
        <div class="pick-item-card-name">${esc(p.name)}</div>
        <div class="pick-item-card-price">${fmtMoney(p.price)} / 100g</div>
      </div>
    </div>
  `).join('');
}

function addPickedItem(productId, target) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  const grams = 100;
  const price = (p.price / 100) * grams;
  const newItem = {
    kind: 'item',
    data: { id: p.id, name: p.name, price, grams, img: p.img },
    qty: 1
  };
  if (target === 'manual') {
    const existing = manualDraft.items.find(i => i.kind === 'item' && i.data.id === p.id && i.data.grams === grams);
    if (existing) existing.qty++;
    else manualDraft.items.push(newItem);
    renderManualDraftItems();
    updateManualTotals();
  } else if (target === 'edit' && editingDraft) {
    editingDraft.itemsList.push({ name: p.name, qty: 1, price, productId: p.id, grams, kind: 'item' });
    renderEditForm();
  } else if (target === 'box-builder') {
    const existing = boxBuilderState.items.find(i => i.id === p.id && i.grams === grams);
    if (existing) existing.qty++;
    else boxBuilderState.items.push({ id: p.id, name: p.name, price, grams, qty: 1, img: p.img });
    renderBoxBuilderItems();
  }
  showToast(`${p.name} added`, 'bx-cart-add');
  document.getElementById('pickItemModal').classList.remove('active');
}

/* ============ PICK OFFER MODAL ============ */
let pickOfferTarget = 'manual';

function bindPickOfferModal() {
  document.getElementById('closePickOfferModal').addEventListener('click', () =>
    document.getElementById('pickOfferModal').classList.remove('active')
  );
  document.getElementById('pickOfferCancel').addEventListener('click', () =>
    document.getElementById('pickOfferModal').classList.remove('active')
  );
  document.getElementById('pickOfferModal').addEventListener('click', (e) => {
    if (e.target.id === 'pickOfferModal') document.getElementById('pickOfferModal').classList.remove('active');
  });
  document.getElementById('pickOfferGrid').addEventListener('click', (e) => {
    const card = e.target.closest('[data-pick-offer]');
    if (!card) return;
    addPickedOffer(card.dataset.pickOffer, pickOfferTarget);
  });
}

function openPickOfferModal(target) {
  pickOfferTarget = target || 'manual';
  renderPickOfferGrid();
  document.getElementById('pickOfferModal').classList.add('active');
}

function renderPickOfferGrid() {
  const grid = document.getElementById('pickOfferGrid');
  if (!grid) return;
  
  // ✅ إصلاح: التأكد من أن OFFERS عبارة عن Array
  const safeOffers = Array.isArray(OFFERS) ? OFFERS : [];
  
  if (!safeOffers.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#8a7a85;">No offers available</div>`;
    return;
  }
  
  grid.innerHTML = safeOffers.map(o => `
    <div class="pick-item-card" data-pick-offer="${esc(o.id)}">
      <div class="pick-item-card-discount">${esc(o.discount || 'OFFER')}</div>
      <img src="${esc(o.img || 'https://via.placeholder.com/150')}" alt="${esc(o.name)}">
      <div class="pick-item-card-info">
        <div class="pick-item-card-name">${esc(o.name)}</div>
        <div class="pick-item-card-price">${fmtMoney(o.price)}</div>
      </div>
    </div>
  `).join('');
}

function addPickedOffer(offerId, target) {
  const safeOffers = Array.isArray(OFFERS) ? OFFERS : [];
  const offer = safeOffers.find(o => o.id === offerId);
  if (!offer) return;
  
  const newItem = { kind: 'offer', data: { ...offer }, qty: 1 };
  if (target === 'manual') {
    const existing = manualDraft.items.find(i => i.kind === 'offer' && i.data.id === offer.id);
    if (existing) existing.qty++;
    else manualDraft.items.push(newItem);
    renderManualDraftItems();
    updateManualTotals();
  } else if (target === 'edit' && editingDraft) {
    editingDraft.itemsList.push({ name: offer.name, qty: 1, price: offer.price, isOffer: true, kind: 'offer' });
    renderEditForm();
  }
  showToast(`${offer.name} added`, 'bx-cart-add');
  document.getElementById('pickOfferModal').classList.remove('active');
}

/* ============ PICK BOX MODAL ============ */
let pickBoxTarget = 'manual';

function bindPickBoxModal() {
  document.getElementById('closePickBoxModal').addEventListener('click', () =>
    document.getElementById('pickBoxModal').classList.remove('active')
  );
  document.getElementById('pickBoxCancel').addEventListener('click', () =>
    document.getElementById('pickBoxModal').classList.remove('active')
  );
  document.getElementById('pickBoxModal').addEventListener('click', (e) => {
    if (e.target.id === 'pickBoxModal') document.getElementById('pickBoxModal').classList.remove('active');
  });

  document.getElementById('boxTypesSelector').addEventListener('click', (e) => {
    const opt = e.target.closest('[data-box-type]');
    if (!opt) return;
    const safeBoxTypes = Array.isArray(BOX_TYPES) ? BOX_TYPES : [];
    const bt = safeBoxTypes.find(b => b.id === opt.dataset.boxType);
    if (!bt) return;
    boxBuilderState.boxType = bt;
    document.querySelectorAll('#boxTypesSelector .box-type-option').forEach(el =>
      el.classList.remove('selected')
    );
    opt.classList.add('selected');
    document.getElementById('boxItemsBuilder').style.display = 'block';
    document.getElementById('pickBoxSaveBtn').style.display = 'inline-flex';
    renderBoxBuilderItems();
  });

  document.getElementById('boxItemSearch').addEventListener('input', (e) =>
    renderBoxItemGrid(e.target.value.trim().toLowerCase())
  );

  document.getElementById('boxItemGrid').addEventListener('click', (e) => {
    const card = e.target.closest('[data-pick-id]');
    if (!card) return;
    addPickedItem(card.dataset.pickId, 'box-builder');
  });

  document.getElementById('boxBuilderItems').addEventListener('click', (e) => {
    const inc = e.target.closest('[data-bb-inc]');
    if (inc) {
      boxBuilderState.items[+inc.dataset.bbInc].qty++;
      renderBoxBuilderItems();
      return;
    }
    const dec = e.target.closest('[data-bb-dec]');
    if (dec) {
      const i = +dec.dataset.bbDec;
      if (boxBuilderState.items[i].qty > 1) boxBuilderState.items[i].qty--;
      else boxBuilderState.items.splice(i, 1);
      renderBoxBuilderItems();
      return;
    }
    const rm = e.target.closest('[data-bb-remove]');
    if (rm) {
      boxBuilderState.items.splice(+rm.dataset.bbRemove, 1);
      renderBoxBuilderItems();
    }
  });

  document.getElementById('pickBoxSaveBtn').addEventListener('click', savePickedBox);
}

function openPickBoxModal(target) {
  pickBoxTarget = target || 'manual';
  boxBuilderState = { boxType: null, items: [] };
  
  const safeBoxTypes = Array.isArray(BOX_TYPES) ? BOX_TYPES : [];
  
  if (!safeBoxTypes.length) {
    document.getElementById('boxTypesSelector').innerHTML = `<div style="text-align:center;padding:20px;color:#8a7a85;">No box types available</div>`;
  } else {
    document.getElementById('boxTypesSelector').innerHTML = safeBoxTypes.map(b => `
      <div class="box-type-option" data-box-type="${esc(b.id)}">
        <i class='bx ${b.icon}'></i>
        <strong>${esc(b.name)}</strong>
        <small>${b.price === 0 ? 'Free' : '+$' + b.price.toFixed(2)}</small>
      </div>
    `).join('');
  }
  
  document.getElementById('boxItemsBuilder').style.display = 'none';
  document.getElementById('pickBoxSaveBtn').style.display = 'none';
  document.getElementById('boxItemSearch').value = '';
  document.getElementById('boxItemGrid').innerHTML = '';
  document.getElementById('boxBuilderItems').innerHTML = '';
  document.getElementById('pickBoxModal').classList.add('active');
}

function renderBoxItemGrid(query) {
  const grid = document.getElementById('boxItemGrid');
  if (!grid) return;
  const list = PRODUCTS.filter(p => !query || p.name.toLowerCase().includes(query));
  grid.innerHTML = list.map(p => `
    <div class="pick-item-card" data-pick-id="${esc(p.id)}">
      <img src="${esc(p.img)}" alt="${esc(p.name)}">
      <div class="pick-item-card-info">
        <div class="pick-item-card-name">${esc(p.name)}</div>
        <div class="pick-item-card-price">${fmtMoney(p.price)} / 100g</div>
      </div>
    </div>
  `).join('');
}

function renderBoxBuilderItems() {
  const list = document.getElementById('boxBuilderItems');
  if (!list) return;
  if (!boxBuilderState.items.length) {
    list.innerHTML = `<div class="manual-items-empty"><i class='bx bx-cart'></i><p>Add products from above</p></div>`;
    return;
  }
  list.innerHTML = boxBuilderState.items.map((it, i) => `
    <div class="manual-item-row">
      <img class="manual-item-thumb" src="${esc(it.img || 'https://via.placeholder.com/80')}" alt="">
      <div class="manual-item-info">
        <div class="manual-item-name">${esc(it.name)}</div>
        <div class="manual-item-meta">${it.grams}g per unit</div>
      </div>
      <div class="manual-item-qty">
        <button type="button" data-bb-dec="${i}">−</button>
        <span>${it.qty}</span>
        <button type="button" data-bb-inc="${i}">+</button>
      </div>
      <div class="manual-item-price">${fmtMoney(it.price * it.qty)}</div>
      <button type="button" class="manual-item-remove" data-bb-remove="${i}"><i class='bx bx-x'></i></button>
    </div>
  `).join('');
}

function savePickedBox() {
  if (!boxBuilderState.boxType) { alert('Please select a box type'); return; }
  if (!boxBuilderState.items.length) { alert('Please add at least one product'); return; }
  
  const totalItemsPrice = boxBuilderState.items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalPrice = totalItemsPrice + boxBuilderState.boxType.price;
  const boxData = { type: boxBuilderState.boxType, items: [...boxBuilderState.items], totalPrice };

  if (pickBoxTarget === 'manual') {
    manualDraft.items.push({ kind: 'box', data: boxData, qty: 1 });
    renderManualDraftItems();
    updateManualTotals();
  } else if (pickBoxTarget === 'edit' && editingDraft) {
    boxBuilderState.items.forEach(i => {
      editingDraft.itemsList.push({
        name: `${i.name} (${boxBuilderState.boxType.name})`,
        qty: i.qty, price: i.price,
        productId: i.id, grams: i.grams,
        kind: 'box', boxName: boxBuilderState.boxType.name
      });
    });
    if (boxBuilderState.boxType.price > 0) {
      editingDraft.itemsList.push({
        name: `${boxBuilderState.boxType.name} (packaging)`,
        qty: 1, price: boxBuilderState.boxType.price, kind: 'box'
      });
    }
    renderEditForm();
  }
  showToast(`${boxBuilderState.boxType.name} with ${boxBuilderState.items.length} products added`, 'bx-box');
  document.getElementById('pickBoxModal').classList.remove('active');
}

/* ============ ORDER DETAILS ============ */

function bindOrderDetailsModal() {
  document.getElementById('closeOrderDetailsModal').addEventListener('click', closeOrderDetailsModal);
  document.getElementById('orderDetailsClose').addEventListener('click', closeOrderDetailsModal);
  document.getElementById('orderDetailsPrint').addEventListener('click', () => {
    const id = document.getElementById('orderDetailsModal').dataset.orderId;
    if (!id) return;
    const o = onlineOrders.find(x => x.id === id) || manualOrders.find(x => x.id === id);
    if (!o) return;
    buildReceiptView({
      receiptId: o.id, date: new Date(o.date),
      customer: o.customerInfo?.name || o.customerName || 'Guest',
      customerPhone: o.customerInfo?.phone || o.customerPhone || '',
      employee: o.servedBy || currentEmployee?.name || 'POS',
      paymentLabel: (o.payment || 'cash').toUpperCase(),
      items: (o.itemsList || []).map(i => ({ type: 'offer', data: { name: i.name, price: i.price, qty: i.qty } })),
      subtotal: o.subtotal || o.total,
      fee: o.deliveryFee || 0,
      tax: o.tax || 0,
      total: o.total,
      isDelivery: o.channel === 'manual',
      address: o.address
    });
    setTimeout(printThermalReceipt, 300);
  });
  document.getElementById('orderDetailsModal').addEventListener('click', (e) => {
    if (e.target.id === 'orderDetailsModal') closeOrderDetailsModal();
  });
}

function closeOrderDetailsModal() {
  document.getElementById('orderDetailsModal').classList.remove('active');
}

function openOrderDetails(orderId) {
  let o = onlineOrders.find(x => x.id === orderId);
  if (!o) o = manualOrders.find(x => x.id === orderId);
  if (!o) return;
  const isManual = o.channel === 'manual';
  document.getElementById('orderDetailsTitle').textContent = `Order ${o.id}`;
  document.getElementById('orderDetailsModal').dataset.orderId = o.id;

  const items = o.itemsList || [];
  const itemsHtml = items.map(i =>
    `<div class="order-details-item-line"><span>${esc(i.name)} <strong>× ${i.qty}</strong>${i.grams ? ` <span style="color:#8a7a85;font-size:.72rem;">(${i.grams}g)</span>` : ''}</span><strong>${fmtMoney((i.price || 0) * (i.qty || 0))}</strong></div>`
  ).join('') || '<div style="text-align:center;color:#8a7a85;padding:12px;">No items</div>';

  const currentStatusIdx = STATUS_FLOW.indexOf(o.status);
  const statusFlowHtml = o.status === 'cancelled'
    ? `<div class="status-flow"><div style="text-align:center;width:100%;color:#dc2626;font-weight:700;padding:8px;font-size:.85rem;"><i class='bx bx-x-circle'></i> Order Cancelled</div></div>`
    : `<div class="status-flow">${STATUS_FLOW.map((st, i) =>
      `<div class="status-step ${i < currentStatusIdx ? 'done' : (i === currentStatusIdx ? 'current' : '')}"><div class="status-step-dot"><i class='${statusIcon(st)}'></i></div><div class="status-step-label">${statusLabel(st)}</div></div>`
    ).join('')}</div>`;

  document.getElementById('orderDetailsBody').innerHTML = `
    ${statusFlowHtml}
    <div class="order-details-grid">
      <div class="order-details-cell"><div class="order-details-cell-label">Date</div><div class="order-details-cell-value small">${fmtDate(o.date)}</div></div>
      <div class="order-details-cell"><div class="order-details-cell-label">Payment</div><div class="order-details-cell-value small">${(o.payment || 'cash').toUpperCase()}</div></div>
      <div class="order-details-cell"><div class="order-details-cell-label">Customer</div><div class="order-details-cell-value">${esc(o.customerInfo?.name || o.customerName || 'Guest')}</div></div>
      <div class="order-details-cell"><div class="order-details-cell-label">Phone</div><div class="order-details-cell-value small">${esc(o.customerInfo?.phone || o.customerPhone || '—')}</div></div>
      <div class="order-details-cell"><div class="order-details-cell-label">${isManual ? 'Source' : 'Channel'}</div><div class="order-details-cell-value small">${isManual ? sourceIcon(o.source) + ' ' + sourceLabel(o.source) : '🌐 Online'}</div></div>
      <div class="order-details-cell"><div class="order-details-cell-label">Served By</div><div class="order-details-cell-value small">${esc(o.servedBy || '—')}</div></div>
      <div class="order-details-cell" style="grid-column:1/-1;"><div class="order-details-cell-label">Address</div><div class="order-details-cell-value small">${esc(o.address || '—')}</div></div>
      ${o.notes ? `<div class="order-details-cell" style="grid-column:1/-1;"><div class="order-details-cell-label">Notes</div><div class="order-details-cell-value small">${esc(o.notes)}</div></div>` : ''}
    </div>
    <div class="order-details-section-title">Items</div>
    <div class="order-details-items">${itemsHtml}</div>
    <div style="margin-top:14px;padding:12px;background:linear-gradient(135deg,rgba(250,204,67,.15),rgba(226,1,93,.08));border:2px dashed rgba(226,1,93,.25);border-radius:14px;">
      ${o.subtotal !== undefined ? `<div style="display:flex;justify-content:space-between;font-size:.82rem;padding:3px 0;"><span style="color:#8a7a85;font-weight:600;">Subtotal</span><span style="font-weight:700;">${fmtMoney(o.subtotal)}</span></div>` : ''}
      ${o.deliveryFee ? `<div style="display:flex;justify-content:space-between;font-size:.82rem;padding:3px 0;"><span style="color:#8a7a85;font-weight:600;">Delivery Fee</span><span style="font-weight:700;">${fmtMoney(o.deliveryFee)}</span></div>` : ''}
      ${o.tax ? `<div style="display:flex;justify-content:space-between;font-size:.82rem;padding:3px 0;"><span style="color:#8a7a85;font-weight:600;">Tax</span><span style="font-weight:700;">${fmtMoney(o.tax)}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:2px solid rgba(226,1,93,.15);margin-top:6px;">
        <span style="color:#9f0b3b;font-weight:700;">Total</span>
        <span style="font-family:'Autolova',sans-serif;font-size:1.5rem;color:#e2015d;">${fmtMoney(o.total)}</span>
      </div>
    </div>
  `;
  document.getElementById('orderDetailsModal').classList.add('active');
}

/* ============ INVOICE EDIT ============ */

function loadEditUnlocks() {
  try {
    const raw = localStorage.getItem(LS_KEYS.editUnlocks);
    const arr = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    return (Array.isArray(arr) ? arr : []).filter(u => u.expiresAt > now);
  } catch (e) { return []; }
}

function saveEditUnlocks(list) {
  try { localStorage.setItem(LS_KEYS.editUnlocks, JSON.stringify(list)); } catch (e) {}
}