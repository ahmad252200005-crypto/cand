// Part 4: part4

// Auto-generated from script.js

function renderInventoryItems() {
  const list = document.getElementById('invItemsList');
  if (!list) return;
  const q = (document.getElementById('itemsSearchInput')?.value || '').trim().toLowerCase();
  let items = invItems.filter(i =>
    !q || i.name.toLowerCase().includes(q) || (i.barcode || '').toLowerCase().includes(q)
  );
  if (!items.length) {
    list.innerHTML = `<div class="inv-empty-small" style="grid-column:1/-1;"><i class='bx bx-barcode'></i><p>${q ? 'No matching items' : 'No items — click "Add Item"'}</p></div>`;
    return;
  }
  list.innerHTML = items.map(item => {
    const catCls = item.category === 'chocolate' ? 'cat-chocolate' : (item.category === 'candy' ? 'cat-candy' : 'cat-other');
    return `<div class="inv-item-card">
      <img class="inv-item-thumb" src="${esc(item.img || 'https://via.placeholder.com/80')}" alt="">
      <div class="inv-item-info">
        <div class="inv-item-name">${esc(item.name)}</div>
        <div class="inv-item-meta">
          <span class="${catCls}">${esc(item.category || 'other')}</span>
          <span>${item.weight}g</span>
          <span>${esc(item.barcode)}</span>
        </div>
      </div>
      <div class="inv-item-stock-badge">
        <span class="wh">WH: ${Number(item.warehouseStock) || 0}</span>
        <span class="sh">Shop: ${Number(item.shopStock) || 0}</span>
      </div>
      <div class="inv-item-actions">
        <button class="label" data-inv-label="${esc(item.id)}" title="Print Labels"><i class='bx bx-printer'></i></button>
        <button class="edit" data-inv-edit="${esc(item.id)}" title="Edit"><i class='bx bx-edit'></i></button>
        <button class="del" data-inv-del="${esc(item.id)}" title="Delete"><i class='bx bx-trash'></i></button>
      </div>
    </div>`;
  }).join('');
}

/* =====================================================
   INVENTORY HISTORY
   ===================================================== */

function renderInventoryHistory() {
  const list = document.getElementById('invHistoryList');
  if (!list) return;

  let items = invMovements;

  if (invHistoryFilter !== 'all') {
    items = items.filter(m => m.type === invHistoryFilter);
  }

  if (invHistoryEmployeeFilter !== 'all') {
    items = items.filter(m =>
      m.employee === invHistoryEmployeeFilter ||
      m.employeeName === invHistoryEmployeeFilter
    );
  }

  items = items.slice(0, 100);

  if (!items.length) {
    const empName = invHistoryEmployeeFilter !== 'all'
      ? (loadEmployeesFromAdmin().find(e => e.username === invHistoryEmployeeFilter)?.name || invHistoryEmployeeFilter)
      : null;
    list.innerHTML = `<div class="inv-empty-small"><i class='bx bx-history'></i><p>${empName ? `No movements for ${esc(empName)}` : 'No movements yet'}</p></div>`;
    return;
  }

  list.innerHTML = items.map(m => {
    const isIn = m.type === 'in';
    let icon = isIn ? 'bx bx-import' : 'bx bx-transfer-alt';
    let title = isIn ? `Supplier → Warehouse` : `Warehouse → ${m.to || 'Shop'}`;
    let qtySign = isIn ? '+' : '−';
    const typeCls = isIn ? 'type-in' : 'type-transfer';
    return `<div class="inv-history-item ${typeCls}">
      <div class="inv-history-icon"><i class='${icon}'></i></div>
      <div class="inv-history-info">
        <div class="inv-history-title">${esc(m.itemName || 'Item')} <span style="opacity:.6;font-weight:500;">— ${esc(title)}</span></div>
        <div class="inv-history-sub">
          <span><i class='bx bx-barcode'></i> ${esc(m.barcode || '—')}</span>
          <span><i class='bx bx-user'></i> ${esc(m.employeeName || m.employee || '—')}</span>
          <span><i class='bx bx-time-five'></i> ${fmtDateTime(m.date)}</span>
        </div>
      </div>
      <div class="inv-history-qty">${qtySign}${m.qty}<small>bags</small></div>
    </div>`;
  }).join('');
}

function populateHistoryEmployeeFilter() {
  const sel = document.getElementById('invHistoryEmployeeFilter');
  if (!sel) return;
  const currentVal = sel.value || 'all';

  const employees = loadEmployeesFromAdmin();

  sel.innerHTML = '<option value="all">All Employees</option>';

  employees.forEach(emp => {
    const opt = document.createElement('option');
    opt.value = emp.username;
    opt.textContent = emp.name + ' (@' + emp.username + ')';
    sel.appendChild(opt);
  });

  if (Array.from(sel.options).some(o => o.value === currentVal)) {
    sel.value = currentVal;
  } else {
    sel.value = 'all';
    invHistoryEmployeeFilter = 'all';
  }
}

