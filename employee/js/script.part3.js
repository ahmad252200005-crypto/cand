// Part 3: part3

// Auto-generated from script.js

function addEditUnlock(orderId, employeeUsername) {
  const list = loadEditUnlocks();
  list.push({
    orderId, unlockedBy: employeeUsername,
    unlockedAt: Date.now(),
    expiresAt: Date.now() + EDIT_WINDOW_MS
  });
  saveEditUnlocks(list);
}

function isOrderUnlocked(orderId) {
  return loadEditUnlocks().some(u => u.orderId === orderId);
}

function consumeUnlock(orderId) {
  saveEditUnlocks(loadEditUnlocks().filter(u => u.orderId !== orderId));
}

function loadEditLog() {
  try {
    const raw = localStorage.getItem(LS_KEYS.editLog);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (e) { return []; }
}

function saveEditLog(list) {
  try { localStorage.setItem(LS_KEYS.editLog, JSON.stringify(list)); } catch (e) {}
}

function addEditLogEntry(entry) {
  const list = loadEditLog();
  list.unshift(entry);
  if (list.length > 500) list.length = 500;
  saveEditLog(list);
}

function getOrderEditLog(orderId) {
  return loadEditLog().filter(e => e.orderId === orderId);
}

function getOrderTimestamp(order) {
  if (!order) return 0;
  if (order.placedAt) return new Date(order.placedAt).getTime();
  if (order.date) return new Date(order.date).getTime();
  return 0;
}

function getTimeRemaining(order) {
  const ts = getOrderTimestamp(order);
  if (!ts) return 0;
  return Math.max(0, EDIT_WINDOW_MS - (Date.now() - ts));
}

function formatTimeRemaining(ms) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function getRecentOrdersForEmployee() {
  if (!currentEmployee) return [];
  return loadEmployeeOrders()
    .filter(o => o.employeeUsername === currentEmployee.username)
    .sort((a, b) => getOrderTimestamp(b) - getOrderTimestamp(a))
    .slice(0, 10);
}

function renderRecentOrders() {
  const grid = document.getElementById('recentOrdersGrid');
  if (!grid) return;
  const orders = getRecentOrdersForEmployee();
  if (!orders.length) {
    grid.innerHTML = `<div class="recent-empty"><i class='bx bx-receipt'></i><p>No orders in this shift yet</p><p style="font-size:.75rem;opacity:.75;margin-top:4px;">Complete an order to see it here</p></div>`;
    return;
  }
  grid.innerHTML = orders.map(o => recentOrderCardHtml(o)).join('');
}
window.renderRecentOrders = renderRecentOrders;

function recentOrderCardHtml(o) {
  const remaining = getTimeRemaining(o);
  const isUnlocked = isOrderUnlocked(o.id);
  const isLocked = remaining === 0 && !isUnlocked;
  const isWarning = remaining > 0 && remaining <= 2 * 60 * 1000;
  let cardClass = '', timerClass = 'editable', timerText = '';

  if (isUnlocked) { cardClass = 'warning'; timerClass = 'approved'; timerText = '🔓 Unlocked'; }
  else if (isLocked) { cardClass = 'locked'; timerClass = 'locked'; timerText = '🔒 Locked'; }
  else if (isWarning) { cardClass = 'warning'; timerClass = 'warning'; timerText = `⚠️ ${formatTimeRemaining(remaining)}`; }
  else { cardClass = 'editable'; timerClass = 'editable'; timerText = `✅ ${formatTimeRemaining(remaining)}`; }

  const itemCount = (o.itemsList || []).reduce((s, i) => s + (i.qty || 0), 0);
  const editCount = getOrderEditLog(o.id).length;
  const customerName = o.customerInfo?.name || o.customerName || 'Walk-in';
  const customerPhone = o.customerInfo?.phone || o.customerPhone || '';
  const isDelivery = o.channel === 'manual' || o.deliveryMethod === 'delivery';

  return `<div class="recent-order-card ${cardClass}" data-order-id="${esc(o.id)}">
    <div class="recent-order-head">
      <div>
        <div class="recent-order-id">${esc(o.id)}</div>
        <div class="recent-order-date">${fmtDateTime(o.placedAt || o.date)}${editCount > 0 ? ` · ✏️ ${editCount} edit${editCount !== 1 ? 's' : ''}` : ''}</div>
      </div>
      <div style="text-align:right;">
        <div class="recent-order-total">${fmtMoney(o.total)}</div>
        <span class="timer-chip ${timerClass}" style="margin-top:6px;">${timerText}</span>
      </div>
    </div>
    <div class="recent-order-meta">
      <span><i class='bx bx-user'></i> ${esc(customerName)}</span>
      ${customerPhone ? `<span><i class='bx bx-phone'></i> ${esc(customerPhone)}</span>` : ''}
      <span><i class='bx bx-package'></i> ${itemCount} item${itemCount !== 1 ? 's' : ''}</span>
      ${isDelivery ? `<span><i class='bx bx-cycling'></i> Delivery</span>` : `<span><i class='bx bx-store'></i> In-Store</span>`}
    </div>
    <div class="recent-order-actions">
      <button class="recent-action-btn edit ${isLocked ? 'locked' : ''}" data-recent-edit="${esc(o.id)}">
        <i class='bx ${isLocked ? 'bx-lock-alt' : 'bx-edit'}'></i> ${isLocked ? 'Unlock' : 'Edit'}
      </button>
      <button class="recent-action-btn print" data-recent-print="${esc(o.id)}" title="Print"><i class='bx bx-printer'></i></button>
      ${editCount > 0 ? `<button class="recent-action-btn history" data-recent-history="${esc(o.id)}" title="History"><i class='bx bx-history'></i></button>` : ''}
    </div>
  </div>`;
}

function bindRecentOrders() {
  const btnRefresh = document.getElementById('btnRefreshRecent');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', (e) => {
      e.currentTarget.style.transform = 'rotate(180deg)';
      renderRecentOrders();
      setTimeout(() => { e.currentTarget.style.transform = ''; }, 500);
      showToast('Refreshed', 'bx-refresh');
    });
  }
  const grid = document.getElementById('recentOrdersGrid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const editBtn = e.target.closest('[data-recent-edit]');
      if (editBtn) { e.stopPropagation(); openEditInvoiceModal(editBtn.dataset.recentEdit); return; }
      const printBtn = e.target.closest('[data-recent-print]');
      if (printBtn) { e.stopPropagation(); printRecentOrder(printBtn.dataset.recentPrint); return; }
      const histBtn = e.target.closest('[data-recent-history]');
      if (histBtn) { e.stopPropagation(); openEditHistoryModal(histBtn.dataset.recentHistory); return; }
    });
  }
}

