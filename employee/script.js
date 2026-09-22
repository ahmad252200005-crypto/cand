/* =====================================================
   HAT CANDY — EMPLOYEE POS SYSTEM (Complete)
   ===================================================== */

// ============ STORAGE KEYS ============
const LS_KEYS = {
    products:        'hatcandy-products',
    employees:       'hatcandy-employees',
    employeeOrders:  'hatcandy-employee-orders',
    employeeShifts:  'hatcandy-employee-shifts',
    onlineOrders:    'hatcandy-online-orders',
    posSettings:     'hatcandy-pos-settings',
    editLog:         'hatcandy-invoice-edits',
    editUnlocks:     'hatcandy-edit-unlocks',
    inventoryItems:  'hatcandy-inventory-items',
    inventoryMoves:  'hatcandy-inventory-movements'
};

// ============ CONFIG ============
const ADMIN_OVERRIDE_PIN = '1234';
const EDIT_WINDOW_MS = 10 * 60 * 1000;
const TAX_RATE = 0.10;
const STORE_INFO = {
    name: 'HAT CANDY',
    slogan: 'Every Candy Begins with Magic',
    address: 'Amman, Jordan — Magic Avenue',
    phone: '+962 7 9876 5432'
};
const STATUS_FLOW = ['processing', 'packing', 'shipped', 'out_for_delivery', 'delivered'];

// Barcode prefix → category code mapping
const CATEGORY_CODES = {
    candy:       '100',
    chocolate:   '200',
    gummy:       '300',
    lollipop:    '400',
    marshmallow: '500',
    other:       '900'
};