function bindInventoryEvents() {
  document.querySelectorAll('.inv-tab').forEach(tab =>
    tab.addEventListener('click', () => switchInventoryTab(tab.dataset.itab))
  );
  const btnRefresh = document.getElementById('btnRefreshInventory');
  if (btnRefresh) btnRefresh.addEventListener('click', (e) => {
    e.currentTarget.style.transform = 'rotate(180deg)';
    loadInventoryItems();
    loadInventoryMovements();
    renderInventory();
    showToast('Refreshed', 'bx-refresh');
    setTimeout(() => { e.currentTarget.style.transform = ''; }, 500);
  });

  const receiveInput = document.getElementById('receiveBarcodeInput');
  const transferInput = document.getElementById('transferBarcodeInput');
  if (receiveInput) receiveInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleBarcodeInput('receive'); }
  });
  if (transferInput) transferInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleBarcodeInput('transfer'); }
  });

  document.getElementById('receiveSearchBtn').addEventListener('click', () =>
    showBarcodeLookupModal('receive', receiveInput.value.trim())
  );
  document.getElementById('transferSearchBtn').addEventListener('click', () =>
    showBarcodeLookupModal('transfer', transferInput.value.trim())
  );

  document.getElementById('receiveClearBatch').addEventListener('click', () => {
    if (!invReceiveBatch.length) return;
    if (!confirm('Clear queue?')) return;
    invReceiveBatch = [];
    renderReceiveBatch();
  });
  document.getElementById('transferClearBatch').addEventListener('click', () => {
    if (!invTransferBatch.length) return;
    if (!confirm('Clear queue?')) return;
    invTransferBatch = [];
    renderTransferBatch();
  });

  document.getElementById('receiveConfirmBtn').addEventListener('click', confirmReceiveBatch);
  document.getElementById('transferConfirmBtn').addEventListener('click', confirmTransferBatch);

  document.getElementById('receiveBatchList').addEventListener('click', (e) => {
    const inc = e.target.closest('[data-rb-inc]');
    if (inc) { invReceiveBatch[+inc.dataset.rbInc].qty++; renderReceiveBatch(); return; }
    const dec = e.target.closest('[data-rb-dec]');
    if (dec) {
      const i = +dec.dataset.rbDec;
      if (invReceiveBatch[i].qty > 1) invReceiveBatch[i].qty--;
      else invReceiveBatch.splice(i, 1);
      renderReceiveBatch();
      return;
    }
    const rm = e.target.closest('[data-rb-remove]');
    if (rm) { invReceiveBatch.splice(+rm.dataset.rbRemove, 1); renderReceiveBatch(); }
  });

  document.getElementById('transferBatchList').addEventListener('click', (e) => {
    const inc = e.target.closest('[data-tb-inc]');
    if (inc) {
      const i = +inc.dataset.tbInc;
      const b = invTransferBatch[i];
      const item = findInvItemById(b.itemId);
      const maxStock = Number(item.warehouseStock) || 0;
      if (b.qty + 1 > maxStock) { showToast(`Only ${maxStock} available`, 'bx-error-circle'); return; }
      b.qty++;
      renderTransferBatch();
      return;
    }
    const dec = e.target.closest('[data-tb-dec]');
    if (dec) {
      const i = +dec.dataset.tbDec;
      if (invTransferBatch[i].qty > 1) invTransferBatch[i].qty--;
      else invTransferBatch.splice(i, 1);
      renderTransferBatch();
      return;
    }
    const rm = e.target.closest('[data-tb-remove]');
    if (rm) { invTransferBatch.splice(+rm.dataset.tbRemove, 1); renderTransferBatch(); }
  });

  document.getElementById('warehouseStockGrid').addEventListener('click', (e) => {
    const rec = e.target.closest('[data-quick-receive]');
    if (rec) { quickReceive(rec.dataset.quickReceive); return; }
    const tr = e.target.closest('[data-quick-transfer]');
    if (tr) { quickTransfer(tr.dataset.quickTransfer); return; }
  });

  document.getElementById('shopStockGrid').addEventListener('click', (e) => {
    const ret = e.target.closest('[data-return-to-wh]');
    if (ret) { returnToWarehouse(ret.dataset.returnToWh); return; }
  });

  document.getElementById('warehouseSearchInput').addEventListener('input', renderWarehouseStock);
  document.getElementById('shopSearchInput').addEventListener('input', renderShopStock);
  document.getElementById('itemsSearchInput').addEventListener('input', renderInventoryItems);

  document.querySelectorAll('.ihfilter').forEach(btn => {
    btn.addEventListener('click', () => {
      invHistoryFilter = btn.dataset.ihfilter;
      document.querySelectorAll('.ihfilter').forEach(b =>
        b.classList.toggle('active', b.dataset.ihfilter === invHistoryFilter)
      );
      renderInventoryHistory();
    });
  });

  const historyEmpFilter = document.getElementById('invHistoryEmployeeFilter');
  if (historyEmpFilter) {
    populateHistoryEmployeeFilter();
    historyEmpFilter.addEventListener('change', (e) => {
      invHistoryEmployeeFilter = e.target.value;
      renderInventoryHistory();
    });
  }

  document.getElementById('invItemsList').addEventListener('click', (e) => {
    const lbl = e.target.closest('[data-inv-label]');
    if (lbl) { openLabelPrintModal(lbl.dataset.invLabel); return; }
    const ed = e.target.closest('[data-inv-edit]');
    if (ed) { openInventoryItemModal(ed.dataset.invEdit); return; }
    const dl = e.target.closest('[data-inv-del]');
    if (dl) {
      const item = findInvItemById(dl.dataset.invDel);
      if (!item) return;
      if (!confirm(`Delete "${item.name}"?`)) return;
      invItems = invItems.filter(i => i.id !== item.id);
      saveInventoryItems();
      renderInventory();
      showToast('Item deleted', 'bx-trash');
    }
  });

  document.getElementById('btnAddInventoryItem').addEventListener('click', () => openInventoryItemModal());
  document.getElementById('receiveScanBtn').addEventListener('click', () => openScanner('receive'));
  document.getElementById('transferScanBtn').addEventListener('click', () => openScanner('transfer'));
}