function findOrderById(id) {
  return loadEmployeeOrders().find(o => o.id === id);
}

function openEditInvoiceModal(orderId) {
  if (!FEAT_INVOICE_EDIT) return;
  const order = findOrderById(orderId);
  if (!order) { showToast('Order not found', 'bx-error-circle'); return; }
  editingOrder = JSON.parse(JSON.stringify(order));
  editingOrderOriginal = JSON.parse(JSON.stringify(order));
  editingDraft = JSON.parse(JSON.stringify(order));
  editingIsUnlocked = isOrderUnlocked(orderId);
  editingDraft.itemsList = (order.itemsList || []).map(i => ({ ...i, _removed: false }));

  const remaining = getTimeRemaining(order);
  const canEditNow = remaining > 0 || editingIsUnlocked;

  document.getElementById('editModalTitle').textContent = canEditNow ? 'Edit Invoice' : 'Invoice Locked';
  document.getElementById('editModalSub').textContent = order.id;
  updateEditTimerBanner(remaining, editingIsUnlocked);

  if (canEditNow) {
    document.getElementById('adminGate').style.display = 'none';
    document.getElementById('editFormBody').style.display = 'block';
    document.getElementById('editModalFooter').style.display = 'flex';
    renderEditForm();
    startEditTimerCountdown(order);
  } else {
    document.getElementById('adminGate').style.display = 'block';
    document.getElementById('editFormBody').style.display = 'none';
    document.getElementById('editModalFooter').style.display = 'none';
    document.getElementById('adminPinInput').value = '';
    document.getElementById('adminGateError').textContent = '';
    setTimeout(() => document.getElementById('adminPinInput').focus(), 250);
  }
  document.getElementById('editInvoiceModal').classList.add('active');
}

function updateEditTimerBanner(remaining, unlocked) {
  const banner = document.getElementById('editTimerBanner');
  const label = document.getElementById('editTimerLabel');
  const countdown = document.getElementById('editTimerCountdown');
  banner.classList.remove('warning', 'locked');
  if (unlocked) {
    label.textContent = 'Admin Unlocked';
    countdown.textContent = '🔓';
    return;
  }
  if (remaining === 0) {
    banner.classList.add('locked');
    label.textContent = 'Edit Window Closed';
    countdown.textContent = '0:00';
    return;
  }
  if (remaining <= 2 * 60 * 1000) {
    banner.classList.add('warning');
    label.textContent = 'Last chance';
  } else {
    label.textContent = 'Edit Window Open';
  }
  countdown.textContent = formatTimeRemaining(remaining);
}

function startEditTimerCountdown(order) {
  if (editTimerInterval) clearInterval(editTimerInterval);
  editTimerInterval = setInterval(() => {
    const remaining = getTimeRemaining(order);
    const unlocked = isOrderUnlocked(order.id);
    updateEditTimerBanner(remaining, unlocked);
    if (remaining === 0 && !unlocked && !editingIsUnlocked) {
      clearInterval(editTimerInterval);
      document.getElementById('adminGate').style.display = 'block';
      document.getElementById('editFormBody').style.display = 'none';
      document.getElementById('editModalFooter').style.display = 'none';
      setTimeout(() => document.getElementById('adminPinInput').focus(), 200);
    } else if (remaining === 0) {
      clearInterval(editTimerInterval);
    }
  }, 1000);
}

