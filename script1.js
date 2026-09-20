/* =====================================================
   HAT CANDY — EMPLOYEE POS SYSTEM
   Fully integrated with the Admin dashboard:
   - Reads employees from shared localStorage
   - Records shifts (check-in / check-out)
   - Saves orders with employee username
   - Deducts stock automatically
   - Syncs new customers back to Admin
   ===================================================== */

// =====================================================
// 1. SHARED STORAGE KEYS
// =====================================================
const LS_KEYS = {
    products:        'hatcandy-products',
    employees:       'hatcandy-employees',
    employeeOrders:  'hatcandy-employee-orders',
    employeeShifts:  'hatcandy-employee-shifts'
};

// =====================================================
// 2. DEFAULT FALLBACK PRODUCTS (if Admin hasn't set any)
// =====================================================
const DEFAULT_PRODUCTS = [
    { id: 'gummies',   name: 'Gourmet Gummies',     price: 8.99,  img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300', stock: 140 },
    { id: 'truffles',  name: 'Velvet Truffles',     price: 14.99, img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=300', stock: 62 },
    { id: 'lollipops', name: 'Honey Swirl Pops',    price: 6.99,  img: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=300', stock: 18 },
    { id: 'cloud',     name: 'Cloud Candy',         price: 7.99,  img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=300', stock: 95 },
    { id: 'sours',     name: 'Zesty Sours',         price: 8.49,  img: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=300', stock: 8 },
    { id: 'caramel',   name: 'Golden Caramel Corn', price: 9.99,  img: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=300', stock: 34 }
];

// =====================================================
// 3. STATIC DATA (Offers + Box Types)
// =====================================================
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

// =====================================================
// 4. GLOBAL STATE
// =====================================================
let PRODUCTS = [];
let currentOrder = { items: [], customer: { name: '', phone: '' } };
let currentBox = null;
let selectedProductForGram = null;
let currentEmployee = null;
let currentShiftId = null;
const TAX_RATE = 0.10;

// =====================================================
// 5. DOM REFERENCES
// =====================================================
const loginScreen = document.getElementById('loginScreen');
const posApp      = document.getElementById('posApp');
const loginForm   = document.getElementById('loginForm');
const loginError  = document.getElementById('loginError');

// =====================================================
// 6. EMPLOYEE DATA LOADER (from Admin)
// =====================================================
function loadEmployeesFromAdmin() {
    try {
        const raw = localStorage.getItem(LS_KEYS.employees);
        if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) return arr;
        }
    } catch (e) {
        console.warn('[POS] Failed to load employees:', e);
    }
    return [];
}

// =====================================================
// 7. PRODUCTS LOADER (from Admin)
// =====================================================
function loadProductsFromAdmin() {
    try {
        const raw = localStorage.getItem(LS_KEYS.products);
        if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length) {
                PRODUCTS = arr.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: Number(p.price) || 0,
                    img: p.img || '',
                    stock: Number(p.stock) || 0
                }));
                return;
            }
        }
    } catch (e) {
        console.warn('[POS] Failed to load products:', e);
    }
    PRODUCTS = DEFAULT_PRODUCTS.map(p => ({ ...p }));
}

// =====================================================
// 8. INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromAdmin();
    loginScreen.style.display = 'flex';
    posApp.classList.remove('active');

    // Warn if no employees registered yet
    const empList = loadEmployeesFromAdmin();
    if (!empList.length) {
        loginError.textContent = 'No employees registered yet. Ask the administrator to add one.';
    }

    setTimeout(() => {
        const u = document.getElementById('username');
        if (u) u.focus();
    }, 100);

    // Bind all event handlers
    bindLoginForm();
    bindTopBar();
    bindGramModal();
    bindFinishBox();
    bindBackToBoxes();
    bindPaymentMethods();
    bindCheckout();
    bindReceiptActions();
});

// Auto record shift end when page closes
window.addEventListener('beforeunload', () => {
    if (currentEmployee && currentShiftId) {
        recordShiftEnd(currentEmployee.username, currentShiftId);
    }
});

// =====================================================
// 9. LOGIN + SHIFT START
// =====================================================
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
            (x.username || '').toLowerCase() === user.toLowerCase() &&
            x.password === pass
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
        if (currentEmployee && currentShiftId) {
            recordShiftEnd(currentEmployee.username, currentShiftId);
        }
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
    loadProductsFromAdmin();
    renderOffers();
    renderBoxTypes();
    renderProducts();
    navigateTo('home');
}