function quickReceive(itemId) {
  const item = findInvItemById(itemId);
  if (!item) return;
  switchInventoryTab('receive');
  setTimeout(() => showDetectedItem('receive', item), 200);
}

function quickTransfer(itemId) {
  const item = findInvItemById(itemId);
  if (!item) return;
  const whStock = Number(item.warehouseStock) || 0;
  if (whStock <= 0) { showToast('No stock available', 'bx-error-circle'); return; }
  switchInventoryTab('transfer');
  setTimeout(() => showDetectedItem('transfer', item), 200);
}

function returnToWarehouse(itemId) {
  const item = findInvItemById(itemId);
  if (!item) return;
  const shopStock = Number(item.shopStock) || 0;
  if (shopStock <= 0) return;
  const qty = prompt(`Return how many? (max ${shopStock})`, '1');
  const n = parseInt(qty);
  if (!n || n < 1 || n > shopStock) { showToast('Invalid quantity', 'bx-error-circle'); return; }
  item.shopStock -= n;
  item.warehouseStock = (Number(item.warehouseStock) || 0) + n;
  invMovements.unshift({
    id: 'mov-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    type: 'transfer', itemId: item.id, itemName: item.name, barcode: item.barcode,
    qty: n, from: 'shop', to: 'warehouse',
    employee: currentEmployee?.username || 'emp',
    employeeName: currentEmployee?.name || 'Employee',
    date: new Date().toISOString(), note: 'Return from shop'
  });
  saveInventoryItems();
  saveInventoryMovements();
  renderInventory();
  showToast(`${n} bags returned to warehouse`, 'bx-undo');
}

/* ============ INVENTORY ITEM MODAL ============ */

function bindInventoryItemModal() {
  document.getElementById('closeInvItemModal').addEventListener('click', closeInventoryItemModal);
  document.getElementById('invItemCancelBtn').addEventListener('click', closeInventoryItemModal);
  document.getElementById('inventoryItemModal').addEventListener('click', (e) => {
    if (e.target.id === 'inventoryItemModal') closeInventoryItemModal();
  });
  document.getElementById('invItemSaveBtn').addEventListener('click', saveInventoryItemFromModal);
  document.getElementById('inventoryItemForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveInventoryItemFromModal();
  });
  document.getElementById('generateBarcodeBtn').addEventListener('click', () => {
    const cat = document.getElementById('invItemCategory').value;
    const weight = parseInt(document.getElementById('invItemWeight').value) || 500;
    const code = generateBarcode(cat, weight);
    document.getElementById('invItemBarcode').value = code;
    showToast('Barcode generated', 'bx-barcode');
  });
  document.getElementById('invItemScanBtn').addEventListener('click', () => openScanner('item-add'));
}

function openInventoryItemModal(itemId) {
  invEditingItemId = itemId || null;
  const form = document.getElementById('inventoryItemForm');
  form.reset();
  document.getElementById('invItemIdInput').value = '';
  document.getElementById('invItemModalTitle').textContent =
    itemId ? 'Edit Inventory Item' : 'Add Inventory Item';

  if (itemId) {
    const item = findInvItemById(itemId);
    if (item) {
      document.getElementById('invItemIdInput').value = item.id;
      document.getElementById('invItemName').value = item.name || '';
      document.getElementById('invItemWeight').value = item.weight || 500;
      document.getElementById('invItemCategory').value = item.category || 'candy';
      document.getElementById('invItemCost').value = item.costPrice || 0;
      document.getElementById('invItemPrice').value = item.retailPrice || 0;
      document.getElementById('invItemBarcode').value = item.barcode || '';
      document.getElementById('invItemImg').value = item.img || '';
    }
  } else {
    document.getElementById('invItemWeight').value = 500;
    document.getElementById('invItemCost').value = '0.00';
    document.getElementById('invItemPrice').value = '0.00';
    document.getElementById('invItemBarcode').value = generateBarcode('candy', 500);
  }
  document.getElementById('inventoryItemModal').classList.add('active');
  setTimeout(() => document.getElementById('invItemName').focus(), 200);
}