function renderEditForm() {
  if (!editingDraft) return;
  const itemsEl = document.getElementById('editItemsList');
  itemsEl.innerHTML = editingDraft.itemsList.map((item, idx) => {
    const removed = item._removed;
    const typeCls = item.kind === 'offer' ? 'type-offer' : (item.kind === 'box' ? 'type-box' : '');
    return `<div class="edit-item-row ${removed ? 'edit-item-remove-row' : ''} ${typeCls}">
      <div class="edit-item-info">
        <div class="edit-item-name">${esc(item.name)}</div>
        <div class="edit-item-meta">${item.grams ? item.grams + 'g' : ''}${item.kind ? ' · ' + item.kind : ''}</div>
      </div>
      <div class="edit-item-qty">
        <button type="button" data-edit-dec="${idx}" ${removed ? 'disabled' : ''}>−</button>
        <span>${item.qty}</span>
        <button type="button" data-edit-inc="${idx}" ${removed ? 'disabled' : ''}>+</button>
      </div>
      <div class="edit-item-price">${fmtMoney(item.price * item.qty)}</div>
      <button type="button" class="edit-item-toggle ${removed ? 'restore' : ''}" data-edit-toggle="${idx}">
        <i class='bx ${removed ? 'bx-undo' : 'bx-trash'}'></i>
      </button>
    </div>`;
  }).join('') || `<div style="text-align:center;padding:14px;color:#8a7a85;font-size:.82rem;">No items</div>`;

  document.getElementById('editCustomerName').value =
    editingDraft.customerInfo?.name || editingDraft.customerName || '';
  document.getElementById('editCustomerPhone').value =
    editingDraft.customerInfo?.phone || editingDraft.customerPhone || '';

  const isDelivery = editingDraft.channel === 'manual' || editingDraft.deliveryMethod === 'delivery';
  document.getElementById('editDeliverySection').style.display = isDelivery ? 'block' : 'none';
  document.getElementById('editPaymentSection').style.display = isDelivery ? 'none' : 'block';

  if (isDelivery) {
    document.getElementById('editAddress').value = editingDraft.address || '';
    document.getElementById('editDeliveryFee').value = (editingDraft.deliveryFee || 0).toFixed(2);
    document.getElementById('editNotes').value = editingDraft.notes || '';
    document.getElementById('editPayment').value = editingDraft.payment || 'pending';
  } else {
    document.querySelectorAll('.edit-pay-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.method === (editingDraft.payment || 'cash'))
    );
  }
  updateEditTotals();
}

function updateEditTotals() {
  if (!editingDraft) return;
  const activeItems = editingDraft.itemsList.filter(i => !i._removed);
  const subtotal = activeItems.reduce((s, i) => s + i.price * i.qty, 0);
  const isDelivery = editingDraft.channel === 'manual' || editingDraft.deliveryMethod === 'delivery';
  const fee = isDelivery ? (parseFloat(document.getElementById('editDeliveryFee')?.value) || 0) : 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + fee + tax;

  document.getElementById('editTotals').innerHTML =
    `<div class="edit-total-row"><span>Subtotal</span><span>${fmtMoney(subtotal)}</span></div>
    ${fee > 0 ? `<div class="edit-total-row"><span>Delivery Fee</span><span>${fmtMoney(fee)}</span></div>` : ''}
    <div class="edit-total-row"><span>Tax (${Math.round(TAX_RATE * 100)}%)</span><span>${fmtMoney(tax)}</span></div>
    <div class="edit-total-row grand"><span>TOTAL</span><span>${fmtMoney(total)}</span></div>
    ${editingOrderOriginal && Math.abs(total - editingOrderOriginal.total) > 0.001
      ? `<div style="text-align:center;margin-top:10px;font-size:.7rem;color:${total > editingOrderOriginal.total ? '#b91c1c' : '#15803d'};font-weight:700;">${total > editingOrderOriginal.total ? '▲' : '▼'} ${fmtMoney(Math.abs(total - editingOrderOriginal.total))} vs original</div>`
      : ''}`;

  editingDraft.subtotal = subtotal;
  editingDraft.tax = tax;
  editingDraft.total = total;
  editingDraft.deliveryFee = fee;
}

function bindEditFormInteractions() {
  const itemsList = document.getElementById('editItemsList');
  if (itemsList) {
    itemsList.addEventListener('click', (e) => {
      const inc = e.target.closest('[data-edit-inc]');
      if (inc) { editingDraft.itemsList[+inc.dataset.editInc].qty++; renderEditForm(); return; }
      const dec = e.target.closest('[data-edit-dec]');
      if (dec) {
        const i = +dec.dataset.editDec;
        if (editingDraft.itemsList[i].qty > 1) {
          editingDraft.itemsList[i].qty--;
          renderEditForm();
        }
        return;
      }
      const toggle = e.target.closest('[data-edit-toggle]');
      if (toggle) {
        const i = +toggle.dataset.editToggle;
        editingDraft.itemsList[i]._removed = !editingDraft.itemsList[i]._removed;
        renderEditForm();
        return;
      }
    });
  }
  const feeInput = document.getElementById('editDeliveryFee');
  if (feeInput) feeInput.addEventListener('input', updateEditTotals);

  document.querySelectorAll('.edit-pay-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.edit-pay-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      editingDraft.payment = btn.dataset.method;
    });
  });

  ['editCustomerName', 'editCustomerPhone', 'editAddress', 'editNotes', 'editPayment'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      if (id === 'editCustomerName') {
        if (!editingDraft.customerInfo) editingDraft.customerInfo = {};
        editingDraft.customerInfo.name = el.value;
      }
      if (id === 'editCustomerPhone') {
        if (!editingDraft.customerInfo) editingDraft.customerInfo = {};
        editingDraft.customerInfo.phone = el.value;
      }
      if (id === 'editAddress') editingDraft.address = el.value;
      if (id === 'editNotes') editingDraft.notes = el.value;
      if (id === 'editPayment') editingDraft.payment = el.value;
    });
  });

  document.querySelectorAll('[data-edit-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.editAdd;
      if (kind === 'item') openPickItemModal('edit');
      else if (kind === 'offer') openPickOfferModal('edit');
      else if (kind === 'box') openPickBoxModal('edit');
    });
  });

  document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
  document.getElementById('cancelEditBtn').addEventListener('click', closeEditModal);
  document.getElementById('editInvoiceModal').addEventListener('click', (e) => {
    if (e.target.id === 'editInvoiceModal') closeEditModal();
  });
  document.getElementById('saveEditBtn').addEventListener('click', saveEditedInvoice);
  document.getElementById('adminUnlockBtn').addEventListener('click', tryAdminUnlock);
  document.getElementById('adminPinInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); tryAdminUnlock(); }
  });
}