// ============ DEFAULTS ============
const DEFAULT_PRODUCTS = [
    { id: 'gummies',   name: 'Gourmet Gummies',     price: 8.99,  img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300', stock: 140 },
    { id: 'truffles',  name: 'Velvet Truffles',     price: 14.99, img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=300', stock: 62 },
    { id: 'lollipops', name: 'Honey Swirl Pops',    price: 6.99,  img: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=300', stock: 18 },
    { id: 'cloud',     name: 'Cloud Candy',         price: 7.99,  img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=300', stock: 95 },
    { id: 'sours',     name: 'Zesty Sours',         price: 8.49,  img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300', stock: 8 },
    { id: 'caramel',   name: 'Golden Caramel Corn', price: 9.99,  img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=300', stock: 34 }
];

const OFFERS = [
    { id: 'offer-love-box',     name: 'Love Box Special',   price: 24.99, oldPrice: 38.99, img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=300', discount: '35% OFF' },
    { id: 'offer-family-pack',  name: 'Family Magic Pack',  price: 44.99, oldPrice: 74.99, img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300', discount: '40% OFF' },
    { id: 'offer-truffle-trio', name: 'Truffle Lover Trio', price: 32.99, oldPrice: 43.99, img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=300', discount: '25% OFF' }
];

const BOX_TYPES = [
    { id: 'bag',   name: 'Signature Kraft Bag', price: 0.00, icon: 'bx-shopping-bag' },
    { id: 'round', name: 'Round Bucket',        price: 2.50, icon: 'bx-cylinder' },
    { id: 'rect',  name: 'Rectangular Box',     price: 3.00, icon: 'bx-rectangle' }
];

// ============ STATE ============
let PRODUCTS = [];
let currentOrder = { items: [], customer: { name: '', phone: '' } };
let currentBox = null;
let selectedProductForGram = null;
let currentEmployee = null;
let currentShiftId = null;
let onlineOrders = [];
let manualOrders = [];
let onlineFilter = 'all';
let manualFilter = 'all';
let activeDeliveryTab = 'online';
let currentOrderType = 'in-store';
let autoPrint = true;
let lastReceiptData = null;

// Manual order draft
let manualDraft = {
    items: [],           // { kind: 'item'|'offer'|'box', data: {...}, qty }
    deliveryMethod: 'delivery',
    paymentMethod: 'cash'
};

// Box builder state (for pick box modal)
let boxBuilderState = {
    boxType: null,
    items: []
};

// Edit state
let editingOrder = null;
let editingOrderOriginal = null;
let editingDraft = null;
let editingIsUnlocked = false;
let editTimerInterval = null;

// Inventory state
let invItems = [];
let invMovements = [];
let invReceiveBatch = [];
let invTransferBatch = [];
let invCurrentTab = 'receive';
let invHistoryFilter = 'all';
let invEditingItemId = null;
let barcodeLookupTarget = null;
let labelPrintItem = null;

// ============ DOM ============
const loginScreen = document.getElementById('loginScreen');
const posApp = document.getElementById('posApp');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

// ============ HELPERS ============
function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, m =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m])
    );
}
function fmtMoney(n) { return '$' + (Number(n) || 0).toFixed(2); }
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
    return { phone: '📞', whatsapp: '💬', instagram: '📷', facebook: '👍', 'walk-in': '🏬', other: '✨', 'pos-delivery': '🏪' }[s] || '📦';
}
function sourceLabel(s) {
    return { phone: 'Phone Call', whatsapp: 'WhatsApp', instagram: 'Instagram', facebook: 'Facebook', 'walk-in': 'Walk-in', other: 'Other', 'pos-delivery': 'POS Delivery' }[s] || 'Other';
}
function showToast(msg, icon = 'bx-check-circle') {
    let toast = document.getElementById('posToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'posToast';
        toast.style.cssText = `
            position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(120px);
            background:#9f0b3b;color:#fff;padding:14px 22px;border-radius:50px;
            box-shadow:0 10px 30px rgba(159,11,59,.35);z-index:9999;
            display:flex;align-items:center;gap:10px;font-family:'Montserrat',sans-serif;
            font-size:.88rem;font-weight:500;transition:transform .4s cubic-bezier(.4,0,.2,1);
            max-width:90%;`;
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class='bx ${icon}' style="color:#facc43;font-size:1.3rem;"></i><span>${esc(msg)}</span>`;
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(120px)';
    }, 2400);
}

// ============ LOADERS ============
function loadEmployeesFromAdmin() {
    try {
        const raw = localStorage.getItem(LS_KEYS.employees);
        if (raw) { const arr = JSON.parse(raw); if (Array.isArray(arr)) return arr; }
    } catch (e) {}
    return [];
}
function loadProductsFromAdmin() {
    try {
        const raw = localStorage.getItem(LS_KEYS.products);
        if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length) {
                PRODUCTS = arr.map(p => ({
                    id: p.id, name: p.name,
                    price: Number(p.price) || 0,
                    img: p.img || '',
                    stock: Number(p.stock) || 0
                }));
                return;
            }
        }
    } catch (e) {}
    PRODUCTS = DEFAULT_PRODUCTS.map(p => ({ ...p }));
}
function loadOnlineOrders() {
    try {
        const raw = localStorage.getItem(LS_KEYS.onlineOrders);
        const arr = raw ? JSON.parse(raw) : [];
        onlineOrders = Array.isArray(arr) ? arr : [];
    } catch (e) { onlineOrders = []; }
}
function saveOnlineOrders() {
    try { localStorage.setItem(LS_KEYS.onlineOrders, JSON.stringify(onlineOrders)); } catch (e) {}
}
function loadEmployeeOrders() {
    try {
        const raw = localStorage.getItem(LS_KEYS.employeeOrders);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
}
function saveEmployeeOrders(list) {
    try { localStorage.setItem(LS_KEYS.employeeOrders, JSON.stringify(list)); } catch (e) {}
}
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
    try {
        const trimmed = invMovements.slice(0, 1000);
        localStorage.setItem(LS_KEYS.inventoryMoves, JSON.stringify(trimmed));
    } catch (e) {}
}

// ============ BARCODE GENERATION ============
// Format: HC + CategoryCode(3) + Weight(4) + Seq(5) + Check(1) = 14 characters
// Example: HC100050000013
function generateBarcode(category, weight, sequence) {
    const catCode = CATEGORY_CODES[category] || '900';
    const wStr = String(Math.min(9999, Math.max(0, parseInt(weight) || 0))).padStart(4, '0');
    let seq = sequence;
    if (seq === undefined || seq === null) {
        // Auto-increment based on existing items
        const existing = invItems
            .map(i => {
                const match = (i.barcode || '').match(/HC\d{3}\d{4}(\d{5})/);
                return match ? parseInt(match[1]) : 0;
            });
        const maxSeq = existing.length ? Math.max(...existing) : 0;
        seq = maxSeq + 1;
    }
    const seqStr = String(seq).padStart(5, '0');
    // Simple checksum: sum of digits mod 10
    const base = `${catCode}${wStr}${seqStr}`;
    const sum = base.split('').reduce((s, d) => s + parseInt(d), 0);
    const check = String(sum % 10);
    return `HC${base}${check}`;
}

// Parse barcode info
function parseBarcode(barcode) {
    if (!barcode || barcode.length < 14) return null;
    const m = barcode.match(/^HC(\d{3})(\d{4})(\d{5})(\d)$/);
    if (!m) return null;
    return {
        categoryCode: m[1],
        weight: parseInt(m[2]),
        sequence: parseInt(m[3]),
        check: m[4]
    };
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
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

    // Bind all
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
    bindInventoryEvents();
    bindInventoryItemModal();
    bindBarcodeLookupModal();
    bindLabelPrintModal();

    refreshDeliveryBadge();
    updateInventoryBadge();
});

window.addEventListener('beforeunload', () => {
    if (currentEmployee && currentShiftId) recordShiftEnd(currentEmployee.username);
});

// ============ LOGIN ============
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
        currentEmployee = null; currentShiftId = null;
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
}

// ============ SHIFTS ============
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

// ============ NAVIGATION ============
window.navigateTo = function(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById('view-' + viewId);
    if (target) target.classList.add('active');

    if (viewId !== 'products') {
        document.getElementById('floatingBoxSummary').classList.remove('active');
    }
    if (viewId === 'offers') renderOffers();
    if (viewId === 'box-types') renderBoxTypes();
    if (viewId === 'products') { renderProducts(); updateCurrentBoxStats(); }
    if (viewId === 'checkout') renderCheckout();
    if (viewId === 'delivery') renderDeliveryCenter();
    if (viewId === 'home') renderRecentOrders();
    if (viewId === 'inventory') renderInventory();
};

window.openDeliveryView = function() {
    loadOnlineOrders();
    loadManualOrders();
    navigateTo('delivery');
    renderDeliveryCenter();
};

window.openInventoryView = function() {
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

// ============ RENDERERS ============
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

// ============ OFFERS + BOXES (MAIN POS) ============
window.addOfferToOrder = function(offerId) {
    const offer = OFFERS.find(o => o.id === offerId);
    if (!offer) { showToast('Offer not found', 'bx-error-circle'); return; }
    currentOrder.items.push({ type: 'offer', data: offer });
    showToast(`${offer.name} added to order`, 'bx-cart-add');
    const card = document.querySelector(`[data-offer-id="${offerId}"]`);
    if (card) {
        card.style.transform = 'scale(.96)';
        card.style.borderColor = '#22c55e';
        setTimeout(() => { card.style.transform = ''; card.style.borderColor = ''; }, 350);
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
    updateCheckoutFeeDisplay();
    showToast('Item removed', 'bx-trash');
};

// ============ GRAM MODAL ============
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
        if (val > 50) { input.value = val - 50; updateGramPrice(); document.querySelectorAll('.gram-presets button').forEach(b => b.classList.remove('active')); }
    });
    document.getElementById('gramPlus').addEventListener('click', () => {
        const input = document.getElementById('gramInput');
        let val = parseInt(input.value) || 50;
        input.value = val + 50; updateGramPrice();
        document.querySelectorAll('.gram-presets button').forEach(b => b.classList.remove('active'));
    });
    document.getElementById('gramInput').addEventListener('input', () => {
        updateGramPrice();
        document.querySelectorAll('.gram-presets button').forEach(b => b.classList.remove('active'));
    });
    document.getElementById('closeGramModal').addEventListener('click', closeGramModal);
    document.getElementById('cancelGram').addEventListener('click', closeGramModal);
    document.getElementById('confirmGram').addEventListener('click', () => {
        if (!selectedProductForGram || !currentBox) { showToast('Please start a box first', 'bx-error-circle'); return; }
        const grams = parseInt(document.getElementById('gramInput').value);
        if (!grams || grams < 50) { alert('Minimum weight is 50g'); return; }
        const price = (selectedProductForGram.price / 100) * grams;
        const existing = currentBox.items.find(i => i.id === selectedProductForGram.id && i.grams === grams);
        if (existing) existing.qty += 1;
        else currentBox.items.push({ id: selectedProductForGram.id, name: selectedProductForGram.name, grams: grams, price: price, qty: 1, img: selectedProductForGram.img });
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
    if (!currentBox) { showToast('Please select a box type first', 'bx-info-circle'); navigateTo('box-types'); return; }
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

// ============ FINISH BOX ============
function bindFinishBox() {
    document.getElementById('btnFinishBox').addEventListener('click', () => {
        if (!currentBox || currentBox.items.length === 0) { showToast('Please add at least one item to the box', 'bx-error-circle'); return; }
        currentOrder.items.push({ type: 'box', data: JSON.parse(JSON.stringify(currentBox)) });
        showToast('Box finished — added to order', 'bx-check-circle');
        currentBox = null;
        updateCurrentBoxStats();
        renderCheckout();
        setTimeout(() => navigateTo('checkout'), 200);
    });
}
function bindBackToBoxes() {
    document.getElementById('btnBackToBoxes').addEventListener('click', () => {
        if (currentBox && currentBox.items.length > 0) {
            if (confirm('Are you sure? Items in this box will be lost.')) { currentBox = null; updateCurrentBoxStats(); navigateTo('box-types'); }
        } else { currentBox = null; updateCurrentBoxStats(); navigateTo('box-types'); }
    });
}
function updateFloatingBoxSummary() {
    const summary = document.getElementById('floatingBoxSummary');
    if (!currentBox || currentBox.items.length === 0) { summary.classList.remove('active'); return; }
    let itemCount = 0;
    let total = currentBox.type.price;
    currentBox.items.forEach(item => { itemCount += item.qty; total += (item.price * item.qty); });
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

// ============ CHECKOUT (MAIN) ============
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
function renderCheckout() {
    const list = document.getElementById('orderItemsList');
    let subtotal = 0;
    if (currentOrder.items.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:40px 20px; color:#8a7a85;">
            <i class='bx bx-cart' style="font-size:3rem; opacity:.3; display:block; margin-bottom:10px;"></i>
            <p style="font-weight:600; margin-bottom:4px;">No items in order yet.</p>
            <p style="font-size:.85rem;">Use the buttons above to add a box or offer.</p>
        </div>`;
    } else {
        list.innerHTML = currentOrder.items.map((item, index) => {
            if (item.type === 'offer') {
                const o = item.data;
                subtotal += o.price;
                return `<div class="order-item">
                    <div class="order-item-info"><h4>${esc(o.name)}</h4><span>Offer Deal · ${esc(o.discount)}</span></div>
                    <div class="order-item-right">
                        <div class="order-item-price">${fmtMoney(o.price)}</div>
                        <button class="remove-item-btn" onclick="removeOrderItem(${index})"><i class='bx bx-trash'></i></button>
                    </div>
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
                        <div class="order-item-right">
                            <div class="order-item-price">${fmtMoney(boxTotal)}</div>
                            <button class="remove-item-btn" onclick="removeOrderItem(${index})"><i class='bx bx-trash'></i></button>
                        </div>
                    </div>
                    <div class="box-items-detail">${itemsHtml}</div>
                </div>`;
            }
        }).join('');
    }
    const fee = currentOrderType === 'delivery' ? (parseFloat(document.getElementById('deliveryFee')?.value) || 0) : 0;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + fee + tax;
    document.getElementById('checkoutSubtotal').textContent = fmtMoney(subtotal);
    document.getElementById('checkoutDeliveryFee').textContent = fmtMoney(fee);
    document.getElementById('checkoutTax').textContent = fmtMoney(tax);
    document.getElementById('checkoutTotal').textContent = fmtMoney(total);
    document.getElementById('checkoutFeeRow').style.display = fee > 0 ? 'flex' : 'none';
}
function updateCheckoutFeeDisplay() {
    const feeRow = document.getElementById('checkoutFeeRow');
    if (currentOrderType === 'delivery') {
        const fee = parseFloat(document.getElementById('deliveryFee').value) || 0;
        document.getElementById('checkoutDeliveryFee').textContent = fmtMoney(fee);
        feeRow.style.display = fee > 0 ? 'flex' : 'none';
        const subtotal = getOrderSubtotal();
        const tax = subtotal * TAX_RATE;
        const total = subtotal + fee + tax;
        document.getElementById('checkoutSubtotal').textContent = fmtMoney(subtotal);
        document.getElementById('checkoutTax').textContent = fmtMoney(tax);
        document.getElementById('checkoutTotal').textContent = fmtMoney(total);
    } else { feeRow.style.display = 'none'; }
}
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
    if (feeInput) feeInput.addEventListener('input', updateCheckoutFeeDisplay);
    applyOrderTypeUI();
}
function applyOrderTypeUI() {
    const isDelivery = currentOrderType === 'delivery';
    document.getElementById('deliveryDetailsSection').style.display = isDelivery ? 'block' : 'none';
    document.getElementById('paymentSection').style.display = isDelivery ? 'none' : 'block';
    updateCheckoutFeeDisplay();
    const btn = document.getElementById('btnCheckout');
    if (btn) btn.innerHTML = isDelivery ? `Create Delivery Order <i class='bx bx-cycling'></i>` : `Complete Order <i class='bx bx-check-shield'></i>`;
}
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
                itemsList.push({ name: i.name, qty: i.qty, price: i.price, productId: i.id, grams: i.grams, isBoxItem: true, boxName: b.type.name, kind: 'box' });
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
        customerInfo: customerName !== 'Walk-in Customer' ? { name: customerName, phone: customerPhone, email: '' } : null,
        address: 'In-store',
        shiftId: currentShiftId,
        placedAt: now.toISOString()
    };
    const empOrders = loadEmployeeOrders();
    empOrders.push(orderObject);
    saveEmployeeOrders(empOrders);
    deductStockFromAdmin(itemsList);

    buildReceiptView({ receiptId, date: now, customer: customerName, customerPhone, employee: currentEmployee.name, paymentLabel: paymentMethod.toUpperCase(), items: currentOrder.items, subtotal, fee: 0, tax, total, isDelivery: false });
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
                itemsList.push({ name: i.name, qty: i.qty, price: i.price, productId: i.id, grams: i.grams, isBoxItem: true, boxName: b.type.name, kind: 'box' });
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
        date: today, status: 'processing',
        payment: 'pending',
        itemsList, subtotal, tax, deliveryFee: fee, total,
        customerId: 'c-del-' + Date.now(),
        customerInfo: { name: customerName, phone: customerPhone, email: '' },
        address, notes, source,
        deliveryMethod: 'delivery',
        shiftId: currentShiftId,
        placedAt: now.toISOString()
    };

    const empOrders = loadEmployeeOrders();
    empOrders.push(orderObject);
    saveEmployeeOrders(empOrders);
    deductStockFromAdmin(itemsList);
    loadManualOrders();
    refreshDeliveryBadge();

    buildReceiptView({ receiptId: orderId, date: now, customer: customerName, customerPhone, employee: currentEmployee.name, paymentLabel: 'ON DELIVERY', items: currentOrder.items, subtotal, fee, tax, total, isDelivery: true, address });
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
    document.querySelectorAll('.order-type-btn').forEach(b => b.classList.toggle('active', b.dataset.ordertype === 'in-store'));
    document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('active'));
    const cashBtn = document.querySelector('.pay-method[data-method="cash"]');
    if (cashBtn) cashBtn.classList.add('active');
    applyOrderTypeUI();
}