function closeInventoryItemModal() {
  document.getElementById('inventoryItemModal').classList.remove('active');
  invEditingItemId = null;
}

function saveInventoryItemFromModal() {
  const name = document.getElementById('invItemName').value.trim();
  const weight = parseInt(document.getElementById('invItemWeight').value);
  const barcode = document.getElementById('invItemBarcode').value.trim();

  if (!name) { alert('Please enter a name'); return; }
  if (!weight || weight < 10) { alert('Please enter a valid weight (min 10g)'); return; }
  if (!barcode) { alert('Please enter or generate a barcode'); return; }

  const dup = invItems.find(i =>
    (i.barcode || '').toLowerCase() === barcode.toLowerCase() && i.id !== invEditingItemId
  );
  if (dup) { alert(`Barcode "${barcode}" is already used by "${dup.name}"`); return; }

  const data = {
    name, weight,
    category: document.getElementById('invItemCategory').value,
    costPrice: parseFloat(document.getElementById('invItemCost').value) || 0,
    retailPrice: parseFloat(document.getElementById('invItemPrice').value) || 0,
    barcode,
    img: document.getElementById('invItemImg').value.trim()
  };

  if (invEditingItemId) {
    const i = invItems.findIndex(x => x.id === invEditingItemId);
    if (i !== -1) invItems[i] = { ...invItems[i], ...data };
    showToast('Item updated', 'bx-check-circle');
  } else {
    invItems.push({
      id: 'inv-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
      ...data, warehouseStock: 0, shopStock: 0,
      createdAt: new Date().toISOString()
    });
    showToast('Item created', 'bx-check-circle');
  }
  saveInventoryItems();
  closeInventoryItemModal();
  renderInventory();
}

/* ============ BARCODE LOOKUP ============ */

function bindBarcodeLookupModal() {
  document.getElementById('closeBarcodeLookup').addEventListener('click', closeBarcodeLookupModal);
  document.getElementById('barcodeLookupModal').addEventListener('click', (e) => {
    if (e.target.id === 'barcodeLookupModal') closeBarcodeLookupModal();
  });
  document.getElementById('barcodeLookupSearch').addEventListener('input', renderBarcodeLookupList);
  document.getElementById('barcodeLookupList').addEventListener('click', (e) => {
    const card = e.target.closest('[data-lookup-id]');
    if (!card) return;
    const itemId = card.dataset.lookupId;
    const mode = barcodeLookupTarget;
    if (mode) {
      const item = findInvItemById(itemId);
      if (item) {
        closeBarcodeLookupModal();
        showDetectedItem(mode, item);
      }
    }
  });
}

function showBarcodeLookupModal(mode, initialQuery) {
  barcodeLookupTarget = mode;
  const searchInput = document.getElementById('barcodeLookupSearch');
  searchInput.value = initialQuery || '';
  renderBarcodeLookupList();
  document.getElementById('barcodeLookupModal').classList.add('active');
  setTimeout(() => searchInput.focus(), 200);
}

function closeBarcodeLookupModal() {
  document.getElementById('barcodeLookupModal').classList.remove('active');
  barcodeLookupTarget = null;
}

function renderBarcodeLookupList() {
  const list = document.getElementById('barcodeLookupList');
  const q = (document.getElementById('barcodeLookupSearch')?.value || '').trim().toLowerCase();
  let items = invItems.filter(i =>
    !q || i.name.toLowerCase().includes(q) || (i.barcode || '').toLowerCase().includes(q)
  );
  items = items.slice(0, 50);
  if (!items.length) {
    list.innerHTML = `<div class="inv-empty-small"><i class='bx bx-search'></i><p>${q ? 'No matching items' : 'No items'}</p></div>`;
    return;
  }
  list.innerHTML = items.map(item => `
    <div class="inv-item-card pickable" data-lookup-id="${esc(item.id)}">
      <img class="inv-item-thumb" src="${esc(item.img || 'https://via.placeholder.com/80')}" alt="">
      <div class="inv-item-info">
        <div class="inv-item-name">${esc(item.name)}</div>
        <div class="inv-item-meta">
          <span>${item.weight}g</span>
          <span>${esc(item.barcode)}</span>
          <span>WH: ${Number(item.warehouseStock) || 0}</span>
        </div>
      </div>
      <button class="inv-mini-btn primary"><i class='bx bx-check'></i></button>
    </div>
  `).join('');
}

/* ============ LABEL PRINT ============ */

function bindLabelPrintModal() {
  document.getElementById('closeLabelModal').addEventListener('click', closeLabelPrintModal);
  document.getElementById('labelCancelBtn').addEventListener('click', closeLabelPrintModal);
  document.getElementById('barcodeLabelModal').addEventListener('click', (e) => {
    if (e.target.id === 'barcodeLabelModal') closeLabelPrintModal();
  });
  document.getElementById('labelPrintBtn').addEventListener('click', printBarcodeLabels);
  document.querySelectorAll('[data-label-inc]').forEach(btn =>
    btn.addEventListener('click', () => {
      const inp = document.getElementById('labelCountInput');
      inp.value = (parseInt(inp.value) || 0) + 1;
    })
  );
  document.querySelectorAll('[data-label-dec]').forEach(btn =>
    btn.addEventListener('click', () => {
      const inp = document.getElementById('labelCountInput');
      const v = (parseInt(inp.value) || 0) - 1;
      inp.value = v < 1 ? 1 : v;
    })
  );
}

