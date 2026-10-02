/* =====================================================
   HAT CANDY — CUSTOMER STORE
   Part 2: Cart, Payment, Mix, Account, Admin
   يعتمد على parts 0, 1
   ===================================================== */

(function () {
  'use strict';

  /* =====================================================
     1. DELIVERY + CART
     ===================================================== */

  window.getDeliveryFee = function () {
    if (cartDelivery.method === 'pickup') return 0;
    const z = deliveryZones.find(z => z.id === cartDelivery.zoneId);
    return z ? Number(z.price) : 0;
  };

  window.renderDeliverySection = function () {
    const body = $('deliveryBody');
    if (!body) return;

    document.querySelectorAll('.delivery-toggle-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.deliveryMethod === cartDelivery.method)
    );

    if (cartDelivery.method === 'pickup') {
      body.innerHTML = `<div class="delivery-pickup-info"><i class='bx bx-store'></i><div><strong>${t('delivery.pickupTitle')}</strong><span>${t('delivery.pickupAddress')}<br>${t('delivery.pickupHours')}</span></div></div>`;
      return;
    }

    const active = deliveryZones.filter(z => z.active);
    if (!active.length) {
      body.innerHTML = `<div class="delivery-empty">${t('delivery.noZones')}</div>`;
      return;
    }

    const currentZone = deliveryZones.find(x => x.id === cartDelivery.zoneId);
    body.innerHTML = `
      <label>${t('delivery.zone')}</label>
      <select class="delivery-select" id="deliveryZoneSelect">
        <option value="">${t('delivery.selectZone')}</option>
        ${active.map(z => `<option value="${z.id}" ${cartDelivery.zoneId === z.id ? 'selected' : ''}>${esc(L(z, 'name'))} — ${formatPrice(z.price)}</option>`).join('')}
      </select>
      ${currentZone ? `<div class="delivery-fee-row"><span>${t('delivery.fee')}</span><span class="fee-value">${formatPrice(currentZone.price)}</span></div>` : ''}`;

    const sel = $('deliveryZoneSelect');
    if (sel) {
      sel.addEventListener('change', (e) => {
        cartDelivery.zoneId = e.target.value || null;
        renderCart();
      });
    }
  };

  window.renderCart = function () {
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);

    if ($('cartBadge')) {
      $('cartBadge').textContent = totalQty;
      $('cartBadge').classList.toggle('show', totalQty > 0);
    }
    if ($('cartItemCount')) {
      $('cartItemCount').textContent = totalQty === 1
        ? `1 ${t('cart.item')}`
        : `${totalQty} ${t('cart.items')}`;
    }

    const paySec = $('paymentSection');
    const delSec = $('deliverySection');

    if (cart.length === 0) {
      const itemsEl = $('cartItems');
      if (itemsEl) {
        itemsEl.innerHTML = `<div class="cart-empty"><i class='bx bx-shopping-bag'></i><p>${t('cart.empty')}</p></div>`;
      }
      if ($('cartTotal')) $('cartTotal').textContent = formatPrice(0);
      if (delSec) delSec.style.display = 'none';
      if (paySec) paySec.style.display = 'none';

      const footer = document.querySelector('.cart-footer');
      if (footer) {
        const extra = footer.querySelector('.cart-extra-rows');
        if (extra) extra.innerHTML = '';
      }
      return;
    }

    if (delSec) delSec.style.display = 'block';
    if (paySec) paySec.style.display = 'block';

    const itemsEl = $('cartItems');
    if (itemsEl) {
      itemsEl.innerHTML = cart.map(item => {
        /* ===== MIX ITEMS ===== */
        if (item.isMix) {
          const typesList = (item.types || []).map(x => L(x, 'name')).join(' • ');
          const addonsList = (item.addons || []).map(a => L(a, 'name')).join(' • ');
          const meta = `${item.weight}${t('mix.unitG')} • ${esc(L(item.packaging, 'name'))}${addonsList ? `<br>${esc(addonsList)}` : ''}<br>${esc(typesList)}`;
          return `<div class="cart-item" data-id="${item.id}">
            <div class="cart-item-img"><img src="${esc(item.img || '')}" alt="${t('cart.customMix')}"></div>
            <div class="cart-item-info">
              <h4>${t('cart.customMix')}</h4>
              <div class="item-meta">${meta}</div>
              <span class="item-price">${formatPrice(item.price * item.qty)}</span>
              <div class="cart-item-controls">
                <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
              </div>
            </div>
            <button class="item-remove" data-action="remove" data-id="${item.id}"><i class='bx bx-trash'></i></button>
          </div>`;
        }

        /* ===== REGULAR PRODUCTS / OFFERS ===== */
        /* ⚡ FIX: use findCartItemProduct() to handle tiered products (id = productId::weight) */
        const p = (typeof findCartItemProduct === 'function')
          ? findCartItemProduct(item)
          : (products.find(x => x.id === item.id) || offers.find(x => x.id === item.id));

        if (!p) return '';

        const isOffer = offers.some(o => o.id === p.id);
        const weightTag = item.weight ? `<div class="item-meta">${item.weight} ${t('weight.unit')}</div>` : '';
        const id = item.id; /* keep the cart key as-is */

        return `<div class="cart-item" data-id="${esc(id)}">
          <div class="cart-item-img"><img src="${esc(p.img)}" alt="${esc(L(p, 'name'))}"></div>
          <div class="cart-item-info">
            <h4>${esc(L(p, 'name'))}</h4>
            ${weightTag}
            <span class="item-price">${formatPrice(item.price * item.qty)}</span>
            <div class="cart-item-controls">
              <button class="qty-btn" data-action="dec" data-id="${esc(id)}">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" data-action="inc" data-id="${esc(id)}">+</button>
            </div>
          </div>
          <button class="item-remove" data-action="remove" data-id="${esc(id)}"><i class='bx bx-trash'></i></button>
        </div>`;
      }).join('');
    }

    renderDeliverySection();
    renderPaymentSection();

    const subtotal = getCartSubtotal();
    const fee = getDeliveryFee();
    const total = subtotal + fee;

    const footer = document.querySelector('.cart-footer');
    if (footer) {
      let extra = footer.querySelector('.cart-extra-rows');
      if (!extra) {
        extra = document.createElement('div');
        extra.className = 'cart-extra-rows';
        footer.insertBefore(extra, footer.firstChild);
      }
      extra.innerHTML = `
        <div class="cart-subtotal-row"><span>${t('delivery.subtotal')}</span><span class="sub-value">${formatPrice(subtotal)}</span></div>
        <div class="cart-delivery-row"><span>${t('delivery.feeLabel')} ${cartDelivery.method === 'pickup' ? `(${t('delivery.pickup')})` : ''}</span><span class="sub-value">${formatPrice(fee)}</span></div>`;
    }

    if ($('cartTotal')) $('cartTotal').textContent = formatPrice(total);
  };

  window.increaseQty = function (id) {
    const i = cart.find(c => c.id === id);
    if (i) { i.qty++; renderCart(); }
  };

  window.decreaseQty = function (id) {
    const i = cart.find(c => c.id === id);
    if (!i) return;
    if (i.qty > 1) i.qty -= 1;
    else cart = cart.filter(c => c.id !== id);
    renderCart();
  };

  window.removeItem = function (id) {
    cart = cart.filter(i => i.id !== id);
    renderCart();
    showToast(t('toast.removed'), 'bx-trash');
  };

  /* =====================================================
     2. PAYMENT — Card validation + section render
     ===================================================== */

  window.detectCardBrand = function (num) {
    const n = (num || '').replace(/\s/g, '');
    if (/^4/.test(n)) return { brand: 'Visa', icon: 'bxl-visa' };
    if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return { brand: 'Mastercard', icon: 'bxl-mastercard' };
    if (/^3[47]/.test(n)) return { brand: 'Amex', icon: 'bxl-paypal' };
    return { brand: '', icon: 'bx-credit-card-front' };
  };

  window.formatCardNumber = function (v) {
    const n = (v || '').replace(/\D/g, '').slice(0, 16);
    return n.replace(/(.{4})/g, '$1 ').trim();
  };

  window.formatExpiry = function (v) {
    let n = (v || '').replace(/\D/g, '').slice(0, 4);
    if (n.length >= 3) n = n.slice(0, 2) + '/' + n.slice(2);
    return n;
  };

  window.validateExpiry = function (v) {
    const m = v.match(/^(\d{2})\/(\d{2})$/);
    if (!m) return false;
    const mo = parseInt(m[1]);
    const yr = parseInt(m[2]);
    if (mo < 1 || mo > 12) return false;
    const now = new Date();
    const curYr = now.getFullYear() % 100;
    const curMo = now.getMonth() + 1;
    return yr > curYr || (yr === curYr && mo >= curMo);
  };

  window.validateCardNumber = function (num) {
    const n = (num || '').replace(/\s/g, '');
    if (n.length < 13 || n.length > 19) return false;
    let sum = 0, alt = false;
    for (let i = n.length - 1; i >= 0; i--) {
      let d = parseInt(n[i]);
      if (alt) { d *= 2; if (d > 9) d -= 9; }
      sum += d;
      alt = !alt;
    }
    return sum % 10 === 0;
  };

  window.renderPaymentSection = function () {
    const body = $('paymentBody');
    if (!body) return;

    document.querySelectorAll('.payment-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.payment === cartPayment.method)
    );

    if (cartPayment.method === 'cash') {
      body.innerHTML = `<div class="payment-cash-note"><i class='bx bx-money'></i><div><strong>${t('pay.cashTitle')}</strong><span>${t('pay.cashText')}</span></div></div>`;
      return;
    }

    const c = cartPayment.card;
    const brand = detectCardBrand(c.number);
    const usingSavedCard = !!(c.savedId && savedCards.some(sc => sc.id === c.savedId));

    const savedHtml = savedCards.length ? `
      <div class="saved-cards">
        <div class="saved-cards-title"><i class='bx bx-credit-card'></i> ${lang === 'ar' ? 'بطاقاتك المحفوظة' : 'Your saved cards'}</div>
        ${savedCards.map(sc => {
          const icon = sc.brand === 'Visa' ? 'bxl-visa'
                     : sc.brand === 'Mastercard' ? 'bxl-mastercard'
                     : 'bx-credit-card-front';
          return `<div class="saved-card ${c.savedId === sc.id ? 'selected' : ''}" data-saved-card="${sc.id}" role="button" tabindex="0">
            <i class='bx ${icon}'></i>
            <div class="saved-card-info"><strong>•••• ${sc.last4}</strong><span>${esc(sc.name)} · ${esc(sc.expiry)}</span></div>
            <button class="saved-card-del" data-del-card="${sc.id}" aria-label="Delete"><i class='bx bx-trash'></i></button>
          </div>`;
        }).join('')}
        <button type="button" class="saved-card-new" id="newCardBtn"><i class='bx bx-plus'></i> ${lang === 'ar' ? 'استخدام بطاقة جديدة' : 'Use a new card'}</button>
      </div>` : '';

    body.innerHTML = `
      ${savedHtml}
      <div class="card-form" id="cardFormEl" style="${usingSavedCard ? 'display:none;' : ''}">
        ${brand.brand ? `<span class="card-brand-hint"><i class='bx ${brand.icon}'></i> ${brand.brand}</span>` : ''}
        <div class="card-field"><label>${t('pay.cardNumber')}</label><input type="text" inputmode="numeric" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" autocomplete="cc-number" value="${esc(c.number)}"><i class='bx ${brand.icon} card-icon'></i></div>
        <div class="card-field"><label>${t('pay.cardName')}</label><input type="text" id="cardName" placeholder="AHMAD AL-RASHID" maxlength="40" autocomplete="cc-name" value="${esc(c.name)}" style="text-transform:uppercase;padding-right:14px;"></div>
        <div class="card-field-row">
          <div class="card-field"><label>${t('pay.cardExpiry')}</label><input type="text" inputmode="numeric" id="cardExpiry" placeholder="MM/YY" maxlength="5" autocomplete="cc-exp" value="${esc(c.expiry)}" style="padding-right:14px;"></div>
          <div class="card-field"><label>${t('pay.cardCvv')}</label><input type="text" inputmode="numeric" id="cardCvv" placeholder="123" maxlength="4" autocomplete="cc-csc" value="${esc(c.cvv)}" style="padding-right:14px;"></div>
        </div>
        <label class="save-card-row"><input type="checkbox" id="saveCardChk" ${c.save ? 'checked' : ''}><span>${lang === 'ar' ? 'حفظ البطاقة' : 'Save this card to my account'}</span></label>
        <div class="card-secure"><i class='bx bx-lock-alt'></i> ${t('pay.cardSecure')}</div>
      </div>`;

    wireCardFormEvents(body);
  };

  function wireCardFormEvents(body) {
    body.querySelectorAll('[data-saved-card]').forEach(el => {
      const activate = (e) => {
        if (e.target.closest('[data-del-card]')) return;
        const id = el.dataset.savedCard;
        const sc = savedCards.find(x => x.id === id);
        if (!sc) return;
        cartPayment.card = {
          number: '•••• ' + sc.last4,
          name: sc.name,
          expiry: sc.expiry,
          cvv: '',
          savedId: sc.id,
          save: false
        };
        renderPaymentSection();
      };
      el.addEventListener('click', activate);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate(e);
        }
      });
    });

    body.querySelectorAll('[data-del-card]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.delCard;
        removeSavedCard(id);
        if (cartPayment.card.savedId === id) {
          cartPayment.card = { number: '', name: '', expiry: '', cvv: '', save: false, savedId: null };
        }
        renderPaymentSection();
        showToast(lang === 'ar' ? 'تم حذف البطاقة' : 'Card removed', 'bx-trash');
      });
    });

    const newBtn = body.querySelector('#newCardBtn');
    if (newBtn) {
      newBtn.addEventListener('click', () => {
        cartPayment.card = { number: '', name: '', expiry: '', cvv: '', save: false, savedId: null };
        renderPaymentSection();
      });
    }

    const numEl = $('cardNumber');
    const nameEl = $('cardName');
    const expEl = $('cardExpiry');
    const cvvEl = $('cardCvv');
    const saveChk = $('saveCardChk');

    if (!numEl) return;
    if (saveChk) saveChk.addEventListener('change', () => { cartPayment.card.save = saveChk.checked; });

    numEl.addEventListener('input', (e) => {
      e.target.value = formatCardNumber(e.target.value);
      cartPayment.card.number = e.target.value;
      const b = detectCardBrand(e.target.value);
      const iconEl = e.target.parentElement.querySelector('.card-icon');
      if (iconEl) iconEl.className = `bx ${b.icon} card-icon`;
      e.target.classList.toggle('invalid', !!e.target.value && !validateCardNumber(e.target.value));
    });

    if (nameEl) nameEl.addEventListener('input', (e) => { cartPayment.card.name = e.target.value; });

    if (expEl) {
      expEl.addEventListener('input', (e) => {
        e.target.value = formatExpiry(e.target.value);
        cartPayment.card.expiry = e.target.value;
        e.target.classList.toggle('invalid', e.target.value.length === 5 && !validateExpiry(e.target.value));
      });
    }

    if (cvvEl) {
      cvvEl.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        cartPayment.card.cvv = e.target.value;
      });
    }
  }

  /* =====================================================
     3. WEIGHT MODAL (Tiered Pricing)
     ===================================================== */

  window.openWeightModal = function (productId) {
    const p = products.find(x => x.id === productId);
    if (!p) return;

    if (p.pricingType !== 'tiered') {
      addFixedProductToCart(p);
      return;
    }

    weightModalState = { product: p, weight: 250, qty: 1 };
    renderWeightModal();
    const modal = $('weightModal');
    if (!modal) return;
    modal.classList.add('show');
    lockBodyScroll();
    const fs = $('floatingSign');
    if (fs) fs.classList.add('hide');
  };

  window.closeWeightModal = function () {
    const modal = $('weightModal');
    if (modal) modal.classList.remove('show');
    weightModalState = { product: null, weight: 250, qty: 1 };

    const othersOpen =
      $('cartPanel').classList.contains('show') ||
      $('loginPanel').classList.contains('show') ||
      ($('mixModal') && $('mixModal').classList.contains('show')) ||
      ($('accountPage') && $('accountPage').classList.contains('show')) ||
      ($('adminPage') && $('adminPage').classList.contains('show')) ||
      ($('ownerPage') && $('ownerPage').classList.contains('show'));

    if (!othersOpen) {
      unlockBodyScroll();
      const fs = $('floatingSign');
      if (fs) fs.classList.remove('hide');
    }
  };

  window.renderWeightModal = function () {
    const p = weightModalState.product;
    const weight = weightModalState.weight;
    const qty = weightModalState.qty;
    if (!p) return;

    const imgEl = $('weightModalImg');
    if (imgEl) { imgEl.src = p.img; imgEl.alt = L(p, 'name'); }

    if ($('weightModalName')) $('weightModalName').textContent = L(p, 'name');
    if ($('weightModalDesc')) $('weightModalDesc').textContent = L(p, 'desc') || '';

    const presets = [
      { w: 250,  price: Number(p.price250)  || 0 },
      { w: 500,  price: Number(p.price500)  || 0 },
      { w: 1000, price: Number(p.price1000) || 0 }
    ];

    const presetsEl = $('weightPresets');
    if (presetsEl) {
      presetsEl.innerHTML = presets.map(pr => {
        const label = pr.w === 1000
          ? (lang === 'ar' ? '١ كيلو' : '1 kg')
          : `${pr.w} g`;
        const active = weight === pr.w;
        return `<button type="button" class="weight-preset ${active ? 'active' : ''}" data-w="${pr.w}">
          <span class="weight-preset-amount">${label}</span>
          <span class="weight-preset-price">${formatPrice(pr.price)}</span>
        </button>`;
      }).join('');
    }

    if ($('weightInput')) $('weightInput').value = weight;

    const tier = getTierForWeight(p, weight);
    const noteEl = $('weightTierNote');
    if (noteEl) {
      if (tier) {
        const priceStr = formatPrice(tier.price);
        const key = tier.tier === 1000
          ? 'weight.tierNote1000'
          : tier.tier === 500
            ? 'weight.tierNote500'
            : 'weight.tierNote250';
        noteEl.innerHTML = `<i class='bx bx-info-circle'></i><span>${t(key, { price: priceStr })}</span>`;
        noteEl.classList.add('active');
      } else {
        noteEl.innerHTML = '';
        noteEl.classList.remove('active');
      }
    }

    if ($('weightQtyValue')) $('weightQtyValue').textContent = qty;

    const unitPrice = calcProductPriceForWeight(p, weight);
    const total = unitPrice * qty;
    if ($('weightTotalPrice')) $('weightTotalPrice').textContent = formatPrice(total);
  };

  window.addFixedProductToCart = function (p) {
    const existing = cart.find(i => i.id === p.id);
    if (existing) existing.qty += 1;
    else cart.push({ id: p.id, qty: 1, price: Number(p.price) || 0 });
    renderCart();
    showToast(t('toast.added', { name: L(p, 'name') }), 'bx-cart-add');
  };

  window.addTieredProductToCart = function () {
    const p = weightModalState.product;
    const weight = weightModalState.weight;
    const qty = weightModalState.qty;
    if (!p) return;

    const unitPrice = calcProductPriceForWeight(p, weight);
    const cartKey = p.id + '::' + weight;
    const existing = cart.find(i => i.id === cartKey);

    if (existing) existing.qty += qty;
    else cart.push({
      id: cartKey,
      productId: p.id,
      qty: qty,
      weight: weight,
      price: unitPrice
    });

    renderCart();
    showToast(t('toast.added', { name: L(p, 'name') }), 'bx-cart-add');
    closeWeightModal();
  };

  window.findCartItemProduct = function (item) {
    if (!item) return null;
    if (item.productId) return products.find(x => x.id === item.productId) || null;
    return products.find(x => x.id === item.id)
        || offers.find(x => x.id === item.id)
        || null;
  };

  /* =====================================================
     4. MIX BUILDER
     ===================================================== */

  window.renderMixWeights = function () {
    const el = $('mixWeightGrid');
    if (!el) return;

    el.classList.toggle('compact', mixWeights.length > 8);
    el.innerHTML = mixWeights.map(w => {
      const sel = mixState.weight === w;
      let tag = '';
      if (w === 500) tag = `<span class="mix-weight-tag">${t('mix.halfKilo')}</span>`;
      else if (w === 1000) tag = `<span class="mix-weight-tag">${t('mix.fullKilo')}</span>`;
      else if (w === 100) tag = `<span class="mix-weight-tag">${t('mix.min')}</span>`;
      else tag = `<span class="mix-weight-tag empty"></span>`;

      const label = w === 1000 ? t('mix.kilogram') : t('mix.gramsLabel', { w });
      return `<div class="mix-weight-pill ${sel ? 'selected' : ''}" data-weight="${w}">
        ${tag}
        <div class="mix-weight-amount">${w}<small style="font-size:0.55em;">${t('mix.unitG')}</small></div>
        <div class="mix-weight-label">${label}</div>
      </div>`;
    }).join('');
  };

  window.renderMixPackaging = function () {
    const el = $('mixPackGrid');
    if (!el) return;

    el.innerHTML = mixPackaging.map(p => {
      const sel = mixState.packaging && mixState.packaging.id === p.id;
      const price = Number(p.extra) === 0 ? t('mix.free') : '+ ' + formatPrice(p.extra);
      const visual = p.img
        ? `<img src="${esc(p.img)}" alt="${esc(L(p, 'name'))}">`
        : `<i class='bx ${p.icon || 'bx-box'}'></i>`;
      return `<div class="mix-pack-card ${sel ? 'selected' : ''}" data-pack="${esc(p.id)}">
        <div class="mix-pack-icon">${visual}</div>
        <div class="mix-pack-name">${esc(L(p, 'name'))}</div>
        <div class="mix-pack-desc">${esc(L(p, 'desc') || '')}</div>
        <div class="mix-pack-price ${Number(p.extra) === 0 ? 'free' : ''}">${price}</div>
      </div>`;
    }).join('');
  };

  window.renderMixSlots = function () {
    const el = $('mixSlots');
    if (!el) return;

    const slots = [];
    for (let i = 0; i < mixState.typesCount; i++) {
      const id = mixState.selectedTypes[i];
      const tp = id ? candyTypes.find(c => c.id === id) : null;
      slots.push(`<div class="mix-slot">
        <div class="mix-slot-num">${i + 1}</div>
        <div class="mix-slot-info">
          <div class="mix-slot-label">${t('mix.type')} ${i + 1}</div>
          <div class="mix-slot-value ${tp ? '' : 'empty'}">${tp ? `<span class="mix-type-color" style="background:${tp.color};"></span>${esc(L(tp, 'name'))}` : t('mix.tapToChoose')}</div>
        </div>
      </div>`);
    }
    el.innerHTML = slots.join('');
  };

  window.renderMixTypesGrid = function () {
    const el = $('mixTypesGrid');
    if (!el) return;

    const sel = new Set(mixState.selectedTypes);
    el.innerHTML = candyTypes.map(c => {
      const isSel = sel.has(c.id);
      const sale = Number(c.sale_price_per_kg) || 0;
      const base = Number(c.price_per_kg) || 0;
      const hasSale = sale > 0 && sale < base;

      const priceHtml = hasSale
        ? `<span class="mix-type-price discounted">${formatPrice(base)}</span><span class="mix-type-sale">${formatPrice(sale)}/kg</span>`
        : `<span class="mix-type-price">${formatPrice(base)}/kg</span>`;

      return `<div class="mix-type-card ${isSel ? 'selected' : ''}" data-type="${c.id}">
        <img class="mix-type-img" src="${esc(c.img)}" alt="${esc(L(c, 'name'))}">
        <div class="mix-type-info">
          <div class="mix-type-name"><span class="mix-type-color" style="background:${c.color};"></span>${esc(L(c, 'name'))}</div>
          <div class="mix-type-price-wrap">${priceHtml}</div>
        </div>
      </div>`;
    }).join('');
  };

  window.renderMixAddons = function () {
    const el = $('mixAddonsGrid');
    if (!el) return;

    const active = addons.filter(a => a.active !== false && a.active !== 'false');
    if (!active.length) {
      el.innerHTML = `<div class="mix-addons-empty">${t('mix.noAddons')}</div>`;
      return;
    }

    const sel = new Set(mixState.selectedAddons);
    el.innerHTML = active.map(a => {
      const isSel = sel.has(a.id);
      const visual = a.img
        ? `<img src="${esc(a.img)}" alt="${esc(L(a, 'name'))}">`
        : `<i class='bx ${a.icon || 'bx-plus-circle'}'></i>`;
      const priceTxt = Number(a.price) === 0 ? t('mix.free') : '+ ' + formatPrice(a.price);
      return `<div class="mix-addon-card ${isSel ? 'selected' : ''}" data-addon="${esc(a.id)}">
        <div class="mix-addon-icon">${visual}</div>
        <div class="mix-addon-info">
          <div class="mix-addon-name">${esc(L(a, 'name'))}</div>
          <div class="mix-addon-desc">${esc(L(a, 'desc') || '')}</div>
          <span class="mix-addon-price ${Number(a.price) === 0 ? 'free' : ''}">${priceTxt}</span>
        </div>
      </div>`;
    }).join('');
  };

  window.renderMixReview = function () {
    const el = $('mixReview');
    if (!el) return;

    const p = mixState.packaging;
    const total = calcMixPrice();
    const sel = mixState.selectedTypes
      .map(id => candyTypes.find(c => c.id === id))
      .filter(Boolean);
    const selectedAddons = getSelectedAddonsObjects();
    const avg = sel.length
      ? sel.reduce((s, tp) => s + effectiveKgPrice(tp), 0) / sel.length
      : 0;
    const candyCost = avg * (mixState.weight / 1000);
    const packExtra = p ? (Number(p.extra) || 0) : 0;
    const addonsCost = getAddonsTotal();

    el.innerHTML = `
      <div class="mix-review-hero">
        <i class='bx bxs-magic-wand'></i>
        <h3>${t('mix.yourMix')}</h3>
        <p>${t('mix.readyToAdd')}</p>
      </div>
      <div class="mix-review-grid">
        <div class="mix-review-card"><div class="label">${t('mix.packaging')}</div><div class="value" style="font-size:1.15rem;">${p ? esc(L(p, 'name')) : '—'}</div></div>
        <div class="mix-review-card"><div class="label">${t('mix.weight')}</div><div class="value">${mixState.weight} ${t('mix.unitG')}</div></div>
        <div class="mix-review-card"><div class="label">${t('mix.candyTypes')}</div><div class="value">${mixState.selectedTypes.length}</div></div>
        <div class="mix-review-card"><div class="label">${t('mix.addons')}</div><div class="value">${selectedAddons.length}</div></div>
      </div>
      <div class="mix-review-types">
        <div class="label">${t('mix.candySelection')}</div>
        <div class="mix-review-types-list">
          ${sel.map(c => {
            const sale = Number(c.sale_price_per_kg) || 0;
            const base = Number(c.price_per_kg) || 0;
            const priceTxt = (sale > 0 && sale < base)
              ? `${formatPrice(sale)}/kg`
              : `${formatPrice(base)}/kg`;
            return `<span class="mix-review-type-chip"><span class="dot" style="background:${c.color};"></span>${esc(L(c, 'name'))} · ${priceTxt}</span>`;
          }).join('')}
        </div>
      </div>
      ${selectedAddons.length ? `
        <div class="mix-review-types">
          <div class="label">${t('mix.addonsSelection')}</div>
          <div class="mix-review-types-list">
            ${selectedAddons.map(a => `<span class="mix-review-type-chip"><i class='bx ${a.icon || "bx-plus-circle"}' style="color:#e2015d;"></i>${esc(L(a, 'name'))} · + ${formatPrice(a.price)}</span>`).join('')}
          </div>
        </div>` : ''}
      <div class="mix-review-total">
        <div>
          <div class="mix-review-total-label">${t('mix.candy')} (${mixState.weight}${t('mix.unitG')})</div>
          <div class="mix-review-sub">${formatPrice(candyCost)} <span style="font-size:0.72rem;opacity:.7;">(${formatPrice(avg)}/kg)</span></div>
          ${packExtra > 0 ? `<div class="mix-review-total-label" style="margin-top:8px;">${esc(L(p, 'name'))}</div><div class="mix-review-sub">+ ${formatPrice(packExtra)}</div>` : ''}
          ${addonsCost > 0 ? `<div class="mix-review-total-label" style="margin-top:8px;">${t('mix.addons')}</div><div class="mix-review-sub">+ ${formatPrice(addonsCost)}</div>` : ''}
        </div>
        <div class="mix-review-total-right">
          <div class="mix-review-total-label">${t('mix.total')}</div>
          <div class="mix-review-total-value">${formatPrice(total)}</div>
        </div>
      </div>`;
  };

  window.updateMixStep = function () {
    document.querySelectorAll('.mix-progress-step').forEach(s => {
      const step = parseInt(s.dataset.step);
      s.classList.toggle('active', step === mixState.step);
      s.classList.toggle('done', step < mixState.step);
    });

    document.querySelectorAll('.mix-progress-line').forEach((line, i) =>
      line.classList.toggle('done', i + 1 < mixState.step)
    );

    document.querySelectorAll('.mix-pane').forEach(p =>
      p.classList.toggle('active', parseInt(p.dataset.pane) === mixState.step)
    );

    const backBtn = $('mixBackBtn');
    if (backBtn) backBtn.disabled = mixState.step === 1;

    const nextIcon = lang === 'ar' ? 'bx-left-arrow-alt' : 'bx-right-arrow-alt';
    const nextBtn = $('mixNextBtn');
    if (!nextBtn) return;

    if (mixState.step === 5) {
      nextBtn.innerHTML = `<i class='bx bx-check-shield'></i> <span>${t('mix.completeOrder')}</span>`;
      nextBtn.classList.add('grab');
    } else {
      nextBtn.innerHTML = `<span>${t('mix.next')}</span> <i class='bx ${nextIcon}'></i>`;
      nextBtn.classList.remove('grab');
    }

    if (mixState.step === 1) nextBtn.disabled = !mixState.packaging;
    else if (mixState.step === 2) nextBtn.disabled = !mixState.weight;
    else if (mixState.step === 3) nextBtn.disabled = mixState.selectedTypes.filter(Boolean).length < mixState.typesCount;
    else nextBtn.disabled = false;
  };

  window.goToMixStep = function (step) {
    mixState.step = step;

    if (step === 3) {
      renderMixSlots();
      renderMixTypesGrid();
      if ($('mixCountNumber')) $('mixCountNumber').textContent = mixState.typesCount;
      if ($('mixCountMinus')) $('mixCountMinus').disabled = mixState.typesCount <= 1;
      if ($('mixCountPlus'))  $('mixCountPlus').disabled  = mixState.typesCount >= 6;
    }
    if (step === 4) renderMixAddons();
    if (step === 5) renderMixReview();

    updateMixStep();
    const body = document.querySelector('.mix-body');
    if (body) body.scrollTop = 0;
  };

  window.openMixModal = function () {
    mixState.step = 1;
    mixState.packaging = null;
    mixState.weight = null;
    mixState.typesCount = 1;
    mixState.selectedTypes = [];
    mixState.selectedAddons = [];

    renderMixPackaging();
    renderMixWeights();
    renderMixSlots();
    renderMixTypesGrid();
    renderMixAddons();
    renderMixReview();
    updateMixStep();

    const modal = $('mixModal');
    if (!modal) return;
    modal.classList.add('show');
    lockBodyScroll();
    const fs = $('floatingSign');
    if (fs) fs.classList.add('hide');
  };

  window.closeMixModal = function () {
    const modal = $('mixModal');
    if (modal) modal.classList.remove('show');

    const othersOpen =
      $('cartPanel').classList.contains('show') ||
      $('loginPanel').classList.contains('show') ||
      ($('accountPage') && $('accountPage').classList.contains('show')) ||
      ($('adminPage') && $('adminPage').classList.contains('show')) ||
      ($('ownerPage') && $('ownerPage').classList.contains('show')) ||
      ($('weightModal') && $('weightModal').classList.contains('show'));

    if (!othersOpen) {
      unlockBodyScroll();
      const fs = $('floatingSign');
      if (fs) fs.classList.remove('hide');
    }
  };

  /* =====================================================
     5. MOBILE ACCOUNT UI
     ===================================================== */

  window.updateMobileAccountUI = function () {
    const btn = $('mobileAccountBtn');
    const nameEl = $('mobileAccountName');
    const av = $('mobileUserAvatar');
    if (!btn || !nameEl || !av) return;

    if (currentUser) {
      btn.classList.add('signed-in');
      nameEl.textContent = currentUser.name || currentUser.email || 'My Account';
      const initial = (currentUser.name || currentUser.email || 'H').charAt(0).toUpperCase();
      av.innerHTML = isOwner
        ? "<i class='bx bx-code-alt'></i>"
        : (isAdmin ? "<i class='bx bx-shield-quarter'></i>" : initial);
    } else {
      btn.classList.remove('signed-in');
      nameEl.textContent = lang === 'ar' ? 'تسجيل الدخول / حسابي' : 'Sign In / My Account';
      av.innerHTML = "<i class='bx bx-user'></i>";
    }
  };

  /* =====================================================
     6. LOGIN FLOW
     ===================================================== */

  window.resetLoginPanel = function (mode) {
    mode = mode || 'default';
    const wrapper = $('loginFormWrapper');
    if (wrapper) wrapper.style.display = 'block';

    const successEl = $('loginSuccess');
    if (successEl) successEl.classList.remove('show');

    const form = $('loginForm');
    if (form) form.reset();

    resetGoogleSignInUI();

    if (mode === 'checkout') {
      checkoutIntent = true;
      if ($('loginTitle'))    $('loginTitle').textContent    = t('login.almost');
      if ($('loginSubtitle')) $('loginSubtitle').textContent = t('login.almostSub');
      if ($('loginCallout'))  $('loginCallout').style.display = 'flex';
    } else {
      checkoutIntent = false;
      if ($('loginTitle'))    $('loginTitle').textContent    = t('login.welcome');
      if ($('loginSubtitle')) $('loginSubtitle').textContent = t('login.subtitle');
      if ($('loginCallout'))  $('loginCallout').style.display = 'none';
    }
  };

  window.onSignInSuccess = async function (user) {
    isAdmin = false;
    isOwner = false;

    /* سجّل العميل (مع مزامنة سحابية) */
    let c;
    try {
      c = await registerCustomer(user);
    } catch (err) {
      c = { id: 'c-' + Date.now(), ...user };
    }

    currentUser = { ...user, id: c.id, role: 'customer' };
    loadUserCards();

    const wrapper = $('loginFormWrapper');
    if (wrapper) wrapper.style.display = 'none';

    const successEl = $('loginSuccess');
    if (successEl) successEl.classList.add('show');

    if ($('successMessage')) {
      $('successMessage').textContent = checkoutIntent
        ? t('login.successSub')
        : t('login.successWelcome', { name: user.name || 'Sweet Friend' });
    }

    const loginBtn = $('loginBtn');
    if (loginBtn) loginBtn.classList.add('signed-in');

    if ($('userInitial')) {
      $('userInitial').textContent = (user.name || user.email || 'H').charAt(0).toUpperCase();
    }

    updateMobileAccountUI();

    setTimeout(() => {
      $('cartPanel').classList.remove('show');
      $('loginPanel').classList.remove('show');
      $('overlay').classList.remove('show');
      unlockBodyScroll();
      openAccountPage();

      if (checkoutIntent) {
        showToast(t('toast.signedInCheckout'), 'bx-party');
        checkoutIntent = false;
      } else {
        showToast(t('toast.welcome', { name: user.name || user.email }), 'bx-user-check');
      }
    }, 1400);
  };

  window.signOutUser = function () {
    isAdmin = false;
    isOwner = false;
    currentUser = null;
    savedCards = [];
    overviewUnlocked = false;
    reportRange = 'weekly';

    /* ⚡ Reset payment card — prevent data leak between users */
    cartPayment.card = { number: '', name: '', expiry: '', cvv: '', save: false, savedId: null };

    const loginBtn = $('loginBtn');
    if (loginBtn) loginBtn.classList.remove('signed-in');
    if ($('userInitial')) $('userInitial').textContent = 'H';

    updateMobileAccountUI();
    closeAccountPage();
    if (typeof closeAdminPage === 'function') closeAdminPage();
    if (typeof closeOwnerPage === 'function') closeOwnerPage();
    showToast(t('toast.signedOut'), 'bx-log-out');
  };

  window.signInAsAdmin = function () {
    isAdmin = true;
    isOwner = false;
    currentUser = {
      id: 'admin',
      name: 'Store Admin',
      email: ADMIN_EMAIL,
      role: 'admin'
    };

    const wrapper = $('loginFormWrapper');
    if (wrapper) wrapper.style.display = 'none';
    if ($('loginSuccess')) $('loginSuccess').classList.add('show');
    if ($('successMessage')) $('successMessage').textContent = t('login.successSub');

    const loginBtn = $('loginBtn');
    if (loginBtn) loginBtn.classList.add('signed-in');
    if ($('userInitial')) $('userInitial').textContent = 'A';

    updateMobileAccountUI();

    setTimeout(() => {
      closeAllPanels();
      openAdminPage();
      showToast(t('toast.adminWelcome'), 'bx-shield-quarter');
    }, 900);
  };

  /* =====================================================
     7. ACCOUNT PAGE
     ===================================================== */

  window.openAccountPage = function () {
    if (!currentUser) return;

    if ($('accountAvatar')) {
      $('accountAvatar').textContent = (currentUser.name || 'H').charAt(0).toUpperCase();
    }
    if ($('accountName')) $('accountName').textContent = currentUser.name || 'Hat Candy User';
    if ($('accountEmail')) $('accountEmail').textContent = currentUser.email || '';

    const page = $('accountPage');
    if (!page) return;
    page.classList.add('show');
    lockBodyScroll();
    const fs = $('floatingSign');
    if (fs) fs.classList.add('hide');

    renderAccountPage();
    switchAccountTab(accountTab);
  };

  window.closeAccountPage = function () {
    const page = $('accountPage');
    if (page) page.classList.remove('show');

    const othersOpen =
      $('cartPanel').classList.contains('show') ||
      $('loginPanel').classList.contains('show') ||
      ($('mixModal') && $('mixModal').classList.contains('show')) ||
      ($('adminPage') && $('adminPage').classList.contains('show')) ||
      ($('ownerPage') && $('ownerPage').classList.contains('show')) ||
      ($('weightModal') && $('weightModal').classList.contains('show'));

    if (!othersOpen) {
      unlockBodyScroll();
      const fs = $('floatingSign');
      if (fs) fs.classList.remove('hide');
    }
  };

  window.switchAccountTab = function (tab) {
    accountTab = tab;

    document.querySelectorAll('#accountPage .account-tab').forEach(x =>
      x.classList.toggle('active', x.dataset.tab === tab)
    );
    document.querySelectorAll('#accountPage .account-pane').forEach(p =>
      p.classList.toggle('active', p.dataset.pane === tab)
    );
  };

  window.renderAccountPage = function () {
    const orders = getUserOrders();
    const active = orders.filter(o =>
      ['processing', 'packing', 'shipped', 'out_for_delivery'].includes(o.status)
    ).length;

    if ($('ordersCount')) $('ordersCount').textContent = orders.length;
    if ($('trackingCount')) $('trackingCount').textContent = active;
    if ($('accountAddressCount')) {
      $('accountAddressCount').textContent = savedAddresses.length + ' ' + t('account.savedAddresses');
    }

    renderAccountNotice();
    renderAccountStats();
    renderOrders();
    renderTracking();
    renderAddresses();
  };

  window.renderAccountNotice = function () {
    const el = $('accountNotice');
    if (!el) return;

    const qty = cart.reduce((s, i) => s + i.qty, 0);

    if (qty > 0) {
      el.innerHTML = `<div class="account-notice"><i class='bx bxs-cart'></i><div class="account-notice-text">${t('account.cartNotice', { n: qty })}</div><button id="accountGoCart">${t('account.goToCart')}</button></div>`;
      const btn = $('accountGoCart');
      if (btn) {
        btn.addEventListener('click', () => {
          closeAccountPage();
          setTimeout(() => openPanel($('cartPanel')), 300);
        });
      }
    } else {
      el.innerHTML = '';
    }
  };

  window.renderAccountStats = function () {
    const el = $('accountStats');
    if (!el) return;
    const s = getUserStats();

    el.innerHTML = `
      <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-receipt'></i></div><div class="account-stat-info"><div class="account-stat-value">${s.total}</div><div class="account-stat-label">${t('account.statTotal')}</div></div></div>
      <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-package'></i></div><div class="account-stat-info"><div class="account-stat-value">${s.active}</div><div class="account-stat-label">${t('account.statActive')}</div></div></div>
      <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-check-circle'></i></div><div class="account-stat-info"><div class="account-stat-value">${s.delivered}</div><div class="account-stat-label">${t('account.statDelivered')}</div></div></div>
      <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-dollar-circle'></i></div><div class="account-stat-info"><div class="account-stat-value">${formatPrice(s.spent)}</div><div class="account-stat-label">${t('account.statSpent')}</div></div></div>`;
  };

  window.renderOrders = function () {
    const list = $('ordersList');
    if (!list) return;

    const myOrders = getUserOrders();

    if (!myOrders.length) {
      list.innerHTML = `<div class="account-empty"><i class='bx bx-receipt'></i><h3>${t('account.noOrders')}</h3><p>${t('account.noOrdersSub')}</p><a href="#candies" class="btn btn-primary" id="emptyShopBtn">${t('account.shopNow')}</a></div>`;
      const btn = $('emptyShopBtn');
      if (btn) btn.addEventListener('click', closeAccountPage);
      return;
    }

    list.innerHTML = myOrders.map(o => `
      <div class="order-card">
        <div class="order-head">
          <div>
            <div class="order-id">${t('account.orderId')} ${o.id}</div>
            <div class="order-date">${formatDate(o.date)}</div>
          </div>
          <span class="order-status status-${o.status}">
            <i class='${statusIcon(o.status)}'></i> ${t('account.status_' + o.status)}
          </span>
        </div>
        <div class="order-items">
          ${(o.itemsList || []).map(it => `
            <div class="order-item">
              <div>
                <span class="order-item-name">${esc(lang === 'ar' && it.name_ar ? it.name_ar : it.name)}</span>
                <span class="order-item-qty">× ${it.qty}</span>
              </div>
              <span class="order-item-price">${formatPrice((it.price || 0) * (it.qty || 0))}</span>
            </div>`).join('')}
        </div>
        <div class="order-foot">
          <div>
            <div class="order-total-label">${t('account.orderTotal')}</div>
            <div class="order-total-value">${formatPrice(o.total)}</div>
          </div>
          <div class="order-actions">
            ${o.tracking ? `<button class="order-action-btn ghost" data-track="${o.id}"><i class='bx bx-package'></i> ${t('account.trackOrder')}</button>` : ''}
            <button class="order-action-btn primary" data-reorder="${o.id}"><i class='bx bx-refresh'></i> ${t('account.reorder')}</button>
          </div>
        </div>
      </div>`).join('');
  };

  window.renderTracking = function () {
    const list = $('trackingList');
    if (!list) return;

    const tracked = getUserOrders().filter(o =>
      ['packing', 'shipped', 'out_for_delivery', 'delivered'].includes(o.status)
    );

    if (!tracked.length) {
      list.innerHTML = `<div class="account-empty"><i class='bx bx-package'></i><h3>${t('account.noTracking')}</h3><p>${t('account.noTrackingSub')}</p></div>`;
      return;
    }

    const idx = { processing: 1, packing: 2, shipped: 3, out_for_delivery: 4, delivered: 5 };

    list.innerHTML = tracked.map(o => {
      const cur = idx[o.status] || 1;
      const steps = [
        { icon: 'bx bx-check',     label: t('account.stepPlaced'),     time: o.placedAt },
        { icon: 'bx bx-cog',       label: t('account.stepProcessing'), time: o.placedAt },
        { icon: 'bx bx-archive',   label: t('account.stepPacking'),    time: o.packedAt },
        { icon: 'bx bx-package',   label: t('account.stepShipped'),    time: o.shippedAt },
        { icon: 'bx bx-cycling',   label: t('account.stepOut'),        time: o.outAt },
        { icon: 'bx bx-home-smile',label: t('account.stepDelivered'),  time: o.deliveredAt }
      ];
      const qty = (o.itemsList || []).reduce((s, i) => s + (Number(i.qty) || 0), 0);

      return `<div class="tracking-card">
        <div class="tracking-head">
          <div class="tracking-head-info">
            <h3>${t('account.trackingFor')} ${o.id}</h3>
            <p>${formatDate(o.date)} • ${qty} ${qty === 1 ? t('cart.item') : t('cart.items')}</p>
          </div>
          <div class="tracking-num"><i class='bx bx-package'></i> ${o.tracking || '—'}</div>
        </div>
        <div class="tracking-timeline">
          ${steps.map((s, i) => `
            <div class="tracking-step ${i <= cur ? 'done' : ''} ${i === cur && o.status !== 'delivered' ? 'current' : ''}">
              <div class="tracking-step-dot"><i class='${s.icon}'></i></div>
              <div class="tracking-step-text">
                <div class="tracking-step-label">${s.label}</div>
                <div class="tracking-step-time">${s.time ? formatDate(s.time) : ''}</div>
              </div>
            </div>`).join('')}
        </div>
        <div class="tracking-foot">
          <div class="tracking-eta"><i class='bx bx-time-five'></i> ${t('account.eta')}: ${o.eta ? formatDate(o.eta) : '—'}</div>
          <div>${t('account.deliveringTo')}: ${o.address}</div>
        </div>
      </div>`;
    }).join('');
  };

  window.renderAddresses = function () {
    const grid = $('addressesGrid');
    if (!grid) return;

    /* ⚡ Filter by current user (falls back to all if legacy data without customerId) */
    const mine = savedAddresses.filter(a => !a.customerId || a.customerId === currentUser?.id);

    const icons  = { home: 'bx-home', work: 'bx-briefcase', other: 'bx-map-pin' };
    const labels = {
      home:  t('account.labelHome'),
      work:  t('account.labelWork'),
      other: t('account.labelOther')
    };

    grid.innerHTML = mine.map(a => `
      <div class="address-card ${a.isDefault ? 'is-default' : ''}">
        ${a.isDefault ? `<span class="address-default-badge">${t('account.default')}</span>` : ''}
        <span class="address-label ${a.label}"><i class='bx ${icons[a.label] || 'bx-map-pin'}'></i> ${labels[a.label] || a.label}</span>
        <div class="address-name">${esc(a.name)}</div>
        <div class="address-line"><i class='bx bx-phone'></i> <span>${esc(a.phone)}</span></div>
        <div class="address-line"><i class='bx bx-map'></i> <span>${esc(a.city)}, ${esc(a.area)} — ${esc(a.line)}</span></div>
        <div class="address-actions">
          <button class="address-btn edit" data-edit-address="${a.id}"><i class='bx bx-edit'></i> ${t('account.edit')}</button>
          ${!a.isDefault ? `<button class="address-btn setdefault" data-default-address="${a.id}"><i class='bx bx-check-circle'></i> ${t('account.setDefault')}</button>` : ''}
          <button class="address-btn delete" data-delete-address="${a.id}"><i class='bx bx-trash'></i> ${t('account.delete')}</button>
        </div>
      </div>`).join('') +
      `<div class="address-add-card" id="addAddressBtn"><div class="address-add-icon"><i class='bx bx-plus'></i></div><span>${t('account.addNew')}</span></div>`;

    const btn = $('addAddressBtn');
    if (btn) btn.addEventListener('click', () => showAddressForm());
  };

  window.showAddressForm = function (id) {
    const form = $('addressForm');
    const el = $('addressFormEl');
    if (!form || !el) return;

    el.reset();
    $('addressId').value = '';

    if (id) {
      const a = savedAddresses.find(x => x.id === id);
      if (a) {
        $('addressFormTitle').textContent = t('account.editAddressTitle');
        $('addressId').value        = a.id;
        $('addressLabelInput').value = a.label;
        $('addressNameInput').value  = a.name;
        $('addressPhoneInput').value = a.phone;
        $('addressCityInput').value  = a.city;
        $('addressAreaInput').value  = a.area;
        $('addressLineInput').value  = a.line;
      }
    } else {
      $('addressFormTitle').textContent = t('account.addAddressTitle');
    }

    form.classList.add('show');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.hideAddressForm = function () {
    const form = $('addressForm');
    if (form) form.classList.remove('show');
    const el = $('addressFormEl');
    if (el) el.reset();
  };

  /* =====================================================
     8. ADMIN PAGE
     ===================================================== */

  window.openAdminPage = function () {
    if (!isAdmin) return;

    /* ⚡ Sync both employee + online orders so admin sees everything */
    if (typeof syncAllOrders === 'function') syncAllOrders();

    const today = new Date();
    if ($('adminToday')) $('adminToday').textContent = formatDate(today.toISOString().split('T')[0]);
    if ($('adminClock')) {
      $('adminClock').textContent = today.toLocaleTimeString(lang === 'ar' ? 'ar-JO' : 'en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    const page = $('adminPage');
    if (!page) return;
    page.classList.add('show');
    lockBodyScroll();
    const fs = $('floatingSign');
    if (fs) fs.classList.add('hide');

    if (overviewUnlocked) {
      if ($('overviewGate'))    $('overviewGate').style.display = 'none';
      if ($('overviewContent')) $('overviewContent').style.display = 'block';
    } else {
      if ($('overviewGate'))    $('overviewGate').style.display = 'flex';
      if ($('overviewContent')) $('overviewContent').style.display = 'none';
    }

    renderAdmin();
    switchAdminTab(adminTab);
  };

  window.closeAdminPage = function () {
    const page = $('adminPage');
    if (page) page.classList.remove('show');

    const othersOpen =
      $('cartPanel').classList.contains('show') ||
      $('loginPanel').classList.contains('show') ||
      ($('mixModal') && $('mixModal').classList.contains('show')) ||
      ($('accountPage') && $('accountPage').classList.contains('show')) ||
      ($('ownerPage') && $('ownerPage').classList.contains('show')) ||
      ($('weightModal') && $('weightModal').classList.contains('show'));

    if (!othersOpen) {
      unlockBodyScroll();
      const fs = $('floatingSign');
      if (fs) fs.classList.remove('hide');
    }
  };

  window.switchAdminTab = function (tab) {
    adminTab = tab;
    document.querySelectorAll('#adminPage .account-tab').forEach(x =>
      x.classList.toggle('active', x.dataset.atab === tab)
    );
    document.querySelectorAll('#adminPage .account-pane').forEach(p =>
      p.classList.toggle('active', p.dataset.apane === tab)
    );
  };

  window.renderAdmin = function () {
    /* ⚡ Ensure both sources are merged before rendering */
    if (typeof syncAllOrders === 'function') syncAllOrders();

    if ($('adminOrdersCount'))    $('adminOrdersCount').textContent    = orderHistory.length;
    if ($('adminCustomersCount')) $('adminCustomersCount').textContent = customers.length;
    if ($('adminMessagesCount'))  $('adminMessagesCount').textContent  = contactMessages.filter(m => !m.read).length;
    if ($('adminEmployeesCount')) $('adminEmployeesCount').textContent = loadEmployees().length;

    renderAdminKpis();
    renderAdminChart();
    renderAdminTopProducts();
    renderAdminRecentOrders();
    renderAdminOrders();
    renderAdminCustomers();
    renderAdminProducts();
    renderAdminMessages();
    if (typeof renderAdminEmployees  === 'function') renderAdminEmployees();
    if (typeof renderAdminAttendance === 'function') renderAdminAttendance();
  };

  window.renderAdminKpis = function () {
    const el = $('adminKpis');
    if (!el) return;

    const orders = getReportOrders();
    const act = orders.filter(o => o.status !== 'cancelled');
    const rev = act.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const delRev = orders.filter(o => o.status === 'delivered')
      .reduce((s, o) => s + (Number(o.total) || 0), 0);
    const pend = orders.filter(o => ['processing', 'packing'].includes(o.status)).length;
    const aov = act.length ? rev / act.length : 0;
    const posOrders = act.filter(o => o.channel === 'pos');
    const posRev = posOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);

    const cards = [
      { icon: 'bx-dollar-circle', value: formatPrice(rev),         label: t('admin.kpiRevenue') },
      { icon: 'bx-receipt',       value: orders.length,            label: t('admin.kpiOrders') },
      { icon: 'bx-group',         value: customers.length,         label: t('admin.kpiCustomers') },
      { icon: 'bx-trending-up',   value: formatPrice(aov),         label: t('admin.kpiAov') },
      { icon: 'bx-time-five',     value: pend,                     label: t('admin.kpiPending') },
      { icon: 'bx-check-shield',  value: formatPrice(delRev),      label: t('admin.kpiDelivered') },
      { icon: 'bx-store',         value: posOrders.length,         label: t('admin.kpiPosOrders') },
      { icon: 'bx-cash',          value: formatPrice(posRev),      label: t('admin.kpiPosRevenue') }
    ];

    el.innerHTML = cards.map(c =>
      `<div class="kpi-card"><div class="kpi-icon"><i class='bx ${c.icon}'></i></div><div><div class="kpi-value">${c.value}</div><div class="kpi-label">${c.label}</div></div></div>`
    ).join('');
  };

  window.renderAdminChart = function () {
    const el = $('adminChartBars');
    if (!el) return;

    const orders = orderHistory.filter(o => o.status !== 'cancelled');
    const now = new Date();
    let data = [];

    if (reportRange === 'daily') {
      const key = now.toISOString().split('T')[0];
      const value = orders.filter(o => o.date === key).reduce((s, o) => s + (Number(o.total) || 0), 0);
      data = [{ label: 'Today', value }];
    } else if (reportRange === 'weekly') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        const value = orders.filter(o => o.date === key).reduce((s, o) => s + (Number(o.total) || 0), 0);
        data.push({
          label: d.toLocaleDateString(lang === 'ar' ? 'ar-JO' : 'en-GB', { day: '2-digit', month: 'short' }),
          value
        });
      }
    } else if (reportRange === 'monthly') {
      for (let b = 5; b >= 0; b--) {
        const end = new Date(now);
        end.setDate(end.getDate() - b * 5);
        const start = new Date(end);
        start.setDate(start.getDate() - 4);
        const value = orders.filter(o => {
          const d = new Date(o.date);
          return d >= start && d <= end;
        }).reduce((s, o) => s + (Number(o.total) || 0), 0);
        data.push({ label: `${start.getDate()}/${start.getMonth() + 1}`, value });
      }
    } else {
      for (let m = 5; m >= 0; m--) {
        const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
        const start = new Date(d);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        const value = orders.filter(o => {
          const od = new Date(o.date);
          return od >= start && od <= end;
        }).reduce((s, o) => s + (Number(o.total) || 0), 0);
        data.push({
          label: start.toLocaleDateString(lang === 'ar' ? 'ar-JO' : 'en-GB', { month: 'short' }),
          value
        });
      }
    }

    if (!data.length) {
      el.innerHTML = `<p class="admin-empty-note">${t('admin.noData')}</p>`;
      return;
    }

    const max = Math.max(...data.map(d => d.value), 1);
    el.innerHTML = data.map(d => `
      <div class="admin-bar-col">
        <div class="admin-bar-value">${formatPrice(d.value).replace(/\.00/, '')}</div>
        <div class="admin-bar-track"><div class="admin-bar" style="height:${Math.max(6, Math.round((d.value / max) * 130))}px"></div></div>
        <div class="admin-bar-label">${d.label}</div>
      </div>`).join('');
  };

  console.log('%c🍬 Part 2 loaded — cart, payment, mix, account, admin', 'color:#e2015d;font-weight:bold;');

})();