// ============ RECEIPT BUILDER ============
function buildReceiptView(data) {
    lastReceiptData = data;
    document.getElementById('printableReceipt').innerHTML = buildReceiptHTML(data, false);
    document.getElementById('thermalReceipt').innerHTML = buildReceiptHTML(data, true);
}
function buildReceiptHTML(data, isThermal) {
    const wrapRow = (label, value) => isThermal
        ? `<div class="t-row"><span class="label">${label}</span><span class="value">${value}</span></div>`
        : `<div class="receipt-row"><span>${label}</span><span>${value}</span></div>`;
    const divider = isThermal ? `<hr class="t-divider">` : `<hr class="receipt-divider">`;
    const dividerDouble = isThermal ? `<hr class="t-divider-double">` : `<hr class="receipt-divider double">`;
    let html = `<div class="${isThermal ? 't-center' : 'receipt-header'}">
        <div class="${isThermal ? 't-brand' : 'brand-line'}">${STORE_INFO.name}</div>
        <div class="${isThermal ? 't-slogan' : 'slogan'}">${STORE_INFO.slogan}</div>
        <div class="${isThermal ? 't-address' : 'address'}">${STORE_INFO.address}</div>
        <div class="${isThermal ? 't-address' : 'address'}">${STORE_INFO.phone}</div>
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
        <p class="magic-line">✨ ${STORE_INFO.slogan} ✨</p>
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

// ============ STOCK DEDUCTION ============
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
                const stockUnits = gramsTotal / 100;
                p.stock = Math.max(0, (Number(p.stock) || 0) - stockUnits);
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
        origItems.forEach(i => { if (!i.productId) return; const g = (i.grams || 100) * i.qty; origMap[i.productId] = (origMap[i.productId] || 0) + g; });
        newItems.forEach(i => { if (!i.productId) return; const g = (i.grams || 100) * i.qty; newMap[i.productId] = (newMap[i.productId] || 0) + g; });
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

// ============ DELIVERY CENTER ============
function refreshDeliveryBadge() {
    loadOnlineOrders();
    loadManualOrders();
    const activeOnline = onlineOrders.filter(o => ['processing', 'packing', 'shipped', 'out_for_delivery'].includes(o.status)).length;
    const activeManual = manualOrders.filter(o => ['processing', 'packing', 'shipped', 'out_for_delivery'].includes(o.status)).length;
    const total = activeOnline + activeManual;
    const badge = document.getElementById('deliveryBadge');
    if (badge) { badge.textContent = total; badge.classList.toggle('hidden', total === 0); }
    const oc = document.getElementById('onlineOrdersCount');
    const mc = document.getElementById('manualOrdersCount');
    if (oc) oc.textContent = onlineOrders.length;
    if (mc) mc.textContent = manualOrders.length;
}
function bindDeliveryCenter() {
    document.querySelectorAll('.delivery-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.delivery-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeDeliveryTab = tab.dataset.dtab;
            document.querySelectorAll('.delivery-pane').forEach(p => p.classList.toggle('active', p.dataset.dpane === activeDeliveryTab));
        });
    });
    document.getElementById('onlineFilters').addEventListener('click', (e) => {
        const btn = e.target.closest('.dfilter');
        if (!btn) return;
        onlineFilter = btn.dataset.ofilter;
        document.querySelectorAll('#onlineFilters .dfilter').forEach(b => b.classList.toggle('active', b.dataset.ofilter === onlineFilter));
        renderOnlineOrders();
    });
    document.getElementById('manualFilters').addEventListener('click', (e) => {
        const btn = e.target.closest('.mfilter');
        if (!btn) return;
        manualFilter = btn.dataset.mfilter;
        document.querySelectorAll('#manualFilters .mfilter').forEach(b => b.classList.toggle('active', b.dataset.mfilter === manualFilter));
        renderManualOrders();
    });
    document.getElementById('btnRefreshDelivery').addEventListener('click', (e) => {
        const btn = e.currentTarget;
        btn.style.transform = 'rotate(180deg)';
        loadOnlineOrders();
        loadManualOrders();
        renderDeliveryCenter();
        refreshDeliveryBadge();
        showToast('Delivery data refreshed', 'bx-refresh');
        setTimeout(() => btn.style.transform = '', 500);
    });
    document.getElementById('btnNewManualOrder').addEventListener('click', () => openManualOrderModal());
    document.getElementById('view-delivery').addEventListener('click', (e) => {
        const adv = e.target.closest('[data-del-advance]');
        if (adv) { advanceOrderStatus(adv.dataset.delAdvance); return; }
        const can = e.target.closest('[data-del-cancel]');
        if (can) { if (confirm('Cancel this order?')) cancelOrder(can.dataset.delCancel); return; }
        const vw = e.target.closest('[data-del-view]');
        if (vw) { openOrderDetails(vw.dataset.delView); return; }
        const del = e.target.closest('[data-order-delete]');
        if (del) { if (confirm('Delete this order permanently?')) deleteOrderPermanent(del.dataset.orderDelete); return; }
        const ed = e.target.closest('[data-order-edit]');
        if (ed) { openEditInvoiceModal(ed.dataset.orderEdit); return; }
    });
}
function renderDeliveryCenter() { renderOnlineOrders(); renderManualOrders(); refreshDeliveryBadge(); }
function renderOnlineOrders() {
    const list = document.getElementById('onlineOrdersList');
    if (!list) return;
    let filtered = onlineOrders;
    if (onlineFilter !== 'all') filtered = onlineOrders.filter(o => o.status === onlineFilter);
    filtered = [...filtered].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    if (!filtered.length) {
        list.innerHTML = `<div class="delivery-empty"><i class='bx bx-inbox'></i><h3>No online orders${onlineFilter !== 'all' ? ' in this status' : ''}</h3><p>${onlineFilter !== 'all' ? 'Try a different filter.' : 'Orders from the website will appear here.'}</p></div>`;
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
    const itemsHtml = items.map(i => `<div class="order-items-preview-line"><span>${esc(i.name)} × ${i.qty}</span><span>${fmtMoney((i.price || 0) * (i.qty || 0))}</span></div>`).join('') + (more > 0 ? `<div class="order-items-preview-line" style="opacity:.6;"><span>+${more} more</span><span>—</span></div>` : '');
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
            ${itemsHtml || '<div style="opacity:.6;font-size:.8rem;">No items</div>'}
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
            <button class="order-action-btn-del danger" data-order-delete="${esc(o.id)}" title="Delete permanently"><i class='bx bx-trash'></i></button>
        </div>
    </div>`;
}

// Status advancement for manual/online orders
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
    let empOrders = loadEmployeeOrders();
    empOrders = empOrders.filter(o => o.id !== orderId);
    saveEmployeeOrders(empOrders);
    let onlineCopy = loadOnlineOrders ? [] : [];
    try {
        const raw = localStorage.getItem(LS_KEYS.onlineOrders);
        const arr = raw ? JSON.parse(raw) : [];
        const filtered = arr.filter(o => o.id !== orderId);
        localStorage.setItem(LS_KEYS.onlineOrders, JSON.stringify(filtered));
    } catch (e) {}
    loadManualOrders();
    loadOnlineOrders();
    renderDeliveryCenter();
    renderRecentOrders();
    refreshDeliveryBadge();
    showToast(`Order ${orderId} deleted`, 'bx-trash');
}