function openLabelPrintModal(itemId) {
  const item = findInvItemById(itemId);
  if (!item) { showToast('Item not found', 'bx-error-circle'); return; }
  labelPrintItem = item;
  document.getElementById('labelPrintItemName').textContent = `${item.name} · ${item.barcode}`;
  document.getElementById('labelCountInput').value = 10;
  renderLabelPreview();
  document.getElementById('barcodeLabelModal').classList.add('active');
}

function closeLabelPrintModal() {
  document.getElementById('barcodeLabelModal').classList.remove('active');
  labelPrintItem = null;
}

function renderLabelPreview() {
  const item = labelPrintItem;
  if (!item) return;
  document.getElementById('labelPreview').innerHTML = `<div class="label-preview-inner">
    <div class="label-preview-name">${esc(item.name)}</div>
    <div class="label-preview-meta">${item.weight}g · ${esc(item.category || 'candy')}</div>
    <div class="label-preview-barcode">*${esc(item.barcode)}*</div>
    <div class="label-preview-code">${esc(item.barcode)}</div>
  </div>`;
}

function printBarcodeLabels() {
  const item = labelPrintItem;
  if (!item) return;
  const count = parseInt(document.getElementById('labelCountInput').value) || 1;
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `<div class="t-label">
      <div class="t-label-name">${esc(item.name)}</div>
      <div class="t-label-meta">${item.weight}g · ${esc(item.category || 'candy')}</div>
      <div class="t-label-barcode">*${esc(item.barcode)}*</div>
      <div class="t-label-code">${esc(item.barcode)}</div>
    </div>`;
  }
  const thermal = document.getElementById('thermalReceipt');
  thermal.innerHTML = html;
  closeLabelPrintModal();
  setTimeout(() => window.print(), 250);
  showToast(`Printing ${count} labels...`, 'bx-printer');
}

/* =====================================================
   CAMERA SCANNER SYSTEM
   ===================================================== */

function bindScannerEvents() {
  document.getElementById('scannerClose').addEventListener('click', closeScanner);
  document.getElementById('scannerDone').addEventListener('click', closeScanner);
  document.getElementById('scannerBackdrop').addEventListener('click', closeScanner);
  document.getElementById('scannerToggleCam').addEventListener('click', switchCamera);
  document.getElementById('scannerTorchBtn').addEventListener('click', toggleTorch);

  const manualInput = document.getElementById('scannerManualInput');
  const manualSubmit = document.getElementById('scannerManualSubmit');
  if (manualInput) {
    manualInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); submitManualScan(); }
    });
  }
  if (manualSubmit) manualSubmit.addEventListener('click', submitManualScan);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.getElementById('scannerModal').classList.contains('active')) closeScanner();
    }
  });
}

function openScanner(mode) {
  if (!FEAT_CAMERA_SCANNER) {
    /* Fallback: use barcode lookup */
    const inp = document.getElementById(mode === 'transfer' ? 'transferBarcodeInput' : 'receiveBarcodeInput');
    if (inp) inp.focus();
    return;
  }
  scannerMode = mode;
  lastScannedBarcode = null;
  lastScanTimestamp = 0;

  document.getElementById('scannerStatus').className = 'scanner-status';
  document.getElementById('scannerStatus').innerHTML =
    `<i class='bx bx-loader-alt bx-spin'></i><span>Starting camera...</span>`;
  document.getElementById('scanResult').classList.add('hidden');
  document.getElementById('scannerManualInput').value = '';

  const subtitleMap = {
    'receive': 'Scanning for stock receive',
    'transfer': 'Scanning for stock transfer',
    'item-add': 'Scan existing barcode to register'
  };
  document.getElementById('scannerSubtitle').textContent = subtitleMap[mode] || 'Point at barcode';

  document.getElementById('scannerModal').classList.add('active');
  setTimeout(() => startScanner(), 250);
}

function closeScanner() {
  stopScanner();
  document.getElementById('scannerModal').classList.remove('active');
  scannerMode = null;
}

