/* =====================================================
   HAT CANDY — CLOUD.JS (v2.0.0)
   Google Apps Script bridge + Cache + Retry
   يعمل مع: Customer Store + Employee POS
   يُحمَّل بعد config.js مباشرة
   ===================================================== */

/**
 * @file Cloud synchronisation layer for Hat Candy.
 *
 * Provides:
 *  - {@link Cache}  — Two-tier (memory + localStorage) cache
 *  - {@link Api}    — Promise-based client for the Google Apps Script backend
 *  - {@link cloudSyncProducts} / {@link cloudPushAll} — convenience helpers
 *
 * The layer is fault-tolerant: if the API URL is not configured
 * (still set to the placeholder) every call resolves silently with `null`
 * so the app works offline with localStorage data only.
 */

(function () {
  'use strict';

  /* ============ CONFIG BRIDGE ============ */
  var CFG     = window.HAT_CONFIG || {};
  var API_CFG = CFG.api || {};
  var SK      = (CFG.storageKeys) || {};

  /* ============ CONSTANTS ============ */
  var PLACEHOLDER_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';
  var DEFAULT_TIMEOUT = Number(API_CFG.timeout) || 15000;
  var DEFAULT_RETRIES = Number(API_CFG.retries) || 2;
  var DEFAULT_TTL     = (API_CFG.cache && API_CFG.cache.ttl) || (5 * 60 * 1000);
  var CACHE_ENABLED   = !(API_CFG.cache && API_CFG.cache.enabled === false);
  var CACHE_KEY       = SK.cache || 'hatcandy-cache';

  /* Is the API configured? */
  var API_URL       = String(API_CFG.url || '').trim();
  var API_TOKEN     = String(API_CFG.adminToken || '');
  var IS_CONFIGURED = !!API_URL && API_URL !== PLACEHOLDER_URL && /^https?:\/\//i.test(API_URL);

  /* ============================================================
     CACHE MANAGER
     ============================================================ */

  /**
   * Two-tier cache: fast in-memory lookups backed by localStorage
   * for persistence across page reloads.  Entries expire after a
   * configurable TTL.
   */
  var Cache = {
    /** @private in-memory store */
    _mem: {},

    /**
     * Retrieve a cached value.
     * @param {string} key
     * @returns {*|null} the cached value, or null if expired / missing.
     */
    get: function (key) {
      if (!CACHE_ENABLED) return null;

      /* Memory first */
      var mem = this._mem[key];
      if (mem && mem.expires > Date.now()) return mem.value;

      /* Then localStorage */
      try {
        var all  = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        var item = all[key];
        if (item && item.expires > Date.now()) {
          this._mem[key] = item;
          return item.value;
        }
        /* Expired — clean up */
        if (item) {
          delete all[key];
          localStorage.setItem(CACHE_KEY, JSON.stringify(all));
        }
      } catch (e) { /* localStorage unavailable */ }

      return null;
    },

    /**
     * Store a value in both memory and localStorage.
     * @param {string} key
     * @param {*}      value  — must be JSON-serialisable
     * @param {number} [ttlMs] — custom TTL in milliseconds
     */
    set: function (key, value, ttlMs) {
      if (!CACHE_ENABLED) return;
      var ttl  = Number(ttlMs) || DEFAULT_TTL;
      var item = { value: value, expires: Date.now() + ttl };

      this._mem[key] = item;

      try {
        var all  = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        all[key] = item;

        /* Bound cache size — evict expired entries when > 40 keys */
        var keys = Object.keys(all);
        if (keys.length > 40) {
          var now = Date.now();
          keys.forEach(function (k) { if (all[k].expires < now) delete all[k]; });
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify(all));
      } catch (e) { /* quota exceeded or unavailable */ }
    },

    /** Wipe the entire cache (memory + localStorage). */
    clear: function () {
      this._mem = {};
      try { localStorage.removeItem(CACHE_KEY); } catch (e) { /* silent */ }
    },

    /**
     * Remove a single key from both tiers.
     * @param {string} key
     */
    invalidate: function (key) {
      delete this._mem[key];
      try {
        var all = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
        if (all[key]) {
          delete all[key];
          localStorage.setItem(CACHE_KEY, JSON.stringify(all));
        }
      } catch (e) { /* silent */ }
    }
  };

  window.Cache = Cache;

  /* ============================================================
     HTTP LAYER
     ============================================================ */

  /**
   * POST JSON to Apps Script with timeout + exponential-backoff retries.
   * Never throws — always resolves (with `null` on failure).
   *
   * @param {string} action  — the Apps Script action name
   * @param {Object} payload — data to send
   * @param {Object} [opts]  — { retries, timeout }
   * @returns {Promise<Object|null>}
   */
  function apiFetch(action, payload, opts) {
    opts = opts || {};
    var retries = (opts.retries != null) ? opts.retries : DEFAULT_RETRIES;
    var timeout = Number(opts.timeout) || DEFAULT_TIMEOUT;

    /* If API is not configured, silently bail */
    if (!IS_CONFIGURED) {
      if (CFG.env === 'development') {
        console.log('[API] not configured — skipping', action);
      }
      return Promise.resolve(null);
    }

    var body = {
      action: action,
      token:  API_TOKEN,
      data:   payload || {},
      ts:     Date.now()
    };

    /**
     * Recursive attempt function — clearer than a for-loop with await
     * because we need exponential backoff delays between retries.
     */
    function attempt(n) {
      return new Promise(function (resolve) {
        var controller = new AbortController();
        var timer      = setTimeout(function () { controller.abort(); }, timeout);

        fetch(API_URL, {
          method:   'POST',
          headers:  { 'Content-Type': 'text/plain;charset=utf-8' },
          body:     JSON.stringify(body),
          signal:   controller.signal,
          redirect: 'follow'
        })
        .then(function (response) {
          clearTimeout(timer);
          if (!response.ok) throw new Error('HTTP ' + response.status);
          return response.text();
        })
        .then(function (text) {
          var json;
          try {
            json = text ? JSON.parse(text) : null;
          } catch (parseErr) {
            console.warn('[API] non-JSON response for', action, ':', text.slice(0, 120));
            return resolve(null);
          }
          if (json && json.error) {
            console.warn('[API] server error for', action, ':', json.error);
            return resolve(null);
          }
          resolve(json);
        })
        .catch(function (err) {
          clearTimeout(timer);
          var isAbort = err.name === 'AbortError';
          var msg     = isAbort ? 'timeout' : (err.message || 'unknown');

          if (n >= retries) {
            console.warn('[API] ' + action + ' failed after ' + (retries + 1) + ' attempts:', msg);
            return resolve(null);
          }
          /* Exponential backoff: 200 ms, 600 ms, 1.4 s … */
          var delay = 200 * Math.pow(3, n);
          setTimeout(function () { resolve(attempt(n + 1)); }, delay);
        });
      });
    }

    return attempt(0);
  }

  /* ============================================================
     API — Public methods
     ============================================================ */

  /** @namespace Api */
  var Api = {

    /* ---- Configuration info ---- */

    /** @returns {boolean} whether the API endpoint is configured */
    isConfigured: function () { return IS_CONFIGURED; },

    /** @returns {string} the API endpoint URL */
    getUrl: function () { return API_URL; },

    /* ---- Bulk fetch ----
       Returns cached result if fresh (unless force=true).
       Shape: { products, offers, gallery, candyTypes, mixPackaging,
                mixWeights, addons, deliveryZones, storeHours, updatedAt }
    */

    /**
     * Fetch all store data in a single call.
     * @param {boolean} [force=false] bypass cache
     * @returns {Promise<Object|null>}
     */
    getAll: function (force) {
      var cacheKey = 'all';
      if (!force) {
        var cached = Cache.get(cacheKey);
        if (cached) return Promise.resolve(cached);
      }
      return apiFetch('getAll', {}).then(function (res) {
        if (!res || !res.data) return null;
        Cache.set(cacheKey, res.data, DEFAULT_TTL);
        return res.data;
      });
    },

    /* ---- Orders ---- */

    /**
     * Create a new order.
     * @param {Object} order — must include an `id` field
     * @returns {Promise<Object|null>}
     */
    createOrder: function (order) {
      if (!order || !order.id) return Promise.resolve(null);
      return apiFetch('createOrder', order).then(function (res) {
        Cache.invalidate('orders');
        return res && res.data ? res.data : (res || null);
      });
    },

    /**
     * Update the status of an existing order.
     * @param {string} orderId
     * @param {string} status
     * @returns {Promise<Object|null>}
     */
    updateOrderStatus: function (orderId, status) {
      if (!orderId || !status) return Promise.resolve(null);
      return apiFetch('updateOrderStatus', { id: orderId, status: status }).then(function (res) {
        Cache.invalidate('orders');
        Cache.invalidate('all');
        return res;
      });
    },

    /**
     * Fetch all orders.
     * @returns {Promise<Array|null>}
     */
    getOrders: function () {
      var cacheKey = 'orders';
      var cached   = Cache.get(cacheKey);
      if (cached) return Promise.resolve(cached);
      return apiFetch('getOrders', {}).then(function (res) {
        if (res && res.data) {
          Cache.set(cacheKey, res.data, 60 * 1000);
          return res.data;
        }
        return null;
      });
    },

    /* ---- Customers ---- */

    /**
     * Register a new customer.
     * @param {Object} customer — must include email or phone
     * @returns {Promise<Object|null>}
     */
    registerCustomer: function (customer) {
      if (!customer || (!customer.email && !customer.phone)) return Promise.resolve(null);
      return apiFetch('registerCustomer', customer).then(function (res) {
        Cache.invalidate('customers');
        return res && res.data ? res.data : null;
      });
    },

    /**
     * Fetch all customers.
     * @returns {Promise<Array|null>}
     */
    getCustomers: function () {
      var cacheKey = 'customers';
      var cached   = Cache.get(cacheKey);
      if (cached) return Promise.resolve(cached);
      return apiFetch('getCustomers', {}).then(function (res) {
        if (res && res.data) {
          Cache.set(cacheKey, res.data, 2 * 60 * 1000);
          return res.data;
        }
        return null;
      });
    },

    /* ---- Products ---- */

    /**
     * Create or update a product.
     * @param {Object} product — must include a `name` field
     * @returns {Promise<Object|null>}
     */
    saveProduct: function (product) {
      if (!product || !product.name) return Promise.resolve(null);
      return apiFetch('saveProduct', product).then(function (res) {
        Cache.invalidate('all');
        return res;
      });
    },

    /**
     * Delete a product by ID.
     * @param {string} productId
     * @returns {Promise<Object|null>}
     */
    deleteProduct: function (productId) {
      if (!productId) return Promise.resolve(null);
      return apiFetch('deleteProduct', { id: productId }).then(function (res) {
        Cache.invalidate('all');
        return res;
      });
    },

    /* ---- Offers ---- */

    /**
     * Create or update an offer.
     * @param {Object} offer — must include a `name` field
     * @returns {Promise<Object|null>}
     */
    saveOffer: function (offer) {
      if (!offer || !offer.name) return Promise.resolve(null);
      return apiFetch('saveOffer', offer).then(function (res) {
        Cache.invalidate('all');
        return res;
      });
    },

    /**
     * Delete an offer by ID.
     * @param {string} offerId
     * @returns {Promise<Object|null>}
     */
    deleteOffer: function (offerId) {
      if (!offerId) return Promise.resolve(null);
      return apiFetch('deleteOffer', { id: offerId }).then(function (res) {
        Cache.invalidate('all');
        return res;
      });
    },

    /* ---- Employees ---- */

    /**
     * Create or update an employee.
     * @param {Object} employee — must include a `username` field
     * @returns {Promise<Object|null>}
     */
    saveEmployee: function (employee) {
      if (!employee || !employee.username) return Promise.resolve(null);
      return apiFetch('saveEmployee', employee).then(function (res) {
        Cache.invalidate('employees');
        return res;
      });
    },

    /**
     * Delete an employee by ID.
     * @param {string} employeeId
     * @returns {Promise<Object|null>}
     */
    deleteEmployee: function (employeeId) {
      if (!employeeId) return Promise.resolve(null);
      return apiFetch('deleteEmployee', { id: employeeId }).then(function (res) {
        Cache.invalidate('employees');
        return res;
      });
    },

    /**
     * Fetch all employees.
     * @returns {Promise<Array|null>}
     */
    getEmployees: function () {
      var cacheKey = 'employees';
      var cached   = Cache.get(cacheKey);
      if (cached) return Promise.resolve(cached);
      return apiFetch('getEmployees', {}).then(function (res) {
        if (res && res.data) {
          Cache.set(cacheKey, res.data, 2 * 60 * 1000);
          return res.data;
        }
        return null;
      });
    },

    /* ---- Contact Messages ---- */

    /**
     * Submit a contact form message.
     * @param {Object} message — must include `name` and `message` fields
     * @returns {Promise<Object|null>}
     */
    submitMessage: function (message) {
      if (!message || !message.name || !message.message) return Promise.resolve(null);
      return apiFetch('submitMessage', message).then(function (res) {
        Cache.invalidate('messages');
        return res;
      });
    },

    /**
     * Fetch all contact messages.
     * @returns {Promise<Array|null>}
     */
    getMessages: function () {
      var cacheKey = 'messages';
      var cached   = Cache.get(cacheKey);
      if (cached) return Promise.resolve(cached);
      return apiFetch('getMessages', {}).then(function (res) {
        if (res && res.data) {
          Cache.set(cacheKey, res.data, 60 * 1000);
          return res.data;
        }
        return null;
      });
    },

    /* ---- Store Info (dynamic) ---- */

    /**
     * Fetch dynamic store information.
     * @returns {Promise<Object|null>}
     */
    getStoreInfo: function () {
      var cacheKey = 'storeInfo';
      var cached   = Cache.get(cacheKey);
      if (cached) return Promise.resolve(cached);
      return apiFetch('getStoreInfo', {}).then(function (res) {
        if (res && res.data) {
          Cache.set(cacheKey, res.data, 5 * 60 * 1000);
          return res.data;
        }
        return null;
      });
    },

    /* ---- Health check ---- */

    /**
     * Ping the API endpoint.
     * @returns {Promise<{ok:boolean, reason?:string, data?:Object}>}
     */
    ping: function () {
      if (!IS_CONFIGURED) return Promise.resolve({ ok: false, reason: 'not-configured' });
      return apiFetch('ping', {}, { retries: 0, timeout: 5000 }).then(function (res) {
        return res ? { ok: true, data: res } : { ok: false, reason: 'unreachable' };
      });
    }
  };

  window.Api = Api;

  /* ============================================================
     AUTO-SYNC HELPERS
     ============================================================ */

  /**
   * Pull products & offers from the cloud and save to localStorage.
   * Called once at app initialisation.
   * @returns {Promise<Object|null>} the full cloud payload
   */
  window.cloudSyncProducts = function () {
    if (!IS_CONFIGURED) return Promise.resolve(null);
    return Api.getAll(false).then(function (cloud) {
      if (!cloud) return null;
      try {
        if (Array.isArray(cloud.products)) {
          localStorage.setItem(SK.products || 'hatcandy-products', JSON.stringify(cloud.products));
        }
        if (Array.isArray(cloud.offers)) {
          localStorage.setItem(SK.offers || 'hatcandy-offers', JSON.stringify(cloud.offers));
        }
      } catch (e) {
        console.warn('[cloudSyncProducts]', e);
      }
      return cloud;
    });
  };

  /**
   * Push a full local snapshot to the cloud (manual owner action).
   * @param {Object} snapshot
   * @returns {Promise<Object|null>}
   */
  window.cloudPushAll = function (snapshot) {
    if (!IS_CONFIGURED || !snapshot) return Promise.resolve(null);
    return apiFetch('pushAll', snapshot, { retries: 3, timeout: 30000 }).then(function (res) {
      Cache.clear();
      return res;
    });
  };

  /* ============================================================
     INITIAL LOG
     ============================================================ */
  var mode = IS_CONFIGURED ? 'enabled' : 'disabled (placeholder URL)';
  console.log(
    '%c☁️  Cloud layer loaded — ' + mode,
    IS_CONFIGURED
      ? 'color:#0ea5e9;font-weight:bold;'
      : 'color:#9ca3af;font-weight:bold;',
    IS_CONFIGURED
      ? '\n→ Endpoint: ' + API_URL.slice(0, 60) + (API_URL.length > 60 ? '…' : '')
      : '\n→ Set HAT_CONFIG.api.url to enable sync'
  );

})();