function closeEditModal() {
  document.getElementById('editInvoiceModal').classList.remove('active');
  if (editTimerInterval) clearInterval(editTimerInterval);
  editingOrder = null;
  editingOrderOriginal = null;
  editingDraft = null;
  editingIsUnlocked = false;
}

function tryAdminUnlock() {
  const input = document.getElementById('adminPinInput');
  const error = document.getElementById('adminGateError');
  const pin = (input.value || '').trim();
  if (pin === ADMIN_OVERRIDE_PIN) {
    addEditUnlock(editingOrder.id, currentEmployee.username);
    editingIsUnlocked = true;
    input.value = '';
    input.classList.remove('error');
    error.textContent = '';
    addEditLogEntry({
      orderId: editingOrder.id,
      editedBy: currentEmployee.username,
      editedByName: currentEmployee.name,
      editedAt: new Date().toISOString(),
      type: 'unlock', override: true, changes: []
    });
    showToast('Admin unlocked', 'bx-lock-open-alt');
    document.getElementById('adminGate').style.display = 'none';
    document.getElementById('editFormBody').style.display = 'block';
    document.getElementById('editModalFooter').style.display = 'flex';
    updateEditTimerBanner(0, true);
    renderEditForm();
  } else {
    error.textContent = 'Invalid admin PIN.';
    input.classList.add('error');
    input.value = '';
    setTimeout(() => input.classList.remove('error'), 550);
    input.focus();
  }
}

function saveEditedInvoice() {
  if (!editingDraft || !editingOrderOriginal) return;
  const activeItems = editingDraft.itemsList.filter(i => !i._removed);
  if (!activeItems.length) { showToast('At least one item required', 'bx-error-circle'); return; }

  const changes = [];
  const origItems = editingOrderOriginal.itemsList || [];
  const draftItems = editingDraft.itemsList || [];

  draftItems.forEach((di, idx) => {
    const oi = origItems[idx];
    if (!oi) {
      changes.push({ type: 'item_added', name: di.name, newQty: di.qty });
      return;
    }
    if (di._removed && !oi._removed) changes.push({ type: 'item_removed', name: di.name, oldQty: oi.qty });
    else if (di.qty !== oi.qty) changes.push({ type: 'item_qty', name: di.name, oldQty: oi.qty, newQty: di.qty });
  });

  const oldName = editingOrderOriginal.customerInfo?.name || editingOrderOriginal.customerName || '';
  const newName = editingDraft.customerInfo?.name || editingDraft.customerName || '';
  if (oldName !== newName) changes.push({ type: 'customer_name', old: oldName, new: newName });

  const oldPhone = editingOrderOriginal.customerInfo?.phone || editingOrderOriginal.customerPhone || '';
  const newPhone = editingDraft.customerInfo?.phone || editingDraft.customerPhone || '';
  if (oldPhone !== newPhone) changes.push({ type: 'customer_phone', old: oldPhone, new: newPhone });

  if (editingOrderOriginal.payment !== editingDraft.payment) {
    changes.push({ type: 'payment', old: editingOrderOriginal.payment, new: editingDraft.payment });
  }
  if ((editingOrderOriginal.address || '') !== (editingDraft.address || '')) {
    changes.push({ type: 'address', old: editingOrderOriginal.address || '', new: editingDraft.address || '' });
  }
  if ((editingOrderOriginal.deliveryFee || 0) !== (editingDraft.deliveryFee || 0)) {
    changes.push({ type: 'delivery_fee', old: editingOrderOriginal.deliveryFee || 0, new: editingDraft.deliveryFee || 0 });
  }
  if (Math.abs((editingOrderOriginal.total || 0) - (editingDraft.total || 0)) > 0.001) {
    changes.push({ type: 'total', old: editingOrderOriginal.total || 0, new: editingDraft.total || 0 });
  }

  if (changes.length === 0) {
    showToast('No changes made', 'bx-info-circle');
    closeEditModal();
    return;
  }

  const updated = JSON.parse(JSON.stringify(editingOrderOriginal));
  updated.itemsList = draftItems.filter(i => !i._removed).map(i => {
    const { _removed, ...clean } = i;
    return clean;
  });
  updated.subtotal = editingDraft.subtotal;
  updated.tax = editingDraft.tax;
  updated.deliveryFee = editingDraft.deliveryFee;
  updated.total = editingDraft.total;
  updated.payment = editingDraft.payment;
  updated.address = editingDraft.address || updated.address;
  updated.notes = editingDraft.notes !== undefined ? editingDraft.notes : (updated.notes || '');
  updated.customerInfo = editingDraft.customerInfo || updated.customerInfo;
  updated.customerName = editingDraft.customerInfo?.name || editingDraft.customerName || updated.customerName;
  updated.customerPhone = editingDraft.customerInfo?.phone || editingDraft.customerPhone || updated.customerPhone;

  const empOrders = loadEmployeeOrders();
  const idx = empOrders.findIndex(o => o.id === updated.id);
  if (idx !== -1) {
    empOrders[idx] = updated;
    saveEmployeeOrders(empOrders);
  }

  adjustStockForEdit(origItems, updated.itemsList);

  addEditLogEntry({
    orderId: updated.id,
    editedBy: currentEmployee.username,
    editedByName: currentEmployee.name,
    editedAt: new Date().toISOString(),
    type: 'edit',
    override: editingIsUnlocked,
    changes,
    oldTotal: editingOrderOriginal.total,
    newTotal: updated.total
  });

  if (editingIsUnlocked) consumeUnlock(updated.id);

  loadManualOrders();
  renderRecentOrders();
  refreshDeliveryBadge();
  showToast(`Invoice ${updated.id} updated`, 'bx-check-circle');
  closeEditModal();
}

