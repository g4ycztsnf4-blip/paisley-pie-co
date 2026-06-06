/* ============================================================
   PAISLEY PIE CO. — CHANGE LOG (shared by admin.html + manager.html)
   ------------------------------------------------------------
   Records who did what, and when. Stored in this browser's
   localStorage (per-device, like orders). Keeps the last 500 entries.
   ============================================================ */
(function () {
  var KEY = 'ppc_audit';
  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function write(a) { localStorage.setItem(KEY, JSON.stringify(a)); }
  function actor() {
    try { if (typeof window.ppcCurrentUser === 'function') { var u = window.ppcCurrentUser(); if (u) return u.name || u.username; } } catch (e) {}
    return sessionStorage.getItem('ppc_admin_user') || 'Unknown';
  }
  window.ppcAudit = {
    log: function (action, detail) {
      var a = read();
      a.push({ ts: Date.now(), who: actor(), action: action, detail: detail || '' });
      if (a.length > 500) a = a.slice(a.length - 500);
      write(a);
    },
    list: function () { return read().slice().sort(function (x, y) { return y.ts - x.ts; }); },
    clear: function () { write([]); }
  };
})();