async function startScanner() {
  if (scannerRunning) return;

  if (typeof Html5Qrcode === 'undefined') {
    setScannerStatus('Scanner library failed to load. Check internet connection.', 'error');
    return;
  }

  try {
    try {
      scannerCameras = await Html5Qrcode.getCameras();
    } catch (camErr) {
      setScannerStatus('Camera access denied. Please enable camera permissions.', 'error');
      showScannerHelp();
      return;
    }

    if (!scannerCameras || !scannerCameras.length) {
      setScannerStatus('No cameras found on this device', 'error');
      return;
    }

    currentCameraIndex = scannerCameras.findIndex(c => /back|rear|environment/i.test(c.label));
    if (currentCameraIndex === -1) currentCameraIndex = scannerCameras.length - 1;

    html5QrCode = new Html5Qrcode("reader", { verbose: false });

    const config = {
      fps: (_POS_CFG.scanner && _POS_CFG.scanner.fps) || 12,
      qrbox: (viewfinderWidth, viewfinderHeight) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
        const size = Math.floor(minEdge * ((_POS_CFG.scanner && _POS_CFG.scanner.qrboxRatio) || 0.75));
        return { width: size, height: size };
      },
      aspectRatio: (_POS_CFG.scanner && _POS_CFG.scanner.aspectRatio) || 1.333,
      disableFlip: false,
      formatsToSupport: (typeof Html5QrcodeSupportedFormats !== 'undefined') ? [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.CODE_93,
        Html5QrcodeSupportedFormats.ITF,
        Html5QrcodeSupportedFormats.CODABAR,
        Html5QrcodeSupportedFormats.DATA_MATRIX,
        Html5QrcodeSupportedFormats.PDF_417
      ] : undefined
    };

    await html5QrCode.start(
      scannerCameras[currentCameraIndex].id,
      config,
      onScanSuccess,
      onScanError
    );

    scannerRunning = true;
    setScannerStatus('Camera ready — point at a barcode', 'ok');

    const torchBtn = document.getElementById('scannerTorchBtn');
    if (torchBtn && /Mobi|Android/i.test(navigator.userAgent)) {
      torchBtn.style.display = 'inline-flex';
    }
  } catch (err) {
    console.warn('Scanner start error:', err);
    setScannerStatus('Could not start camera. ' + (err.message || ''), 'error');
    scannerRunning = false;
  }
}

function stopScanner() {
  if (html5QrCode && scannerRunning) {
    try {
      html5QrCode.stop().then(() => {
        try { html5QrCode.clear(); } catch (e) {}
        html5QrCode = null;
        scannerRunning = false;
      }).catch(() => {
        html5QrCode = null;
        scannerRunning = false;
      });
    } catch (e) {
      html5QrCode = null;
      scannerRunning = false;
    }
  } else {
    scannerRunning = false;
  }
}

async function switchCamera() {
  if (!scannerCameras || scannerCameras.length < 2) {
    showToast('Only one camera available', 'bx-info-circle');
    return;
  }
  try {
    if (html5QrCode) {
      await html5QrCode.stop();
      try { html5QrCode.clear(); } catch (e) {}
    }
  } catch (e) {}
  html5QrCode = null;
  scannerRunning = false;

  currentCameraIndex = (currentCameraIndex + 1) % scannerCameras.length;
  setScannerStatus('Switching camera...', 'ok');
  setTimeout(() => startScanner(), 400);
}

async function toggleTorch() {
  if (!html5QrCode || !scannerRunning) return;
  try {
    const video = document.querySelector('#reader video');
    if (video && video.srcObject) {
      const track = video.srcObject.getVideoTracks()[0];
      const caps = track.getCapabilities ? track.getCapabilities() : {};
      if (caps.torch) {
        const current = track.getSettings().torch || false;
        await track.applyConstraints({ advanced: [{ torch: !current }] });
        showToast(`Torch ${!current ? 'ON' : 'OFF'}`, 'bx-bulb');
      } else {
        showToast('Torch not supported', 'bx-error-circle');
      }
    }
  } catch (err) {
    console.warn('Torch error:', err);
  }
}

function onScanSuccess(decodedText, decodedResult) {
  const now = Date.now();
  if (decodedText === lastScannedBarcode && (now - lastScanTimestamp) < SCAN_COOLDOWN_MS) {
    return;
  }
  lastScannedBarcode = decodedText;
  lastScanTimestamp = now;
  if (navigator.vibrate) navigator.vibrate(80);
  handleScanResult(decodedText);
}

function onScanError(errorMessage) {
  /* Silent — happens on every frame without a code */
}

function setScannerStatus(text, type) {
  const el = document.getElementById('scannerStatus');
  el.className = 'scanner-status' + (type === 'ok' ? ' success' : (type === 'error' ? ' error' : ''));
  let icon = 'bx bx-loader-alt bx-spin';
  if (type === 'ok') icon = 'bx bx-check-circle';
  if (type === 'error') icon = 'bx bx-error-circle';
  el.innerHTML = `<i class='${icon}'></i><span>${esc(text)}</span>`;
}

function showScannerHelp() {
  const status = document.getElementById('scannerStatus');
  status.className = 'scanner-status error';
  status.innerHTML = `<i class='bx bx-info-circle'></i><span>To use camera: allow camera access in browser settings. Or type the barcode manually below.</span>`;
}

function submitManualScan() {
  const input = document.getElementById('scannerManualInput');
  const value = (input.value || '').trim();
  if (!value) return;
  input.value = '';
  lastScannedBarcode = value;
  lastScanTimestamp = Date.now();
  handleScanResult(value);
}