function openEditHistoryModal(orderId) {
  const log = getOrderEditLog(orderId);
  const body = document.getElementById('editHistoryBody');

  if (!log.length) {
    body.innerHTML = `<div class="edit-history-empty"><i class='bx bx-history'></i><p>No edits recorded.</p></div>`;
  } else {
    body.innerHTML = log.map(entry => {
      const changeList = (entry.changes || []).map(c => {
        if (c.type === 'item_qty') return `<div style="font-size:.74rem;color:#555;">• Qty of <strong>${esc(c.name)}</strong>: ${c.oldQty} → ${c.newQty}</div>`;
        if (c.type === 'item_removed') return `<div style="font-size:.74rem;color:#b91c1c;">• Removed <strong>${esc(c.name)}</strong></div>`;
        if (c.type === 'item_added') return `<div style="font-size:.74rem;color:#15803d;">• Added <strong>${esc(c.name)}</strong> × ${c.newQty}</div>`;
        if (c.type === 'total') return `<div style="font-size:.74rem;color:#555;">• Total: ${fmtMoney(c.old)} → <strong>${fmtMoney(c.new)}</strong></div>`;
        if (c.type === 'payment') return `<div style="font-size:.74rem;color:#555;">• Payment: ${esc(c.old)} → ${esc(c.new)}</div>`;
        if (c.type === 'customer_name') return `<div style="font-size:.74rem;color:#555;">• Name updated</div>`;
        if (c.type === 'customer_phone') return `<div style="font-size:.74rem;color:#555;">• Phone updated</div>`;
        if (c.type === 'address') return `<div style="font-size:.74rem;color:#555;">• Address updated</div>`;
        if (c.type === 'delivery_fee') return `<div style="font-size:.74rem;color:#555;">• Delivery fee: ${fmtMoney(c.old)} → ${fmtMoney(c.new)}</div>`;
        return '';
      }).join('');

      return `<div class="edit-history-entry">
        <div class="edit-history-entry-head">
          <div class="edit-history-by"><i class='bx bx-user-circle'></i> ${esc(entry.editedByName || entry.editedBy)}</div>
          <div class="edit-history-date">${fmtDateTime(entry.editedAt)}</div>
        </div>
        ${entry.type === 'unlock'
          ? `<div style="font-size:.76rem;color:#a16207;font-weight:700;">🔓 Unlocked with admin PIN</div>`
          : changeList || '<div style="font-size:.74rem;color:#999;">No changes</div>'}
      </div>`;
    }).join('');
  }
  document.getElementById('editHistoryModal').classList.add('active');
}

function bindEditHistoryModal() {
  document.getElementById('closeEditHistory').addEventListener('click', () =>
    document.getElementById('editHistoryModal').classList.remove('active')
  );
  document.getElementById('editHistoryClose').addEventListener('click', () =>
    document.getElementById('editHistoryModal').classList.remove('active')
  );
  document.getElementById('editHistoryModal').addEventListener('click', (e) => {
    if (e.target.id === 'editHistoryModal') document.getElementById('editHistoryModal').classList.remove('active');
  });
}

function printRecentOrder(orderId) {
  const order = findOrderById(orderId);
  if (!order) { showToast('Order not found', 'bx-error-circle'); return; }
  const items = (order.itemsList || []).map(i => ({
    type: 'offer',
    data: { name: i.name, price: i.price, qty: i.qty }
  }));
  buildReceiptView({
    receiptId: order.id,
    date: new Date(order.placedAt || order.date),
    customer: order.customerInfo?.name || order.customerName || 'Walk-in',
    customerPhone: order.customerInfo?.phone || order.customerPhone || '',
    employee: order.servedBy || currentEmployee?.name || 'POS',
    paymentLabel: (order.payment || 'cash').toUpperCase(),
    items,
    subtotal: order.subtotal || order.total,
    fee: order.deliveryFee || 0,
    tax: order.tax || 0,
    total: order.total,
    isDelivery: order.channel === 'manual' || order.deliveryMethod === 'delivery',
    address: order.address
  });
  setTimeout(printThermalReceipt, 250);
  showToast('Printing...', 'bx-printer');
}

/* =====================================================
   INVENTORY (all guarded by FEAT_INVENTORY)
   ===================================================== */

function findInvItemByBarcode(barcode) {
  if (!barcode) return null;
  const clean = barcode.trim().toLowerCase();
  return invItems.find(i => (i.barcode || '').toLowerCase() === clean);
}

function findInvItemById(id) {
  return invItems.find(i => i.id === id);
}

function updateInventoryBadge() {
  const badge = document.getElementById('inventoryBadge');
  if (!badge) return;
  const total = invItems.reduce((s, i) => s + (Number(i.warehouseStock) || 0), 0);
  badge.textContent = total;
  badge.classList.toggle('hidden', total === 0);
}

