/* ============================================================
   PAISLEY PIE CO. — ORDER STORAGE (shared by order.html + admin.html)
   ------------------------------------------------------------
   Orders are saved in this browser's localStorage. On a static
   site there is no server, so orders are visible on the SAME
   device they were placed on (e.g. the shop's own till / office
   computer). See the note in admin.html about making customer
   phone orders reach the shop for real.
   ============================================================ */
(function () {
  var KEY = 'ppc_orders';
  var STATUSES = ['New', 'Preparing', 'Ready', 'Completed'];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function write(arr) { localStorage.setItem(KEY, JSON.stringify(arr)); }

  window.ppcOrders = {
    STATUSES: STATUSES,
    // newest first
    list: function () { return read().slice().sort(function (a, b) { return b.ts - a.ts; }); },
    get: function (ref) { return read().filter(function (o) { return o.ref === ref; })[0] || null; },
    add: function (order) { var a = read(); a.push(order); write(a); return order; },
    setStatus: function (ref, status) {
      var a = read();
      for (var i = 0; i < a.length; i++) if (a[i].ref === ref) { a[i].status = status; break; }
      write(a);
    },
    remove: function (ref) { write(read().filter(function (o) { return o.ref !== ref; })); },
    clear: function () { write([]); },
    countNew: function () { return read().filter(function (o) { return (o.status || 'New') === 'New'; }).length; }
  };
})();