// ============ MANUAL ORDER MODAL (with 3 add buttons) ============
function openManualOrderModal(editId) {
    manualDraft = { items: [], deliveryMethod: 'delivery', paymentMethod: 'cash' };
    document.getElementById('manualCustomerName').value = '';
    document.getElementById('manualCustomerPhone').value = '';
    document.getElementById('manualOrderSource').value = 'phone';
    document.getElementById('manualAddress').value = '';
    document.getElementById('manualDeliveryFee').value = '2.00';
    document.getElementById('manualNotes').value = '';
    document.getElementById('manualModalTitle').textContent = 'New Manual Order';
    document.querySelectorAll('.manual-del-btn').forEach(b => b.classList.toggle('active', b.dataset.dmethod === 'delivery'));
    document.querySelectorAll('.manual-pay-btn').forEach(b => b.classList.toggle('active', b.dataset.method === 'cash'));
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
                if (i.isOffer) return { kind: 'offer', data: { name: i.name, price: i.price, qty: i.qty, img: '' }, qty: i.qty || 1 };
                if (i.isBoxItem) return { kind: 'item', data: { id: i.productId, name: i.name, price: i.price, grams: i.grams || 100, img: (PRODUCTS.find(p => p.id === i.productId) || {}).img || '' }, qty: i.qty || 1 };
                return { kind: 'item', data: { id: i.productId, name: i.name, price: i.price, grams: i.grams || 100, img: (PRODUCTS.find(p => p.id === i.productId) || {}).img || '' }, qty: i.qty || 1 };
            });
            manualDraft.deliveryMethod = o.deliveryMethod || 'delivery';
            manualDraft.paymentMethod = o.payment || 'cash';
            document.querySelectorAll('.manual-del-btn').forEach(b => b.classList.toggle('active', b.dataset.dmethod === manualDraft.deliveryMethod));
            document.querySelectorAll('.manual-pay-btn').forEach(b => b.classList.toggle('active', b.dataset.method === manualDraft.paymentMethod));
            document.getElementById('manualAddressWrap').style.display = manualDraft.deliveryMethod === 'pickup' ? 'none' : 'block';
            document.getElementById('manualFeeWrap').style.display = manualDraft.deliveryMethod === 'pickup' ? 'none' : 'block';
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
    if (!manualDraft.items.length) { list.innerHTML = ''; empty.style.display = 'block'; return; }
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
            img = it.data.type?.icon ? `https://via.placeholder.com/80` : img;
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
    const fee = manualDraft.deliveryMethod === 'pickup' ? 0 : (parseFloat(document.getElementById('manualDeliveryFee').value) || 0);
    const total = subtotal + fee;
    document.getElementById('manualSubtotal').textContent = fmtMoney(subtotal);
    document.getElementById('manualFeeDisplay').textContent = fmtMoney(fee);
    document.getElementById('manualTotal').textContent = fmtMoney(total);
}
function bindManualOrderModal() {
    document.getElementById('closeManualModal').addEventListener('click', closeManualOrderModal);
    document.getElementById('manualCancelBtn').addEventListener('click', closeManualOrderModal);
    document.getElementById('manualOrderModal').addEventListener('click', (e) => { if (e.target.id === 'manualOrderModal') closeManualOrderModal(); });
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

    // ⭐ 3 add buttons
    document.getElementById('manualAddItemBtn').addEventListener('click', () => {
        openPickItemModal('manual');
    });
    document.getElementById('manualAddOfferBtn').addEventListener('click', () => {
        openPickOfferModal('manual');
    });
    document.getElementById('manualAddBoxBtn').addEventListener('click', () => {
        openPickBoxModal('manual');
    });

    document.getElementById('manualItemsList').addEventListener('click', (e) => {
        const inc = e.target.closest('[data-manual-inc]');
        if (inc) { manualDraft.items[+inc.dataset.manualInc].qty++; renderManualDraftItems(); updateManualTotals(); return; }
        const dec = e.target.closest('[data-manual-dec]');
        if (dec) {
            const i = +dec.dataset.manualDec;
            if (manualDraft.items[i].qty > 1) manualDraft.items[i].qty--;
            else manualDraft.items.splice(i, 1);
            renderManualDraftItems(); updateManualTotals(); return;
        }
        const rm = e.target.closest('[data-manual-remove]');
        if (rm) { manualDraft.items.splice(+rm.dataset.manualRemove, 1); renderManualDraftItems(); updateManualTotals(); }
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
    const fee = manualDraft.deliveryMethod === 'pickup' ? 0 : (parseFloat(document.getElementById('manualDeliveryFee').value) || 0);
    const address = manualDraft.deliveryMethod === 'pickup' ? 'Pickup from boutique' : (document.getElementById('manualAddress').value.trim() || 'Amman');
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
            itemsList.push({ name: it.data.name, qty: it.qty, price: it.data.price, productId: it.data.id, grams: it.data.grams || 100, kind: 'item' });
        }
    });

    const empOrders = loadEmployeeOrders();
    if (editId) {
        const idx = empOrders.findIndex(o => o.id === editId);
        if (idx !== -1) {
            empOrders[idx] = {
                ...empOrders[idx],
                customerInfo: { name, phone, email: '' },
                itemsList, subtotal, deliveryFee: fee, total,
                address, notes, source,
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
            itemsList, subtotal, deliveryFee: fee, total,
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

// ============ PICK ITEM MODAL ============
let pickItemTarget = 'manual'; // 'manual' | 'edit'
function bindPickItemModal() {
    document.getElementById('closePickItemModal').addEventListener('click', () => document.getElementById('pickItemModal').classList.remove('active'));
    document.getElementById('pickItemCancel').addEventListener('click', () => document.getElementById('pickItemModal').classList.remove('active'));
    document.getElementById('pickItemModal').addEventListener('click', (e) => { if (e.target.id === 'pickItemModal') document.getElementById('pickItemModal').classList.remove('active'); });
    document.getElementById('pickItemSearch').addEventListener('input', (e) => renderPickItemGrid(e.target.value.trim().toLowerCase()));
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
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px 20px;color:#8a7a85;"><i class='bx bx-search' style="font-size:2.5rem;opacity:.3;display:block;margin-bottom:8px;"></i><p style="font-weight:600;">No products found</p></div>`;
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
    const newItem = { kind: 'item', data: { id: p.id, name: p.name, price: price, grams: grams, img: p.img }, qty: 1 };

    if (target === 'manual') {
        const existing = manualDraft.items.find(i => i.kind === 'item' && i.data.id === p.id && i.data.grams === grams);
        if (existing) existing.qty++;
        else manualDraft.items.push(newItem);
        renderManualDraftItems();
        updateManualTotals();
    } else if (target === 'edit' && editingDraft) {
        editingDraft.itemsList.push({ name: p.name, qty: 1, price: price, productId: p.id, grams: grams, kind: 'item' });
        renderEditForm();
    } else if (target === 'box-builder') {
        const existing = boxBuilderState.items.find(i => i.id === p.id && i.grams === grams);
        if (existing) existing.qty++;
        else boxBuilderState.items.push({ id: p.id, name: p.name, price: price, grams: grams, qty: 1, img: p.img });
        renderBoxBuilderItems();
    }

    showToast(`${p.name} added`, 'bx-cart-add');
    document.getElementById('pickItemModal').classList.remove('active');
}

// ============ PICK OFFER MODAL ============
let pickOfferTarget = 'manual';
function bindPickOfferModal() {
    document.getElementById('closePickOfferModal').addEventListener('click', () => document.getElementById('pickOfferModal').classList.remove('active'));
    document.getElementById('pickOfferCancel').addEventListener('click', () => document.getElementById('pickOfferModal').classList.remove('active'));
    document.getElementById('pickOfferModal').addEventListener('click', (e) => { if (e.target.id === 'pickOfferModal') document.getElementById('pickOfferModal').classList.remove('active'); });
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
    grid.innerHTML = OFFERS.map(o => `
        <div class="pick-item-card" data-pick-offer="${esc(o.id)}">
            <div class="pick-item-card-discount">${esc(o.discount)}</div>
            <img src="${esc(o.img)}" alt="${esc(o.name)}">
            <div class="pick-item-card-info">
                <div class="pick-item-card-name">${esc(o.name)}</div>
                <div class="pick-item-card-price">${fmtMoney(o.price)}</div>
            </div>
        </div>
    `).join('');
}
function addPickedOffer(offerId, target) {
    const offer = OFFERS.find(o => o.id === offerId);
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

// ============ PICK BOX MODAL (Build a box inside manual order) ============
let pickBoxTarget = 'manual';
function bindPickBoxModal() {
    document.getElementById('closePickBoxModal').addEventListener('click', () => document.getElementById('pickBoxModal').classList.remove('active'));
    document.getElementById('pickBoxCancel').addEventListener('click', () => document.getElementById('pickBoxModal').classList.remove('active'));
    document.getElementById('pickBoxModal').addEventListener('click', (e) => { if (e.target.id === 'pickBoxModal') document.getElementById('pickBoxModal').classList.remove('active'); });

    document.getElementById('boxTypesSelector').addEventListener('click', (e) => {
        const opt = e.target.closest('[data-box-type]');
        if (!opt) return;
        const typeId = opt.dataset.boxType;
        const bt = BOX_TYPES.find(b => b.id === typeId);
        if (!bt) return;
        boxBuilderState.boxType = bt;
        document.querySelectorAll('#boxTypesSelector .box-type-option').forEach(el => el.classList.remove('selected'));
        opt.classList.add('selected');
        document.getElementById('boxItemsBuilder').style.display = 'block';
        document.getElementById('pickBoxSaveBtn').style.display = 'inline-flex';
        renderBoxBuilderItems();
    });

    document.getElementById('boxItemSearch').addEventListener('input', (e) => {
        renderBoxItemGrid(e.target.value.trim().toLowerCase());
    });
    document.getElementById('boxItemGrid').addEventListener('click', (e) => {
        const card = e.target.closest('[data-pick-id]');
        if (!card) return;
        addPickedItem(card.dataset.pickId, 'box-builder');
    });
    document.getElementById('boxBuilderItems').addEventListener('click', (e) => {
        const inc = e.target.closest('[data-bb-inc]');
        if (inc) { boxBuilderState.items[+inc.dataset.bbInc].qty++; renderBoxBuilderItems(); return; }
        const dec = e.target.closest('[data-bb-dec]');
        if (dec) {
            const i = +dec.dataset.bbDec;
            if (boxBuilderState.items[i].qty > 1) boxBuilderState.items[i].qty--;
            else boxBuilderState.items.splice(i, 1);
            renderBoxBuilderItems();
            return;
        }
        const rm = e.target.closest('[data-bb-remove]');
        if (rm) { boxBuilderState.items.splice(+rm.dataset.bbRemove, 1); renderBoxBuilderItems(); }
    });
    document.getElementById('pickBoxSaveBtn').addEventListener('click', savePickedBox);
}
function openPickBoxModal(target) {
    pickBoxTarget = target || 'manual';
    boxBuilderState = { boxType: null, items: [] };
    document.getElementById('boxTypesSelector').innerHTML = BOX_TYPES.map(b => `
        <div class="box-type-option" data-box-type="${esc(b.id)}">
            <i class='bx ${b.icon}'></i>
            <strong>${esc(b.name)}</strong>
            <small>${b.price === 0 ? 'Free' : '+$' + b.price.toFixed(2)}</small>
        </div>
    `).join('');
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
    const boxData = {
        type: boxBuilderState.boxType,
        items: [...boxBuilderState.items],
        totalPrice: totalPrice
    };

    if (pickBoxTarget === 'manual') {
        manualDraft.items.push({ kind: 'box', data: boxData, qty: 1 });
        renderManualDraftItems();
        updateManualTotals();
    } else if (pickBoxTarget === 'edit' && editingDraft) {
        // For edit, flatten into individual line items
        boxBuilderState.items.forEach(i => {
            editingDraft.itemsList.push({ name: `${i.name} (${boxBuilderState.boxType.name})`, qty: i.qty, price: i.price, productId: i.id, grams: i.grams, kind: 'box', boxName: boxBuilderState.boxType.name });
        });
        if (boxBuilderState.boxType.price > 0) {
            editingDraft.itemsList.push({ name: `${boxBuilderState.boxType.name} (packaging)`, qty: 1, price: boxBuilderState.boxType.price, kind: 'box' });
        }
        renderEditForm();
    }

    showToast(`${boxBuilderState.boxType.name} with ${boxBuilderState.items.length} products added`, 'bx-box');
    document.getElementById('pickBoxModal').classList.remove('active');
}

// ============ ORDER DETAILS MODAL ============
function bindOrderDetailsModal() {
    document.getElementById('closeOrderDetailsModal').addEventListener('click', closeOrderDetailsModal);
    document.getElementById('orderDetailsClose').addEventListener('click', closeOrderDetailsModal);
    document.getElementById('orderDetailsPrint').addEventListener('click', () => {
        const id = document.getElementById('orderDetailsModal').dataset.orderId;
        if (!id) return;
        const o = onlineOrders.find(x => x.id === id) || manualOrders.find(x => x.id === id);
        if (!o) return;
        buildReceiptView({
            receiptId: o.id,
            date: new Date(o.date),
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
    document.getElementById('orderDetailsModal').addEventListener('click', (e) => { if (e.target.id === 'orderDetailsModal') closeOrderDetailsModal(); });
}
function closeOrderDetailsModal() { document.getElementById('orderDetailsModal').classList.remove('active'); }
function openOrderDetails(orderId) {
    let o = onlineOrders.find(x => x.id === orderId);
    if (!o) o = manualOrders.find(x => x.id === orderId);
    if (!o) return;
    const isManual = o.channel === 'manual';
    document.getElementById('orderDetailsTitle').textContent = `Order ${o.id}`;
    document.getElementById('orderDetailsModal').dataset.orderId = o.id;

    const items = o.itemsList || [];
    const itemsHtml = items.map(i => `
        <div class="order-details-item-line">
            <span>${esc(i.name)} <strong>× ${i.qty}</strong>${i.grams ? ` <span style="color:#8a7a85;font-size:.78rem;">(${i.grams}g)</span>` : ''}</span>
            <strong>${fmtMoney((i.price || 0) * (i.qty || 0))}</strong>
        </div>
    `).join('') || '<div style="text-align:center;color:#8a7a85;padding:12px;">No items</div>';

    // Status flow
    const currentStatusIdx = STATUS_FLOW.indexOf(o.status);
    const statusFlowHtml = o.status === 'cancelled'
        ? `<div class="status-flow"><div style="text-align:center;width:100%;color:#dc2626;font-weight:700;padding:8px;"><i class='bx bx-x-circle'></i> Order Cancelled</div></div>`
        : `<div class="status-flow">
            ${STATUS_FLOW.map((st, i) => `
                <div class="status-step ${i < currentStatusIdx ? 'done' : (i === currentStatusIdx ? 'current' : '')}">
                    <div class="status-step-dot"><i class='${statusIcon(st)}'></i></div>
                    <div class="status-step-label">${statusLabel(st)}</div>
                </div>
            `).join('')}
        </div>`;

    document.getElementById('orderDetailsBody').innerHTML = `
        ${statusFlowHtml}
        <div class="order-details-grid">
            <div class="order-details-cell">
                <div class="order-details-cell-label">Date</div>
                <div class="order-details-cell-value">${fmtDate(o.date)}</div>
            </div>
            <div class="order-details-cell">
                <div class="order-details-cell-label">Payment</div>
                <div class="order-details-cell-value small">${(o.payment || 'cash').toUpperCase()}</div>
            </div>
            <div class="order-details-cell">
                <div class="order-details-cell-label">Customer</div>
                <div class="order-details-cell-value">${esc(o.customerInfo?.name || o.customerName || 'Guest')}</div>
            </div>
            <div class="order-details-cell">
                <div class="order-details-cell-label">Phone</div>
                <div class="order-details-cell-value small">${esc(o.customerInfo?.phone || o.customerPhone || '—')}</div>
            </div>
            <div class="order-details-cell">
                <div class="order-details-cell-label">${isManual ? 'Source' : 'Channel'}</div>
                <div class="order-details-cell-value small">${isManual ? sourceIcon(o.source) + ' ' + sourceLabel(o.source) : '🌐 Online'}</div>
            </div>
            <div class="order-details-cell">
                <div class="order-details-cell-label">Served By</div>
                <div class="order-details-cell-value small">${esc(o.servedBy || '—')}</div>
            </div>
            <div class="order-details-cell" style="grid-column:1/-1;">
                <div class="order-details-cell-label">Address</div>
                <div class="order-details-cell-value small">${esc(o.address || '—')}</div>
            </div>
            ${o.notes ? `<div class="order-details-cell" style="grid-column:1/-1;"><div class="order-details-cell-label">Notes</div><div class="order-details-cell-value small">${esc(o.notes)}</div></div>` : ''}
        </div>
        <div class="order-details-section-title">Items</div>
        <div class="order-details-items">${itemsHtml}</div>
        <div style="margin-top:16px;padding:14px;background:linear-gradient(135deg,rgba(250,204,67,.15),rgba(226,1,93,.08));border:2px dashed rgba(226,1,93,.25);border-radius:14px;">
            ${o.subtotal !== undefined ? `<div style="display:flex;justify-content:space-between;font-size:.85rem;padding:3px 0;"><span style="color:#8a7a85;font-weight:600;">Subtotal</span><span style="font-weight:700;">${fmtMoney(o.subtotal)}</span></div>` : ''}
            ${o.deliveryFee ? `<div style="display:flex;justify-content:space-between;font-size:.85rem;padding:3px 0;"><span style="color:#8a7a85;font-weight:600;">Delivery Fee</span><span style="font-weight:700;">${fmtMoney(o.deliveryFee)}</span></div>` : ''}
            ${o.tax ? `<div style="display:flex;justify-content:space-between;font-size:.85rem;padding:3px 0;"><span style="color:#8a7a85;font-weight:600;">Tax</span><span style="font-weight:700;">${fmtMoney(o.tax)}</span></div>` : ''}
            <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:2px solid rgba(226,1,93,.15);margin-top:6px;">
                <span style="color:#9f0b3b;font-weight:700;">Total</span>
                <span style="font-family:'Autolova',sans-serif;font-size:1.6rem;color:#e2015d;">${fmtMoney(o.total)}</span>
            </div>
        </div>
    `;
    document.getElementById('orderDetailsModal').classList.add('active');
}

// ============ INVOICE EDIT SYSTEM ============
function loadEditUnlocks() {
    try {
        const raw = localStorage.getItem(LS_KEYS.editUnlocks);
        const arr = raw ? JSON.parse(raw) : [];
        const now = Date.now();
        return (Array.isArray(arr) ? arr : []).filter(u => u.expiresAt > now);
    } catch (e) { return []; }
}
function saveEditUnlocks(list) { try { localStorage.setItem(LS_KEYS.editUnlocks, JSON.stringify(list)); } catch (e) {} }
function addEditUnlock(orderId, employeeUsername) {
    const list = loadEditUnlocks();
    list.push({ orderId, unlockedBy: employeeUsername, unlockedAt: Date.now(), expiresAt: Date.now() + EDIT_WINDOW_MS });
    saveEditUnlocks(list);
}
function isOrderUnlocked(orderId) { return loadEditUnlocks().some(u => u.orderId === orderId); }
function consumeUnlock(orderId) { saveEditUnlocks(loadEditUnlocks().filter(u => u.orderId !== orderId)); }
function loadEditLog() {
    try {
        const raw = localStorage.getItem(LS_KEYS.editLog);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
}
function saveEditLog(list) { try { localStorage.setItem(LS_KEYS.editLog, JSON.stringify(list)); } catch (e) {} }
function addEditLogEntry(entry) {
    const list = loadEditLog();
    list.unshift(entry);
    if (list.length > 500) list.length = 500;
    saveEditLog(list);
}
function getOrderEditLog(orderId) { return loadEditLog().filter(e => e.orderId === orderId); }
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
    const empOrders = loadEmployeeOrders();
    return empOrders
        .filter(o => o.employeeUsername === currentEmployee.username)
        .sort((a, b) => getOrderTimestamp(b) - getOrderTimestamp(a))
        .slice(0, 10);
}
function renderRecentOrders() {
    const grid = document.getElementById('recentOrdersGrid');
    if (!grid) return;
    const orders = getRecentOrdersForEmployee();
    if (!orders.length) {
        grid.innerHTML = `<div class="recent-empty"><i class='bx bx-receipt'></i><p>No orders in this shift yet.</p><p style="font-size:.78rem;opacity:.75;margin-top:4px;">Complete an order to see it here.</p></div>`;
        return;
    }
    grid.innerHTML = orders.map(o => recentOrderCardHtml(o)).join('');
}
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
                <i class='bx ${isLocked ? 'bx-lock-alt' : 'bx-edit'}'></i> ${isLocked ? 'Unlock to Edit' : 'Edit'}
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
            showToast('Recent orders refreshed', 'bx-refresh');
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
function findOrderById(id) { return loadEmployeeOrders().find(o => o.id === id); }

function openEditInvoiceModal(orderId) {
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
    if (unlocked) { label.textContent = 'Admin Unlocked — Edits allowed'; countdown.textContent = '🔓'; return; }
    if (remaining === 0) { banner.classList.add('locked'); label.textContent = 'Edit Window Closed'; countdown.textContent = '0:00'; return; }
    if (remaining <= 2 * 60 * 1000) { banner.classList.add('warning'); label.textContent = 'Last chance — Edit Window'; }
    else { label.textContent = 'Edit Window Open'; }
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
        } else if (remaining === 0) clearInterval(editTimerInterval);
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
    }).join('') || `<div style="text-align:center;padding:16px;color:#8a7a85;font-size:.85rem;">No items</div>`;
    document.getElementById('editCustomerName').value = editingDraft.customerInfo?.name || editingDraft.customerName || '';
    document.getElementById('editCustomerPhone').value = editingDraft.customerInfo?.phone || editingDraft.customerPhone || '';
    const isDelivery = editingDraft.channel === 'manual' || editingDraft.deliveryMethod === 'delivery';
    document.getElementById('editDeliverySection').style.display = isDelivery ? 'block' : 'none';
    document.getElementById('editPaymentSection').style.display = isDelivery ? 'none' : 'block';
    if (isDelivery) {
        document.getElementById('editAddress').value = editingDraft.address || '';
        document.getElementById('editDeliveryFee').value = (editingDraft.deliveryFee || 0).toFixed(2);
        document.getElementById('editNotes').value = editingDraft.notes || '';
        document.getElementById('editPayment').value = editingDraft.payment || 'pending';
    } else {
        document.querySelectorAll('.edit-pay-btn').forEach(b => b.classList.toggle('active', b.dataset.method === (editingDraft.payment || 'cash')));
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
    const el = document.getElementById('editTotals');
    el.innerHTML = `<div class="edit-total-row"><span>Subtotal</span><span>${fmtMoney(subtotal)}</span></div>
        ${fee > 0 ? `<div class="edit-total-row"><span>Delivery Fee</span><span>${fmtMoney(fee)}</span></div>` : ''}
        <div class="edit-total-row"><span>Tax (${Math.round(TAX_RATE * 100)}%)</span><span>${fmtMoney(tax)}</span></div>
        <div class="edit-total-row grand"><span>TOTAL</span><span>${fmtMoney(total)}</span></div>
        ${editingOrderOriginal && Math.abs(total - editingOrderOriginal.total) > 0.001 ? `<div style="text-align:center;margin-top:10px;font-size:.72rem;color:${total > editingOrderOriginal.total ? '#b91c1c' : '#15803d'};font-weight:700;">${total > editingOrderOriginal.total ? '▲' : '▼'} ${fmtMoney(Math.abs(total - editingOrderOriginal.total))} vs original</div>` : ''}`;
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
            if (dec) { const i = +dec.dataset.editDec; if (editingDraft.itemsList[i].qty > 1) { editingDraft.itemsList[i].qty--; renderEditForm(); } return; }
            const toggle = e.target.closest('[data-edit-toggle]');
            if (toggle) { const i = +toggle.dataset.editToggle; editingDraft.itemsList[i]._removed = !editingDraft.itemsList[i]._removed; renderEditForm(); return; }
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
            if (id === 'editCustomerName') { if (!editingDraft.customerInfo) editingDraft.customerInfo = {}; editingDraft.customerInfo.name = el.value; }
            if (id === 'editCustomerPhone') { if (!editingDraft.customerInfo) editingDraft.customerInfo = {}; editingDraft.customerInfo.phone = el.value; }
            if (id === 'editAddress') editingDraft.address = el.value;
            if (id === 'editNotes') editingDraft.notes = el.value;
            if (id === 'editPayment') editingDraft.payment = el.value;
        });
    });
    // ⭐ 3 EDIT ADD BUTTONS
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
    document.getElementById('editInvoiceModal').addEventListener('click', (e) => { if (e.target.id === 'editInvoiceModal') closeEditModal(); });
    document.getElementById('saveEditBtn').addEventListener('click', saveEditedInvoice);
    document.getElementById('adminUnlockBtn').addEventListener('click', tryAdminUnlock);
    document.getElementById('adminPinInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); tryAdminUnlock(); } });
}
function closeEditModal() {
    document.getElementById('editInvoiceModal').classList.remove('active');
    if (editTimerInterval) clearInterval(editTimerInterval);
    editingOrder = null; editingOrderOriginal = null; editingDraft = null; editingIsUnlocked = false;
}
function tryAdminUnlock() {
    const input = document.getElementById('adminPinInput');
    const error = document.getElementById('adminGateError');
    const pin = (input.value || '').trim();
    if (pin === ADMIN_OVERRIDE_PIN) {
        addEditUnlock(editingOrder.id, currentEmployee.username);
        editingIsUnlocked = true;
        input.value = ''; input.classList.remove('error'); error.textContent = '';
        addEditLogEntry({ orderId: editingOrder.id, editedBy: currentEmployee.username, editedByName: currentEmployee.name, editedAt: new Date().toISOString(), type: 'unlock', override: true, changes: [] });
        showToast('Admin unlocked — you can now edit', 'bx-lock-open-alt');
        document.getElementById('adminGate').style.display = 'none';
        document.getElementById('editFormBody').style.display = 'block';
        document.getElementById('editModalFooter').style.display = 'flex';
        updateEditTimerBanner(0, true);
        renderEditForm();
    } else {
        error.textContent = 'Invalid admin PIN. Please try again.';
        input.classList.add('error');
        input.value = '';
        setTimeout(() => input.classList.remove('error'), 550);
        input.focus();
    }
}
function saveEditedInvoice() {
    if (!editingDraft || !editingOrderOriginal) return;
    const activeItems = editingDraft.itemsList.filter(i => !i._removed);
    if (!activeItems.length) { showToast('At least one item is required', 'bx-error-circle'); return; }
    const changes = [];
    const origItems = editingOrderOriginal.itemsList || [];
    const draftItems = editingDraft.itemsList || [];
    draftItems.forEach((di, idx) => {
        const oi = origItems[idx];
        if (!oi) { changes.push({ type: 'item_added', name: di.name, newQty: di.qty }); return; }
        if (di._removed && !oi._removed) changes.push({ type: 'item_removed', name: di.name, oldQty: oi.qty });
        else if (di.qty !== oi.qty) changes.push({ type: 'item_qty', name: di.name, oldQty: oi.qty, newQty: di.qty });
    });
    const oldName = editingOrderOriginal.customerInfo?.name || editingOrderOriginal.customerName || '';
    const newName = editingDraft.customerInfo?.name || editingDraft.customerName || '';
    if (oldName !== newName) changes.push({ type: 'customer_name', old: oldName, new: newName });
    const oldPhone = editingOrderOriginal.customerInfo?.phone || editingOrderOriginal.customerPhone || '';
    const newPhone = editingDraft.customerInfo?.phone || editingDraft.customerPhone || '';
    if (oldPhone !== newPhone) changes.push({ type: 'customer_phone', old: oldPhone, new: newPhone });
    if (editingOrderOriginal.payment !== editingDraft.payment) changes.push({ type: 'payment', old: editingOrderOriginal.payment, new: editingDraft.payment });
    if ((editingOrderOriginal.address || '') !== (editingDraft.address || '')) changes.push({ type: 'address', old: editingOrderOriginal.address || '', new: editingDraft.address || '' });
    if ((editingOrderOriginal.deliveryFee || 0) !== (editingDraft.deliveryFee || 0)) changes.push({ type: 'delivery_fee', old: editingOrderOriginal.deliveryFee || 0, new: editingDraft.deliveryFee || 0 });
    if (Math.abs((editingOrderOriginal.total || 0) - (editingDraft.total || 0)) > 0.001) changes.push({ type: 'total', old: editingOrderOriginal.total || 0, new: editingDraft.total || 0 });
    if (changes.length === 0) { showToast('No changes made', 'bx-info-circle'); closeEditModal(); return; }

    const updated = JSON.parse(JSON.stringify(editingOrderOriginal));
    updated.itemsList = draftItems.filter(i => !i._removed).map(i => { const { _removed, ...clean } = i; return clean; });
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
    if (idx !== -1) { empOrders[idx] = updated; saveEmployeeOrders(empOrders); }
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
        body.innerHTML = `<div class="edit-history-empty"><i class='bx bx-history'></i><p>No edits recorded for this invoice.</p></div>`;
    } else {
        body.innerHTML = log.map(entry => {
            const changeList = (entry.changes || []).map(c => {
                if (c.type === 'item_qty') return `<div style="font-size:.78rem;color:#555;">• Qty of <strong>${esc(c.name)}</strong>: ${c.oldQty} → ${c.newQty}</div>`;
                if (c.type === 'item_removed') return `<div style="font-size:.78rem;color:#b91c1c;">• Removed <strong>${esc(c.name)}</strong> (was ${c.oldQty})</div>`;
                if (c.type === 'item_added') return `<div style="font-size:.78rem;color:#15803d;">• Added <strong>${esc(c.name)}</strong> × ${c.newQty}</div>`;
                if (c.type === 'total') return `<div style="font-size:.78rem;color:#555;">• Total: ${fmtMoney(c.old)} → <strong>${fmtMoney(c.new)}</strong></div>`;
                if (c.type === 'payment') return `<div style="font-size:.78rem;color:#555;">• Payment: ${esc(c.old)} → ${esc(c.new)}</div>`;
                if (c.type === 'customer_name') return `<div style="font-size:.78rem;color:#555;">• Name: ${esc(c.old)} → ${esc(c.new)}</div>`;
                if (c.type === 'customer_phone') return `<div style="font-size:.78rem;color:#555;">• Phone: ${esc(c.old)} → ${esc(c.new)}</div>`;
                if (c.type === 'address') return `<div style="font-size:.78rem;color:#555;">• Address updated</div>`;
                if (c.type === 'delivery_fee') return `<div style="font-size:.78rem;color:#555;">• Delivery fee: ${fmtMoney(c.old)} → ${fmtMoney(c.new)}</div>`;
                return '';
            }).join('');
            return `<div class="edit-history-entry">
                <div class="edit-history-entry-head">
                    <div class="edit-history-by"><i class='bx bx-user-circle'></i> ${esc(entry.editedByName || entry.editedBy)}</div>
                    <div class="edit-history-date">${fmtDateTime(entry.editedAt)}</div>
                </div>
                ${entry.type === 'unlock' ? `<div style="font-size:.8rem;color:#a16207;font-weight:700;">🔓 Unlocked with admin PIN</div>` : changeList || '<div style="font-size:.78rem;color:#999;">No specific changes recorded</div>'}
                ${entry.override && entry.type === 'edit' ? `<span class="edit-history-override">🔐 Admin Override</span>` : ''}
            </div>`;
        }).join('');
    }
    document.getElementById('editHistoryModal').classList.add('active');
}
function bindEditHistoryModal() {
    document.getElementById('closeEditHistory').addEventListener('click', () => document.getElementById('editHistoryModal').classList.remove('active'));
    document.getElementById('editHistoryClose').addEventListener('click', () => document.getElementById('editHistoryModal').classList.remove('active'));
    document.getElementById('editHistoryModal').addEventListener('click', (e) => { if (e.target.id === 'editHistoryModal') document.getElementById('editHistoryModal').classList.remove('active'); });
}
function printRecentOrder(orderId) {
    const order = findOrderById(orderId);
    if (!order) { showToast('Order not found', 'bx-error-circle'); return; }
    const items = (order.itemsList || []).map(i => ({ type: 'offer', data: { name: i.name, price: i.price, qty: i.qty } }));
    buildReceiptView({
        receiptId: order.id,
        date: new Date(order.placedAt || order.date),
        customer: order.customerInfo?.name || order.customerName || 'Walk-in',
        customerPhone: order.customerInfo?.phone || order.customerPhone || '',
        employee: order.servedBy || currentEmployee?.name || 'POS',
        paymentLabel: (order.payment || 'cash').toUpperCase(),
        items, subtotal: order.subtotal || order.total, fee: order.deliveryFee || 0,
        tax: order.tax || 0, total: order.total,
        isDelivery: order.channel === 'manual' || order.deliveryMethod === 'delivery',
        address: order.address
    });
    setTimeout(printThermalReceipt, 250);
    showToast('Printing receipt...', 'bx-printer');
}

// =====================================================
// INVENTORY MANAGEMENT SYSTEM
// =====================================================
function findInvItemByBarcode(barcode) {
    if (!barcode) return null;
    const clean = barcode.trim().toLowerCase();
    return invItems.find(i => (i.barcode || '').toLowerCase() === clean);
}
function findInvItemById(id) { return invItems.find(i => i.id === id); }
function updateInventoryBadge() {
    const badge = document.getElementById('inventoryBadge');
    if (!badge) return;
    const total = invItems.reduce((s, i) => s + (Number(i.warehouseStock) || 0), 0);
    badge.textContent = total;
    badge.classList.toggle('hidden', total === 0);
}
function renderInventory() {
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
    const lowStockCount = invItems.filter(i => (Number(i.warehouseStock) || 0) > 0 && (Number(i.warehouseStock) || 0) <= 5).length;
    el.innerHTML = `
        <div class="inv-stat-card blue"><div class="inv-stat-icon"><i class='bx bx-package'></i></div><div><div class="inv-stat-value">${totalItems}</div><div class="inv-stat-label">Product Types</div></div></div>
        <div class="inv-stat-card green"><div class="inv-stat-icon"><i class='bx bx-warehouse'></i></div><div><div class="inv-stat-value">${warehouseTotal}</div><div class="inv-stat-label">Warehouse Bags</div></div></div>
        <div class="inv-stat-card purple"><div class="inv-stat-icon"><i class='bx bx-store'></i></div><div><div class="inv-stat-value">${shopTotal}</div><div class="inv-stat-label">Shop Bags</div></div></div>
        <div class="inv-stat-card orange"><div class="inv-stat-icon"><i class='bx bx-error-circle'></i></div><div><div class="inv-stat-value">${lowStockCount}</div><div class="inv-stat-label">Low Stock</div></div></div>
    `;
}
function switchInventoryTab(tab, silent) {
    invCurrentTab = tab;
    document.querySelectorAll('.inv-tab').forEach(t => t.classList.toggle('active', t.dataset.itab === tab));
    document.querySelectorAll('.inv-pane').forEach(p => p.classList.toggle('active', p.dataset.ipane === tab));
    if (!silent) {
        setTimeout(() => {
            if (tab === 'receive') { const inp = document.getElementById('receiveBarcodeInput'); if (inp) inp.focus(); }
            else if (tab === 'transfer') { const inp = document.getElementById('transferBarcodeInput'); if (inp) inp.focus(); }
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
        showToast(`Barcode "${barcode}" not found`, 'bx-error-circle');
        showBarcodeLookupModal(mode, barcode);
        input.value = '';
        return;
    }
    if (mode === 'transfer') {
        const currentStock = Number(item.warehouseStock) || 0;
        if (currentStock <= 0) { showToast(`${item.name} — no stock at warehouse`, 'bx-error-circle'); input.value = ''; return; }
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
            <span>${esc(item.barcode)} · ${item.weight}g/bag · WH: ${currentStock}</span>
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
    if (mode === 'transfer') { qtyInput.max = currentStock; qtyInput.value = 1; }
    detectedEl.querySelectorAll('[data-detected-inc]').forEach(btn => btn.addEventListener('click', () => { const inp = document.getElementById('detectedQtyInput'); inp.value = (parseInt(inp.value) || 0) + 1; }));
    detectedEl.querySelectorAll('[data-detected-dec]').forEach(btn => btn.addEventListener('click', () => { const inp = document.getElementById('detectedQtyInput'); const v = (parseInt(inp.value) || 0) - 1; inp.value = v < 1 ? 1 : v; }));
    detectedEl.querySelectorAll('[data-detected-add]').forEach(btn => btn.addEventListener('click', () => {
        const qty = parseInt(document.getElementById('detectedQtyInput').value) || 1;
        addToBatch(mode, item.id, qty);
        detectedEl.classList.add('hidden');
        detectedEl.innerHTML = '';
        const inpId = mode === 'receive' ? 'receiveBarcodeInput' : 'transferBarcodeInput';
        const input = document.getElementById(inpId);
        if (input) input.focus();
    }));
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
        if (alreadyInBatch + qty > whStock) { showToast(`Only ${whStock - alreadyInBatch} available`, 'bx-error-circle'); return; }
    }
    if (existing) existing.qty += qty;
    else batch.push({ itemId, qty });
    showToast(`${item.name} × ${qty} added`, 'bx-plus-circle');
    if (mode === 'receive') renderReceiveBatch(); else renderTransferBatch();
}
function renderReceiveBatch() {
    const list = document.getElementById('receiveBatchList');
    if (!list) return;
    if (!invReceiveBatch.length) { list.innerHTML = `<div class="inv-empty-small"><i class='bx bx-scan'></i><p>No items scanned yet</p></div>`; updateReceiveTotals(); return; }
    list.innerHTML = invReceiveBatch.map((b, idx) => {
        const item = findInvItemById(b.itemId);
        if (!item) return '';
        return `<div class="inv-batch-row">
            <img class="inv-batch-thumb" src="${esc(item.img || 'https://via.placeholder.com/80')}" alt="">
            <div class="inv-batch-info">
                <div class="inv-batch-name">${esc(item.name)}</div>
                <div class="inv-batch-meta"><i class='bx bx-barcode'></i> ${esc(item.barcode)}<span style="opacity:.6;">·</span><span>${item.weight}g/bag</span></div>
            </div>
            <div class="inv-batch-qty">
                <button type="button" data-rb-dec="${idx}">−</button>
                <span>${b.qty}</span>
                <button type="button" data-rb-inc="${idx}">+</button>
            </div>
            <button type="button" class="inv-batch-remove" data-rb-remove="${idx}"><i class='bx bx-x'></i></button>
        </div>`;
    }).join('');
    updateReceiveTotals();
}
function renderTransferBatch() {
    const list = document.getElementById('transferBatchList');
    if (!list) return;
    if (!invTransferBatch.length) { list.innerHTML = `<div class="inv-empty-small"><i class='bx bx-scan'></i><p>No items scanned yet</p></div>`; updateTransferTotals(); return; }
    list.innerHTML = invTransferBatch.map((b, idx) => {
        const item = findInvItemById(b.itemId);
        if (!item) return '';
        return `<div class="inv-batch-row transfer">
            <img class="inv-batch-thumb" src="${esc(item.img || 'https://via.placeholder.com/80')}" alt="">
            <div class="inv-batch-info">
                <div class="inv-batch-name">${esc(item.name)}</div>
                <div class="inv-batch-meta"><i class='bx bx-barcode'></i> ${esc(item.barcode)}<span style="opacity:.6;">·</span><span>WH: ${item.warehouseStock}</span></div>
            </div>
            <div class="inv-batch-qty">
                <button type="button" data-tb-dec="${idx}">−</button>
                <span>${b.qty}</span>
                <button type="button" data-tb-inc="${idx}">+</button>
            </div>
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
    showToast(`${total} bags received & added to warehouse`, 'bx-check-circle');
}
function confirmTransferBatch() {
    if (!invTransferBatch.length) return;
    const shopId = document.getElementById('transferShopSelect')?.value || 'main';
    const shopName = { main: 'Main Boutique (Amman)', shop2: 'Shop 2 (Zarqa)', shop3: 'Shop 3 (Irbid)' }[shopId] || shopId;
    const today = new Date().toISOString();
    for (const b of invTransferBatch) {
        const item = findInvItemById(b.itemId);
        if (!item) continue;
        if ((Number(item.warehouseStock) || 0) < b.qty) { showToast(`Not enough stock for ${item.name}`, 'bx-error-circle'); return; }
    }
    invTransferBatch.forEach(b => {
        const item = findInvItemById(b.itemId);
        if (!item) return;
        item.warehouseStock = Math.max(0, (Number(item.warehouseStock) || 0) - b.qty);
        item.shopStock = (Number(item.shopStock) || 0) + b.qty;
        invMovements.unshift({
            id: 'mov-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
            type: 'transfer', itemId: item.id, itemName: item.name, barcode: item.barcode,
            qty: b.qty, from: 'warehouse', to: shopName, shopId: shopId,
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
    let list = invItems.filter(i => !q || i.name.toLowerCase().includes(q) || (i.barcode || '').toLowerCase().includes(q));
    if (!list.length) { grid.innerHTML = `<div class="inv-empty-small" style="grid-column:1/-1;"><i class='bx bx-package'></i><p>${q ? 'No matching items' : 'Warehouse is empty'}</p></div>`; return; }
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
    let list = invItems.filter(i => !q || i.name.toLowerCase().includes(q) || (i.barcode || '').toLowerCase().includes(q));
    list = list.filter(i => (Number(i.shopStock) || 0) > 0);
    if (!list.length) { grid.innerHTML = `<div class="inv-empty-small" style="grid-column:1/-1;"><i class='bx bx-store'></i><p>${q ? 'No matching items' : 'No stock at shops yet'}</p></div>`; return; }
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
                <button class="inv-mini-btn ghost" data-return-to-wh="${esc(item.id)}"><i class='bx bx-undo'></i> Return to WH</button>
            </div>
        </div>`;
    }).join('');
}
function renderInventoryItems() {
    const list = document.getElementById('invItemsList');
    if (!list) return;
    const q = (document.getElementById('itemsSearchInput')?.value || '').trim().toLowerCase();
    let items = invItems.filter(i => !q || i.name.toLowerCase().includes(q) || (i.barcode || '').toLowerCase().includes(q));
    if (!items.length) { list.innerHTML = `<div class="inv-empty-small" style="grid-column:1/-1;"><i class='bx bx-barcode'></i><p>${q ? 'No matching items' : 'No inventory items yet — click "Add Item"'}</p></div>`; return; }
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
function renderInventoryHistory() {
    const list = document.getElementById('invHistoryList');
    if (!list) return;
    let items = invMovements;
    if (invHistoryFilter !== 'all') items = items.filter(m => m.type === invHistoryFilter);
    items = items.slice(0, 100);
    if (!items.length) { list.innerHTML = `<div class="inv-empty-small"><i class='bx bx-history'></i><p>No movements yet</p></div>`; return; }
    list.innerHTML = items.map(m => {
        const isIn = m.type === 'in';
        const isTransfer = m.type === 'transfer';
        let icon = isIn ? 'bx bx-import' : 'bx bx-transfer-alt';
        let title = isIn ? `Received from Supplier → Warehouse` : `Warehouse → ${m.to || 'Shop'}`;
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
function bindInventoryEvents() {
    document.querySelectorAll('.inv-tab').forEach(tab => tab.addEventListener('click', () => switchInventoryTab(tab.dataset.itab)));
    document.getElementById('btnRefreshInventory').addEventListener('click', (e) => {
        e.currentTarget.style.transform = 'rotate(180deg)';
        loadInventoryItems();
        loadInventoryMovements();
        renderInventory();
        showToast('Inventory refreshed', 'bx-refresh');
        setTimeout(() => { e.currentTarget.style.transform = ''; }, 500);
    });
    const receiveInput = document.getElementById('receiveBarcodeInput');
    const transferInput = document.getElementById('transferBarcodeInput');
    if (receiveInput) receiveInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleBarcodeInput('receive'); } });
    if (transferInput) transferInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleBarcodeInput('transfer'); } });
    document.getElementById('receiveSearchBtn').addEventListener('click', () => showBarcodeLookupModal('receive', receiveInput.value.trim()));
    document.getElementById('transferSearchBtn').addEventListener('click', () => showBarcodeLookupModal('transfer', transferInput.value.trim()));
    document.getElementById('receiveClearBatch').addEventListener('click', () => { if (!invReceiveBatch.length) return; if (!confirm('Clear receive queue?')) return; invReceiveBatch = []; renderReceiveBatch(); });
    document.getElementById('transferClearBatch').addEventListener('click', () => { if (!invTransferBatch.length) return; if (!confirm('Clear transfer queue?')) return; invTransferBatch = []; renderTransferBatch(); });
    document.getElementById('receiveConfirmBtn').addEventListener('click', confirmReceiveBatch);
    document.getElementById('transferConfirmBtn').addEventListener('click', confirmTransferBatch);
    document.getElementById('receiveBatchList').addEventListener('click', (e) => {
        const inc = e.target.closest('[data-rb-inc]');
        if (inc) { invReceiveBatch[+inc.dataset.rbInc].qty++; renderReceiveBatch(); return; }
        const dec = e.target.closest('[data-rb-dec]');
        if (dec) { const i = +dec.dataset.rbDec; if (invReceiveBatch[i].qty > 1) invReceiveBatch[i].qty--; else invReceiveBatch.splice(i, 1); renderReceiveBatch(); return; }
        const rm = e.target.closest('[data-rb-remove]');
        if (rm) { invReceiveBatch.splice(+rm.dataset.rbRemove, 1); renderReceiveBatch(); }
    });
    document.getElementById('transferBatchList').addEventListener('click', (e) => {
        const inc = e.target.closest('[data-tb-inc]');
        if (inc) { const i = +inc.dataset.tbInc; const b = invTransferBatch[i]; const item = findInvItemById(b.itemId); const maxStock = Number(item.warehouseStock) || 0; if (b.qty + 1 > maxStock) { showToast(`Only ${maxStock} available`, 'bx-error-circle'); return; } b.qty++; renderTransferBatch(); return; }
        const dec = e.target.closest('[data-tb-dec]');
        if (dec) { const i = +dec.dataset.tbDec; if (invTransferBatch[i].qty > 1) invTransferBatch[i].qty--; else invTransferBatch.splice(i, 1); renderTransferBatch(); return; }
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
            document.querySelectorAll('.ihfilter').forEach(b => b.classList.toggle('active', b.dataset.ihfilter === invHistoryFilter));
            renderInventoryHistory();
        });
    });
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
    const qty = prompt(`How many bags to return? (max ${shopStock})`, '1');
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

// ============ INVENTORY ITEM MODAL ============
function bindInventoryItemModal() {
    document.getElementById('closeInvItemModal').addEventListener('click', closeInventoryItemModal);
    document.getElementById('invItemCancelBtn').addEventListener('click', closeInventoryItemModal);
    document.getElementById('inventoryItemModal').addEventListener('click', (e) => { if (e.target.id === 'inventoryItemModal') closeInventoryItemModal(); });
    document.getElementById('invItemSaveBtn').addEventListener('click', saveInventoryItemFromModal);
    document.getElementById('inventoryItemForm').addEventListener('submit', (e) => { e.preventDefault(); saveInventoryItemFromModal(); });
    document.getElementById('generateBarcodeBtn').addEventListener('click', () => {
        const cat = document.getElementById('invItemCategory').value;
        const weight = parseInt(document.getElementById('invItemWeight').value) || 500;
        const code = generateBarcode(cat, weight);
        document.getElementById('invItemBarcode').value = code;
        showToast('Barcode generated', 'bx-barcode');
    });
}
function openInventoryItemModal(itemId) {
    invEditingItemId = itemId || null;
    const form = document.getElementById('inventoryItemForm');
    form.reset();
    document.getElementById('invItemIdInput').value = '';
    document.getElementById('invItemModalTitle').textContent = itemId ? 'Edit Inventory Item' : 'Add Inventory Item';
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
    const dup = invItems.find(i => (i.barcode || '').toLowerCase() === barcode.toLowerCase() && i.id !== invEditingItemId);
    if (dup) { alert(`Barcode "${barcode}" is already used by "${dup.name}"`); return; }
    const data = {
        name,
        weight,
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
            ...data,
            warehouseStock: 0,
            shopStock: 0,
            createdAt: new Date().toISOString()
        });
        showToast('Item created', 'bx-check-circle');
    }
    saveInventoryItems();
    closeInventoryItemModal();
    renderInventory();
}