function generateBarcode(category, weight, sequence) {
  const catCode = CATEGORY_CODES[category] || '900';
  const wStr = String(Math.min(9999, Math.max(0, parseInt(weight) || 0))).padStart(4, '0');
  let seq = sequence;
  if (seq === undefined || seq === null) {
    const existing = invItems.map(i => {
      const match = (i.barcode || '').match(/HC\d{3}\d{4}(\d{5})/);
      return match ? parseInt(match[1]) : 0;
    });
    const maxSeq = existing.length ? Math.max(...existing) : 0;
    seq = maxSeq + 1;
  }
  const seqStr = String(seq).padStart(5, '0');
  const base = `${catCode}${wStr}${seqStr}`;
  const sum = base.split('').reduce((s, d) => s + parseInt(d), 0);
  const check = String(sum % 10);
  return `HC${base}${check}`;
}

function renderInventory() {
  if (!FEAT_INVENTORY) return;
  loadInventoryItems();
  loadInventoryMovements();
  renderInventoryStats();
  renderReceiveBatch();
  renderTransferBatch();
  renderWarehouseStock();
  renderShopStock();
  renderInventoryItems();
  renderInventoryHistory();
  updateInventoryBadge();
  switchInventoryTab(invCurrentTab, true);
}

function renderInventoryStats() {
  const el = document.getElementById('invStats');
  if (!el) return;
  const totalItems = invItems.length;
  const warehouseTotal = invItems.reduce((s, i) => s + (Number(i.warehouseStock) || 0), 0);
  const shopTotal = invItems.reduce((s, i) => s + (Number(i.shopStock) || 0), 0);
  const lowStockCount = invItems.filter(i =>
    (Number(i.warehouseStock) || 0) > 0 && (Number(i.warehouseStock) || 0) <= 5
  ).length;

  el.innerHTML = `
    <div class="inv-stat-card blue"><div class="inv-stat-icon"><i class='bx bx-package'></i></div><div><div class="inv-stat-value">${totalItems}</div><div class="inv-stat-label">Types</div></div></div>
    <div class="inv-stat-card green"><div class="inv-stat-icon"><i class='bx bx-warehouse'></i></div><div><div class="inv-stat-value">${warehouseTotal}</div><div class="inv-stat-label">Warehouse</div></div></div>
    <div class="inv-stat-card purple"><div class="inv-stat-icon"><i class='bx bx-store'></i></div><div><div class="inv-stat-value">${shopTotal}</div><div class="inv-stat-label">Shop</div></div></div>
    <div class="inv-stat-card orange"><div class="inv-stat-icon"><i class='bx bx-error-circle'></i></div><div><div class="inv-stat-value">${lowStockCount}</div><div class="inv-stat-label">Low</div></div></div>
  `;
}

function switchInventoryTab(tab, silent) {
  invCurrentTab = tab;
  document.querySelectorAll('.inv-tab').forEach(t => t.classList.toggle('active', t.dataset.itab === tab));
  document.querySelectorAll('.inv-pane').forEach(p => p.classList.toggle('active', p.dataset.ipane === tab));

  if (!silent) {
    setTimeout(() => {
      if (tab === 'receive') {
        const inp = document.getElementById('receiveBarcodeInput');
        if (inp) inp.focus();
      } else if (tab === 'transfer') {
        const inp = document.getElementById('transferBarcodeInput');
        if (inp) inp.focus();
      }
    }, 150);
  }
}

function handleBarcodeInput(mode) {
  const inputId = mode === 'receive' ? 'receiveBarcodeInput' : 'transferBarcodeInput';
  const input = document.getElementById(inputId);
  if (!input) return;
  const barcode = input.value.trim();
  if (!barcode) return;

  const item = findInvItemByBarcode(barcode);
  if (!item) {
    showToast(`"${barcode}" not found`, 'bx-error-circle');
    showBarcodeLookupModal(mode, barcode);
    input.value = '';
    return;
  }

  if (mode === 'transfer') {
    const currentStock = Number(item.warehouseStock) || 0;
    if (currentStock <= 0) {
      showToast(`${item.name} — no stock`, 'bx-error-circle');
      input.value = '';
      return;
    }
  }

  showDetectedItem(mode, item);
  input.value = '';
}

function showDetectedItem(mode, item) {
  const detectedEl = document.getElementById(mode === 'receive' ? 'receiveDetected' : 'transferDetected');
  if (!detectedEl) return;
  const currentStock = Number(item.warehouseStock) || 0;

  detectedEl.innerHTML = `
    <div class="barcode-detected-icon"><i class='bx bx-check'></i></div>
    <div class="barcode-detected-info">
      <strong>${esc(item.name)}</strong>
      <span>${esc(item.barcode)} · ${item.weight}g · WH: ${currentStock}</span>
    </div>
    <div class="barcode-detected-qty">
      <button type="button" data-detected-dec="${mode}"><i class='bx bx-minus'></i></button>
      <input type="number" id="detectedQtyInput" value="1" min="1" max="9999">
      <button type="button" data-detected-inc="${mode}"><i class='bx bx-plus'></i></button>
      <button type="button" class="barcode-add-btn" data-detected-add="${mode}"><i class='bx bx-plus-circle'></i> Add</button>
    </div>
  `;
  detectedEl.classList.remove('hidden');
  detectedEl.dataset.itemId = item.id;

  const qtyInput = document.getElementById('detectedQtyInput');
  if (mode === 'transfer') {
    qtyInput.max = currentStock;
    qtyInput.value = 1;
  }

  detectedEl.querySelectorAll('[data-detected-inc]').forEach(btn =>
    btn.addEventListener('click', () => {
      const inp = document.getElementById('detectedQtyInput');
      inp.value = (parseInt(inp.value) || 0) + 1;
    })
  );
  detectedEl.querySelectorAll('[data-detected-dec]').forEach(btn =>
    btn.addEventListener('click', () => {
      const inp = document.getElementById('detectedQtyInput');
      const v = (parseInt(inp.value) || 0) - 1;
      inp.value = v < 1 ? 1 : v;
    })
  );
  detectedEl.querySelectorAll('[data-detected-add]').forEach(btn =>
    btn.addEventListener('click', () => {
      const qty = parseInt(document.getElementById('detectedQtyInput').value) || 1;
      addToBatch(mode, item.id, qty);
      detectedEl.classList.add('hidden');
      detectedEl.innerHTML = '';
      const inpId = mode === 'receive' ? 'receiveBarcodeInput' : 'transferBarcodeInput';
      const input = document.getElementById(inpId);
      if (input) input.focus();
    })
  );

  setTimeout(() => qtyInput.focus(), 100);
}

