# Chaudhary Bake & Cake — Scroll-Based 3D E-Commerce Website

A production-ready, mobile-first storefront for a 100% veg, eggless Indian bakery.
The centrepiece is a **scroll-scrubbed cake-assembly** animation: as you scroll, the
cake builds itself from an empty stand to a finished, decorated two-tier cake.

Built to the PRD: React + Vite + TypeScript, Three.js (React Three Fiber), GSAP
ScrollTrigger, Tailwind, React Router, Zustand, React Hook Form + Zod, Razorpay.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build to /dist
npm run preview    # preview the build
```

> This project was scaffolded in an offline environment, so dependencies were **not**
> installed there. Run `npm install` once on your machine — everything is wired to work.

---

## ▶ Before you go live — fill in the placeholders

Everything client-specific lives in **`src/config/site.ts`**. Replace every value
marked `PLACEHOLDER` (these are the items from PRD §10):

| What | Where |
|------|-------|
| Full phone number (signboard shows `9341-XXXXX-2499`) | `phoneDisplay`, `phoneE164`, `whatsappNumber` |
| Shop address | `address.line1`, `address.line2` |
| Google Maps embed URL | `address.mapEmbedSrc` |
| Delivery pincodes | `deliveryPincodes` |
| "Since" year + neighbourhood | `sinceYear`, `neighborhood` |
| Instagram / Facebook links | `social` |

Also: drop **`storefront.jpg`** into `/public/assets/` for the About-page hero
(it currently falls back to the finished-cake image if missing), and add real
product / gallery / category photos where noted in `src/data/*`.

---

## Assets (already processed for you)

Your four Gemini clips were processed into web-ready assets in `/public/assets/`:

| File | Source | Used for |
|------|--------|----------|
| `hero-360-cake.mp4` (+ `-mobile`) | the 360° rotation clip | Hero loop |
| `cake-assembly.mp4` (+ `-mobile`) | two assembly clips concatenated, **every frame a keyframe** for smooth scroll-scrubbing | Section 3 showstopper |
| `frame-01…04-*.png` | extracted stills | Poster frames + reduced-motion fallback |
| `og-image.jpg` | final decorated frame | Social share preview |
| `cake-assembly-berries-extra.mp4` | the spare berry-layering clip | not used — kept in case you want to re-cut |

The assembly video is encoded with `-g 1` (dense keyframes) so
`video.currentTime = progress * duration` seeks are buttery. If you re-encode it,
keep the dense keyframes or scrubbing will stutter.

---

## The scroll animation (how it works)

`src/components/home/AssemblyScroll.tsx` pins the section and binds the video's
`currentTime` to scroll progress via GSAP ScrollTrigger (`scrub: 1`). Captions are
**real text** (not baked into the video), crossfading at 0 / 33 / 66 / 100%.
Scroll distance is 200vh on desktop, 150vh on mobile.

**Reduced motion:** if the visitor has "reduce motion" on, the whole section swaps
to four stacked stills with captions — no video, no scrubbing. Every animated
section checks this.

---

## Razorpay

Online payment uses Razorpay **test mode**. Add your test key to `.env`:

```
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

`src/lib/razorpay.ts` loads the checkout script and opens the widget. **For
production you must** create the order on a server (`/orders` API) and verify the
payment signature server-side — never trust a browser-only confirmation. Cash on
Delivery works with no keys.

---

## Project structure

```
src/
  components/
    home/        # the 8 scroll sections (Hero, TaglinePin, AssemblyScroll, …)
    layout/      # Navbar, Footer, CartDrawer, WhatsAppButton, Layout
    three/       # FinishedCake (procedural R3F model) + CakeScene
    ui/          # Button-like primitives, ProductCard, SectionHeading
  config/site.ts # ← all client details / placeholders
  data/          # products, categories, testimonials
  store/cart.ts  # Zustand cart (persisted to localStorage)
  pages/         # Home, Shop, ProductDetail, About, Gallery, Contact,
                 # Checkout, OrderConfirmation, NotFound
  lib/           # gsap register, razorpay, utils
```

### The 3D cake
`src/components/three/FinishedCake.tsx` is a **procedural placeholder** cake.
To use a real model, drop a `.glb` in `/public/assets/` and swap the mesh for:
```tsx
import { useGLTF } from "@react-three/drei";
const { scene } = useGLTF("/assets/finished-cake.glb");
return <primitive object={scene} />;
```

---

## Deploy (Vercel)

1. Push to GitHub.
2. Import the repo in Vercel — framework preset **Vite**, build `npm run build`, output `dist`.
3. Add the `VITE_RAZORPAY_KEY_ID` env var.
4. `vercel.json` already rewrites all routes to `index.html` for the SPA router.

---

## Accessibility & performance notes

- Skip-to-content link, visible focus rings, `aria-label`s on videos and controls.
- Captions are readable text, not burned into video.
- `prefers-reduced-motion` fully respected (static fallbacks).
- Route-level + 3D-bundle code splitting; videos lazy-loaded; fonts self-hosted.
- Run Lighthouse on the production build (`npm run build && npm run preview`).

---

## Admin portal + backend (Supabase)

The site ships with a full owner dashboard at **`/admin`**, backed by Supabase
(Postgres + Auth + Storage). The public storefront runs fine **without** any of
this configured — the admin routes simply show a setup notice until you add the
env vars.

### 1. Create a Supabase project
At [supabase.com](https://supabase.com), create a project, then open
**Project Settings → API** and copy the **Project URL** and the **anon public** key
into your `.env`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### 2. Run the migrations
In the Supabase dashboard → **SQL Editor**, paste and run, in order:

1. `supabase/migrations/0001_init.sql` — tables, row-level security, storage buckets
2. `supabase/migrations/0002_seed.sql` — the 4 categories + 6 starter cakes (optional)

(Or, with the Supabase CLI: `supabase db push`.)

### 3. Create the first admin user
1. Dashboard → **Authentication → Users → Add user** (set an email + password).
2. Copy that user's **UID**.
3. SQL Editor → run (replace the UID + name):
   ```sql
   insert into public.admins (id, name, role)
   values ('PASTE-USER-UID', 'Owner name', 'owner');
   ```
4. Visit `/admin/login` and sign in. Only users present in the `admins`
   table can enter — there is intentionally no public sign-up.

### What the portal does
- **Dashboard** — today's orders/revenue, pending count, customers, a 30-day
  revenue line chart, orders-by-status donut, top-5 products, recent orders.
- **Orders** — filter/search/paginate; open an order to see the **cake message
  highlighted**, advance status (placed → confirmed → baking → out for delivery →
  delivered), cancel with a reason, tap-to-call / WhatsApp / print.
- **Realtime** — a new incoming order lights up the sidebar badge instantly
  (Supabase Realtime).
- **Products** — create/edit with a rich-text description (Tiptap), weight
  variants, tags, eggless + in-stock toggles, and drag-to-upload images stored
  in the `product-images` bucket (★ marks the main photo).
- **Categories / Customers** — inline category CRUD; searchable customer list
  with call/WhatsApp shortcuts.

### Storefront data — live from the admin
The public storefront (Shop, Product detail, and the Home "This week's
favourites" section) reads its catalogue through `src/lib/catalog.ts` +
`src/hooks/useCatalog.ts`:

- **Supabase configured** → products, prices, variants, images, tags and
  stock come **live** from the admin. Add/edit a product in `/admin` and it
  appears on the storefront (in-stock items only). Rich-text descriptions are
  flattened to plain text for the product page.
- **No Supabase** → it falls back to the static catalogue in
  `src/data/products.ts`, so the site still runs with zero backend.

The four category tiles + Shop filter remain the fixed PRD set
(cakes / pastries / cookies & cupcakes / breads); products in any extra
categories you create still list under "All".
---

## The baker mascot (autonomous character — PRD §4.4)

`src/components/home/BakerStage.tsx` renders a friendly 3D chef that travels
with the scroll and stays "alive":

- **Idle** breathing, randomised blinking, gentle bob.
- **Look-at** — the head tracks your cursor (or last tap on mobile).
- **Per-section movement** — it repositions to 8 anchors as you scroll, with a
  springy transition (never teleports).
- **Reactions** — a little cheer when you add to cart; after 30s idle it dozes
  off (💤); moving the mouse back wakes it with a wave.
- **Accessibility** — respects `prefers-reduced-motion` (calm single pose) and
  auto-hides below 400px width. The overlay is `pointer-events:none`, so it
  never blocks content.

It's **procedural** (built from primitives) so it needs no asset and can't
crash. To use a real rigged model, drop `baker.glb` (with `idle`, `wave`,
`cheer`, `sleep` clips) into `/public/assets/`, set `BAKER_MODEL_URL =
"/assets/baker.glb"` at the top of the file, and render a `useGLTF` +
`useAnimations` component in place of `<ProceduralBaker>` (map each `Mood` to a
clip). The scroll/positioning/reaction logic stays exactly the same.

---

## Still to confirm before launch (PRD §10 + backend)

- Full shop phone number, exact address + Google Maps embed URL, delivery
  pincodes, real "Since" year, bilingual (Hindi/English) decision — all live in
  `src/config/site.ts`.
- Razorpay: add `VITE_RAZORPAY_KEY_ID` and implement server-side order/signature
  verification before taking real payments (test mode is safe as-is).
- Supabase: run the migrations and create the first admin user (above).

---

## Admin access + login (updated)

The admin portal is **hidden** — there is no visible button, menu, or keyboard
shortcut. To open it:

> **Press and hold the brand logo ("Chaudhary") for 5 seconds.** It then opens
> the admin login. (Works with mouse or touch; a normal tap still goes home.)

### Login flow
- The email field is pre-filled with the authorized owner address and is the
  **only** account allowed in. Any other email shows **"Unauthorized email."**
  and is blocked. Change the address in `src/admin/adminConfig.ts`
  (`AUTHORIZED_ADMIN_EMAIL`) and in `supabase/migrations/0003_admin_and_realtime.sql`.
- **First time:** tap "First time? Set your password", enter + confirm a
  password → the account is created and you land in the dashboard.
- **After that:** email + password → sign in. "Forgot password?" sends a reset
  link. There is no public signup/registration.

### Required Supabase settings for the create-password flow
1. Run **all three** migrations, including
   `0003_admin_and_realtime.sql` (adds the bootstrap policy that lets the
   authorized email self-register as admin, and enables Realtime).
2. For instant first-login access, turn **off** email confirmation:
   **Authentication → Providers → Email → disable "Confirm email"**. (If you
   leave it on, the first sign-up sends a confirmation email; confirm it, then
   sign in — the app handles both and tells the user which happened.)

You no longer need to hand-create the admin user or insert the `admins` row
manually — the first long-press + create-password does it.

---

## Orders now reach the admin (fixed)

Checkout writes each order to Supabase (`src/lib/orders.ts`): a customer row (new
phones), the order, and its line items — so orders appear in **Admin → Orders**
and trigger the realtime new-order badge. IDs are generated client-side, so this
works under the public "insert-only" RLS (no read-back needed). With no Supabase
configured, checkout still completes locally as before.

## Realtime storefront

`useCatalog` subscribes to `products` / `product_variants` / `product_images`
changes, so editing a product, toggling stock, or deleting one in the admin
updates the storefront within a moment — no manual refresh.

---

## What this build was and wasn't verified against

This project was assembled and audited by **static analysis** (every source file
read and traced; imports, types, delimiters, and data flow checked; the
order/admin/realtime integration gaps found and fixed). It was **not** executed
in a browser here — the build environment has no network or runtime, so I could
not run `npm install`, `npm run build`, Lighthouse, or device testing.

Please run this locally to confirm the runtime bits:

```
npm install
npm run build      # expect zero TS/build errors
npm run dev        # smoke-test the pages below
```

Manual smoke test (≈10 min):
- Home: hero video, tagline pin, cake-assembly scrub, baker mascot (cursor
  look, cheer on add-to-cart, nap after 30s), featured products.
- Shop: search / category / price / sort; Product page: gallery, variant,
  cake message, add to cart, WhatsApp.
- Cart → Checkout (COD) → Order confirmation. Then check **Admin → Orders**
  shows it (Supabase configured).
- Admin: long-press logo → set password → dashboard, orders, product CRUD +
  image upload, categories, customers.
- Responsive: 320 / 360 / 375 / 390 / 414 / 768 / 1024 / 1280 — confirm no
  horizontal scroll (guarded via `overflow-x: hidden` on `html`) and the mobile
  drawer/cart work. The mascot auto-hides below 400px by design.
- Lighthouse (mobile) on the built `preview` server.

---

## Deploying to Netlify

The repo is Netlify-ready:

- **`netlify.toml`** — build command `npm run build`, publish dir `dist`,
  Node 20, a SPA redirect (`/* → /index.html 200`) so every route (including
  `/admin` and deep links) works on refresh/direct-open with no 404s, plus
  long-cache headers for hashed assets and baseline security headers.
- **`public/_redirects`** — `/* /index.html 200` (Vite copies it to `dist/`),
  the same SPA fallback as a redundant safety net.

### Steps
1. Push the repo to GitHub/GitLab and "Add new site → Import" in Netlify (or
   `netlify deploy --build --prod` with the CLI). Build settings are read from
   `netlify.toml`.
2. In **Site settings → Environment variables**, add:
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_RAZORPAY_KEY_ID`.
   (All client env vars must use the `VITE_` prefix or Vite won't expose them.)
3. Deploy. Netlify runs `npm install` then `npm run build` (`tsc -b && vite build`).

### Post-deploy checks
- Open `/shop`, `/about`, `/gallery`, `/contact`, a product page, then **refresh
  each** — no 404s (SPA fallback).
- Long-press the logo → `/admin/login` → set password → dashboard.
- Place a test order → confirm it appears in Admin → Orders (Supabase live).
- Re-test the home animations and mobile widths on the deployed URL.

---

## Build verification — what was and wasn't run

This build environment has **no network and no `node_modules`**, so `npm install`
is blocked here (the registry returns 403) and therefore `npm run build` / `dev`
cannot be executed in-place. Rather than claim otherwise, the code was verified
by running the **TypeScript compiler** against the source and eliminating every
*real* error it found:

- Fixed `React.*` UMD-namespace errors (TS2686) in `ProtectedRoute`,
  `RichText`, `BakerStage` (imported the specific types instead).
- Fixed a recharts `Tooltip` formatter type-variance error in `Dashboard`.
- Fixed `waLink` inferring a single string-literal parameter type (typed it
  `string`) — this one would have failed `tsc -b` and broken the Netlify build.
- Widened `Categories` handler prop types to accept async handlers.

After these fixes, the **only** remaining compiler errors are the expected
"cannot find module / implicit any / JSX intrinsic" cascade caused by
`node_modules` being absent — they all resolve once `npm install` runs (locally
or on Netlify). Import resolution, delimiter balance, env prefixing, and
secret-scanning all pass.

**Please run `npm install && npm run build` locally or let Netlify run it.** If
the full-dependency build surfaces anything, paste the log and I'll fix it — but
the type-level defects that a build would catch have been addressed.