function handleScanResult(barcode) {
  if (scannerMode === 'item-add') {
    const existing = findInvItemByBarcode(barcode);
    if (existing) {
      showScanResultCard({
        status: 'warn',
        title: 'Barcode already registered',
        subtitle: `${existing.name} · ${existing.weight}g`,
        barcode,
        actions: [
          {
            label: 'Use Anyway', primary: true,
            onClick: () => {
              document.getElementById('invItemBarcode').value = barcode;
              closeScanner();
              showToast('Barcode filled', 'bx-check');
            }
          },
          { label: 'Cancel', onClick: closeScanner }
        ]
      });
      setScannerStatus('Already registered', 'error');
    } else {
      showScanResultCard({
        status: 'success',
        title: 'New barcode detected',
        subtitle: 'Ready to register as new item',
        barcode,
        actions: [
          {
            label: 'Use This Barcode', primary: true,
            onClick: () => {
              document.getElementById('invItemBarcode').value = barcode;
              closeScanner();
              showToast('Barcode filled — complete details', 'bx-check-circle');
            }
          },
          {
            label: 'Scan Again',
            onClick: () => {
              lastScannedBarcode = null;
              document.getElementById('scanResult').classList.add('hidden');
            }
          }
        ]
      });
      setScannerStatus('Scanned successfully', 'ok');
    }
    return;
  }

  const item = findInvItemByBarcode(barcode);

  if (!item) {
    showScanResultCard({
      status: 'error',
      title: 'Barcode not registered',
      subtitle: 'This barcode is not in the system',
      barcode,
      actions: [
        {
          label: 'Register as New', primary: true,
          onClick: () => {
            closeScanner();
            navigateTo('inventory');
            switchInventoryTab('items');
            setTimeout(() => {
              openInventoryItemModal();
              document.getElementById('invItemBarcode').value = barcode;
              showToast('Complete the item details', 'bx-edit');
            }, 300);
          }
        },
        {
          label: 'Scan Again',
          onClick: () => {
            lastScannedBarcode = null;
            document.getElementById('scanResult').classList.add('hidden');
          }
        }
      ]
    });
    setScannerStatus('Not found in system', 'error');
    return;
  }

  if (scannerMode === 'transfer') {
    const whStock = Number(item.warehouseStock) || 0;
    if (whStock <= 0) {
      showScanResultCard({
        status: 'error',
        title: 'No stock in warehouse',
        subtitle: `${item.name} — WH: 0`,
        barcode,
        actions: [
          {
            label: 'Scan Another', primary: true,
            onClick: () => {
              lastScannedBarcode = null;
              document.getElementById('scanResult').classList.add('hidden');
            }
          }
        ]
      });
      setScannerStatus('No warehouse stock', 'error');
      return;
    }
  }

  const stock = scannerMode === 'transfer'
    ? `Warehouse: ${item.warehouseStock} bags`
    : `In stock: ${item.warehouseStock} bags`;

  showScanResultCard({
    status: 'success',
    title: item.name,
    subtitle: `${item.weight}g/bag · ${stock}`,
    barcode: item.barcode,
    actions: [
      {
        label: 'Add to Queue', primary: true,
        onClick: () => {
          addToBatch(scannerMode, item.id, 1);
          lastScannedBarcode = null;
          document.getElementById('scanResult').classList.add('hidden');
          setScannerStatus('Added! Scan next item', 'ok');
        }
      },
      {
        label: 'Scan Next',
        onClick: () => {
          lastScannedBarcode = null;
          document.getElementById('scanResult').classList.add('hidden');
          setScannerStatus('Camera ready', 'ok');
        }
      }
    ]
  });
  setScannerStatus('Detected: ' + item.name, 'ok');
}

function showScanResultCard({ status, title, subtitle, barcode, actions }) {
  const el = document.getElementById('scanResult');
  el.innerHTML = `
    <div class="scan-result-icon ${status === 'error' ? 'error' : (status === 'warn' ? 'warn' : '')}">
      <i class='bx ${status === 'error' ? 'bx-x' : (status === 'warn' ? 'bx-error' : 'bx-check')}'></i>
    </div>
    <div class="scan-result-info">
      <strong>${esc(title)}</strong>
      <span>${esc(subtitle)}</span>
      <div style="font-family:'Courier New',monospace;font-size:.7rem;opacity:.7;margin-top:4px;word-break:break-all;">${esc(barcode)}</div>
      <div class="scan-result-actions" id="scanResultActions"></div>
    </div>
  `;
  el.classList.remove('hidden');

  const actionsContainer = document.getElementById('scanResultActions');
  actionsContainer.innerHTML = actions.map((a, i) =>
    `<button type="button" class="scan-result-btn ${a.primary ? 'primary' : 'ghost'}" data-scan-action="${i}">${esc(a.label)}</button>`
  ).join('');

  actionsContainer.querySelectorAll('[data-scan-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.scanAction);
      if (actions[idx] && actions[idx].onClick) actions[idx].onClick();
    });
  });
}

/* =====================================================
   FULLSCREEN MANAGER
   ===================================================== */