function addToBatch(mode, itemId, qty) {
  const batch = mode === 'receive' ? invReceiveBatch : invTransferBatch;
  const existing = batch.find(b => b.itemId === itemId);
  const item = findInvItemById(itemId);
  if (!item) return;

  if (mode === 'transfer') {
    const whStock = Number(item.warehouseStock) || 0;
    const alreadyInBatch = batch.filter(b => b.itemId === itemId).reduce((s, b) => s + b.qty, 0);
    if (alreadyInBatch + qty > whStock) {
      showToast(`Only ${whStock - alreadyInBatch} available`, 'bx-error-circle');
      return;
    }
  }
  if (existing) existing.qty += qty;
  else batch.push({ itemId, qty });

  showToast(`${item.name} × ${qty} added`, 'bx-plus-circle');
  if (mode === 'receive') renderReceiveBatch();
  else renderTransferBatch();
}

function renderReceiveBatch() {
  const list = document.getElementById('receiveBatchList');
  if (!list) return;
  if (!invReceiveBatch.length) {
    list.innerHTML = `<div class="inv-empty-small"><i class='bx bx-scan'></i><p>No items scanned yet</p></div>`;
    updateReceiveTotals();
    return;
  }
  list.innerHTML = invReceiveBatch.map((b, idx) => {
    const item = findInvItemById(b.itemId);
    if (!item) return '';
    return `<div class="inv-batch-row">
      <img class="inv-batch-thumb" src="${esc(item.img || 'https://via.placeholder.com/80')}" alt="">
      <div class="inv-batch-info">
        <div class="inv-batch-name">${esc(item.name)}</div>
        <div class="inv-batch-meta"><i class='bx bx-barcode'></i> ${esc(item.barcode)}<span style="opacity:.6;">·</span><span>${item.weight}g</span></div>
      </div>
      <div class="inv-batch-qty"><button type="button" data-rb-dec="${idx}">−</button><span>${b.qty}</span><button type="button" data-rb-inc="${idx}">+</button></div>
      <button type="button" class="inv-batch-remove" data-rb-remove="${idx}"><i class='bx bx-x'></i></button>
    </div>`;
  }).join('');
  updateReceiveTotals();
}

function renderTransferBatch() {
  const list = document.getElementById('transferBatchList');
  if (!list) return;
  if (!invTransferBatch.length) {
    list.innerHTML = `<div class="inv-empty-small"><i class='bx bx-scan'></i><p>No items scanned yet</p></div>`;
    updateTransferTotals();
    return;
  }
  list.innerHTML = invTransferBatch.map((b, idx) => {
    const item = findInvItemById(b.itemId);
    if (!item) return '';
    return `<div class="inv-batch-row transfer">
      <img class="inv-batch-thumb" src="${esc(item.img || 'https://via.placeholder.com/80')}" alt="">
      <div class="inv-batch-info">
        <div class="inv-batch-name">${esc(item.name)}</div>
        <div class="inv-batch-meta"><i class='bx bx-barcode'></i> ${esc(item.barcode)}<span style="opacity:.6;">·</span><span>WH: ${item.warehouseStock}</span></div>
      </div>
      <div class="inv-batch-qty"><button type="button" data-tb-dec="${idx}">−</button><span>${b.qty}</span><button type="button" data-tb-inc="${idx}">+</button></div>
      <button type="button" class="inv-batch-remove" data-tb-remove="${idx}"><i class='bx bx-x'></i></button>
    </div>`;
  }).join('');
  updateTransferTotals();
}

function updateReceiveTotals() {
  const count = invReceiveBatch.reduce((s, b) => s + b.qty, 0);
  const cntEl = document.getElementById('receiveBatchCount');
  const totalEl = document.getElementById('receiveConfirmTotal');
  const btn = document.getElementById('receiveConfirmBtn');
  if (cntEl) cntEl.textContent = invReceiveBatch.length;
  if (totalEl) totalEl.textContent = `${count} bag${count !== 1 ? 's' : ''}`;
  if (btn) btn.disabled = invReceiveBatch.length === 0;
}

function updateTransferTotals() {
  const count = invTransferBatch.reduce((s, b) => s + b.qty, 0);
  const cntEl = document.getElementById('transferBatchCount');
  const totalEl = document.getElementById('transferConfirmTotal');
  const btn = document.getElementById('transferConfirmBtn');
  if (cntEl) cntEl.textContent = invTransferBatch.length;
  if (totalEl) totalEl.textContent = `${count} bag${count !== 1 ? 's' : ''}`;
  if (btn) btn.disabled = invTransferBatch.length === 0;
}

