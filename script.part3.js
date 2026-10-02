/* =====================================================
   HAT CANDY — CUSTOMER STORE
   Part 3: Admin + Owner + Attendance + Store Info + Events
   يعتمد على parts 0, 1, 2
   ===================================================== */

(function () {
  'use strict';

  /* =====================================================
     1. ADMIN — REPORTS & KPIs
     ===================================================== */

  window.productSales = function () {
    const map = {};
    orderHistory.filter(o => o.status !== 'cancelled').forEach(o =>
      (o.itemsList || []).forEach(it => {
        if (!map[it.name]) {
          map[it.name] = { name: it.name, name_ar: it.name_ar, qty: 0, revenue: 0 };
        }
        map[it.name].qty += Number(it.qty) || 0;
        map[it.name].revenue += (Number(it.qty) || 0) * (Number(it.price) || 0);
      })
    );
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  };

  window.renderAdminTopProducts = function () {
    const list = productSales().slice(0, 5);
    const el = $('adminTopProducts');
    if (!el) return;

    if (!list.length) {
      el.innerHTML = `<p class="admin-empty-note">${t('admin.noData')}</p>`;
      return;
    }

    const max = Math.max(...list.map(p => p.revenue), 1);
    el.innerHTML = list.map((p, i) => `
      <div class="admin-rank-item">
        <div class="admin-rank-num">${i + 1}</div>
        <div class="admin-rank-info">
          <div class="admin-rank-name">${esc(lang === 'ar' && p.name_ar ? p.name_ar : p.name)}</div>
          <div class="admin-rank-bar"><span style="width:${(p.revenue / max) * 100}%"></span></div>
        </div>
        <div class="admin-rank-value">${formatPrice(p.revenue)}</div>
      </div>`).join('');
  };

  window.orderRowHtml = function (o, compact) {
    const c = custById(o.customerId);
    const items = (o.itemsList || [])
      .map(i => `${lang === 'ar' && i.name_ar ? i.name_ar : i.name} ×${i.qty}`)
      .join(' • ');
    const pay = (o.payment === 'cod' || o.payment === 'cash')
      ? t('admin.payCod')
      : t('admin.payCard');
    const channelBadge = o.channel === 'pos'
      ? `<span class="admin-tier" style="background:rgba(226,1,93,0.15);color:#9f0b3b;margin-inline-start:6px;">POS</span>`
      : '';

    return `<tr>
      <td><strong>${o.id}</strong>${channelBadge}<div class="admin-sub">${formatDate(o.date)}</div></td>
      <td><div class="admin-user"><div class="admin-user-avatar">${esc((c.name || 'G').charAt(0))}</div><div><div class="admin-user-name">${esc(c.name)}</div><div class="admin-sub">${esc(c.email || '')}</div></div></div></td>
      <td><div class="admin-items">${esc(items)}</div></td>
      <td><strong>${formatPrice(o.total)}</strong><div class="admin-sub">${pay}</div></td>
      <td><span class="order-status status-${o.status}"><i class='${statusIcon(o.status)}'></i> ${t('account.status_' + o.status)}</span></td>
      ${compact ? '' : `<td><select class="admin-status-select" data-status-order="${o.id}">${['processing', 'packing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${t('account.status_' + s)}</option>`).join('')}</select></td><td><div class="admin-row-actions"><button class="admin-mini-btn primary" data-advance="${o.id}" ${(o.status === 'delivered' || o.status === 'cancelled') ? 'disabled' : ''}><i class='bx bx-right-arrow-alt'></i> ${t('admin.advance')}</button><button class="admin-mini-btn danger" data-cancel-order="${o.id}" ${(o.status === 'delivered' || o.status === 'cancelled') ? 'disabled' : ''}><i class='bx bx-x'></i></button></div></td>`}
    </tr>`;
  };

  window.renderAdminRecentOrders = function () {
    const recent = getReportOrders()
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .slice(0, 5);
    const tbody = $('adminRecentOrders');
    if (!tbody) return;

    if (!recent.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="admin-empty-note">${t('admin.noData')}</div></td></tr>`;
      return;
    }
    tbody.innerHTML = recent.map(o => orderRowHtml(o, true)).join('');
  };

  window.renderAdminOrders = function () {
    const counts = { all: orderHistory.length };
    ['processing', 'packing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'].forEach(s => {
      counts[s] = orderHistory.filter(o => o.status === s).length;
    });

    const filters = [
      ['all', t('admin.all')],
      ['processing', t('account.status_processing')],
      ['packing', t('account.status_packing')],
      ['shipped', t('account.status_shipped')],
      ['out_for_delivery', t('account.status_out_for_delivery')],
      ['delivered', t('account.status_delivered')],
      ['cancelled', t('account.status_cancelled')]
    ];

    const filtersEl = $('adminOrderFilters');
    if (filtersEl) {
      filtersEl.innerHTML = filters.map(([k, l]) =>
        `<button class="admin-filter ${adminOrderFilter === k ? 'active' : ''}" data-ofilter="${k}">${l} <span class="flt-count">${counts[k] || 0}</span></button>`
      ).join('');
    }

    const rows = orderHistory
      .filter(o => adminOrderFilter === 'all' || o.status === adminOrderFilter)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));

    const body = $('adminOrdersBody');
    if (body) {
      body.innerHTML = rows.length
        ? rows.map(o => orderRowHtml(o, false)).join('')
        : `<tr><td colspan="7"><div class="admin-empty-note">${t('admin.noData')}</div></td></tr>`;
    }
  };

  window.renderAdminCustomers = function () {
    const q = adminCustomerSearch.toLowerCase();
    const list = customers.filter(c =>
      !q || ((c.name || '') + ' ' + (c.email || '') + ' ' + (c.phone || '') + ' ' + (c.city || ''))
        .toLowerCase().includes(q)
    );

    const tierLabels = {
      vip: t('admin.tierVip'),
      active: t('admin.tierActive'),
      new: t('admin.tierNew')
    };

    const body = $('adminCustomersBody');
    if (!body) return;

    body.innerHTML = list.length ? list.map(c => {
      const st = customerStats(c.id);
      return `<tr>
        <td><div class="admin-user"><div class="admin-user-avatar">${esc((c.name || 'G').charAt(0))}</div><div><div class="admin-user-name">${esc(c.name)}</div><div class="admin-sub">${esc(c.email || '')}</div></div></div></td>
        <td>${esc(c.phone || '—')}</td>
        <td>${esc(c.city || '—')}</td>
        <td>${st.orders}</td>
        <td><strong>${formatPrice(st.spent)}</strong></td>
        <td><span class="admin-tier ${c.tier}">${tierLabels[c.tier] || c.tier || ''}</span></td>
        <td>${formatDate(c.joined)}</td>
        <td><div class="admin-row-actions">
          <button class="admin-mini-btn ghost" data-view-customer="${c.id}"><i class='bx bx-show'></i></button>
          <button class="admin-mini-btn danger" data-del-customer="${c.id}"><i class='bx bx-trash'></i></button>
        </div></td>
      </tr>`;
    }).join('') : `<tr><td colspan="8"><div class="admin-empty-note">${t('admin.noData')}</div></td></tr>`;
  };

  window.renderAdminProducts = function () {
    const sales = productSales();
    const body = $('adminProductsBody');
    if (!body) return;

    body.innerHTML = products.map(p => {
      const s = sales.find(x => x.name === p.name) || { qty: 0, revenue: 0 };
      const stock = Number(p.stock) || 0;
      const cls = stock > 20 ? 'in' : (stock > 0 ? 'low' : 'out');
      const lbl = stock > 20 ? t('admin.stockIn') : (stock > 0 ? t('admin.stockLow') : t('admin.stockOut'));
      const priceShow = p.pricingType === 'tiered'
        ? formatPrice(p.price250) + '+'
        : formatPrice(p.price);

      return `<tr>
        <td><div class="admin-user"><img class="admin-prod-thumb" src="${esc(p.img)}" alt=""><div><div class="admin-user-name">${esc(L(p, 'name'))}</div><div class="admin-sub">${esc(L(p, 'badge') || '')}</div></div></div></td>
        <td><strong>${priceShow}</strong></td>
        <td>${s.qty} <span class="admin-sub">${t('admin.units')}</span></td>
        <td><strong>${formatPrice(s.revenue)}</strong></td>
        <td><span class="admin-stock ${cls}"><i class='bx bx-package'></i> ${lbl} (${stock})</span></td>
      </tr>`;
    }).join('');
  };

  window.renderAdminMessages = function () {
    const el = $('adminMessagesList');
    if (!el) return;

    if (!contactMessages.length) {
      el.innerHTML = `<div class="account-empty"><i class='bx bx-envelope'></i><h3>${t('admin.noMessages')}</h3><p>${t('admin.noMessagesSub')}</p></div>`;
      return;
    }

    el.innerHTML = contactMessages.map(m => `
      <div class="admin-msg ${m.read ? 'read' : ''}">
        <div class="admin-msg-head">
          <div class="admin-user"><div class="admin-user-avatar">${esc((m.name || 'G').charAt(0))}</div><div><div class="admin-user-name">${esc(m.name)}</div><div class="admin-sub">${esc(m.email)} • ${formatDate(m.date)}</div></div></div>
          <div class="admin-msg-actions">
            <button class="admin-mini-btn ghost" data-msg-read="${m.id}"><i class='bx ${m.read ? 'bx-envelope' : 'bx-check-double'}'></i> ${m.read ? t('admin.markUnread') : t('admin.markRead')}</button>
            <button class="admin-mini-btn danger" data-msg-delete="${m.id}"><i class='bx bx-trash'></i></button>
          </div>
        </div>
        <div class="admin-msg-body">${esc(m.message)}</div>
      </div>`).join('');
  };

  /* =====================================================
     2. EMPLOYEE ATTENDANCE & FILTER
     ===================================================== */

  let attendanceRange = 'today';
  let attendanceEmployee = 'all';

  window.loadShifts = function () {
    try {
      const raw = localStorage.getItem(LS_KEYS.employeeShifts);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  };

  window.renderAdminAttendance = function () {
    const body = $('attendanceBody');
    const kpisEl = $('attendanceKpis');
    if (!body) return;

    const shifts = loadShifts();
    const employees = loadEmployees();
    const now = new Date();

    /* === Populate employee filter — ALWAYS refresh === */
    const filterSelect = $('attendanceEmployeeFilter');
    if (filterSelect) {
      const currentVal = attendanceEmployee;
      filterSelect.innerHTML = '<option value="all">All Employees</option>';
      employees.forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp.username;
        opt.textContent = emp.name + ' (@' + emp.username + ')';
        filterSelect.appendChild(opt);
      });
      if (Array.from(filterSelect.options).some(o => o.value === currentVal)) {
        filterSelect.value = currentVal;
      } else {
        attendanceEmployee = 'all';
        filterSelect.value = 'all';
      }
    }

    /* فلترة حسب الموظف */
    let filtered = shifts;
    if (attendanceEmployee !== 'all') {
      filtered = filtered.filter(s => s.username === attendanceEmployee);
    }

    /* فلترة حسب النطاق الزمني */
    let rangeLabel = lang === 'ar' ? 'اليوم' : 'Today';
    if (attendanceRange === 'today') {
      const today = now.toISOString().split('T')[0];
      filtered = filtered.filter(s => {
        try { return new Date(s.checkIn).toISOString().split('T')[0] === today; }
        catch (e) { return false; }
      });
    } else if (attendanceRange === 'week') {
      const start = new Date(now);
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(s => new Date(s.checkIn) >= start);
      rangeLabel = lang === 'ar' ? 'آخر ٧ أيام' : 'Last 7 Days';
    } else {
      rangeLabel = lang === 'ar' ? 'كل الفترات' : 'All Time';
    }

    filtered = [...filtered].sort((a, b) =>
      String(b.checkIn || '').localeCompare(String(a.checkIn || ''))
    );

    /* KPI cards */
    if (kpisEl) {
      const activeNow = shifts.filter(s => !s.checkOut).length;
      const totalShifts = filtered.length;
      const totalMinutes = filtered.reduce((sum, s) => {
        if (!s.checkOut) return sum;
        const diff = (new Date(s.checkOut) - new Date(s.checkIn)) / 60000;
        return sum + (isNaN(diff) ? 0 : Math.max(0, diff));
      }, 0);
      const avgHours = totalShifts
        ? ((totalMinutes / Math.max(1, filtered.filter(s => s.checkOut).length)) / 60).toFixed(1)
        : '0.0';

      kpisEl.innerHTML = `
        <div class="attendance-kpi">
          <div class="attendance-kpi-icon green"><i class='bx bx-user-check'></i></div>
          <div>
            <div class="attendance-kpi-value">${activeNow}</div>
            <div class="attendance-kpi-label">${lang === 'ar' ? 'يعمل الآن' : 'Active Now'}</div>
          </div>
        </div>
        <div class="attendance-kpi">
          <div class="attendance-kpi-icon pink"><i class='bx bx-time'></i></div>
          <div>
            <div class="attendance-kpi-value">${totalShifts}</div>
            <div class="attendance-kpi-label">${lang === 'ar' ? 'دوامات' : 'Shifts'} ${rangeLabel}</div>
          </div>
        </div>
        <div class="attendance-kpi">
          <div class="attendance-kpi-icon blue"><i class='bx bx-hourglass'></i></div>
          <div>
            <div class="attendance-kpi-value">${avgHours}h</div>
            <div class="attendance-kpi-label">${lang === 'ar' ? 'متوسط الدوام' : 'Avg Duration'}</div>
          </div>
        </div>
        <div class="attendance-kpi">
          <div class="attendance-kpi-icon gold"><i class='bx bx-group'></i></div>
          <div>
            <div class="attendance-kpi-value">${employees.length}</div>
            <div class="attendance-kpi-label">${lang === 'ar' ? 'إجمالي الموظفين' : 'Total Employees'}</div>
          </div>
        </div>`;
    }

    /* الجدول */
    if (!filtered.length) {
      body.innerHTML = `<tr><td colspan="7">
        <div class="attendance-empty">
          <i class='bx bx-time-five'></i>
          <p>${lang === 'ar' ? 'لا توجد سجلات دوام لهذا الموظف في' : 'No attendance records for this employee in'} ${rangeLabel}</p>
        </div>
      </td></tr>`;
      return;
    }

    body.innerHTML = filtered.map(s => {
      const emp = employees.find(e => e.username === s.username) || { role: 'Cashier' };
      const checkIn  = new Date(s.checkIn);
      const checkOut = s.checkOut ? new Date(s.checkOut) : null;

      const dateStr = checkIn.toLocaleDateString(lang === 'ar' ? 'ar-JO' : 'en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
      const inStr = checkIn.toLocaleTimeString(lang === 'ar' ? 'ar-JO' : 'en-GB', {
        hour: '2-digit', minute: '2-digit'
      });
      const outStr = checkOut
        ? checkOut.toLocaleTimeString(lang === 'ar' ? 'ar-JO' : 'en-GB', { hour: '2-digit', minute: '2-digit' })
        : '—';

      let durationTxt = '—';
      let statusBadge = '';

      if (!checkOut) {
        const mins = Math.floor((Date.now() - checkIn.getTime()) / 60000);
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        durationTxt = `${h}h ${m}m`;
        statusBadge = `<span class="attendance-status active">● ${lang === 'ar' ? 'يعمل الآن' : 'Working Now'}</span>`;
      } else {
        const mins = Math.floor((checkOut - checkIn) / 60000);
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        durationTxt = `${h}h ${m}m`;
        statusBadge = `<span class="attendance-status done">✓ ${lang === 'ar' ? 'انتهى' : 'Completed'}</span>`;
      }

      const initial = (s.name || s.username || 'E').charAt(0).toUpperCase();

      return `<tr>
        <td>
          <div class="admin-user">
            <div class="admin-user-avatar">${esc(initial)}</div>
            <div>
              <div class="admin-user-name">${esc(s.name || s.username || 'Unknown')}</div>
              <div class="admin-sub">@${esc(s.username || '')}</div>
            </div>
          </div>
        </td>
        <td>${esc(emp.role || 'Cashier')}</td>
        <td>${dateStr}</td>
        <td><strong>${inStr}</strong></td>
        <td>${outStr}</td>
        <td><span class="attendance-duration">${durationTxt}</span></td>
        <td>${statusBadge}</td>
      </tr>`;
    }).join('');
  };

  /* =====================================================
     3. SECURED REPORTS
     ===================================================== */

  window.getRangeStart = function (range) {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    if (range === 'daily')   return start;
    if (range === 'weekly')  { start.setDate(start.getDate() - 6);  return start; }
    if (range === 'monthly') { start.setDate(start.getDate() - 29); return start; }
    return null;
  };

  window.getReportOrders = function () {
    const start = getRangeStart(reportRange);
    if (!start) return orderHistory.slice();
    return orderHistory.filter(o => new Date(o.date) >= start);
  };

  window.getReportRangeLabel = function (range) {
    const labels = {
      daily:   { en: 'Today',        ar: 'اليوم' },
      weekly:  { en: 'Last 7 Days',  ar: 'آخر ٧ أيام' },
      monthly: { en: 'Last 30 Days', ar: 'آخر ٣٠ يوماً' },
      all:     { en: 'All Time',     ar: 'كل الفترات' }
    };
    const l = labels[range] || labels.weekly;
    return lang === 'ar' ? l.ar : l.en;
  };

  window.tryUnlockOverview = function () {
    const input = $('overviewPassword');
    const error = $('overviewGateError');
    const value = (input.value || '').trim();

    if (value === OVERVIEW_SECRET) {
      overviewUnlocked = true;
      $('overviewGate').style.display = 'none';
      $('overviewContent').style.display = 'block';
      input.value = '';
      input.classList.remove('error');
      error.textContent = '';
      refreshOverviewReports();
      showToast(lang === 'ar' ? 'تم فتح التقارير' : 'Reports unlocked', 'bx-lock-open-alt');
    } else {
      error.textContent = lang === 'ar' ? 'كلمة المرور غير صحيحة' : 'Incorrect password. Please try again.';
      input.classList.add('error');
      input.value = '';
      setTimeout(() => input.classList.remove('error'), 550);
      input.focus();
    }
  };

  window.lockOverview = function () {
    overviewUnlocked = false;
    $('overviewGate').style.display = 'flex';
    $('overviewContent').style.display = 'none';
    $('overviewPassword').value = '';
    $('overviewGateError').textContent = '';
    showToast(lang === 'ar' ? 'تم قفل التقارير' : 'Reports locked', 'bx-lock-alt');
  };

  window.refreshOverviewReports = function () {
    if (!overviewUnlocked) return;
    renderAdminKpis();
    renderAdminChart();
    renderAdminTopProducts();
    renderAdminRecentOrders();
    const tag = $('adminChartTag');
    if (tag) tag.textContent = getReportRangeLabel(reportRange);
  };

  window.buildPrintReportHTML = function () {
    const orders = getReportOrders();
    const act = orders.filter(o => o.status !== 'cancelled');
    const revenue = act.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const deliveredRev = orders.filter(o => o.status === 'delivered')
      .reduce((s, o) => s + (Number(o.total) || 0), 0);
    const pending = orders.filter(o => ['processing', 'packing'].includes(o.status)).length;
    const aov = act.length ? revenue / act.length : 0;
    const now = new Date();

    const salesMap = {};
    act.forEach(o => (o.itemsList || []).forEach(it => {
      const key = it.name;
      if (!salesMap[key]) salesMap[key] = { name: it.name, qty: 0, revenue: 0 };
      salesMap[key].qty += Number(it.qty) || 0;
      salesMap[key].revenue += (Number(it.qty) || 0) * (Number(it.price) || 0);
    }));

    const topProducts = Object.values(salesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
    const recent = [...orders].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 25);
    const rangeLabel = getReportRangeLabel(reportRange);
    const storeName = (typeof getStoreInfoFromStorage === 'function')
      ? getStoreInfoFromStorage().name
      : 'Hat Candy';

    return `
      <div class="print-header">
        <div class="print-brand">${esc(storeName)}<span>.</span></div>
        <div class="print-tagline">Every Candy Begins with Magic</div>
        <h1 class="print-title">SALES &amp; OPERATIONS REPORT</h1>
        <div class="print-meta">
          <span><strong>Range:</strong> ${esc(rangeLabel)}</span>
          <span><strong>Generated:</strong> ${now.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          <span><strong>Orders:</strong> ${orders.length}</span>
        </div>
      </div>
      <div class="print-kpis">
        <div class="print-kpi"><div class="print-kpi-value">${formatPrice(revenue)}</div><div class="print-kpi-label">Total Revenue</div></div>
        <div class="print-kpi"><div class="print-kpi-value">${orders.length}</div><div class="print-kpi-label">Total Orders</div></div>
        <div class="print-kpi"><div class="print-kpi-value">${customers.length}</div><div class="print-kpi-label">Customers</div></div>
        <div class="print-kpi"><div class="print-kpi-value">${formatPrice(aov)}</div><div class="print-kpi-label">Avg. Order Value</div></div>
        <div class="print-kpi"><div class="print-kpi-value">${pending}</div><div class="print-kpi-label">Pending Orders</div></div>
        <div class="print-kpi"><div class="print-kpi-value">${formatPrice(deliveredRev)}</div><div class="print-kpi-label">Delivered Revenue</div></div>
      </div>
      <div class="print-section">
        <h2>Top Selling Products</h2>
        <table class="print-table"><thead><tr><th>#</th><th>Product</th><th>Units</th><th>Revenue</th></tr></thead>
        <tbody>${topProducts.length ? topProducts.map((p, i) => `<tr><td>${i + 1}</td><td>${esc(p.name)}</td><td>${p.qty}</td><td>${formatPrice(p.revenue)}</td></tr>`).join('') : `<tr><td colspan="4" class="print-empty">No sales data</td></tr>`}</tbody></table>
      </div>
      <div class="print-section">
        <h2>Order Details</h2>
        <table class="print-table"><thead><tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>${recent.length ? recent.map(o => {
          const c = custById(o.customerId);
          const qty = (o.itemsList || []).reduce((s, i) => s + (Number(i.qty) || 0), 0);
          return `<tr><td><strong>${o.id}</strong></td><td>${formatDate(o.date)}</td><td>${esc(c.name)}</td><td>${qty}</td><td>${formatPrice(o.total)}</td><td>${t('account.status_' + o.status)}</td></tr>`;
        }).join('') : `<tr><td colspan="6" class="print-empty">No orders in this range</td></tr>`}</tbody></table>
        <div class="print-total-row"><span>REPORT TOTAL</span><span>${formatPrice(revenue)}</span></div>
      </div>
      <div class="print-signature">
        <div><span class="line"></span>Prepared By</div>
        <div><span class="line"></span>Reviewed By</div>
        <div><span class="line"></span>Authorized Signature</div>
      </div>
      <div class="print-footer">
        <strong>${esc(storeName)}</strong> — Amman, Jordan · Magic Avenue<br>
        Every Candy Begins with Magic ✨<br>
        Generated ${now.toLocaleString('en-GB')} · Computer-generated report
      </div>`;
  };

  window.printReport = function () {
    const el = $('printReport');
    if (!el) return;
    el.innerHTML = buildPrintReportHTML();
    setTimeout(() => { window.print(); }, 120);
  };

  window.setOrderStatus = async function (id, status) {
    const o = orderHistory.find(x => x.id === id);
    if (!o) return;
    if (o.status === status) { renderAdmin(); return; }

    o.status = status;
    const today = new Date().toISOString().split('T')[0];
    if (status === 'packing' && !o.packedAt) o.packedAt = today;
    if (status === 'shipped') {
      o.shippedAt = o.shippedAt || today;
      if (!o.tracking) o.tracking = 'JD-EXP-' + Math.floor(100000 + Math.random() * 899999);
    }
    if (status === 'out_for_delivery') o.outAt = o.outAt || today;
    if (status === 'delivered') {
      o.deliveredAt = o.deliveredAt || today;
      o.eta = o.eta || today;
    }

    /* ⚡ persist orderHistory */
    if (typeof persistOrderHistory === 'function') persistOrderHistory();

    if (window.Api) {
      try {
        await window.Api.updateOrderStatus(id, status);
      } catch (err) {
        console.warn('[setOrderStatus] cloud sync failed:', err.message);
      }
    }

    renderAdmin();
    if ($('accountPage') && $('accountPage').classList.contains('show')) renderAccountPage();
    showToast(t('admin.statusUpdated', { id: o.id, status: t('account.status_' + status) }), 'bx-check-circle');
  };

  window.advanceOrder = function (id) {
    const o = orderHistory.find(x => x.id === id);
    if (!o) return;
    const i = STATUS_FLOW.indexOf(o.status);
    if (i === -1 || i >= STATUS_FLOW.length - 1) return;
    setOrderStatus(id, STATUS_FLOW[i + 1]);
  };

  window.exportOrdersCsv = function () {
    const rows = [['Order ID', 'Customer', 'Email', 'Date', 'Items', 'Total', 'Currency', 'Status', 'Payment', 'Channel', 'Served By']];
    orderHistory.forEach(o => {
      const c = custById(o.customerId);
      const qty = (o.itemsList || []).reduce((s, i) => s + (Number(i.qty) || 0), 0);
      rows.push([
        o.id, c.name, c.email, o.date, qty,
        (Number(o.total) || 0).toFixed(2), CURRENCY_CODE,
        t('account.status_' + o.status), o.payment, o.channel || 'online', o.servedBy || ''
      ]);
    });
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hat-candy-orders-' + new Date().toISOString().split('T')[0] + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t('admin.exported'), 'bx-download');
  };

  window.openAdminCustomerModal = function (customerId) {
    const c = customers.find(x => x.id === customerId);
    if (!c) return;

    const stats = customerStats(c.id);
    const orders = orderHistory.filter(o => o.customerId === c.id);

    $('adminCustomerName').textContent = c.name || 'Customer';
    $('adminCustomerEmail').textContent = c.email || '';
    $('adminCustomerBody').innerHTML = `
      <div class="account-stats" style="margin-bottom:16px;">
        <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-receipt'></i></div><div><div class="account-stat-value">${stats.orders}</div><div class="account-stat-label">Orders</div></div></div>
        <div class="account-stat"><div class="account-stat-icon"><i class='bx bx-dollar-circle'></i></div><div><div class="account-stat-value">${formatPrice(stats.spent)}</div><div class="account-stat-label">Total Spent</div></div></div>
      </div>
      <div class="owner-form-grid" style="margin-bottom:16px;">
        <div class="form-group"><label>Phone</label><input type="text" id="adminCustPhone" value="${esc(c.phone || '')}"></div>
        <div class="form-group"><label>City</label><input type="text" id="adminCustCity" value="${esc(c.city || '')}"></div>
        <div class="form-group"><label>Tier</label><select id="adminCustTier"><option value="new" ${c.tier === 'new' ? 'selected' : ''}>New</option><option value="active" ${c.tier === 'active' ? 'selected' : ''}>Active</option><option value="vip" ${c.tier === 'vip' ? 'selected' : ''}>VIP</option></select></div>
      </div>
      <h4 style="margin:14px 0 10px;font-family:var(--font-heading);color:var(--primary);font-weight:400;">Recent Orders</h4>
      <div class="admin-table-wrap" style="box-shadow:none;padding:0;">
        <table class="admin-table"><thead><tr><th>ID</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>${orders.length ? orders.map(o => `<tr><td><strong>${o.id}</strong></td><td>${formatDate(o.date)}</td><td>${formatPrice(o.total)}</td><td><span class="order-status status-${o.status}">${t('account.status_' + o.status)}</span></td></tr>`).join('') : `<tr><td colspan="4"><div class="admin-empty-note">No orders</div></td></tr>`}</tbody></table>
      </div>
      <div style="display:flex;justify-content:space-between;gap:8px;margin-top:18px;">
        <button class="owner-btn danger" id="adminCustDelete"><i class='bx bx-trash'></i> Delete</button>
        <div style="display:flex;gap:8px;">
          <button class="owner-btn ghost" data-close-owner-modal>Cancel</button>
          <button class="owner-btn primary" id="adminCustSave"><i class='bx bx-save'></i> Save</button>
        </div>
      </div>`;

    $('adminCustomerModal').classList.add('show');

    $('adminCustSave').addEventListener('click', () => {
      c.phone = $('adminCustPhone').value.trim();
      c.city = $('adminCustCity').value.trim();
      c.tier = $('adminCustTier').value;
      /* ⚡ persist */
      if (typeof persistCustomers === 'function') persistCustomers();
      renderAdmin();
      $('adminCustomerModal').classList.remove('show');
      showToast('Customer updated', 'bx-check-circle');
    });

    $('adminCustDelete').addEventListener('click', () => {
      if (!confirm('Delete this customer? Their orders will remain.')) return;
      customers = customers.filter(x => x.id !== c.id);
      /* ⚡ persist */
      if (typeof persistCustomers === 'function') persistCustomers();
      renderAdmin();
      $('adminCustomerModal').classList.remove('show');
      showToast('Customer deleted', 'bx-trash');
    });
  };

  /* =====================================================
     4. STORE INFO — DYNAMIC MANAGEMENT
     ===================================================== */

  const DEFAULT_STORE_INFO = {
    name:      'Hat Candy',
    nameAr:    'هات كاندي',
    slogan:    'Every Candy Begins with Magic',
    sloganAr:  'كل قطعة حلوى تبدأ بالسحر',
    address:   'Amman, Jordan — Magic Avenue',
    addressAr: 'عمّان، الأردن — شارع السحر',
    phone:     '+962 7 9876 5432',
    email:     'hello@hatcandy.jo',
    logo:      '',
    taxRate:   0.10
  };

  window.getStoreInfoFromStorage = function () {
    try {
      const raw = localStorage.getItem(LS_KEYS.storeInfo);
      if (raw) return { ...DEFAULT_STORE_INFO, ...JSON.parse(raw) };
    } catch (e) {}
    return { ...DEFAULT_STORE_INFO };
  };

  window.saveStoreInfoToStorage = function (data) {
    try {
      localStorage.setItem(LS_KEYS.storeInfo, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('[StoreInfo] Save failed:', e);
      return false;
    }
  };

  window.renderOwnerStoreInfo = function () {
    const info = getStoreInfoFromStorage();

    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };

    set('storeInfoName',      info.name);
    set('storeInfoNameAr',    info.nameAr);
    set('storeInfoSlogan',    info.slogan);
    set('storeInfoSloganAr',  info.sloganAr);
    set('storeInfoAddress',   info.address);
    set('storeInfoAddressAr', info.addressAr);
    set('storeInfoPhone',     info.phone);
    set('storeInfoEmail',     info.email);
    set('storeInfoLogo',      info.logo);
    set('storeInfoTaxRate',   (Number(info.taxRate) * 100).toFixed(1));

    const preview = document.getElementById('storeInfoLogoPreview');
    if (preview) {
      preview.innerHTML = info.logo
        ? `<img src="${esc(info.logo)}" alt="Logo" style="max-height:80px;max-width:220px;border-radius:12px;border:2px dashed rgba(226,1,93,.25);padding:8px;background:#fff;">`
        : `<span style="font-size:.75rem;color:#8a7a85;">No logo — will display text name.</span>`;
    }
  };

  window.bindStoreInfoHandlers = function () {
    const saveBtn     = document.getElementById('storeInfoSave');
    const resetBtn    = document.getElementById('storeInfoReset');
    const uploadInput = document.getElementById('storeInfoLogoFile');
    const clearBtn    = document.getElementById('storeInfoLogoClear');
    const logoInput   = document.getElementById('storeInfoLogo');

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const taxPercent = parseFloat(document.getElementById('storeInfoTaxRate').value) || 0;

        const data = {
          name:      (document.getElementById('storeInfoName')?.value      || '').trim() || DEFAULT_STORE_INFO.name,
          nameAr:    (document.getElementById('storeInfoNameAr')?.value    || '').trim() || DEFAULT_STORE_INFO.nameAr,
          slogan:    (document.getElementById('storeInfoSlogan')?.value    || '').trim() || DEFAULT_STORE_INFO.slogan,
          sloganAr:  (document.getElementById('storeInfoSloganAr')?.value  || '').trim() || DEFAULT_STORE_INFO.sloganAr,
          address:   (document.getElementById('storeInfoAddress')?.value   || '').trim() || DEFAULT_STORE_INFO.address,
          addressAr: (document.getElementById('storeInfoAddressAr')?.value || '').trim() || DEFAULT_STORE_INFO.addressAr,
          phone:     (document.getElementById('storeInfoPhone')?.value     || '').trim() || DEFAULT_STORE_INFO.phone,
          email:     (document.getElementById('storeInfoEmail')?.value     || '').trim() || DEFAULT_STORE_INFO.email,
          logo:      (logoInput?.value || '').trim(),
          taxRate:   taxPercent / 100
        };

        if (saveStoreInfoToStorage(data)) {
          showToast('تم حفظ معلومات المتجر ✨', 'bx-check-circle');
          renderOwnerStoreInfo();
          applyStoreInfoToSite();
          if (typeof applySiteConfig === 'function') applySiteConfig();
        } else {
          showToast('فشل الحفظ — تحقق من مساحة التخزين', 'bx-error-circle');
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (!confirm('إعادة تعيين معلومات المتجر إلى القيم الافتراضية؟')) return;
        saveStoreInfoToStorage({ ...DEFAULT_STORE_INFO });
        renderOwnerStoreInfo();
        applyStoreInfoToSite();
        if (typeof applySiteConfig === 'function') applySiteConfig();
        showToast('تمت إعادة التعيين', 'bx-reset');
      });
    }

    if (uploadInput) {
      uploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 200 * 1024) {
          showToast('الصورة كبيرة (الحد الأقصى 200KB)', 'bx-error-circle');
          e.target.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
          if (logoInput) logoInput.value = ev.target.result;
          const preview = document.getElementById('storeInfoLogoPreview');
          if (preview) {
            preview.innerHTML = `<img src="${ev.target.result}" alt="Logo" style="max-height:80px;max-width:220px;border-radius:12px;border:2px dashed rgba(226,1,93,.25);padding:8px;background:#fff;">`;
          }
          showToast('تم رفع الشعار — اضغط حفظ للتأكيد', 'bx-image');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (logoInput) logoInput.value = '';
        const preview = document.getElementById('storeInfoLogoPreview');
        if (preview) {
          preview.innerHTML = `<span style="font-size:.75rem;color:#8a7a85;">No logo — will display text name.</span>`;
        }
      });
    }
  };

  window.applyStoreInfoToSite = function () {
    const info = getStoreInfoFromStorage();
    const isAr = (typeof lang !== 'undefined' && lang === 'ar');
    const displayName = (isAr && info.nameAr) ? info.nameAr : info.name;
    const displaySlogan = (isAr && info.sloganAr) ? info.sloganAr : info.slogan;

    document.querySelectorAll('.logo, footer .logo, .login-brand, .account-brand, .hero h1').forEach(el => {
      const hasSpan = el.querySelector('span');
      if (hasSpan && el.childNodes.length > 0 && el.childNodes[0].nodeType === 3) {
        el.childNodes[0].textContent = displayName;
      } else if (!hasSpan) {
        el.textContent = displayName;
      }
    });

    if (info.logo) {
      document.querySelectorAll('[data-store-logo]').forEach(el => {
        el.innerHTML = `<img src="${esc(info.logo)}" alt="${esc(displayName)}" style="max-height:42px;max-width:180px;object-fit:contain;display:block;">`;
      });
    }

    const phoneEl = document.querySelector('[data-contact-phone]');
    const emailEl = document.querySelector('[data-contact-email]');
    if (phoneEl && info.phone) phoneEl.textContent = info.phone;
    if (emailEl && info.email) emailEl.textContent = info.email;

    if (displayName) {
      document.title = displayName + ' | ' + (displaySlogan || 'Every Candy Begins with Magic');
    }
  };

  /* =====================================================
     5. OWNER PANEL
     ===================================================== */

  window.signInAsOwner = function () {
    isOwner = true;
    isAdmin = true;
    currentUser = { id: 'owner', name: 'Developer', email: '0782342105', role: 'owner' };

    /* ⚡ Reset payment card for safety */
    cartPayment.card = { number: '', name: '', expiry: '', cvv: '', save: false, savedId: null };

    $('loginFormWrapper').style.display = 'none';
    $('loginSuccess').classList.add('show');
    $('successMessage').textContent = 'Full access granted ✨';
    $('loginBtn').classList.add('signed-in');
    $('userInitial').textContent = 'D';
    updateMobileAccountUI();

    setTimeout(() => {
      closeAllPanels();
      openOwnerPage();
      showToast(t('toast.ownerWelcome'), 'bx-code-alt');
    }, 900);
  };

  window.openOwnerPage = function () {
    if (!isOwner) return;
    $('ownerPage').classList.add('show');
    lockBodyScroll();
    const fs = $('floatingSign');
    if (fs) fs.classList.add('hide');
    renderOwner();
    switchOwnerTab(ownerTab);
    setTimeout(updateOwnerTabsScrollBtns, 60);
  };

  window.closeOwnerPage = function () {
    $('ownerPage').classList.remove('show');
    const stillOpen =
      $('cartPanel').classList.contains('show') ||
      $('loginPanel').classList.contains('show') ||
      $('mixModal').classList.contains('show') ||
      $('accountPage').classList.contains('show') ||
      $('adminPage').classList.contains('show') ||
      $('weightModal').classList.contains('show');
    if (!stillOpen) {
      unlockBodyScroll();
      const fs = $('floatingSign');
      if (fs) fs.classList.remove('hide');
    }
  };

  window.switchOwnerTab = function (tab) {
    ownerTab = tab;
    document.querySelectorAll('#ownerPage .account-tab').forEach(x =>
      x.classList.toggle('active', x.dataset.otab === tab)
    );
    document.querySelectorAll('#ownerPage .account-pane').forEach(p =>
      p.classList.toggle('active', p.dataset.opane === tab)
    );
  };

  window.updateOwnerTabsScrollBtns = function () {
    const vp = $('ownerTabsViewport');
    const left = $('ownerTabsLeft');
    const right = $('ownerTabsRight');
    if (!vp || !left || !right) return;
    const atStart = vp.scrollLeft <= 4;
    const atEnd = vp.scrollLeft + vp.clientWidth >= vp.scrollWidth - 4;
    left.disabled = atStart;
    right.disabled = atEnd;
  };

  window.renderOwner = function () {
    if ($('ownerProductsCount')) $('ownerProductsCount').textContent = products.length;
    if ($('ownerOffersCount'))   $('ownerOffersCount').textContent   = offers.length;
    if ($('ownerGalleryCount'))  $('ownerGalleryCount').textContent  = galleryImages.length;

    renderOwnerStats();
    renderOwnerProducts();
    renderOwnerOffers();
    renderOwnerGallery();
    renderOwnerMixBuilder();
    renderOwnerAddons();
    renderOwnerDelivery();
    renderStoreHours();
    renderOwnerCMS();
    if (typeof renderOwnerStoreInfo === 'function') renderOwnerStoreInfo();
  };

  window.renderStoreHours = function () {
    if ($('ownerOpenHour'))  $('ownerOpenHour').value  = storeHours.open;
    if ($('ownerCloseHour')) $('ownerCloseHour').value = storeHours.close;
  };

  window.renderOwnerStats = function () {
    const stats = [
      { icon: 'bx-package',      value: products.length,                label: 'Products' },
      { icon: 'bx-purchase-tag', value: offers.length,                  label: 'Offers' },
      { icon: 'bx-check-circle', value: offers.filter(o => o.isActive).length, label: 'Active Offers' },
      { icon: 'bx-image',        value: galleryImages.length,           label: 'Gallery Items' },
      { icon: 'bx-plus-circle',  value: addons.length,                  label: 'Add-ons' },
      { icon: 'bx-error-circle', value: products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 20).length, label: 'Low Stock' }
    ];
    const el = $('ownerStats');
    if (!el) return;
    el.innerHTML = stats.map(s =>
      `<div class="owner-stat"><div class="owner-stat-icon"><i class='bx ${s.icon}'></i></div><div class="owner-stat-value">${s.value}</div><div class="owner-stat-label">${s.label}</div></div>`
    ).join('');
  };

  window.renderOwnerProducts = function () {
    const body = $('ownerProductsBody');
    if (!body) return;

    if (!products.length) {
      body.innerHTML = `<tr><td colspan="8"><div class="owner-empty"><i class='bx bx-package'></i><p>No products yet</p></div></td></tr>`;
      return;
    }

    body.innerHTML = products.map(p => {
      const cat = p.category === 'chocolate' ? 'Chocolate' : 'Candy';
      const mode = p.pricingType === 'tiered'
        ? '<span class="owner-chip-toggle on">Tiered</span>'
        : '<span class="owner-chip-toggle off">Fixed</span>';
      const p250  = p.pricingType === 'tiered' ? formatPrice(p.price250)  : '—';
      const p500  = p.pricingType === 'tiered' ? formatPrice(p.price500)  : '—';
      const p1000 = p.pricingType === 'tiered' ? formatPrice(p.price1000) : formatPrice(p.price);

      return `
        <tr>
          <td><div class="admin-user"><img class="owner-thumb" src="${esc(p.img)}" alt=""><div><div class="admin-user-name">${esc(p.name)}</div><div class="admin-sub">${esc(p.name_ar || '')}</div></div></div></td>
          <td><span class="owner-chip-toggle ${p.category === 'chocolate' ? 'on' : 'off'}">${cat}</span></td>
          <td>${mode}</td>
          <td>${p250}</td>
          <td>${p500}</td>
          <td>${p1000}</td>
          <td>${p.stock}</td>
          <td><div class="admin-row-actions"><button class="owner-btn primary" data-edit-product="${esc(p.id)}"><i class='bx bx-edit'></i> Edit</button><button class="owner-btn danger" data-delete-product="${esc(p.id)}"><i class='bx bx-trash'></i></button></div></td>
        </tr>`;
    }).join('');
  };

  window.renderOwnerOffers = function () {
    const body = $('ownerOffersBody');
    if (!body) return;

    if (!offers.length) {
      body.innerHTML = `<tr><td colspan="6"><div class="owner-empty"><i class='bx bx-purchase-tag'></i><p>No offers yet</p></div></td></tr>`;
      return;
    }

    body.innerHTML = offers.map(o => `
      <tr>
        <td><div class="admin-user"><img class="owner-thumb" src="${esc(o.img)}" alt=""><div><div class="admin-user-name">${esc(o.name)}</div><div class="admin-sub">${esc(o.name_ar || '')}</div></div></div></td>
        <td>${esc(o.category || '—')}</td>
        <td><strong>${formatPrice(o.price)}</strong></td>
        <td>${esc(o.discount || '—')}</td>
        <td>${o.isActive ? '<span class="admin-tier active">Active</span>' : '<span class="admin-tier" style="background:rgba(107,114,128,0.15);color:#4b5563;">Inactive</span>'}</td>
        <td><div class="admin-row-actions"><button class="owner-btn primary" data-edit-offer="${esc(o.id)}"><i class='bx bx-edit'></i> Edit</button><button class="owner-btn danger" data-delete-offer="${esc(o.id)}"><i class='bx bx-trash'></i></button></div></td>
      </tr>`).join('');
  };

  window.renderOwnerGallery = function () {
    const grid = $('ownerGalleryGrid');
    if (!grid) return;

    grid.innerHTML = galleryImages.map(g =>
      `<div class="owner-gallery-item"><img src="${esc(g.img)}" alt="${esc(g.alt || '')}"><button class="owner-gallery-remove" data-delete-gallery="${g.id}"><i class='bx bx-trash'></i></button></div>`
    ).join('') + `<div class="owner-gallery-add" id="ownerAddGalleryTile"><i class='bx bx-plus'></i><span>Add Image</span></div>`;

    const tile = $('ownerAddGalleryTile');
    if (tile) tile.addEventListener('click', openOwnerGalleryModal);
  };

  window.renderOwnerMixBuilder = function () {
    const wl = $('ownerWeightsList');
    if (wl) {
      wl.innerHTML = mixWeights.length
        ? [...mixWeights].sort((a, b) => a - b).map(w =>
            `<div class="owner-list-item"><div class="owner-list-thumb"><i class='bx bx-weight'></i></div><div class="owner-list-info"><div class="owner-list-title">${w} g</div><div class="owner-list-meta">${(w / 1000).toFixed(3)} kg</div></div><div class="owner-list-actions"><button class="owner-icon-btn edit" data-edit-weight="${w}"><i class='bx bx-edit'></i></button><button class="owner-icon-btn del" data-del-weight="${w}"><i class='bx bx-trash'></i></button></div></div>`
          ).join('')
        : `<div class="owner-empty"><i class='bx bx-weight'></i><p>No weights yet</p></div>`;
    }

    const pl = $('ownerPackagingList');
    if (pl) {
      pl.innerHTML = mixPackaging.length
        ? mixPackaging.map(p =>
            `<div class="owner-list-item">${p.img ? `<img class="owner-list-thumb" src="${esc(p.img)}" alt="">` : `<div class="owner-list-thumb"><i class='bx ${p.icon || 'bx-box'}'></i></div>`}<div class="owner-list-info"><div class="owner-list-title">${esc(p.name)} <span style="opacity:.6;font-weight:500">/ ${esc(p.name_ar || '')}</span></div><div class="owner-list-meta">${Number(p.extra) === 0 ? 'Free' : '+ ' + formatPrice(p.extra)}</div></div><div class="owner-list-actions"><button class="owner-icon-btn edit" data-edit-pack="${esc(p.id)}"><i class='bx bx-edit'></i></button><button class="owner-icon-btn del" data-del-pack="${esc(p.id)}"><i class='bx bx-trash'></i></button></div></div>`
          ).join('')
        : `<div class="owner-empty"><i class='bx bx-package'></i><p>No packaging yet</p></div>`;
    }

    const cl = $('ownerCandyTypesList');
    if (cl) {
      cl.innerHTML = candyTypes.length
        ? candyTypes.map(c => {
            const sale = Number(c.sale_price_per_kg) || 0;
            const base = Number(c.price_per_kg) || 0;
            const priceTxt = (sale > 0 && sale < base)
              ? `<s>${formatPrice(base)}</s> → ${formatPrice(sale)} / kg`
              : `${formatPrice(base)} / kg`;
            return `<div class="owner-list-item"><img class="owner-list-thumb" src="${esc(c.img)}" alt=""><div class="owner-list-info"><div class="owner-list-title"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c.color};margin-inline-end:6px;vertical-align:middle;"></span>${esc(c.name)} <span style="opacity:.6;font-weight:500">/ ${esc(c.name_ar || '')}</span></div><div class="owner-list-meta">${priceTxt}</div></div><div class="owner-list-actions"><button class="owner-icon-btn edit" data-edit-candy="${esc(c.id)}"><i class='bx bx-edit'></i></button><button class="owner-icon-btn del" data-del-candy="${esc(c.id)}"><i class='bx bx-trash'></i></button></div></div>`;
          }).join('')
        : `<div class="owner-empty"><i class='bx bx-candy'></i><p>No candy types yet</p></div>`;
    }
  };

  window.renderOwnerAddons = function () {
    const list = $('ownerAddonsList');
    if (!list) return;

    if (!addons.length) {
      list.innerHTML = `<div class="owner-empty"><i class='bx bx-plus-circle'></i><p>No add-ons yet</p></div>`;
      return;
    }

    list.innerHTML = addons.map(a => {
      const visual = a.img
        ? `<img class="owner-list-thumb" src="${esc(a.img)}" alt="">`
        : `<div class="owner-list-thumb"><i class='bx ${a.icon || 'bx-plus-circle'}'></i></div>`;
      return `<div class="owner-list-item">
        ${visual}
        <div class="owner-list-info">
          <div class="owner-list-title">${esc(a.name)} <span style="opacity:.6;font-weight:500">/ ${esc(a.name_ar || '')}</span></div>
          <div class="owner-list-meta">${formatPrice(a.price)} · ${esc(a.desc || '')}</div>
        </div>
        <span class="owner-chip-toggle ${a.active !== false ? 'on' : 'off'}">${a.active !== false ? 'Active' : 'Off'}</span>
        <div class="owner-list-actions">
          <button class="owner-icon-btn edit" data-edit-addon="${esc(a.id)}"><i class='bx bx-edit'></i></button>
          <button class="owner-icon-btn del" data-del-addon="${esc(a.id)}"><i class='bx bx-trash'></i></button>
        </div>
      </div>`;
    }).join('');
  };

  window.renderOwnerDelivery = function () {
    const zl = $('ownerZonesList');
    if (!zl) return;

    zl.innerHTML = deliveryZones.length
      ? deliveryZones.map(z =>
          `<div class="owner-list-item"><div class="owner-list-thumb"><i class='bx bx-map-pin'></i></div><div class="owner-list-info"><div class="owner-list-title">${esc(z.name)} <span style="opacity:.6;font-weight:500">/ ${esc(z.name_ar || '')}</span></div><div class="owner-list-meta">${formatPrice(z.price)}</div></div><span class="owner-chip-toggle ${z.active ? 'on' : 'off'}">${z.active ? 'Active' : 'Off'}</span><div class="owner-list-actions"><button class="owner-icon-btn edit" data-edit-zone="${esc(z.id)}"><i class='bx bx-edit'></i></button><button class="owner-icon-btn del" data-del-zone="${esc(z.id)}"><i class='bx bx-trash'></i></button></div></div>`
        ).join('')
      : `<div class="owner-empty"><i class='bx bx-cycling'></i><p>No delivery zones yet</p></div>`;
  };

  window.renderOwnerCMS = function () {
    document.querySelectorAll('[data-cms]').forEach(el => {
      const key = el.dataset.cms;
      const la = el.closest('[data-cms-lang]') ? el.closest('[data-cms-lang]').dataset.cmsLang : 'en';
      const dict = I18N[la] || I18N.en;
      el.value = dict[key] || '';
    });

    const phE = document.querySelector('[data-cms-contact="phone"]');
    const emE = document.querySelector('[data-cms-contact="email"]');
    const phS = document.querySelector('[data-contact-phone]');
    const emS = document.querySelector('[data-contact-email]');
    if (phE && phS) phE.value = phS.textContent || '';
    if (emE && emS) emE.value = emS.textContent || '';

    document.querySelectorAll('[data-site]').forEach(el => {
      const key = el.dataset.site;
      el.value = siteConfig[key] || '';
    });
  };

  window.applySiteConfig = function () {
    const sc = siteConfig;

    const storeInfo = (typeof getStoreInfoFromStorage === 'function') ? getStoreInfoFromStorage() : null;
    const logoText = (storeInfo && storeInfo.name) || sc.logoText;

    if (logoText) {
      document.querySelectorAll('.logo, .account-brand, footer .logo, .login-brand').forEach(el => {
        const hasSpan = el.querySelector('span');
        if (hasSpan && el.childNodes.length > 0 && el.childNodes[0].nodeType === 3) {
          el.childNodes[0].textContent = logoText;
        } else if (!hasSpan) {
          el.textContent = logoText;
        }
      });
    }

    if (sc.heroBg) {
      const hero = document.querySelector('.hero');
      if (hero) {
        hero.style.backgroundImage = `linear-gradient(135deg, rgba(253,244,229,.92), rgba(253,244,229,.75)), url('${sc.heroBg}')`;
      }
    }

    if (sc.aboutImg) {
      const aboutImg = document.querySelector('.about-img img');
      if (aboutImg) aboutImg.src = sc.aboutImg;
    }

    if (sc.metaTitle) document.title = sc.metaTitle;
    if (sc.metaDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = sc.metaDescription;
    }
    if (sc.ogImage) {
      let og = document.querySelector('meta[property="og:image"]');
      if (!og) {
        og = document.createElement('meta');
        og.setAttribute('property', 'og:image');
        document.head.appendChild(og);
      }
      og.content = sc.ogImage;
    }

    if (sc.footerText) {
      const fEl = document.querySelector('footer p[data-i18n="footer.copy"]');
      if (fEl) fEl.textContent = sc.footerText;
    }
  };

  window.saveSiteConfig = function () {
    try {
      localStorage.setItem(LS_KEYS.siteConfig, JSON.stringify(siteConfig));
    } catch (e) {}
  };

  window.closeOwnerModals = function () {
    document.querySelectorAll('.owner-modal.show').forEach(m => m.classList.remove('show'));
  };

  window.confirmDelete = function (kind, id) {
    if (pendingDeleteId === id) {
      pendingDeleteId = null;
      if (kind === 'product') {
        products = products.filter(p => p.id !== id);
        saveAll();
        renderCandies();
        renderOwner();
        showToast(t('toast.productDeleted'), 'bx-trash');
      } else if (kind === 'offer') {
        offers = offers.filter(o => o.id !== id);
        saveAll();
        renderOffers();
        renderOwner();
        showToast(t('toast.offerDeleted'), 'bx-trash');
      }
    } else {
      pendingDeleteId = id;
      showToast(t('toast.confirmDelete'), 'bx-info-circle');
      setTimeout(() => { pendingDeleteId = null; }, 3000);
    }
  };

  /* =====================================================
     6. OWNER MODALS — OPEN
     ===================================================== */

  window.updateProductPricingPanels = function (mode) {
    document.querySelectorAll('#ownerProductModal .price-mode-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.priceMode === mode)
    );
    document.querySelectorAll('#ownerProductModal .owner-price-panel').forEach(p => {
      p.style.display = (p.dataset.pricePanel === mode) ? 'block' : 'none';
    });
    const hidden = $('ownerProductForm').querySelector('[data-field="pricingType"]');
    if (hidden) hidden.value = mode;
    updatePricePreview();
  };

  window.updatePricePreview = function () {
    const f = $('ownerProductForm');
    if (!f) return;
    const modeEl = f.querySelector('[data-field="pricingType"]');
    if (!modeEl) return;
    const mode = modeEl.value;
    const preview = $('ownerPricePreview');
    if (!preview) return;

    if (mode !== 'tiered') { preview.classList.remove('show'); return; }

    const p250  = parseFloat(f.querySelector('[data-field="price250"]').value) || 0;
    const p500  = parseFloat(f.querySelector('[data-field="price500"]').value) || 0;
    const p1000 = parseFloat(f.querySelector('[data-field="price1000"]').value) || 0;

    preview.classList.add('show');
    preview.innerHTML = `
      <strong>✓ Auto tier preview</strong><br>
      • 0 – 499 g  →  <strong>${formatPrice(p250)}</strong><br>
      • 500 – 999 g  →  <strong>${formatPrice(p500)}</strong><br>
      • 1000 g +  →  <strong>${formatPrice(p1000)}</strong> (capped)`;
  };

  window.openOwnerProductModal = function (id) {
    const m = $('ownerProductModal');
    const f = $('ownerProductForm');
    f.reset();
    f.querySelector('[data-field="id"]').value = '';
    $('ownerProductModalTitle').textContent = id ? 'Edit Product' : 'Add Product';

    if (id) {
      const p = products.find(x => x.id === id);
      if (p) {
        ['id', 'name', 'name_ar', 'desc', 'desc_ar', 'price', 'oldPrice', 'badge', 'badge_ar', 'stock', 'img', 'category', 'price250', 'price500', 'price1000'].forEach(k => {
          const el = f.querySelector(`[data-field="${k}"]`);
          if (el) el.value = (p[k] !== undefined && p[k] !== null) ? p[k] : '';
        });
        updateProductPricingPanels(p.pricingType === 'tiered' ? 'tiered' : 'fixed');
      }
    } else {
      f.querySelector('[data-field="stock"]').value = 50;
      const cEl = f.querySelector('[data-field="category"]');
      if (cEl) cEl.value = 'candy';
      updateProductPricingPanels('fixed');
    }
    m.classList.add('show');
  };

  window.openOwnerOfferModal = function (id) {
    const m = $('ownerOfferModal');
    const f = $('ownerOfferForm');
    f.reset();
    f.querySelector('[data-field="id"]').value = '';
    $('ownerOfferModalTitle').textContent = id ? 'Edit Offer' : 'Add Offer';

    if (id) {
      const o = offers.find(x => x.id === id);
      if (o) {
        ['id', 'name', 'name_ar', 'desc', 'desc_ar', 'category', 'category_ar', 'discount', 'discount_ar', 'price', 'oldPrice', 'ends', 'ends_ar', 'img'].forEach(k => {
          const el = f.querySelector(`[data-field="${k}"]`);
          if (el) el.value = (o[k] !== undefined && o[k] !== null) ? o[k] : '';
        });
        const a = f.querySelector('[data-field="isActive"]');
        if (a) a.checked = !!o.isActive;
      }
    } else {
      f.querySelector('[data-field="isActive"]').checked = true;
    }
    m.classList.add('show');
  };

  window.openOwnerGalleryModal = function () {
    $('ownerGalleryForm').reset();
    $('ownerGalleryModal').classList.add('show');
  };

  window.openOwnerWeightModal = function (val) {
    const f = $('ownerWeightForm');
    f.reset();
    f.querySelector('[data-wfield="old"]').value = val || '';
    f.querySelector('[data-wfield="value"]').value = val || '';
    $('ownerWeightModalTitle').textContent = val ? 'Edit Weight' : 'Add Weight';
    $('ownerWeightModal').classList.add('show');
  };

  window.openOwnerPackagingModal = function (id) {
    const f = $('ownerPackagingForm');
    f.reset();
    f.querySelector('[data-pfield="id"]').value = '';
    $('ownerPackagingModalTitle').textContent = id ? 'Edit Packaging' : 'Add Packaging';

    if (id) {
      const p = mixPackaging.find(x => x.id === id);
      if (p) {
        ['id', 'name', 'name_ar', 'desc', 'desc_ar', 'icon', 'extra', 'img'].forEach(k => {
          const el = f.querySelector(`[data-pfield="${k}"]`);
          if (el) el.value = (p[k] !== undefined && p[k] !== null) ? p[k] : '';
        });
      }
    } else {
      f.querySelector('[data-pfield="icon"]').value = 'bx-box';
      f.querySelector('[data-pfield="extra"]').value = 0;
    }
    $('ownerPackagingModal').classList.add('show');
  };

  window.openOwnerCandyTypeModal = function (id) {
    const f = $('ownerCandyTypeForm');
    f.reset();
    f.querySelector('[data-cfield="id"]').value = '';
    $('ownerCandyTypeModalTitle').textContent = id ? 'Edit Candy Type' : 'Add Candy Type';

    if (id) {
      const c = candyTypes.find(x => x.id === id);
      if (c) {
        ['id', 'name', 'name_ar', 'price_per_kg', 'sale_price_per_kg', 'color', 'img'].forEach(k => {
          const el = f.querySelector(`[data-cfield="${k}"]`);
          if (el) el.value = (c[k] !== undefined && c[k] !== null) ? c[k] : '';
        });
      }
    } else {
      f.querySelector('[data-cfield="color"]').value = '#e2015d';
      f.querySelector('[data-cfield="price_per_kg"]').value = 12;
      f.querySelector('[data-cfield="sale_price_per_kg"]').value = '';
    }
    $('ownerCandyTypeModal').classList.add('show');
  };

  window.openOwnerAddonModal = function (id) {
    const f = $('ownerAddonForm');
    f.reset();
    f.querySelector('[data-afield="id"]').value = '';
    $('ownerAddonModalTitle').textContent = id ? 'Edit Add-on' : 'Add Add-on';

    if (id) {
      const a = addons.find(x => x.id === id);
      if (a) {
        f.querySelector('[data-afield="id"]').value = a.id;
        f.querySelector('[data-afield="name"]').value = a.name || '';
        f.querySelector('[data-afield="name_ar"]').value = a.name_ar || '';
        f.querySelector('[data-afield="desc"]').value = a.desc || '';
        f.querySelector('[data-afield="desc_ar"]').value = a.desc_ar || '';
        f.querySelector('[data-afield="price"]').value = a.price || 0;
        f.querySelector('[data-afield="icon"]').value = a.icon || 'bx-dot';
        f.querySelector('[data-afield="img"]').value = a.img || '';
        f.querySelector('[data-afield="active"]').checked = a.active !== false;
      }
    } else {
      f.querySelector('[data-afield="price"]').value = 0.99;
      f.querySelector('[data-afield="icon"]').value = 'bx-dot';
      f.querySelector('[data-afield="active"]').checked = true;
    }
    $('ownerAddonModal').classList.add('show');
  };

  window.openOwnerZoneModal = function (id) {
    const f = $('ownerZoneForm');
    f.reset();
    f.querySelector('[data-zfield="id"]').value = '';
    $('ownerZoneModalTitle').textContent = id ? 'Edit Delivery Zone' : 'Add Delivery Zone';

    if (id) {
      const z = deliveryZones.find(x => x.id === id);
      if (z) {
        f.querySelector('[data-zfield="name"]').value = z.name || '';
        f.querySelector('[data-zfield="name_ar"]').value = z.name_ar || '';
        f.querySelector('[data-zfield="price"]').value = z.price || 0;
        f.querySelector('[data-zfield="active"]').checked = !!z.active;
      }
    } else {
      f.querySelector('[data-zfield="active"]').checked = true;
      f.querySelector('[data-zfield="price"]').value = 2;
    }
    $('ownerZoneModal').classList.add('show');
  };

  /* =====================================================
     7. LANGUAGE & SIGNBOARD
     ===================================================== */

  window.applyLanguage = function (newLang) {
    lang = (newLang === 'ar') ? 'ar' : 'en';
    try { localStorage.setItem(LS_KEYS.lang, lang); } catch (e) {}

    const isAr = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir  = isAr ? 'rtl' : 'ltr';

    const storeInfo = (typeof getStoreInfoFromStorage === 'function') ? getStoreInfoFromStorage() : null;
    if (storeInfo) {
      document.title = (isAr && storeInfo.nameAr ? storeInfo.nameAr : storeInfo.name) +
                       ' | ' + (isAr && storeInfo.sloganAr ? storeInfo.sloganAr : storeInfo.slogan);
    } else {
      document.title = t('title.page');
    }

    const label = $('langLabel');
    if (label) label.textContent = isAr ? 'EN' : 'AR';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = t(key);
      if (val !== key) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      const val = t(key);
      if (val !== key) el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const val = t(key);
      if (val !== key) el.placeholder = val;
    });

    const bi = $('mixBackIcon');
    if (bi) bi.className = 'bx ' + (isAr ? 'bx-right-arrow-alt' : 'bx-left-arrow-alt');

    if (typeof renderOffers  === 'function') renderOffers();
    if (typeof renderCandies === 'function') renderCandies();
    if (typeof renderGallery === 'function') renderGallery();
    if (typeof renderCart    === 'function') renderCart();

    if ($('mixModal') && $('mixModal').classList.contains('show')) {
      if (typeof renderMixPackaging === 'function') renderMixPackaging();
      if (typeof renderMixWeights   === 'function') renderMixWeights();
      if (typeof renderMixSlots     === 'function') renderMixSlots();
      if (typeof renderMixTypesGrid === 'function') renderMixTypesGrid();
      if (typeof renderMixAddons    === 'function') renderMixAddons();
      if (typeof updateMixStep      === 'function') updateMixStep();
      if (mixState.step === 5 && typeof renderMixReview === 'function') renderMixReview();
    }
    if ($('weightModal') && $('weightModal').classList.contains('show')) {
      if (typeof renderWeightModal === 'function') renderWeightModal();
    }
    if ($('accountPage') && $('accountPage').classList.contains('show')) {
      if (typeof renderAccountPage === 'function') renderAccountPage();
    }
    if ($('adminPage') && $('adminPage').classList.contains('show')) {
      if (typeof renderAdmin === 'function') renderAdmin();
    }
    if ($('ownerPage') && $('ownerPage').classList.contains('show')) {
      if (typeof renderOwner === 'function') renderOwner();
    }

    if (typeof applyStoreInfoToSite === 'function') applyStoreInfoToSite();

    if (typeof updateMobileAccountUI === 'function') updateMobileAccountUI();
    if (typeof updateSign === 'function')            updateSign(true);
    if (typeof revealOnScroll === 'function')        revealOnScroll();
  };

  window.updateSign = function (force) {
    const now = new Date();
    const h = now.getHours();
    const isOpen = h >= storeHours.open && h < storeHours.close;

    if (previousSignState !== isOpen || force) {
      const sb = $('sbBoard');
      if (!sb) return;

      sb.textContent = isOpen ? t('sign.open') : t('sign.closed');
      document.body.classList.toggle('is-open', isOpen);

      const note = $('sbNote');
      if (note) note.textContent = isOpen ? t('sign.openNote') : t('sign.closedNote');

      sb.classList.remove('text-change');
      void sb.offsetWidth;
      sb.classList.add('text-change');

      previousSignState = isOpen;

      const ch = $('contactHoursText');
      if (ch) {
        ch.textContent = String(storeHours.open).padStart(2, '0') + ':00 – ' +
                         String(storeHours.close).padStart(2, '0') + ':00';
      }
    }
  };

  /* =====================================================
     8. SCROLL
     ===================================================== */

  window.revealOnScroll = function () {
    const wh = window.innerHeight;
    document.querySelectorAll('.reveal').forEach(el => {
      if (!el.classList.contains('active') &&
          el.getBoundingClientRect().top < wh - 100) {
        el.classList.add('active');
      }
    });
  };

  window.smoothScrollTo = function (targetY, duration) {
    duration = duration || 1200;
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    const start = performance.now();

    function ease(x) {
      return x < 0.5
        ? 16 * x * x * x * x * x
        : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }
    function step(now) {
      const el = now - start;
      const p = Math.min(el / duration, 1);
      window.scrollTo(0, startY + diff * ease(p));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  window.jumpToCandyCategory = function (cat) {
    candyFilter = cat;
    renderCandies();
    const tgt = document.getElementById('candies');
    if (!tgt) return;
    const y = tgt.getBoundingClientRect().top + window.pageYOffset - 80;
    const d = Math.abs(y - window.pageYOffset);
    smoothScrollTo(y, Math.min(600 + d * 0.5, 1400));
  };

  /* =====================================================
     9. EVENT WIRING — DOMContentLoaded
     ===================================================== */

  document.addEventListener('DOMContentLoaded', () => {

    /* ==== HEADER ==== */
    const hamburger = $('hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        $('navLinks').classList.toggle('active');
      });
    }
    const navLinks = $('navLinks');
    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(l =>
        l.addEventListener('click', () => {
          if (hamburger) hamburger.classList.remove('active');
          navLinks.classList.remove('active');
        })
      );
    }
    window.addEventListener('scroll', () => {
      const h = $('header');
      if (h) h.classList.toggle('scrolled', window.scrollY > 50);
    });

    /* ==== NAV SHORTCUTS ==== */
    const navCandies = $('navCandiesLink');
    const navChoc = $('navChocolateLink');
    if (navCandies) navCandies.addEventListener('click', (e) => { e.preventDefault(); jumpToCandyCategory('candy'); });
    if (navChoc)    navChoc.addEventListener('click',    (e) => { e.preventDefault(); jumpToCandyCategory('chocolate'); });

    /* ==== MOBILE ACCOUNT ==== */
    const mobileAcc = $('mobileAccountBtn');
    if (mobileAcc) {
      mobileAcc.addEventListener('click', (e) => {
        e.preventDefault();
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
        setTimeout(() => {
          if (currentUser) {
            if (isOwner) openOwnerPage();
            else if (isAdmin) openAdminPage();
            else if (typeof openAccountPage === 'function') openAccountPage();
          } else {
            resetLoginPanel('default');
            openPanel($('loginPanel'));
          }
        }, 250);
      });
    }

    /* ==== CART / LOGIN ==== */
    const cartBtn = $('cartBtn');
    if (cartBtn) cartBtn.addEventListener('click', () => openPanel($('cartPanel')));

    const cartClose = $('cartClose');
    if (cartClose) cartClose.addEventListener('click', closeAllPanels);

    const loginBtn = $('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        if (currentUser) {
          if (isOwner) openOwnerPage();
          else if (isAdmin) openAdminPage();
          else if (typeof openAccountPage === 'function') openAccountPage();
          return;
        }
        resetLoginPanel('default');
        openPanel($('loginPanel'));
      });
    }

    const loginClose = $('loginClose');
    if (loginClose) loginClose.addEventListener('click', closeAllPanels);

    const overlay = $('overlay');
    if (overlay) overlay.addEventListener('click', closeAllPanels);

    /* ==== ESC KEY ==== */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if ($('weightModal').classList.contains('show')) closeWeightModal();
        else if ($('mixModal').classList.contains('show')) closeMixModal();
        else if ($('ownerPage').classList.contains('show')) closeOwnerPage();
        else if ($('adminPage').classList.contains('show')) closeAdminPage();
        else if ($('accountPage').classList.contains('show') && typeof closeAccountPage === 'function') closeAccountPage();
        else closeAllPanels();
      }
    });

    /* ==== CATEGORY CIRCLES ==== */
    const candyCategoriesEl = $('candyCategories');
    if (candyCategoriesEl) {
      candyCategoriesEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.cat-circle');
        if (!btn) return;
        const cat = btn.dataset.cat;
        if (cat === candyFilter) return;
        candyFilter = cat;
        renderCandies();
      });
    }

    /* ==== ADD TO CART + CART CONTROLS (DELEGATED) ==== */
    document.addEventListener('click', (e) => {
      const ab = e.target.closest('.add-to-cart-btn');
      if (ab) {
        const pid = ab.dataset.id;
        const offer = offers.find(o => o.id === pid);
        if (offer) {
          const ex = cart.find(i => i.id === offer.id);
          if (ex) ex.qty += 1;
          else cart.push({ id: offer.id, qty: 1, price: Number(offer.price) || 0 });
          renderCart();
          showToast(t('toast.added', { name: L(offer, 'name') }), 'bx-cart-add');
          const orig = ab.innerHTML;
          ab.classList.add('added');
          ab.innerHTML = `<i class='bx bx-check'></i> ${t('candies.added')}`;
          setTimeout(() => { ab.classList.remove('added'); ab.innerHTML = orig; }, 900);
          return;
        }

        const p = products.find(x => x.id === pid);
        if (p) {
          if (p.pricingType === 'tiered') openWeightModal(p.id);
          else {
            if (typeof addFixedProductToCart === 'function') addFixedProductToCart(p);
            else {
              const ex = cart.find(i => i.id === p.id);
              if (ex) ex.qty += 1;
              else cart.push({ id: p.id, qty: 1, price: Number(p.price) || 0 });
              renderCart();
              showToast(t('toast.added', { name: L(p, 'name') }), 'bx-cart-add');
            }
            const orig = ab.innerHTML;
            ab.classList.add('added');
            ab.innerHTML = `<i class='bx bx-check'></i> ${t('candies.added')}`;
            setTimeout(() => { ab.classList.remove('added'); ab.innerHTML = orig; }, 900);
          }
        }
        return;
      }

      const ctrl = e.target.closest('[data-action]');
      if (ctrl) {
        const action = ctrl.dataset.action;
        const id = ctrl.dataset.id;
        if (action === 'inc' && typeof increaseQty === 'function') increaseQty(id);
        if (action === 'dec' && typeof decreaseQty === 'function') decreaseQty(id);
        if (action === 'remove' && typeof removeItem === 'function') removeItem(id);
      }
    });

    /* ==== OWNER: APPEARANCE SAVE ==== */
    if ($('ownerSaveAppearance')) {
      $('ownerSaveAppearance').addEventListener('click', () => {
        document.querySelectorAll('[data-site]').forEach(el => {
          siteConfig[el.dataset.site] = el.value.trim();
        });
        saveSiteConfig();
        applySiteConfig();
        showToast('تم حفظ المظهر والصور ✨', 'bx-check-circle');
      });
    }

    if ($('ownerResetAppearance')) {
      $('ownerResetAppearance').addEventListener('click', () => {
        if (!confirm('إعادة تعيين المظهر للوضع الافتراضي؟')) return;
        siteConfig = {
          logoText: 'Hat Candy',
          heroBg: '',
          aboutImg: '',
          ogImage: '',
          metaTitle: '',
          metaDescription: '',
          footerText: ''
        };
        saveSiteConfig();
        document.querySelectorAll('[data-site]').forEach(el => {
          el.value = siteConfig[el.dataset.site] || '';
        });
        location.reload();
      });
    }

    /* ==== STORE INFO — bind once ==== */
    if (typeof bindStoreInfoHandlers === 'function') bindStoreInfoHandlers();
    if (typeof applyStoreInfoToSite === 'function') applyStoreInfoToSite();

    /* ==== DELIVERY / PAYMENT TOGGLES ==== */
    document.querySelectorAll('.delivery-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        cartDelivery.method = btn.dataset.deliveryMethod;
        if (cartDelivery.method === 'delivery' && !cartDelivery.zoneId) {
          const first = deliveryZones.find(z => z.active);
          if (first) cartDelivery.zoneId = first.id;
        }
        renderCart();
      });
    });

    document.querySelectorAll('.payment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.payment) {
          cartPayment.method = btn.dataset.payment;
          if (typeof renderPaymentSection === 'function') renderPaymentSection();
        }
      });
    });

    /* ==== WEIGHT MODAL ==== */
    if ($('weightModalClose'))    $('weightModalClose').addEventListener('click', closeWeightModal);
    if ($('weightModalBackdrop')) $('weightModalBackdrop').addEventListener('click', closeWeightModal);

    const wPresets = $('weightPresets');
    if (wPresets) {
      wPresets.addEventListener('click', (e) => {
        const b = e.target.closest('.weight-preset');
        if (!b) return;
        weightModalState.weight = parseInt(b.dataset.w, 10);
        if (typeof renderWeightModal === 'function') renderWeightModal();
      });
    }
    const wInput = $('weightInput');
    if (wInput) {
      wInput.addEventListener('input', (e) => {
        let v = parseInt(e.target.value, 10);
        if (isNaN(v) || v < 1) v = 0;
        weightModalState.weight = v;
        if (typeof renderWeightModal === 'function') renderWeightModal();
      });
    }
    const wMinus = $('weightMinus');
    if (wMinus) wMinus.addEventListener('click', () => {
      let v = weightModalState.weight - 50;
      if (v < 50) v = 50;
      weightModalState.weight = v;
      if (typeof renderWeightModal === 'function') renderWeightModal();
    });
    const wPlus = $('weightPlus');
    if (wPlus) wPlus.addEventListener('click', () => {
      weightModalState.weight += 50;
      if (typeof renderWeightModal === 'function') renderWeightModal();
    });
    const wqMinus = $('weightQtyMinus');
    const wqPlus  = $('weightQtyPlus');
    if (wqMinus) wqMinus.addEventListener('click', () => {
      if (weightModalState.qty > 1) { weightModalState.qty--; if (typeof renderWeightModal === 'function') renderWeightModal(); }
    });
    if (wqPlus) wqPlus.addEventListener('click', () => {
      weightModalState.qty++;
      if (typeof renderWeightModal === 'function') renderWeightModal();
    });
    const wAddBtn = $('weightAddBtn');
    if (wAddBtn && typeof addTieredProductToCart === 'function') {
      wAddBtn.addEventListener('click', addTieredProductToCart);
    }

    /* ==== MIX BUILDER ==== */
    if ($('heroMixBtn') && typeof openMixModal === 'function')   $('heroMixBtn').addEventListener('click', openMixModal);
    if ($('bannerMixBtn') && typeof openMixModal === 'function') $('bannerMixBtn').addEventListener('click', openMixModal);
    if ($('mixClose'))    $('mixClose').addEventListener('click', closeMixModal);
    if ($('mixBackdrop')) $('mixBackdrop').addEventListener('click', closeMixModal);

    /* ==== MIX EVENTS ==== */
    const packGrid = $('mixPackGrid');
    if (packGrid) {
      packGrid.addEventListener('click', (e) => {
        const c = e.target.closest('.mix-pack-card');
        if (!c) return;
        mixState.packaging = mixPackaging.find(p => p.id === c.dataset.pack);
        if (typeof renderMixPackaging === 'function') renderMixPackaging();
        const nb = $('mixNextBtn');
        if (nb) nb.disabled = false;
      });
    }

    const weightGrid = $('mixWeightGrid');
    if (weightGrid) {
      weightGrid.addEventListener('click', (e) => {
        const p = e.target.closest('.mix-weight-pill');
        if (!p) return;
        mixState.weight = parseInt(p.dataset.weight);
        if (typeof renderMixWeights === 'function') renderMixWeights();
        const nb = $('mixNextBtn');
        if (nb) nb.disabled = false;
      });
    }

    if ($('mixCountMinus')) {
      $('mixCountMinus').addEventListener('click', () => {
        if (mixState.typesCount > 1) {
          mixState.typesCount--;
          mixState.selectedTypes = mixState.selectedTypes.slice(0, mixState.typesCount);
          if (typeof renderMixSlots === 'function') renderMixSlots();
          if (typeof renderMixTypesGrid === 'function') renderMixTypesGrid();
          $('mixCountNumber').textContent = mixState.typesCount;
          $('mixCountMinus').disabled = mixState.typesCount <= 1;
          $('mixCountPlus').disabled = mixState.typesCount >= 6;
          if (typeof updateMixStep === 'function') updateMixStep();
        }
      });
    }
    if ($('mixCountPlus')) {
      $('mixCountPlus').addEventListener('click', () => {
        if (mixState.typesCount < 6) {
          mixState.typesCount++;
          $('mixCountNumber').textContent = mixState.typesCount;
          $('mixCountMinus').disabled = false;
          $('mixCountPlus').disabled = mixState.typesCount >= 6;
          if (typeof renderMixSlots === 'function') renderMixSlots();
          if (typeof renderMixTypesGrid === 'function') renderMixTypesGrid();
          if (typeof updateMixStep === 'function') updateMixStep();
        }
      });
    }

    if ($('mixTypesGrid')) {
      $('mixTypesGrid').addEventListener('click', (e) => {
        const c = e.target.closest('.mix-type-card');
        if (!c) return;
        const id = c.dataset.type;
        const i = mixState.selectedTypes.indexOf(id);
        if (i !== -1) {
          mixState.selectedTypes.splice(i, 1);
        } else {
          if (mixState.selectedTypes.length >= mixState.typesCount) {
            showToast(t('toast.allSlots'), 'bx-info-circle');
            return;
          }
          mixState.selectedTypes.push(id);
        }
        if (typeof renderMixSlots === 'function') renderMixSlots();
        if (typeof renderMixTypesGrid === 'function') renderMixTypesGrid();
        if (typeof updateMixStep === 'function') updateMixStep();
      });
    }

    if ($('mixAddonsGrid')) {
      $('mixAddonsGrid').addEventListener('click', (e) => {
        const c = e.target.closest('.mix-addon-card');
        if (!c) return;
        const id = c.dataset.addon;
        const i = mixState.selectedAddons.indexOf(id);
        if (i !== -1) mixState.selectedAddons.splice(i, 1);
        else mixState.selectedAddons.push(id);
        if (typeof renderMixAddons === 'function') renderMixAddons();
      });
    }

    if ($('mixBackBtn') && typeof goToMixStep === 'function') {
      $('mixBackBtn').addEventListener('click', () => {
        if (mixState.step > 1) goToMixStep(mixState.step - 1);
      });
    }

    if ($('mixNextBtn')) {
      $('mixNextBtn').addEventListener('click', () => {
        if (mixState.step < 5) {
          if (typeof goToMixStep === 'function') goToMixStep(mixState.step + 1);
          return;
        }

        const total = calcMixPrice();
        const selectedAddons = getSelectedAddonsObjects();
        const firstType = mixState.selectedTypes[0]
          ? candyTypes.find(c => c.id === mixState.selectedTypes[0])
          : null;

        cart.push({
          id: 'mix-' + Date.now(),
          isMix: true,
          packaging: mixState.packaging,
          weight: mixState.weight,
          types: mixState.selectedTypes.map(id => candyTypes.find(c => c.id === id)),
          addons: selectedAddons,
          price: total,
          qty: 1,
          img: firstType ? firstType.img : (candyTypes[0] ? candyTypes[0].img : '')
        });

        renderCart();
        showToast(t('toast.added', { name: t('mix.customMix') }), 'bx-party');
        closeMixModal();
        setTimeout(() => openPanel($('cartPanel')), 400);
      });
    }

    /* ==== LOGIN FORM ==== */
    const loginForm = $('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = $('loginEmail').value.trim();
        const password = $('loginPassword').value.trim();
        const phone = $('loginPhone').value.trim();

        /* EMPLOYEE REDIRECT */
        if (email === EMPLOYEE_USER && password === EMPLOYEE_PASS) {
          const btn = $('loginSubmit');
          btn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> Opening Employee Portal...`;
          btn.disabled = true;
          setTimeout(() => { window.location.href = './employee/index.html'; }, 900);
          return;
        }

        /* OWNER */
        if (isOwnerPhone(phone)) {
          const btn = $('loginSubmit');
          const orig = btn.innerHTML;
          btn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> ${t('login.signingIn')}`;
          btn.disabled = true;
          setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; signInAsOwner(); }, 800);
          return;
        }

        /* ADMIN */
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const btn = $('loginSubmit');
          const orig = btn.innerHTML;
          btn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> ${t('login.signingIn')}`;
          btn.disabled = true;
          setTimeout(() => {
            btn.innerHTML = orig;
            btn.disabled = false;
            if (typeof signInAsAdmin === 'function') signInAsAdmin();
          }, 800);
          return;
        }

        /* CUSTOMER */
        if (!email || !password || !phone) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
        if (!email.includes('@')) { showToast(t('toast.validEmail'), 'bx-error-circle'); return; }
        if (!validateJordanPhone(phone)) { showToast(t('toast.validPhone'), 'bx-error-circle'); return; }

        const btn = $('loginSubmit');
        const orig = btn.innerHTML;
        btn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> ${t('login.signingIn')}`;
        btn.disabled = true;

        setTimeout(async () => {
          btn.innerHTML = orig;
          btn.disabled = false;
          await onSignInSuccess({
            name: email.split('@')[0],
            email,
            phone: '+962 ' + phone.replace(/\D/g, '')
          });
        }, 1200);
      });
    }

    /* ==== GOOGLE SIGN-IN ==== */
    if ($('googleBtn')) $('googleBtn').addEventListener('click', openGoogleChooser);
    if ($('gChooserBackdrop')) $('gChooserBackdrop').addEventListener('click', closeGoogleChooser);
    if ($('gChooserCancel')) $('gChooserCancel').addEventListener('click', closeGoogleChooser);

    if ($('gChooserUseOther')) {
      $('gChooserUseOther').addEventListener('click', () => {
        closeGoogleChooser();
        const suffix = Date.now().toString().slice(-4);
        const newAcc = { name: 'Google User', email: 'user' + suffix + '@gmail.com' };
        pendingGoogleAccount = newAcc;
        openGooglePhoneStep(newAcc);
      });
    }

    if ($('gChooserList')) {
      $('gChooserList').addEventListener('click', (e) => {
        const removeBtn = e.target.closest('[data-google-remove]');
        if (removeBtn) {
          e.stopPropagation();
          const idx = parseInt(removeBtn.dataset.googleRemove, 10);
          googleAccounts.splice(idx, 1);
          persistGoogleAccounts();
          renderGoogleChooser();
          return;
        }
        const item = e.target.closest('[data-google-account]');
        if (item) handleGoogleAccountSelected(parseInt(item.dataset.googleAccount, 10));
      });
    }

    if ($('googleChange')) $('googleChange').addEventListener('click', resetGoogleSignInUI);

    if ($('googleContinue')) {
      $('googleContinue').addEventListener('click', () => {
        const phone = $('googlePhone').value.trim();
        if (!phone) { showToast(t('toast.enterPhone'), 'bx-error-circle'); $('googlePhone').focus(); return; }
        if (isOwnerPhone(phone)) { resetGoogleSignInUI(); signInAsOwner(); return; }
        if (!validateJordanPhone(phone)) { showToast(t('toast.validPhone'), 'bx-error-circle'); $('googlePhone').focus(); return; }

        const btn = $('googleContinue');
        const original = btn.innerHTML;
        btn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> ${t('login.signingIn')}`;
        btn.disabled = true;

        setTimeout(async () => {
          btn.innerHTML = original;
          btn.disabled = false;
          const account = pendingGoogleAccount || {
            name: $('googleName').textContent,
            email: $('googleEmail').textContent
          };
          rememberGoogleAccount(account);
          await onSignInSuccess({
            name: account.name,
            email: account.email,
            phone: '+962 ' + phone.replace(/\D/g, '')
          });
          setTimeout(resetGoogleSignInUI, 1800);
        }, 1100);
      });
    }

    if ($('signupLink')) $('signupLink').addEventListener('click', (e) => { e.preventDefault(); closeAllPanels(); });
    if ($('forgotLink')) $('forgotLink').addEventListener('click', (e) => {
      e.preventDefault();
      showToast(t('toast.resetSent'), 'bx-envelope');
    });

    /* ==== CHECKOUT ==== */
    if ($('checkoutBtn')) {
      $('checkoutBtn').addEventListener('click', async () => {
        const btn = $('checkoutBtn');
        if (btn.disabled) return;
        btn.disabled = true;
        setTimeout(() => { btn.disabled = false; }, 1500);

        if (cart.length === 0) { showToast(t('toast.cartEmpty'), 'bx-shopping-bag'); return; }

        if (!currentUser) {
          closeAllPanels();
          setTimeout(() => { resetLoginPanel('checkout'); openPanel($('loginPanel')); }, 350);
          return;
        }

        /* Card validation */
        if (cartPayment.method === 'card' && typeof validateCardNumber === 'function') {
          const c = cartPayment.card;
          if (!validateCardNumber(c.number)) { showToast(t('pay.invalidCard'), 'bx-error-circle'); return; }
          if (!c.name || c.name.trim().length < 3) { showToast(t('pay.invalidName'), 'bx-error-circle'); return; }
          if (!validateExpiry(c.expiry)) { showToast(t('pay.invalidExpiry'), 'bx-error-circle'); return; }
          if (!/^\d{3,4}$/.test(c.cvv)) { showToast(t('pay.invalidCvv'), 'bx-error-circle'); return; }
        }

        if (cartPayment.method === 'card' && cartPayment.card.save && !cartPayment.card.savedId) {
          const num = cartPayment.card.number.replace(/\s/g, '');
          const b = detectCardBrand(num);
          saveCardForCurrentUser({
            brand: b.brand,
            last4: num.slice(-4),
            name: cartPayment.card.name,
            expiry: cartPayment.card.expiry
          });
        }

        const subtotal = getCartSubtotal();
        const deliveryFee = (typeof getDeliveryFee === 'function') ? getDeliveryFee() : 0;
        const total = subtotal + deliveryFee;
        const zone = deliveryZones.find(z => z.id === cartDelivery.zoneId);
        const defAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
        const today = new Date().toISOString().split('T')[0];

        const itemsList = cart.map(i => {
          if (i.isMix) {
            return { name: 'Custom Mix', name_ar: 'خلطة خاصة', qty: i.qty, price: i.price };
          }
          const p = (typeof findCartItemProduct === 'function')
            ? findCartItemProduct(i)
            : (products.find(x => x.id === i.id) || offers.find(x => x.id === i.id));
          if (!p) return null;
          const weightSuffix = i.weight ? ` (${i.weight}g)` : '';
          return {
            name: p.name + weightSuffix,
            name_ar: (p.name_ar || p.name) + weightSuffix,
            qty: i.qty,
            price: i.price || Number(p.price) || 0
          };
        }).filter(Boolean);

        const newOrder = {
          id: 'HC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
          customerId: currentUser.id || 'c-guest',
          date: today,
          status: 'processing',
          itemsCount: cart.reduce((s, i) => s + i.qty, 0),
          itemsList,
          subtotal, deliveryFee, total,
          deliveryMethod: cartDelivery.method,
          deliveryZone: zone ? zone.name : null,
          payment: cartPayment.method,
          cardLast4: cartPayment.method === 'card'
            ? cartPayment.card.number.replace(/\s/g, '').slice(-4)
            : null,
          address: cartDelivery.method === 'pickup'
            ? 'Pickup from boutique'
            : (defAddr ? defAddr.city + ', ' + defAddr.area : 'Amman, Jordan'),
          tracking: null,
          placedAt: today, packedAt: null, shippedAt: null,
          outAt: null, deliveredAt: null, eta: null,
          channel: 'online'
        };

        orderHistory.unshift(newOrder);

        /* ⚡ Persist order history immediately */
        if (typeof persistOrderHistory === 'function') persistOrderHistory();

        if (window.Api) {
          window.Api.createOrder({
            id: newOrder.id,
            date: newOrder.date,
            customerId: newOrder.customerId,
            customerName: currentUser.name || 'Guest',
            customerPhone: currentUser.phone || '',
            customerEmail: currentUser.email || '',
            items: newOrder.itemsList,
            subtotal: newOrder.subtotal,
            tax: 0,
            deliveryFee: newOrder.deliveryFee,
            total: newOrder.total,
            status: 'processing',
            payment: newOrder.payment,
            address: newOrder.address,
            channel: 'online',
            source: 'website',
            servedBy: '',
            placedAt: new Date().toISOString()
          }).then(() => console.log('✅ Order synced to cloud'))
            .catch(err => console.warn('⚠️ Order sync failed:', err.message));
        }

        try {
          const online = JSON.parse(localStorage.getItem(LS_KEYS.onlineOrders) || '[]');
          online.unshift({
            id: newOrder.id,
            date: newOrder.date,
            status: newOrder.status,
            customerName: currentUser ? currentUser.name : 'Guest',
            customerPhone: currentUser ? currentUser.phone : '',
            address: newOrder.address,
            itemsList: newOrder.itemsList,
            subtotal: newOrder.subtotal,
            deliveryFee: newOrder.deliveryFee || 0,
            total: newOrder.total,
            payment: newOrder.payment,
            placedAt: new Date().toISOString()
          });
          localStorage.setItem(LS_KEYS.onlineOrders, JSON.stringify(online));
        } catch (err) {}

        showToast(t('toast.orderPlaced', { total: formatPrice(total) }), 'bx-party');
        cart = [];
        cartPayment.card = { number: '', name: '', expiry: '', cvv: '', save: false, savedId: null };
        renderCart();

        setTimeout(() => {
          closeAllPanels();
          if (typeof openAccountPage === 'function') {
            setTimeout(openAccountPage, 300);
          }
        }, 900);
      });
    }

    /* ==== CONTACT FORM ==== */
    if ($('contactForm')) {
      $('contactForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = $('name').value.trim();
        const email = $('email').value.trim();
        const message = $('message').value.trim();
        if (!name || !email || !message) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }

        const btn = e.target.querySelector('button[type="submit"]');
        const orig = btn.textContent;
        btn.textContent = t('contact.sending');
        btn.disabled = true;

        const msgData = {
          id: 'msg-' + Date.now(),
          name, email, message,
          date: new Date().toISOString().split('T')[0],
          read: false
        };

        if (window.Api) {
          try { await window.Api.submitMessage({ name, email, message }); }
          catch (err) { console.warn('[contact] cloud sync failed:', err.message); }
        }

        contactMessages.unshift(msgData);

        /* ⚡ Persist contact messages */
        if (typeof persistContactMessages === 'function') persistContactMessages();

        if ($('adminPage') && $('adminPage').classList.contains('show')) renderAdmin();

        showToast(t('toast.thanks', { name }), 'bx-check-circle');
        e.target.reset();
        btn.textContent = orig;
        btn.disabled = false;
      });
    }

    /* ==== SMOOTH SCROLL ==== */
    document.querySelectorAll('a[href^="#"]:not(#navCandiesLink):not(#navChocolateLink)').forEach(a => {
      a.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const tgt = document.querySelector(href);
        if (!tgt) return;
        e.preventDefault();
        const y = tgt.getBoundingClientRect().top + window.pageYOffset - 80;
        const d = Math.abs(y - window.pageYOffset);
        smoothScrollTo(y, Math.min(600 + d * 0.5, 1600));
      });
    });
    document.documentElement.style.scrollBehavior = 'auto';
    window.addEventListener('scroll', revealOnScroll);

    /* ==== ACCOUNT ==== */
    document.querySelectorAll('#accountPage .account-tab').forEach(tb =>
      tb.addEventListener('click', () => {
        if (typeof switchAccountTab === 'function') switchAccountTab(tb.dataset.tab);
      })
    );
    if ($('accountBack') && typeof closeAccountPage === 'function')    $('accountBack').addEventListener('click', closeAccountPage);
    if ($('accountSignout')) $('accountSignout').addEventListener('click', () => {
      if (typeof signOutUser === 'function') signOutUser();
    });

    /* ==== ADDRESS FORM SUBMIT ==== */
    if ($('addressFormEl')) {
      $('addressFormEl').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = $('addressId').value;
        const data = {
          label: $('addressLabelInput').value,
          name: $('addressNameInput').value.trim(),
          phone: $('addressPhoneInput').value.trim(),
          city: $('addressCityInput').value.trim(),
          area: $('addressAreaInput').value.trim(),
          line: $('addressLineInput').value.trim()
        };
        if (!data.name || !data.phone || !data.city || !data.area || !data.line) {
          showToast(t('toast.fillFields'), 'bx-error-circle');
          return;
        }
        if (id) {
          const i = savedAddresses.findIndex(a => a.id === id);
          if (i !== -1) savedAddresses[i] = { ...savedAddresses[i], ...data };
          showToast(t('toast.addressUpdated'), 'bx-check-circle');
        } else {
          /* ⚡ Tag address with current user id */
          const mine = currentUser ? savedAddresses.filter(a => a.customerId === currentUser.id) : [];
          savedAddresses.push({
            id: 'addr-' + Date.now(),
            customerId: currentUser ? currentUser.id : null,
            ...data,
            isDefault: mine.length === 0
          });
          showToast(t('toast.addressAdded'), 'bx-check-circle');
        }
        /* ⚡ Persist addresses */
        if (typeof saveAddresses === 'function') saveAddresses();

        if (typeof hideAddressForm === 'function') hideAddressForm();
        if (typeof renderAccountPage === 'function') renderAccountPage();
      });
    }

    if ($('addressCancel') && typeof hideAddressForm === 'function') {
      $('addressCancel').addEventListener('click', hideAddressForm);
    }

    /* ==== ADDRESSES GRID — click delegation ==== */
    if ($('addressesGrid')) {
      $('addressesGrid').addEventListener('click', (e) => {
        const ed = e.target.closest('[data-edit-address]');
        if (ed) { if (typeof showAddressForm === 'function') showAddressForm(ed.dataset.editAddress); return; }

        const dl = e.target.closest('[data-delete-address]');
        if (dl) {
          const toDel = savedAddresses.find(a => a.id === dl.dataset.deleteAddress);
          const mine = currentUser
            ? savedAddresses.filter(a => a.customerId === currentUser.id)
            : savedAddresses;
          if (mine.length <= 1) { showToast(t('toast.needOneAddress'), 'bx-info-circle'); return; }
          savedAddresses = savedAddresses.filter(a => a.id !== dl.dataset.deleteAddress);
          if (!savedAddresses.some(a => a.isDefault && (!a.customerId || a.customerId === currentUser?.id))
              && mine.length > 1) {
            const next = savedAddresses.find(a => !a.customerId || a.customerId === currentUser?.id);
            if (next) next.isDefault = true;
          }
          /* ⚡ Persist */
          if (typeof saveAddresses === 'function') saveAddresses();
          if (typeof renderAccountPage === 'function') renderAccountPage();
          showToast(t('toast.addressDeleted'), 'bx-trash');
          return;
        }

        const df = e.target.closest('[data-default-address]');
        if (df) {
          savedAddresses.forEach(a => {
            /* Only toggle within current user's addresses */
            if (!a.customerId || a.customerId === currentUser?.id) {
              a.isDefault = a.id === df.dataset.defaultAddress;
            }
          });
          /* ⚡ Persist */
          if (typeof saveAddresses === 'function') saveAddresses();
          if (typeof renderAccountPage === 'function') renderAccountPage();
          showToast(t('toast.addressDefaultSet'), 'bx-check-circle');
        }
      });
    }

    /* ==== ORDERS LIST ==== */
    if ($('ordersList')) {
      $('ordersList').addEventListener('click', (e) => {
        const tr = e.target.closest('[data-track]');
        if (tr) {
          if (typeof switchAccountTab === 'function') switchAccountTab('tracking');
          return;
        }
        const ro = e.target.closest('[data-reorder]');
        if (ro) {
          const o = orderHistory.find(x => x.id === ro.dataset.reorder);
          if (!o) return;
          (o.itemsList || []).forEach(it => {
            const p = products.find(x => x.name === it.name) || offers.find(x => x.name === it.name);
            if (p) {
              const ex = cart.find(c => c.id === p.id);
              if (ex) ex.qty += it.qty;
              else cart.push({ id: p.id, qty: it.qty, price: Number(p.price) || 0 });
            }
          });
          renderCart();
          showToast(t('toast.reordered'), 'bx-cart-add');
          if (typeof closeAccountPage === 'function') closeAccountPage();
          setTimeout(() => openPanel($('cartPanel')), 300);
        }
      });
    }

    /* ==== ADMIN ==== */
    if ($('adminBack') && typeof closeAdminPage === 'function')    $('adminBack').addEventListener('click', closeAdminPage);
    if ($('adminSignout')) $('adminSignout').addEventListener('click', () => {
      if (typeof signOutUser === 'function') signOutUser();
    });
    if ($('adminExportOrders')) $('adminExportOrders').addEventListener('click', exportOrdersCsv);
    if ($('adminAddEmployee'))  $('adminAddEmployee').addEventListener('click', () => openAdminEmployeeModal());
    if ($('adminEmployeeForm')) $('adminEmployeeForm').addEventListener('submit', handleAdminEmployeeSubmit);

    /* ==== ATTENDANCE RANGE & EMPLOYEE FILTERS ==== */
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-attendance-range]');
      if (!btn) return;
      attendanceRange = btn.dataset.attendanceRange;
      document.querySelectorAll('[data-attendance-range]').forEach(b =>
        b.classList.toggle('active', b.dataset.attendanceRange === attendanceRange)
      );
      renderAdminAttendance();
    });

    document.addEventListener('change', (e) => {
      if (e.target.id === 'attendanceEmployeeFilter') {
        attendanceEmployee = e.target.value;
        renderAdminAttendance();
      }
    });

    if ($('adminPage')) {
      $('adminPage').addEventListener('click', (e) => {
        const tb = e.target.closest('[data-atab]');
        if (tb) { if (typeof switchAdminTab === 'function') switchAdminTab(tb.dataset.atab); return; }

        const fl = e.target.closest('[data-ofilter]');
        if (fl) { adminOrderFilter = fl.dataset.ofilter; renderAdminOrders(); return; }

        const ad = e.target.closest('[data-advance]');
        if (ad) { advanceOrder(ad.dataset.advance); return; }

        const cn = e.target.closest('[data-cancel-order]');
        if (cn) { setOrderStatus(cn.dataset.cancelOrder, 'cancelled'); return; }

        const rd = e.target.closest('[data-msg-read]');
        if (rd) {
          const m = contactMessages.find(x => x.id === rd.dataset.msgRead);
          if (m) {
            m.read = !m.read;
            if (typeof persistContactMessages === 'function') persistContactMessages();
            if (typeof renderAdmin === 'function') renderAdmin();
          }
          return;
        }

        const dm = e.target.closest('[data-msg-delete]');
        if (dm) {
          contactMessages = contactMessages.filter(x => x.id !== dm.dataset.msgDelete);
          if (typeof persistContactMessages === 'function') persistContactMessages();
          if (typeof renderAdmin === 'function') renderAdmin();
          showToast(t('admin.msgDeleted'), 'bx-trash');
          return;
        }

        const go = e.target.closest('[data-goto-orders]');
        if (go) { if (typeof switchAdminTab === 'function') switchAdminTab('orders'); return; }

        const vc = e.target.closest('[data-view-customer]');
        if (vc) { openAdminCustomerModal(vc.dataset.viewCustomer); return; }

        const dc = e.target.closest('[data-del-customer]');
        if (dc) {
          if (!confirm('Delete this customer? Their orders will remain.')) return;
          customers = customers.filter(x => x.id !== dc.dataset.delCustomer);
          if (typeof persistCustomers === 'function') persistCustomers();
          if (typeof renderAdmin === 'function') renderAdmin();
          showToast('Customer deleted', 'bx-trash');
          return;
        }

        const editEmp = e.target.closest('[data-edit-employee]');
        if (editEmp) { openAdminEmployeeModal(editEmp.dataset.editEmployee); return; }

        const delEmp = e.target.closest('[data-del-employee]');
        if (delEmp) {
          if (!confirm(t('admin.deleteEmployeeConfirm'))) return;
          const list = loadEmployees().filter(x => x.id !== delEmp.dataset.delEmployee);
          saveEmployees(list);
          renderAdminEmployees();
          showToast(t('toast.employeeDeleted'), 'bx-trash');
          return;
        }
      });

      $('adminPage').addEventListener('change', (e) => {
        const s = e.target.closest('[data-status-order]');
        if (s) setOrderStatus(s.dataset.statusOrder, s.value);
      });

      $('adminPage').addEventListener('input', (e) => {
        if (e.target.id === 'adminCustomerSearch') {
          adminCustomerSearch = e.target.value.trim();
          renderAdminCustomers();
        }
      });
    }

    /* ==== OWNER ==== */
    if ($('ownerBack') && typeof closeOwnerPage === 'function')    $('ownerBack').addEventListener('click', closeOwnerPage);
    if ($('ownerSignout')) $('ownerSignout').addEventListener('click', () => {
      if (typeof signOutUser === 'function') signOutUser();
    });

    if ($('ownerAddProduct'))   $('ownerAddProduct').addEventListener('click',   () => openOwnerProductModal());
    if ($('ownerAddOffer'))     $('ownerAddOffer').addEventListener('click',     () => openOwnerOfferModal());
    if ($('ownerAddGallery'))   $('ownerAddGallery').addEventListener('click',   openOwnerGalleryModal);
    if ($('ownerAddWeight'))    $('ownerAddWeight').addEventListener('click',    () => openOwnerWeightModal());
    if ($('ownerAddPackaging')) $('ownerAddPackaging').addEventListener('click', () => openOwnerPackagingModal());
    if ($('ownerAddCandyType')) $('ownerAddCandyType').addEventListener('click', () => openOwnerCandyTypeModal());
    if ($('ownerAddAddon'))     $('ownerAddAddon').addEventListener('click',     () => openOwnerAddonModal());
    if ($('ownerAddZone'))      $('ownerAddZone').addEventListener('click',      () => openOwnerZoneModal());

    const ownerTabsLeft  = $('ownerTabsLeft');
    const ownerTabsRight = $('ownerTabsRight');
    const ownerTabsVp    = $('ownerTabsViewport');
    if (ownerTabsLeft)  ownerTabsLeft.addEventListener('click',  () => ownerTabsVp.scrollBy({ left: -220, behavior: 'smooth' }));
    if (ownerTabsRight) ownerTabsRight.addEventListener('click', () => ownerTabsVp.scrollBy({ left:  220, behavior: 'smooth' }));
    if (ownerTabsVp)    ownerTabsVp.addEventListener('scroll', updateOwnerTabsScrollBtns, { passive: true });
    window.addEventListener('resize', updateOwnerTabsScrollBtns);

    document.querySelectorAll('#ownerProductModal .price-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => updateProductPricingPanels(btn.dataset.priceMode));
    });

    const opf = $('ownerProductForm');
    if (opf) {
      opf.querySelectorAll('[data-field="price250"], [data-field="price500"], [data-field="price1000"]').forEach(inp => {
        inp.addEventListener('input', updatePricePreview);
      });
    }

    if ($('ownerSaveHours')) {
      $('ownerSaveHours').addEventListener('click', () => {
        const o = parseInt($('ownerOpenHour').value);
        const c = parseInt($('ownerCloseHour').value);
        if (isNaN(o) || isNaN(c) || o < 0 || o > 23 || c < 0 || c > 23) {
          showToast('Please enter valid hours (0–23)', 'bx-error-circle');
          return;
        }
        storeHours = { open: o, close: c };
        saveAll();
        updateSign(true);
        showToast(t('toast.hoursSaved'), 'bx-check-circle');
      });
    }

    if ($('ownerSaveContent')) {
      $('ownerSaveContent').addEventListener('click', () => {
        document.querySelectorAll('[data-cms]').forEach(el => {
          const k = el.dataset.cms;
          const la = el.closest('[data-cms-lang]')
            ? el.closest('[data-cms-lang]').dataset.cmsLang
            : 'en';
          if (!contentOverrides[k]) contentOverrides[k] = {};
          contentOverrides[k][la] = el.value;
          if (I18N[la]) I18N[la][k] = el.value;
        });
        const phE = document.querySelector('[data-cms-contact="phone"]');
        const emE = document.querySelector('[data-cms-contact="email"]');
        if (phE) document.querySelector('[data-contact-phone]').textContent = phE.value;
        if (emE) document.querySelector('[data-contact-email]').textContent = emE.value;
        saveAll();
        applyLanguage(lang);
        showToast(t('toast.contentSaved'), 'bx-check-circle');
      });
    }

    if ($('ownerResetContent')) {
      $('ownerResetContent').addEventListener('click', () => {
        try { localStorage.removeItem(LS_KEYS.content); } catch (e) {}
        location.reload();
      });
    }

    if ($('ownerExportData')) {
      $('ownerExportData').addEventListener('click', () => {
        const data = {
          products, offers, galleryImages, contentOverrides,
          mixWeights, mixPackaging, candyTypes, addons,
          deliveryZones, storeHours,
          storeInfo: (typeof getStoreInfoFromStorage === 'function') ? getStoreInfoFromStorage() : null,
          employees: loadEmployees(),
          exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hat-candy-backup-' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(t('toast.dataExported'), 'bx-download');
      });
    }

    if ($('ownerImportData')) {
      $('ownerImportData').addEventListener('click', () => $('ownerImportFile').click());
    }
    if ($('ownerImportFile')) {
      $('ownerImportFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target.result);
            if (Array.isArray(data.products))      products      = data.products;
            if (Array.isArray(data.offers))        offers        = data.offers;
            if (Array.isArray(data.galleryImages)) galleryImages = data.galleryImages;
            if (Array.isArray(data.mixWeights))    mixWeights    = data.mixWeights;
            if (Array.isArray(data.mixPackaging))  mixPackaging  = data.mixPackaging;
            if (Array.isArray(data.candyTypes))    candyTypes    = data.candyTypes;
            if (Array.isArray(data.addons))        addons        = data.addons;
            if (Array.isArray(data.deliveryZones)) deliveryZones = data.deliveryZones;
            if (Array.isArray(data.employees))     saveEmployees(data.employees);
            if (data.storeHours)                   storeHours    = data.storeHours;

            if (data.storeInfo && typeof saveStoreInfoToStorage === 'function') {
              saveStoreInfoToStorage(data.storeInfo);
              if (typeof applyStoreInfoToSite === 'function') applyStoreInfoToSite();
            }

            if (data.contentOverrides && typeof data.contentOverrides === 'object') {
              contentOverrides = data.contentOverrides;
              Object.keys(contentOverrides).forEach(k => {
                const v = contentOverrides[k];
                if (I18N.en[k] !== undefined && v.en !== undefined) I18N.en[k] = v.en;
                if (I18N.ar[k] !== undefined && v.ar !== undefined) I18N.ar[k] = v.ar;
              });
            }
            saveAll();
            renderOffers();
            renderCandies();
            renderGallery();
            renderCart();
            renderOwner();
            applyLanguage(lang);
            showToast(t('toast.dataImported'), 'bx-check-circle');
          } catch (err) {
            showToast(t('toast.dataInvalid'), 'bx-error-circle');
          }
        };
        reader.readAsText(file);
        e.target.value = '';
      });
    }

    if ($('ownerResetAll')) {
      $('ownerResetAll').addEventListener('click', () => {
        if (!confirm('Reset all data to defaults? This cannot be undone.')) return;
        try {
          Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k));
          localStorage.removeItem('hatcandy-store-info');
        } catch (e) {}
        location.reload();
      });
    }

    document.querySelectorAll('[data-close-owner-modal]').forEach(el =>
      el.addEventListener('click', closeOwnerModals)
    );

    /* ==== OWNER FORM SUBMITS ==== */
    if ($('ownerProductForm')) {
      $('ownerProductForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = e.target;
        const id = f.querySelector('[data-field="id"]').value;
        const data = {};
        f.querySelectorAll('[data-field]').forEach(el => {
          const k = el.dataset.field;
          if (k === 'id') return;
          if (el.type === 'number') data[k] = parseFloat(el.value) || 0;
          else if (el.type === 'checkbox') data[k] = el.checked;
          else data[k] = el.value.trim();
        });
        if (!data.name || !data.name_ar) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
        if (!data.category) data.category = 'candy';

        if (data.pricingType === 'tiered') {
          if (!data.price250 || !data.price500 || !data.price1000) {
            showToast('Please enter all 3 tier prices', 'bx-error-circle');
            return;
          }
          delete data.price;
        } else {
          if (!data.price) { showToast('Please enter a price', 'bx-error-circle'); return; }
          delete data.price250;
          delete data.price500;
          delete data.price1000;
        }

        if (id) {
          const i = products.findIndex(p => p.id === id);
          if (i !== -1) products[i] = { ...products[i], ...data };
        } else {
          data.id = 'p-' + Date.now();
          products.push(data);
        }

        saveAll();
        renderCandies();
        renderOwner();
        closeOwnerModals();
        showToast(t('toast.productSaved'), 'bx-check-circle');

        if (window.Api) {
          try {
            await window.Api.saveProduct({ ...data, id: data.id || (id || '') });
          } catch (err) { console.warn('[product] sync failed:', err.message); }
        }
      });
    }

    if ($('ownerOfferForm')) {
      $('ownerOfferForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = e.target;
        const id = f.querySelector('[data-field="id"]').value;
        const data = {};
        f.querySelectorAll('[data-field]').forEach(el => {
          const k = el.dataset.field;
          if (k === 'id') return;
          if (el.type === 'number') data[k] = parseFloat(el.value) || 0;
          else if (el.type === 'checkbox') data[k] = el.checked;
          else data[k] = el.value.trim();
        });
        if (!data.name || !data.name_ar || !data.price) {
          showToast(t('toast.fillFields'), 'bx-error-circle');
          return;
        }
        if (id) {
          const i = offers.findIndex(o => o.id === id);
          if (i !== -1) offers[i] = { ...offers[i], ...data };
        } else {
          data.id = 'offer-' + Date.now();
          offers.push(data);
        }
        saveAll();
        renderOffers();
        renderOwner();
        closeOwnerModals();
        showToast(t('toast.offerSaved'), 'bx-check-circle');

        if (window.Api) {
          try { await window.Api.saveOffer(data); }
          catch (err) { console.warn('[offer] sync failed:', err.message); }
        }
      });
    }

    if ($('ownerGalleryForm')) {
      $('ownerGalleryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const img = e.target.querySelector('[data-field="img"]').value.trim();
        const alt = e.target.querySelector('[data-field="alt"]').value.trim();
        if (!img) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
        galleryImages.push({ id: 'g-' + Date.now(), img, alt });
        saveAll();
        renderGallery();
        renderOwner();
        closeOwnerModals();
        showToast(t('toast.galleryAdded'), 'bx-image-add');
      });
    }

    if ($('ownerWeightForm')) {
      $('ownerWeightForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const f = e.target;
        const oldV = f.querySelector('[data-wfield="old"]').value;
        const newV = parseInt(f.querySelector('[data-wfield="value"]').value);
        if (!newV || newV <= 0) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
        if (oldV) {
          const i = mixWeights.indexOf(parseInt(oldV));
          if (i !== -1) mixWeights[i] = newV;
          else mixWeights.push(newV);
        } else if (!mixWeights.includes(newV)) {
          mixWeights.push(newV);
        }
        saveAll();
        if (typeof renderMixWeights === 'function') renderMixWeights();
        renderOwner();
        closeOwnerModals();
        showToast('Weight saved', 'bx-check-circle');
      });
    }

    if ($('ownerPackagingForm')) {
      $('ownerPackagingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const f = e.target;
        const id = f.querySelector('[data-pfield="id"]').value;
        const data = {};
        f.querySelectorAll('[data-pfield]').forEach(el => {
          const k = el.dataset.pfield;
          if (k === 'id') return;
          if (el.type === 'number') data[k] = parseFloat(el.value) || 0;
          else data[k] = el.value.trim();
        });
        if (!data.name || !data.name_ar) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
        if (id) {
          const i = mixPackaging.findIndex(p => p.id === id);
          if (i !== -1) mixPackaging[i] = { ...mixPackaging[i], ...data };
        } else {
          data.id = 'pack-' + Date.now();
          mixPackaging.push(data);
        }
        saveAll();
        if (typeof renderMixPackaging === 'function') renderMixPackaging();
        renderOwner();
        closeOwnerModals();
        showToast('Packaging saved', 'bx-check-circle');
      });
    }

    if ($('ownerCandyTypeForm')) {
      $('ownerCandyTypeForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const f = e.target;
        const id = f.querySelector('[data-cfield="id"]').value;
        const data = {};
        f.querySelectorAll('[data-cfield]').forEach(el => {
          const k = el.dataset.cfield;
          if (k === 'id') return;
          if (el.type === 'number') data[k] = parseFloat(el.value) || 0;
          else data[k] = el.value.trim();
        });
        if (!data.name || !data.name_ar || !data.price_per_kg || !data.img) {
          showToast(t('toast.fillFields'), 'bx-error-circle');
          return;
        }
        if (id) {
          const i = candyTypes.findIndex(c => c.id === id);
          if (i !== -1) candyTypes[i] = { ...candyTypes[i], ...data };
        } else {
          data.id = 'candy-' + Date.now();
          candyTypes.push(data);
        }
        saveAll();
        if (typeof renderMixTypesGrid === 'function') renderMixTypesGrid();
        renderOwner();
        if ($('mixModal') && $('mixModal').classList.contains('show')) {
          if (typeof renderMixSlots === 'function') renderMixSlots();
          if (mixState.step === 5 && typeof renderMixReview === 'function') renderMixReview();
        }
        closeOwnerModals();
        showToast('Candy type saved', 'bx-check-circle');
      });
    }

    if ($('ownerAddonForm')) {
      $('ownerAddonForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const f = e.target;
        const id = f.querySelector('[data-afield="id"]').value;
        const data = {
          name: f.querySelector('[data-afield="name"]').value.trim(),
          name_ar: f.querySelector('[data-afield="name_ar"]').value.trim(),
          desc: f.querySelector('[data-afield="desc"]').value.trim(),
          desc_ar: f.querySelector('[data-afield="desc_ar"]').value.trim(),
          price: parseFloat(f.querySelector('[data-afield="price"]').value) || 0,
          icon: f.querySelector('[data-afield="icon"]').value.trim() || 'bx-dot',
          img: f.querySelector('[data-afield="img"]').value.trim(),
          active: f.querySelector('[data-afield="active"]').checked
        };
        if (!data.name || !data.name_ar) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
        if (id) {
          const i = addons.findIndex(a => a.id === id);
          if (i !== -1) addons[i] = { ...addons[i], ...data };
        } else {
          data.id = 'addon-' + Date.now();
          addons.push(data);
        }
        saveAll();
        renderOwnerAddons();
        if (typeof renderMixAddons === 'function') renderMixAddons();
        if ($('mixModal') && $('mixModal').classList.contains('show') && mixState.step === 5) {
          if (typeof renderMixReview === 'function') renderMixReview();
        }
        closeOwnerModals();
        showToast(t('toast.addonSaved'), 'bx-check-circle');
      });
    }

    if ($('ownerZoneForm')) {
      $('ownerZoneForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const f = e.target;
        const id = f.querySelector('[data-zfield="id"]').value;
        const data = {
          name: f.querySelector('[data-zfield="name"]').value.trim(),
          name_ar: f.querySelector('[data-zfield="name_ar"]').value.trim(),
          price: parseFloat(f.querySelector('[data-zfield="price"]').value) || 0,
          active: f.querySelector('[data-zfield="active"]').checked
        };
        if (!data.name || !data.name_ar) { showToast(t('toast.fillFields'), 'bx-error-circle'); return; }
        if (id) {
          const i = deliveryZones.findIndex(z => z.id === id);
          if (i !== -1) deliveryZones[i] = { ...deliveryZones[i], ...data };
        } else {
          data.id = 'zone-' + Date.now();
          deliveryZones.push(data);
        }
        saveAll();
        renderOwner();
        renderCart();
        closeOwnerModals();
        showToast('Zone saved', 'bx-check-circle');
      });
    }

    /* ==== OWNER PAGE CLICK ==== */
    if ($('ownerPage')) {
      $('ownerPage').addEventListener('click', (e) => {
        const sw = e.target.closest('[data-lang-switch] button');
        if (sw) {
          const lk = sw.dataset.lang;
          const parent = sw.closest('.owner-cms-section');
          parent.querySelectorAll('[data-lang-switch] button').forEach(b =>
            b.classList.toggle('active', b.dataset.lang === lk)
          );
          parent.querySelectorAll('[data-cms-lang]').forEach(f => {
            f.style.display = (f.dataset.cmsLang === lk) ? 'block' : 'none';
          });
          return;
        }

        const tb = e.target.closest('[data-otab]');
        if (tb) { switchOwnerTab(tb.dataset.otab); return; }

        const add = e.target.closest('[data-owner-add]');
        if (add) {
          const k = add.dataset.ownerAdd;
          if (k === 'product') openOwnerProductModal();
          if (k === 'offer')   openOwnerOfferModal();
          return;
        }

        const go = e.target.closest('[data-owner-goto]');
        if (go) { switchOwnerTab(go.dataset.ownerGoto); return; }

        const ep = e.target.closest('[data-edit-product]');
        if (ep) { openOwnerProductModal(ep.dataset.editProduct); return; }

        const dp = e.target.closest('[data-delete-product]');
        if (dp) { confirmDelete('product', dp.dataset.deleteProduct); return; }

        const eo = e.target.closest('[data-edit-offer]');
        if (eo) { openOwnerOfferModal(eo.dataset.editOffer); return; }

        const dof = e.target.closest('[data-delete-offer]');
        if (dof) { confirmDelete('offer', dof.dataset.deleteOffer); return; }

        const dg = e.target.closest('[data-delete-gallery]');
        if (dg) {
          galleryImages = galleryImages.filter(g => g.id !== dg.dataset.deleteGallery);
          saveAll();
          renderGallery();
          renderOwner();
          showToast(t('toast.galleryRemoved'), 'bx-trash');
          return;
        }

        const ew = e.target.closest('[data-edit-weight]');
        if (ew) { openOwnerWeightModal(parseInt(ew.dataset.editWeight)); return; }

        const dw = e.target.closest('[data-del-weight]');
        if (dw) {
          const w = parseInt(dw.dataset.delWeight);
          mixWeights = mixWeights.filter(x => x !== w);
          saveAll();
          if (typeof renderMixWeights === 'function') renderMixWeights();
          renderOwner();
          showToast('Weight removed', 'bx-trash');
          return;
        }

        const epk = e.target.closest('[data-edit-pack]');
        if (epk) { openOwnerPackagingModal(epk.dataset.editPack); return; }

        const dpk = e.target.closest('[data-del-pack]');
        if (dpk) {
          mixPackaging = mixPackaging.filter(x => x.id !== dpk.dataset.delPack);
          saveAll();
          if (typeof renderMixPackaging === 'function') renderMixPackaging();
          renderOwner();
          showToast('Packaging removed', 'bx-trash');
          return;
        }

        const ect = e.target.closest('[data-edit-candy]');
        if (ect) { openOwnerCandyTypeModal(ect.dataset.editCandy); return; }

        const dct = e.target.closest('[data-del-candy]');
        if (dct) {
          candyTypes = candyTypes.filter(x => x.id !== dct.dataset.delCandy);
          saveAll();
          if (typeof renderMixTypesGrid === 'function') renderMixTypesGrid();
          renderOwner();
          showToast('Candy type removed', 'bx-trash');
          return;
        }

        const ead = e.target.closest('[data-edit-addon]');
        if (ead) { openOwnerAddonModal(ead.dataset.editAddon); return; }

        const dad = e.target.closest('[data-del-addon]');
        if (dad) {
          const id = dad.dataset.delAddon;
          if (pendingAddonDeleteId === id) {
            addons = addons.filter(a => a.id !== id);
            pendingAddonDeleteId = null;
            saveAll();
            renderOwnerAddons();
            if (typeof renderMixAddons === 'function') renderMixAddons();
            showToast(t('toast.addonDeleted'), 'bx-trash');
          } else {
            pendingAddonDeleteId = id;
            showToast(t('toast.confirmDelete'), 'bx-info-circle');
            setTimeout(() => { pendingAddonDeleteId = null; }, 3000);
          }
          return;
        }

        const ez = e.target.closest('[data-edit-zone]');
        if (ez) { openOwnerZoneModal(ez.dataset.editZone); return; }

        const dz = e.target.closest('[data-del-zone]');
        if (dz) {
          deliveryZones = deliveryZones.filter(x => x.id !== dz.dataset.delZone);
          saveAll();
          renderOwner();
          renderCart();
          showToast('Zone removed', 'bx-trash');
          return;
        }
      });
    }

    /* ==== LANGUAGE TOGGLE ==== */
    if ($('langToggle')) {
      $('langToggle').addEventListener('click', () => {
        applyLanguage(lang === 'ar' ? 'en' : 'ar');
      });
    }

    /* ==== VH FIX ==== */
    function setVH() {
      document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
    }
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => setTimeout(setVH, 200));

    /* ==== SWIPE TO CLOSE ==== */
    ['cartPanel', 'loginPanel'].forEach(id => {
      const el = $(id);
      if (!el) return;
      let startX = 0, startY = 0, curX = 0, tracking = false;

      el.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        curX = startX;
        tracking = true;
        el.style.transition = 'none';
      }, { passive: true });

      el.addEventListener('touchmove', (e) => {
        if (!tracking) return;
        curX = e.touches[0].clientX;
        const dy = Math.abs(e.touches[0].clientY - startY);
        const dx = curX - startX;
        const rtl = document.documentElement.dir === 'rtl';
        const wrongDir = (!rtl && dx < 0) || (rtl && dx > 0);
        if (dy > 40 || wrongDir) {
          tracking = false;
          el.style.transition = '';
          el.style.transform = '';
          return;
        }
        el.style.transform = 'translateX(' + dx + 'px)';
      }, { passive: true });

      el.addEventListener('touchend', () => {
        if (!tracking) return;
        tracking = false;
        el.style.transition = '';
        const dx = curX - startX;
        const rtl = document.documentElement.dir === 'rtl';
        const shouldClose = (!rtl && dx > 100) || (rtl && dx < -100);
        el.style.transform = '';
        if (shouldClose) closeAllPanels();
      });
    });

    /* ==== SECURED OVERVIEW ==== */
    if ($('overviewUnlockBtn')) $('overviewUnlockBtn').addEventListener('click', tryUnlockOverview);
    if ($('overviewPassword')) {
      $('overviewPassword').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); tryUnlockOverview(); }
      });
    }
    if ($('reportLockBtn'))  $('reportLockBtn').addEventListener('click', lockOverview);
    if ($('reportPrintBtn')) $('reportPrintBtn').addEventListener('click', printReport);

    if ($('reportFilters')) {
      $('reportFilters').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-range]');
        if (!btn) return;
        reportRange = btn.dataset.range;
        document.querySelectorAll('.report-filter').forEach(b =>
          b.classList.toggle('active', b.dataset.range === reportRange)
        );
        refreshOverviewReports();
      });
    }

    /* ==== AUTO REFRESH ATTENDANCE (30s) ==== */
    setInterval(() => {
      if ($('adminPage') && $('adminPage').classList.contains('show') &&
          $('attendanceBody')) {
        renderAdminAttendance();
      }
    }, 30000);

    /* =====================================================
       INIT — نقطة الانطلاق النهائية
       ===================================================== */
    (async function init() {
      try {
        /* loadAll handles syncing both employee + online orders */
        if (typeof loadAll === 'function')                  await loadAll();
        if (typeof loadGoogleAccounts === 'function')       loadGoogleAccounts();
        if (typeof loadUserCards === 'function')            loadUserCards();

        /* Apply dynamic store info BEFORE other renderers */
        if (typeof applyStoreInfoToSite === 'function')     applyStoreInfoToSite();
        if (typeof applySiteConfig === 'function')          applySiteConfig();

        if (typeof renderOffers  === 'function') renderOffers();
        if (typeof renderCandies === 'function') renderCandies();
        if (typeof renderGallery === 'function') renderGallery();
        if (typeof renderCart    === 'function') renderCart();

        applyLanguage(lang);
        if (typeof updateMobileAccountUI === 'function') updateMobileAccountUI();
        updateSign(false);
        setInterval(() => updateSign(false), 10000);
        if (typeof revealOnScroll === 'function') revealOnScroll();

        console.log('%c🍬 Hat Candy Store — Ready', 'color:#e2015d;font-weight:bold;font-size:14px;');
      } catch (err) {
        console.error('[init]', err);
      }
    })();

  }); /* end DOMContentLoaded */

})();