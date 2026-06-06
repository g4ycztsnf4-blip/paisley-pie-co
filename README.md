# Paisley Pie Co. — website

A fast, static website for Paisley Pie Co. (flagship: 25 Causeyside Street, Paisley).
No build step, no framework — just HTML/CSS/JS so it can be hosted anywhere for free.

## Pages
| File | What it is |
|------|------------|
| `index.html` | Home (hero, story, menu preview, reviews, hours, map) |
| `menu.html` | Full menu (data-driven) |
| `order.html` | Online ordering (cart, collection/delivery, "we're busy" screen) |
| `deals.html` | Deals & loyalty (data-driven) |
| `news.html` | News & press (data-driven) |
| `pie-ideas.html`, `suggestions.html` | Community pages |
| `admin.html` | **Website manager** — edit menu/prices/deals/news, shop info, busy switch; view orders; change log |
| `manager.html` | **Manager portal** — rotas, team, reports & staffing |
| `data.js` | The site's content (menu, prices, deals, news, shop info). Edited via `admin.html`. |
| `orders.js`, `audit.js` | Shared helpers (orders storage, change log) |

## Run it locally
```bash
python3 -m http.server 3456
# then open http://localhost:3456
```

## Editing content (no code)
Open `admin.html` → log in → edit → **Publish**. On a static host this downloads an
updated `data.js`; commit/replace that file to publish. (See "Going further" for making
Publish commit automatically.)

## Staff logins (admin.html & manager.html)
Accounts: `chloe.admin`, `michael.admin`, `scott.admin` — first-time password `paisleypie`,
and everyone is forced to set their own password on first login.

> ⚠️ The login is a **client-side deterrent** (good for hiding the manager from casual
> visitors), not strong security. Real auth needs a backend — see "Going further".

## Deploy (pick one — all free)
**Netlify (easiest):** push this repo to GitHub, then on netlify.com → "Add new site" →
"Import from Git" → pick the repo → Deploy. `netlify.toml` is already set (no build).

**GitHub Pages:** push to GitHub → repo Settings → Pages → Source: `main` / root → Save.
`.nojekyll` is included.

**Cloudflare Pages:** Pages → Connect to Git → pick repo → Framework "None", build command
empty, output dir `/`.

## Going further (needs accounts — the dynamic bits Git alone can't do)
- **Auto-publish content from admin** → add a Git-based CMS (Decap) with GitHub login.
- **Orders from customer phones + shared orders/logins/rotas across devices** → a small
  backend: a serverless function + database (Cloudflare Pages Functions + D1, or Supabase/Firebase).
- **Auto-send rotas & "we're live" emails** → an email/SMS service (Resend/EmailJS/Twilio).

Today everything runs client-side (per-device storage), which is ideal on the shop's own
computer/till and as a public brochure + content site.
