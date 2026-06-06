/* ============================================================
   PAISLEY PIE CO. — BACKEND CONFIG
   ------------------------------------------------------------
   Paste your Supabase project values below to turn on cloud
   orders (so orders from customer phones reach the shop) and
   the cloud waitlist. Find these in your Supabase dashboard:
     Settings → API
       • Project URL      → url
       • Project API keys → "anon public" → anonKey

   Leave them blank to keep everything running on this device
   only (localStorage). The anon key is SAFE to expose publicly —
   it's protected by the database's Row Level Security rules.
   ============================================================ */
window.PPC_SUPABASE = {
  url: "",       // e.g. "https://abcdefgh.supabase.co"
  anonKey: ""    // e.g. "eyJhbGciOiJI...."  (the anon public key)
};

/* Returns a ready Supabase client if configured, else null. */
window.ppcCloud = function () {
  try {
    var c = window.PPC_SUPABASE;
    if (c && c.url && c.anonKey && window.supabase && window.supabase.createClient) {
      if (!window._ppcSb) window._ppcSb = window.supabase.createClient(c.url, c.anonKey);
      return window._ppcSb;
    }
  } catch (e) {}
  return null;
};