function confirmReceiveBatch() {
  if (!invReceiveBatch.length) return;
  const today = new Date().toISOString();
  invReceiveBatch.forEach(b => {
    const item = findInvItemById(b.itemId);
    if (!item) return;
    item.warehouseStock = (Number(item.warehouseStock) || 0) + b.qty;
    invMovements.unshift({
      id: 'mov-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      type: 'in', itemId: item.id, itemName: item.name, barcode: item.barcode,
      qty: b.qty, from: 'supplier', to: 'warehouse',
      employee: currentEmployee?.username || 'emp',
      employeeName: currentEmployee?.name || 'Employee',
      date: today, note: ''
    });
  });
  saveInventoryItems();
  saveInventoryMovements();
  const total = invReceiveBatch.reduce((s, b) => s + b.qty, 0);
  invReceiveBatch = [];
  renderInventory();
  showToast(`${total} bags received`, 'bx-check-circle');
}

function confirmTransferBatch() {
  if (!invTransferBatch.length) return;
  const shopId = document.getElementById('transferShopSelect')?.value || 'main';
  const shopName = {
    main: 'Main Boutique (Amman)',
    shop2: 'Shop 2 (Zarqa)',
    shop3: 'Shop 3 (Irbid)'
  }[shopId] || shopId;
  const today = new Date().toISOString();

  for (const b of invTransferBatch) {
    const item = findInvItemById(b.itemId);
    if (!item) continue;
    if ((Number(item.warehouseStock) || 0) < b.qty) {
      showToast(`Not enough stock for ${item.name}`, 'bx-error-circle');
      return;
    }
  }

  invTransferBatch.forEach(b => {
    const item = findInvItemById(b.itemId);
    if (!item) return;
    item.warehouseStock = Math.max(0, (Number(item.warehouseStock) || 0) - b.qty);
    item.shopStock = (Number(item.shopStock) || 0) + b.qty;
    invMovements.unshift({
      id: 'mov-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      type: 'transfer', itemId: item.id, itemName: item.name, barcode: item.barcode,
      qty: b.qty, from: 'warehouse', to: shopName, shopId,
      employee: currentEmployee?.username || 'emp',
      employeeName: currentEmployee?.name || 'Employee',
      date: today, note: ''
    });
  });
  saveInventoryItems();
  saveInventoryMovements();
  const total = invTransferBatch.reduce((s, b) => s + b.qty, 0);
  invTransferBatch = [];
  renderInventory();
  showToast(`${total} bags transferred to ${shopName}`, 'bx-transfer-alt');
}

function renderWarehouseStock() {
  const grid = document.getElementById('warehouseStockGrid');
  if (!grid) return;
  const q = (document.getElementById('warehouseSearchInput')?.value || '').trim().toLowerCase();
  let list = invItems.filter(i =>
    !q || i.name.toLowerCase().includes(q) || (i.barcode || '').toLowerCase().includes(q)
  );
  if (!list.length) {
    grid.innerHTML = `<div class="inv-empty-small" style="grid-column:1/-1;"><i class='bx bx-package'></i><p>${q ? 'No matching items' : 'Warehouse is empty'}</p></div>`;
    return;
  }
  grid.innerHTML = list.map(item => {
    const stock = Number(item.warehouseStock) || 0;
    let cardCls = stock === 0 ? 'out' : (stock <= 5 ? 'low' : '');
    return `<div class="inv-stock-card ${cardCls}">
      <div class="inv-stock-head">
        <img class="inv-stock-thumb" src="${esc(item.img || 'https://via.placeholder.com/80')}" alt="">
        <div class="inv-stock-info">
          <div class="inv-stock-name">${esc(item.name)}</div>
          <span class="inv-stock-barcode">${esc(item.barcode)}</span>
        </div>
        <div class="inv-stock-qty">${stock}<small>bags</small></div>
      </div>
      <div class="inv-stock-footer">
        <button class="inv-mini-btn primary" data-quick-receive="${esc(item.id)}"><i class='bx bx-plus'></i> Receive</button>
        <button class="inv-mini-btn ghost" data-quick-transfer="${esc(item.id)}"><i class='bx bx-transfer-alt'></i> Transfer</button>
      </div>
    </div>`;
  }).join('');
}

function renderShopStock() {
  const grid = document.getElementById('shopStockGrid');
  if (!grid) return;
  const q = (document.getElementById('shopSearchInput')?.value || '').trim().toLowerCase();
  let list = invItems.filter(i =>
    !q || i.name.toLowerCase().includes(q) || (i.barcode || '').toLowerCase().includes(q)
  );
  list = list.filter(i => (Number(i.shopStock) || 0) > 0);
  if (!list.length) {
    grid.innerHTML = `<div class="inv-empty-small" style="grid-column:1/-1;"><i class='bx bx-store'></i><p>${q ? 'No matching items' : 'No stock at shops'}</p></div>`;
    return;
  }
  grid.innerHTML = list.map(item => {
    const stock = Number(item.shopStock) || 0;
    return `<div class="inv-stock-card">
      <div class="inv-stock-head">
        <img class="inv-stock-thumb" src="${esc(item.img || 'https://via.placeholder.com/80')}" alt="">
        <div class="inv-stock-info">
          <div class="inv-stock-name">${esc(item.name)}</div>
          <span class="inv-stock-barcode">${esc(item.barcode)}</span>
        </div>
        <div class="inv-stock-qty">${stock}<small>bags</small></div>
      </div>
      <div class="inv-stock-footer">
        <button class="inv-mini-btn ghost" data-return-to-wh="${esc(item.id)}"><i class='bx bx-undo'></i> Return</button>
      </div>
    </div>`;
  }).join('');
}