const FULLSCREEN_DELAY = (_POS_CFG.fullscreenDelayMs) || 8000;
const FS_PROMPT_SKIPPED_KEY = 'hatcandy-fs-skipped';

let fsAutoTimer = null;
let fsExitHintTimer = null;
let fsHasInteracted = false;
let fsWasAlreadyAsked = false;

function getFullscreenElement() {
  return document.fullscreenElement
    || document.webkitFullscreenElement
    || document.mozFullScreenElement
    || document.msFullscreenElement
    || null;
}

function isFullscreenActive() { return !!getFullscreenElement(); }

function isFullscreenSupported() {
  const el = document.documentElement;
  return !!(el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen);
}

async function requestFullscreen() {
  const el = document.documentElement;
  try {
    if (el.requestFullscreen) await el.requestFullscreen({ navigationUI: 'hide' });
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
    else return false;
    return true;
  } catch (err) {
    console.warn('[FS] Request failed:', err);
    return false;
  }
}

async function exitFullscreen() {
  try {
    if (document.exitFullscreen) await document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    return true;
  } catch (err) {
    console.warn('[FS] Exit failed:', err);
    return false;
  }
}

async function toggleFullscreen() {
  if (isFullscreenActive()) await exitFullscreen();
  else await requestFullscreen();
}

function updateFullscreenUI() {
  const btn = document.getElementById('btnFullscreen');
  const icon = document.getElementById('fullscreenIcon');
  const label = document.getElementById('fullscreenLabel');
  if (!btn || !icon) return;
  if (isFullscreenActive()) {
    btn.classList.add('active');
    icon.className = 'bx bx-exit-fullscreen';
    if (label) label.textContent = 'Exit';
    btn.title = 'Exit Fullscreen (Esc)';
  } else {
    btn.classList.remove('active');
    icon.className = 'bx bx-expand';
    if (label) label.textContent = 'Fullscreen';
    btn.title = 'Enter Fullscreen (F11)';
  }
}

function showExitHint() {
  const hint = document.getElementById('fullscreenExitHint');
  if (!hint) return;
  hint.classList.add('show');
  clearTimeout(fsExitHintTimer);
  fsExitHintTimer = setTimeout(() => hint.classList.remove('show'), 4500);
}

function showFullscreenPrompt() {
  try {
    if (sessionStorage.getItem(FS_PROMPT_SKIPPED_KEY) === '1') return;
  } catch (e) {}
  const prompt = document.getElementById('fullscreenPrompt');
  if (!prompt) return;
  prompt.classList.add('show');
}

function hideFullscreenPrompt() {
  const prompt = document.getElementById('fullscreenPrompt');
  if (!prompt) return;
  prompt.classList.remove('show');
}

async function tryAutoFullscreen() {
  if (fsWasAlreadyAsked) return;
  fsWasAlreadyAsked = true;
  if (isFullscreenActive()) return;
  if (!isFullscreenSupported()) { showFullscreenPrompt(); return; }
  const ok = await requestFullscreen();
  if (!ok) showFullscreenPrompt();
  else showExitHint();
}

function markInteraction() {
  if (fsHasInteracted) return;
  fsHasInteracted = true;
}
['click', 'touchstart', 'keydown', 'mousemove', 'scroll'].forEach(evt => {
  document.addEventListener(evt, markInteraction, { once: true, passive: true });
});

function bindFullscreenEvents() {
  const btn = document.getElementById('btnFullscreen');
  if (btn) {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await toggleFullscreen();
    });
  }
  document.addEventListener('keydown', async (e) => {
    if (e.key === 'F11') {
      e.preventDefault();
      await toggleFullscreen();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'F' || e.key === 'f')) {
      e.preventDefault();
      await toggleFullscreen();
    }
  });

  const enterBtn = document.getElementById('fsPromptEnter');
  const skipBtn = document.getElementById('fsPromptSkip');
  if (enterBtn) {
    enterBtn.addEventListener('click', async () => {
      hideFullscreenPrompt();
      const ok = await requestFullscreen();
      if (ok) showExitHint();
      else showToast('Tap the Fullscreen button in top bar', 'bx-info-circle');
    });
  }
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      try { sessionStorage.setItem(FS_PROMPT_SKIPPED_KEY, '1'); } catch (e) {}
      hideFullscreenPrompt();
    });
  }

  ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
    document.addEventListener(evt, () => {
      updateFullscreenUI();
      if (isFullscreenActive()) showExitHint();
    });
  });
}

function startFullscreenTimer() {
  clearTimeout(fsAutoTimer);
  fsAutoTimer = setTimeout(() => tryAutoFullscreen(), FULLSCREEN_DELAY);
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') updateFullscreenUI();
});

/* ============ AUTO REFRESH ============ */
setInterval(() => {
  const homeView = document.getElementById('view-home');
  if (homeView && homeView.classList.contains('active')) {
    renderRecentOrders();
  }
}, 10000);

/* ============ END ============ */
console.log('%c🍬 Hat Candy POS Ready (with HAT_CONFIG integration + Feature Flags)', 'color:#e2015d;font-weight:bold;font-size:14px;');