// =====================================================
// 10. SHIFT TRACKING
// =====================================================
function recordShiftStart(username, name) {
    const id = 'shift-' + Date.now();
    try {
        const shifts = JSON.parse(localStorage.getItem(LS_KEYS.employeeShifts) || '[]');
        shifts.push({
            id: id,
            username: username,
            name: name,
            checkIn: new Date().toISOString(),
            checkOut: null
        });
        localStorage.setItem(LS_KEYS.employeeShifts, JSON.stringify(shifts));
    } catch (e) {
        console.warn('[Shift] Failed to record start:', e);
    }
    return id;
}

function recordShiftEnd(username, shiftId) {
    try {
        const shifts = JSON.parse(localStorage.getItem(LS_KEYS.employeeShifts) || '[]');
        for (let i = shifts.length - 1; i >= 0; i--) {
            if (shifts[i].username === username && !shifts[i].checkOut) {
                shifts[i].checkOut = new Date().toISOString();
                break;
            }
        }
        localStorage.setItem(LS_KEYS.employeeShifts, JSON.stringify(shifts));
    } catch (e) {
        console.warn('[Shift] Failed to record end:', e);
    }
}

// =====================================================
// 11. NAVIGATION
// =====================================================
window.navigateTo = function(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById('view-' + viewId);
    if (target) target.classList.add('active');

    if (viewId !== 'products') {
        document.getElementById('floatingBoxSummary').classList.remove('active');
    }
    if (viewId === 'checkout') renderCheckout();
};

// =====================================================
// 12. RENDERING
// =====================================================
function renderOffers() {
    document.getElementById('offersGrid').innerHTML = OFFERS.map(o => `
        <div class="card" onclick="addOfferToOrder('${o.id}')">
            <div class="badge-discount">${o.discount}</div>
            <img src="${o.img}" alt="${o.name}">
            <h4>${o.name}</h4>
            <div class="price">$${o.price.toFixed(2)} <span class="old-price">$${o.oldPrice.toFixed(2)}</span></div>
        </div>
    `).join('');
}

function renderBoxTypes() {
    document.getElementById('boxTypesGrid').innerHTML = BOX_TYPES.map(b => `
        <div class="box-card" onclick="startNewBox('${b.id}')">
            <div class="box-card-icon"><i class='bx ${b.icon}'></i></div>
            <h4>${b.name}</h4>
            <div class="price">${b.price === 0 ? 'Free' : '+$' + b.price.toFixed(2)}</div>
        </div>
    `).join('');
}

function renderProducts() {
    document.getElementById('productsGrid').innerHTML = PRODUCTS.map(p => {
        const outOfStock = p.stock <= 0;
        return `
        <div class="card ${outOfStock ? 'out-of-stock' : ''}" ${outOfStock ? '' : `onclick="openGramModal('${p.id}')"`}>
            <img src="${p.img}" alt="${p.name}">
            <h4>${p.name}</h4>
            <div class="price">$${p.price.toFixed(2)}</div>
            <span class="price-note">${outOfStock ? 'Out of stock' : 'per 100g · Stock: ' + p.stock}</span>
        </div>`;
    }).join('');
}

// =====================================================
// 13. ORDER LOGIC
// =====================================================
window.addOfferToOrder = function(offerId) {
    const offer = OFFERS.find(o => o.id === offerId);
    if (!offer) return;
    currentOrder.items.push({ type: 'offer', data: offer });
    renderCheckout();
    navigateTo('checkout');
};

window.startNewBox = function(boxTypeId) {
    const boxType = BOX_TYPES.find(b => b.id === boxTypeId);
    if (!boxType) return;
    currentBox = { type: boxType, items: [] };
    document.getElementById('currentBoxName').textContent = boxType.name;
    document.getElementById('floatingBoxSummary').classList.remove('active');
    navigateTo('products');
};

window.removeOrderItem = function(index) {
    currentOrder.items.splice(index, 1);
    renderCheckout();
};

// =====================================================
// 14. GRAM MODAL
// =====================================================
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
        if (!selectedProductForGram || !currentBox) return;
        const grams = parseInt(document.getElementById('gramInput').value);
        if (!grams || grams < 50) { alert('Minimum weight is 50g'); return; }

        const price = (selectedProductForGram.price / 100) * grams;
        const existing = currentBox.items.find(i => i.id === selectedProductForGram.id && i.grams === grams);

        if (existing) {
            existing.qty += 1;
        } else {
            currentBox.items.push({
                id: selectedProductForGram.id,
                name: selectedProductForGram.name,
                grams: grams,
                price: price,
                qty: 1
            });
        }
        closeGramModal();
        updateFloatingBoxSummary();
    });

    document.getElementById('gramModal').addEventListener('click', (e) => {
        if (e.target.id === 'gramModal') closeGramModal();
    });
}