// ============ BARCODE LOOKUP MODAL ============
function bindBarcodeLookupModal() {
    document.getElementById('closeBarcodeLookup').addEventListener('click', closeBarcodeLookupModal);
    document.getElementById('barcodeLookupModal').addEventListener('click', (e) => { if (e.target.id === 'barcodeLookupModal') closeBarcodeLookupModal(); });
    document.getElementById('barcodeLookupSearch').addEventListener('input', renderBarcodeLookupList);
    document.getElementById('barcodeLookupList').addEventListener('click', (e) => {
        const card = e.target.closest('[data-lookup-id]');
        if (!card) return;
        const itemId = card.dataset.lookupId;
        const mode = barcodeLookupTarget;
        if (mode) {
            const item = findInvItemById(itemId);
            if (item) { closeBarcodeLookupModal(); showDetectedItem(mode, item); }
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
    let items = invItems.filter(i => !q || i.name.toLowerCase().includes(q) || (i.barcode || '').toLowerCase().includes(q));
    items = items.slice(0, 50);
    if (!items.length) { list.innerHTML = `<div class="inv-empty-small"><i class='bx bx-search'></i><p>${q ? 'No matching items' : 'No inventory items yet'}</p></div>`; return; }
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

// ============ LABEL PRINT MODAL ============
function bindLabelPrintModal() {
    document.getElementById('closeLabelModal').addEventListener('click', closeLabelPrintModal);
    document.getElementById('labelCancelBtn').addEventListener('click', closeLabelPrintModal);
    document.getElementById('barcodeLabelModal').addEventListener('click', (e) => { if (e.target.id === 'barcodeLabelModal') closeLabelPrintModal(); });
    document.getElementById('labelPrintBtn').addEventListener('click', printBarcodeLabels);
    document.querySelectorAll('[data-label-inc]').forEach(btn => btn.addEventListener('click', () => { const inp = document.getElementById('labelCountInput'); inp.value = (parseInt(inp.value) || 0) + 1; }));
    document.querySelectorAll('[data-label-dec]').forEach(btn => btn.addEventListener('click', () => { const inp = document.getElementById('labelCountInput'); const v = (parseInt(inp.value) || 0) - 1; inp.value = v < 1 ? 1 : v; }));
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
    const preview = document.getElementById('labelPreview');
    preview.innerHTML = `<div class="label-preview-inner">
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

// ============ AUTO REFRESH ============
setInterval(() => {
    if (document.getElementById('view-home').classList.contains('active')) renderRecentOrders();
}, 10000);

// ============ GLOBAL ESC KEY ============
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.getElementById('editInvoiceModal').classList.contains('active')) closeEditModal();
        else if (document.getElementById('editHistoryModal').classList.contains('active')) document.getElementById('editHistoryModal').classList.remove('active');
        else if (document.getElementById('manualOrderModal').classList.contains('active')) closeManualOrderModal();
        else if (document.getElementById('pickItemModal').classList.contains('active')) document.getElementById('pickItemModal').classList.remove('active');
        else if (document.getElementById('pickOfferModal').classList.contains('active')) document.getElementById('pickOfferModal').classList.remove('active');
        else if (document.getElementById('pickBoxModal').classList.contains('active')) document.getElementById('pickBoxModal').classList.remove('active');
        else if (document.getElementById('orderDetailsModal').classList.contains('active')) closeOrderDetailsModal();
        else if (document.getElementById('gramModal').classList.contains('active')) closeGramModal();
        else if (document.getElementById('inventoryItemModal').classList.contains('active')) closeInventoryItemModal();
        else if (document.getElementById('barcodeLookupModal').classList.contains('active')) closeBarcodeLookupModal();
        else if (document.getElementById('barcodeLabelModal').classList.contains('active')) closeLabelPrintModal();
    }
});