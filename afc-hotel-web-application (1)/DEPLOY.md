# 🚀 Deploy AFC Hotel — Vercel & Netlify (No npm needed from you)

Your site is already configured. You do **NOT** need to run `npm` on your computer.
Just push this folder to GitHub — Vercel / Netlify will install + build automatically.

Build output is a single self-contained file: `dist/index.html` (all JS/CSS inlined).

---

## Option A — Deploy on Vercel (recommended, fastest)

1. Push this project to GitHub (upload all files **except** `node_modules` and `dist` — they are ignored via `.gitignore`).
2. Go to **https://vercel.com/new** → Import your repo.
3. Vercel auto-detects from `vercel.json`:
   - Framework: **Vite**
   - Install: `npm install`
   - Build: `npm run build`
   - Output: `dist`
4. Click **Deploy**. Done — you get a live URL like `https://afc-hotel.vercel.app`.
5. Custom domain (optional): Project → Settings → Domains → add your domain.

> Node version is pinned to **20** via `.nvmrc`. No extra settings needed.

## Option B — Deploy on Netlify

**Via website:**
1. Push to GitHub.
2. Go to **https://app.netlify.com/start** → Import from Git.
3. Netlify reads `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy site** → live URL like `https://afc-hotel.netlify.app`.

**Via drag & drop (no Git, no npm at all):**
1. Run `npm run build` once (or download the built `dist/index.html`).
2. Go to **https://app.netlify.com/drop** and drag the `dist` folder in. Live in seconds.

SPA routing (`/`, refresh, direct links) is handled by `netlify.toml` + `public/_redirects`.

---

## ❓ "Remove npm" — what was done?

- `node_modules/` and `dist/` are now in `.gitignore` — you never upload them.
- `vercel.json` + `netlify.toml` tell the hosts to run npm **on their servers**, so your laptop stays clean.
- Nothing to install locally to stay live. Just edit, commit, push — hosts rebuild.

## Local preview (optional)

```bash
npm install
npm run dev      # develop
npm run build    # produces dist/index.html
npm run preview  # preview the build
```

## Admin login (after deploy)

- Open `your-live-url` → **Admin Login**
- Username: `admin` / Password: `afc123`
- Change it later inside Dashboard → key icon → Change password.