window.openGramModal = function(productId) {
    if (!currentBox) return;
    selectedProductForGram = PRODUCTS.find(p => p.id === productId);
    if (!selectedProductForGram) return;
    if (selectedProductForGram.stock <= 0) {
        alert('This product is out of stock.');
        return;
    }

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
        document.getElementById('gramPricePreview').textContent = `$${price.toFixed(2)}`;
    }
}

// =====================================================
// 15. FINISH BOX
// =====================================================
function bindFinishBox() {
    document.getElementById('btnFinishBox').addEventListener('click', () => {
        if (!currentBox || currentBox.items.length === 0) {
            alert('Please add at least one item to the box.');
            return;
        }
        currentOrder.items.push({ type: 'box', data: currentBox });
        currentBox = null;
        renderCheckout();
        navigateTo('checkout');
    });
}

function bindBackToBoxes() {
    document.getElementById('btnBackToBoxes').addEventListener('click', () => {
        if (currentBox && currentBox.items.length > 0) {
            if (confirm('Are you sure? Items in this box will be lost.')) {
                currentBox = null;
                navigateTo('box-types');
            }
        } else {
            currentBox = null;
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
    let itemCount = 0;
    let total = currentBox.type.price;
    currentBox.items.forEach(item => {
        itemCount += item.qty;
        total += (item.price * item.qty);
    });
    document.getElementById('boxItemCount').textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
    document.getElementById('boxTotalPrice').textContent = `$${total.toFixed(2)}`;
    summary.classList.add('active');
}

// =====================================================
// 16. CHECKOUT RENDERING
// =====================================================
function renderCheckout() {
    const list = document.getElementById('orderItemsList');
    let subtotal = 0;

    if (currentOrder.items.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:40px 20px; color:#8a7a85;">
                <i class='bx bx-cart' style="font-size:3rem; opacity:.3; display:block; margin-bottom:10px;"></i>
                <p style="font-weight:600; margin-bottom:4px;">No items in order yet.</p>
                <p style="font-size:.85rem;">Use the buttons above to add a box or offer.</p>
            </div>`;
    } else {
        list.innerHTML = currentOrder.items.map((item, index) => {
            if (item.type === 'offer') {
                const o = item.data;
                subtotal += o.price;
                return `
                    <div class="order-item">
                        <div class="order-item-info"><h4>${o.name}</h4><span>Offer Deal</span></div>
                        <div class="order-item-right">
                            <div class="order-item-price">$${o.price.toFixed(2)}</div>
                            <button class="remove-item-btn" onclick="removeOrderItem(${index})"><i class='bx bx-trash'></i></button>
                        </div>
                    </div>`;
            } else {
                const b = item.data;
                let boxTotal = b.type.price;
                let itemsHtml = b.items.map(i => {
                    boxTotal += (i.price * i.qty);
                    return `<div class="box-item-line">${i.qty}x ${i.name} (${i.grams}g) — $${(i.price * i.qty).toFixed(2)}</div>`;
                }).join('');
                subtotal += boxTotal;
                return `
                    <div class="order-item order-item-box">
                        <div class="order-item-box-head">
                            <div class="order-item-info"><h4>${b.type.name}</h4><span>Custom Box</span></div>
                            <div class="order-item-right">
                                <div class="order-item-price">$${boxTotal.toFixed(2)}</div>
                                <button class="remove-item-btn" onclick="removeOrderItem(${index})"><i class='bx bx-trash'></i></button>
                            </div>
                        </div>
                        <div class="box-items-detail">${itemsHtml}</div>
                    </div>`;
            }
        }).join('');
    }

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkoutTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
}

// =====================================================
// 17. PAYMENT METHODS
// =====================================================
function bindPaymentMethods() {
    document.querySelectorAll('.pay-method').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// =====================================================
// 18. COMPLETE ORDER
// =====================================================
function bindCheckout() {
    document.getElementById('btnCheckout').addEventListener('click', () => {
        if (currentOrder.items.length === 0) { alert('Order is empty!'); return; }
        if (!currentEmployee) { alert('Please sign in again.'); return; }

        const customerName  = document.getElementById('customerName').value.trim() || 'Walk-in Customer';
        const customerPhone = document.getElementById('customerPhone').value.trim() || '';
        const paymentMethod = document.querySelector('.pay-method.active').dataset.method;
        const employeeName  = currentEmployee.name;
        const employeeUsername = currentEmployee.username;

        const receiptId = 'HC-POS-' + Date.now().toString().slice(-6);
        const now = new Date();
        const dateISO = now.toISOString();
        const today = dateISO.split('T')[0];

        // Build items list + subtotal
        let subtotal = 0;
        const itemsList = [];
        currentOrder.items.forEach(item => {
            if (item.type === 'offer') {
                const o = item.data;
                subtotal += o.price;
                itemsList.push({ name: o.name, qty: 1, price: o.price, isOffer: true });
            } else {
                const b = item.data;
                let boxTotal = b.type.price;
                b.items.forEach(i => {
                    boxTotal += (i.price * i.qty);
                    itemsList.push({
                        name: i.name,
                        qty: i.qty,
                        price: i.price,
                        productId: i.id,
                        grams: i.grams,
                        isBoxItem: true
                    });
                });
                subtotal += boxTotal;
            }
        });

        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;
        const customerId = 'c-pos-' + Date.now();

        // Save order to shared storage
        const orderObject = {
            id: receiptId,
            channel: 'pos',
            employeeUsername: employeeUsername,
            servedBy: employeeName,
            date: today,
            status: 'delivered',
            payment: paymentMethod,
            itemsList: itemsList,
            subtotal: subtotal,
            tax: tax,
            total: total,
            customerId: customerName !== 'Walk-in Customer' ? customerId : 'c-guest-pos',
            customerInfo: customerName !== 'Walk-in Customer' ? {
                name: customerName,
                phone: customerPhone,
                email: ''
            } : null,
            address: 'In-store',
            shiftId: currentShiftId
        };
        saveEmployeeOrder(orderObject);

        // Deduct stock from admin products
        deductStockFromAdmin(itemsList);

        // Build receipt display
        document.getElementById('receiptId').textContent = receiptId;
        document.getElementById('receiptDate').textContent = now.toLocaleString();
        document.getElementById('receiptCustomer').textContent = customerName;
        document.getElementById('receiptEmployee').textContent = employeeName;
        document.getElementById('receiptPaymentMethod').textContent = paymentMethod.toUpperCase();

        let receiptItemsHtml = '';
        currentOrder.items.forEach(item => {
            if (item.type === 'offer') {
                const o = item.data;
                receiptItemsHtml += `<div class="receipt-item"><span>1x ${o.name}</span><span>$${o.price.toFixed(2)}</span></div>`;
            } else {
                const b = item.data;
                let boxTotal = b.type.price;
                receiptItemsHtml += `<div class="receipt-item" style="font-weight:bold; margin-top:6px;"><span>${b.type.name}</span><span></span></div>`;
                b.items.forEach(i => {
                    boxTotal += (i.price * i.qty);
                    receiptItemsHtml += `<div class="receipt-item" style="padding-left:10px;"><span>${i.qty}x ${i.name} (${i.grams}g)</span><span>$${(i.price * i.qty).toFixed(2)}</span></div>`;
                });
                receiptItemsHtml += `<div class="receipt-item" style="padding-left:10px; border-top:1px dashed #ccc; padding-top:4px;"><span>Box Total</span><span>$${boxTotal.toFixed(2)}</span></div>`;
            }
        });

        document.getElementById('receiptItems').innerHTML = receiptItemsHtml;
        document.getElementById('receiptSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('receiptTax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('receiptTotal').textContent = `$${total.toFixed(2)}`;

        // Reset order
        currentOrder = { items: [], customer: { name: '', phone: '' } };
        currentBox = null;
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('floatingBoxSummary').classList.remove('active');

        navigateTo('receipt');
    });
}

// =====================================================
// 19. PERSISTENCE HELPERS
// =====================================================
function saveEmployeeOrder(order) {
    try {
        const orders = JSON.parse(localStorage.getItem(LS_KEYS.employeeOrders) || '[]');
        orders.push(order);
        localStorage.setItem(LS_KEYS.employeeOrders, JSON.stringify(orders));
    } catch (e) {
        console.warn('[Order] Failed to save:', e);
    }
}

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
                // Stock unit = 100g (based on price per 100g)
                const gramsTotal = (it.grams || 100) * it.qty;
                const stockUnits = gramsTotal / 100;
                p.stock = Math.max(0, (Number(p.stock) || 0) - stockUnits);
            }
        });

        localStorage.setItem(LS_KEYS.products, JSON.stringify(arr));
        loadProductsFromAdmin();
    } catch (e) {
        console.warn('[Stock] Failed to deduct:', e);
    }
}

// =====================================================
// 20. RECEIPT ACTIONS
// =====================================================
function bindReceiptActions() {
    document.getElementById('btnPrint').addEventListener('click', () => window.print());

    document.getElementById('btnNewOrder').addEventListener('click', () => {
        currentOrder = { items: [], customer: { name: '', phone: '' } };
        currentBox = null;
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('floatingBoxSummary').classList.remove('active');

        document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('active'));
        const cashBtn = document.querySelector('.pay-method[data-method="cash"]');
        if (cashBtn) cashBtn.classList.add('active');

        loadProductsFromAdmin();
        renderProducts();
        navigateTo('home');
    });
}