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
  url: "https://wzmonkivlosnkoabdbpu.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bW9ua2l2bG9zbmtvYWJkYnB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MDY3NzcsImV4cCI6MjA5NjM4Mjc3N30.D_Z8Q1_XZchfdPhyiER_lL-0kH1ZklFwLbp6UEasse8"   // anon public key — safe to expose; protected by RLS
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

/* ---------------------------------------------------------------
   EMAILJS (auto-send rotas to staff + "we're live" to the waitlist)
   Create a free account at emailjs.com, add an email Service and a
   Template, then paste the 3 values below (Account → API Keys for the
   public key; the Service and Template each have their own ID).
   Your template should use these variables:
     To Email: {{to_email}}   Subject: {{subject}}   Body: {{message}}
--------------------------------------------------------------- */
window.PPC_EMAILJS = {
  publicKey:  "",   // e.g. "AbCdEf123..."
  serviceId:  "",   // e.g. "service_xxxx"
  templateId: ""    // e.g. "template_xxxx"
};
window.ppcEmailReady = function () {
  var e = window.PPC_EMAILJS;
  return !!(e && e.publicKey && e.serviceId && e.templateId && window.emailjs);
};
/* Sends one email; returns a Promise. Rejects if EmailJS isn't set up. */
window.ppcSendEmail = function (toEmail, toName, subject, message) {
  if (!window.ppcEmailReady()) return Promise.reject(new Error('EmailJS not set up'));
  try { if (!window._ppcEmailInit) { window.emailjs.init({ publicKey: window.PPC_EMAILJS.publicKey }); window._ppcEmailInit = true; } } catch (e) {}
  return window.emailjs.send(window.PPC_EMAILJS.serviceId, window.PPC_EMAILJS.templateId, {
    to_email: toEmail, to_name: toName || '', subject: subject || '', message: message || ''
  });
};
