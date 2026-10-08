/* =====================================================
   HAT CANDY — SYNC MANAGER (Incremental Delta Sync)
   يرفع فقط التغييرات + Batch + Auto-Retry + Offline-First
   يُحمَّل بعد cloud.js مباشرة
   ===================================================== */

(function () {
  'use strict';

  const CFG = window.HAT_CONFIG || {};
  const SK  = CFG.storageKeys || {};

  /* ============ KEYS ============ */
  const QUEUE_KEY = 'hatcandy-sync-queue';
  const META_KEY  = 'hatcandy-sync-meta';

  /* ============ CONFIG ============ */
  const DEBOUNCE_MS   = 800;    /* تجميع التعديلات السريعة */
  const RETRY_MS      = 5000;   /* إعادة المحاولة عند الفشل */
  const PERIODIC_MS   = 30000;  /* فحص دوري للـ queue */

  /* ============ STATE ============ */
  const STATE = {
    queue: {},        /* { products: {id: {op, data, dirtyAt}}, ... } */
    isSyncing: false,
    lastSync: null,
    debounceTimer: null,
    retryTimer: null,
    listeners: []
  };

  /* ============ PERSISTENCE ============ */
  function loadQueue() {
    try {
      const raw = localStorage.getItem(QUEUE_KEY);
      STATE.queue = raw ? JSON.parse(raw) : {};
      if (!STATE.queue || typeof STATE.queue !== 'object') STATE.queue = {};
    } catch { STATE.queue = {}; }
  }

  function saveQueue() {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(STATE.queue)); } catch {}
  }

  /* ============ MARK DIRTY ============ */
  function markDirty(entity, id, data, op) {
    if (!entity || !id) return;
    STATE.queue[entity] = STATE.queue[entity] || {};
    STATE.queue[entity][String(id)] = {
      id: String(id),
      data: data || null,
      op: op || 'upsert',
      dirtyAt: Date.now()
    };
    saveQueue();
    scheduleSync();
    notify('queued', { entity, id, total: getPendingCount() });
  }

  function markDeleted(entity, id) {
    if (!entity || !id) return;
    STATE.queue[entity] = STATE.queue[entity] || {};
    STATE.queue[entity][String(id)] = {
      id: String(id),
      op: 'delete',
      dirtyAt: Date.now()
    };
    saveQueue();
    scheduleSync();
    notify('queued', { entity, id, total: getPendingCount() });
  }

  /* ============ HELPERS ============ */
  function hasPending() {
    return Object.keys(STATE.queue).some(e => Object.keys(STATE.queue[e] || {}).length > 0);
  }

  function getPendingCount() {
    let n = 0;
    Object.keys(STATE.queue).forEach(e => {
      n += Object.keys(STATE.queue[e] || {}).length;
    });
    return n;
  }

  function scheduleSync() {
    clearTimeout(STATE.debounceTimer);
    STATE.debounceTimer = setTimeout(() => {
      flush().catch(err => console.warn('[Sync] flush error:', err));
    }, DEBOUNCE_MS);
  }

  /* ============ FLUSH ============ */
  async function flush() {
    if (STATE.isSyncing) return { ok: false, reason: 'busy' };
    if (!hasPending()) return { ok: true, reason: 'empty' };

    if (!window.Api || typeof window.Api.isConfigured !== 'function' || !window.Api.isConfigured()) {
      return { ok: false, reason: 'no-api' };
    }

    STATE.isSyncing = true;
    notify('syncing', { count: getPendingCount() });

    const snapshot = JSON.parse(JSON.stringify(STATE.queue));
    const counts = getPendingCount();

    try {
      const response = await fetch(CFG.api.url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'syncDelta',
          token: CFG.api.adminToken,
          data: snapshot
        }),
        redirect: 'follow'
      });

      if (!response.ok) throw new Error('HTTP ' + response.status);
      const json = await response.json();

      if (!json || json.error) {
        throw new Error((json && json.error) || 'unknown server error');
      }

      /* نجاح — نظّف فقط العناصر التي لم تعدّل مجدداً */
      Object.keys(snapshot).forEach(entity => {
        Object.keys(snapshot[entity] || {}).forEach(id => {
          const cur = STATE.queue[entity] && STATE.queue[entity][id];
          const sent = snapshot[entity][id];
          if (cur && cur.dirtyAt === sent.dirtyAt) {
            delete STATE.queue[entity][id];
          }
        });
        if (STATE.queue[entity] && !Object.keys(STATE.queue[entity]).length) {
          delete STATE.queue[entity];
        }
      });
      saveQueue();

      STATE.lastSync = new Date().toISOString();
      notify('synced', { counts, result: json.data });

      return { ok: true, counts, result: json.data };

    } catch (err) {
      console.warn('[Sync] failed:', err.message);
      notify('failed', { error: err.message });
      clearTimeout(STATE.retryTimer);
      STATE.retryTimer = setTimeout(() => flush().catch(() => {}), RETRY_MS);
      return { ok: false, reason: err.message };
    } finally {
      STATE.isSyncing = false;
    }
  }

  /* ============ NOTIFY LISTENERS ============ */
  function notify(event, payload) {
    STATE.listeners.forEach(cb => {
      try { cb(event, payload); } catch (e) { /* silent */ }
    });
  }

  function onSync(cb) {
    if (typeof cb === 'function') STATE.listeners.push(cb);
  }

  /* ============ PUBLIC API ============ */
  window.SyncManager = {
    markDirty,
    markDeleted,
    flush,
    hasPending,
    getPendingCount,
    onSync,
    getQueue: () => JSON.parse(JSON.stringify(STATE.queue)),
    clearQueue: () => { STATE.queue = {}; saveQueue(); },
    lastSync: () => STATE.lastSync,
    status: () => ({
      pending: getPendingCount(),
      syncing: STATE.isSyncing,
      lastSync: STATE.lastSync
    })
  };

  /* ============ HOOK API METHODS ============ */
  function installApiHooks() {
    if (!window.Api) return;

    const MAP = {
      saveProduct:       'products',
      deleteProduct:     'products',
      saveOffer:         'offers',
      deleteOffer:       'offers',
      saveGallery:       'gallery',
      deleteGallery:     'gallery',
      saveCandyType:     'candyTypes',
      deleteCandyType:   'candyTypes',
      savePackaging:     'mixPackaging',
      deletePackaging:   'mixPackaging',
      saveAddon:         'addons',
      deleteAddon:       'addons',
      saveZone:          'deliveryZones',
      deleteZone:        'deliveryZones',
      saveEmployee:      'employees',
      deleteEmployee:    'employees',
      createOrder:       'orders',
      registerCustomer:  'customers',
      submitMessage:     'messages'
    };

    Object.keys(MAP).forEach(method => {
      const entity = MAP[method];
      const orig = window.Api[method];
      if (typeof orig !== 'function' || orig._syncHooked) return;

      const isDelete = method.startsWith('delete');

      const hooked = function (data) {
        try {
          if (isDelete) {
            /* deleteProduct({id}) أو deleteProduct('id') */
            const id = (data && typeof data === 'object')
              ? (data.id || data.productId || data.offerId || data.employeeId)
              : data;
            if (id) {
              markDeleted(entity, String(id));
              return Promise.resolve({ ok: true, queued: true, entity, id });
            }
          } else if (data && data.id) {
            markDirty(entity, String(data.id), data, 'upsert');
            return Promise.resolve({ ok: true, queued: true, entity, id: data.id });
          }
        } catch (e) {
          console.warn('[Sync] hook error:', e);
        }
        /* Fallback: نفّذ الأصلي إن لم نستطع التعامل مع الطلب */
        return orig.apply(this, arguments);
      };

      hooked._syncHooked = true;
      window.Api[method] = hooked;
    });

    console.log('%c🔗 Api methods hooked — writes now go through queue', 'color:#0ea5e9;font-weight:bold;');
  }

  /* ============ AUTO TRIGGERS ============ */
  window.addEventListener('online', () => {
    console.log('[Sync] back online — flushing');
    flush().catch(() => {});
  });

  window.addEventListener('beforeunload', () => {
    if (hasPending() && navigator.sendBeacon) {
      try {
        const blob = new Blob([JSON.stringify({
          action: 'syncDelta',
          token: CFG.api.adminToken,
          data: STATE.queue
        })], { type: 'text/plain;charset=utf-8' });
        navigator.sendBeacon(CFG.api.url, blob);
      } catch (e) { /* silent */ }
    }
  });

  setInterval(() => {
    if (hasPending() && !STATE.isSyncing) {
      flush().catch(() => {});
    }
  }, PERIODIC_MS);

  /* ============ INIT ============ */
  loadQueue();

  /* Hook بعد تحميل Api */
  if (window.Api) {
    installApiHooks();
  } else {
    /* انتظر قليلاً حتى يُحمَّل cloud.js */
    let tries = 0;
    const wait = setInterval(() => {
      tries++;
      if (window.Api) {
        installApiHooks();
        clearInterval(wait);
      }
      if (tries > 20) clearInterval(wait);
    }, 100);
  }

  console.log(
    '%c⚡ Sync Manager loaded — delta sync ready',
    'color:#22c55e;font-weight:bold;',
    '\n→ Pending on boot:', getPendingCount()
  );

})();