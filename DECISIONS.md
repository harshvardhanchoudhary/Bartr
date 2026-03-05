# Bartr — Architecture Decisions Log

A living doc. Updated by Claude Code when a non-obvious decision is made.
Each entry: **what** was decided, **why**, and **what to watch out for**.

---

## Design System

### D001 — Warm parchment design system
**Decision:** `#F6F4F1` parchment background. Instrument Serif for display. DM Sans body. DM Mono labels.
**Why:** Warm/light palette fits the physical-goods marketplace feel — approachable, not tech-aggressive. Instrument Serif gives the wordmark character.
**Watch out for:** Prefer inline CSS vars (`var(--bg)`, `var(--red)`) over Tailwind colour classes. Tailwind classes are a secondary layer — CSS vars are the source of truth.

### D002 — CSS custom properties as single source of truth
**Decision:** All colours defined as CSS vars in `globals.css :root {}`. Tailwind theme extends them via the hex values.
**Why:** Prototype uses CSS vars. Keeps design tokens in one place. Makes theming (e.g. Bartr-B green mode) straightforward.
**Watch out for:** Don't define new colours directly in Tailwind without also adding the CSS var.

---

## Authentication

### D003 — Magic link + Google OAuth only (no passwords)
**Decision:** Supabase OTP (magic link) + Google OAuth. No email/password.
**Why:** Reduces friction, eliminates password reset flows. Magic link is lower-barrier for a marketplace where users might only sign up to make one trade.
**Watch out for:** Magic link emails need Supabase email templates customised (warm branding). Set up in Supabase dashboard — Claude Code can't do this directly.

### D004 — Earn-the-signup: browse before auth
**Decision:** `/` and `/browse` are fully public. Auth gate only appears when user tries to *make an offer*.
**Why:** Core YC principle — show value before asking for commitment. Users see real listings, then want to trade.
**Watch out for:** Don't add auth middleware to `/` or `/browse`. The `LandingGate` component fires on `window.dispatchEvent(new Event('bartr:offer-gate'))`.

---

## Consumer Bartr (P2P trades)

### D005 — No escrow, no deposits, no Stripe on consumer side
**Decision:** Stripe is imported in package.json but ONLY used in Bartr-B milestone escrow. Consumer Bartr has zero payment logic.
**Why:** Prototype-v10.html explicitly says "No escrow • No payments • Public history is the trust layer."
**Watch out for:** The public trade ledger (trade history visible on profiles) is the trust mechanism. Don't add payment/escrow logic to consumer Bartr flows.

### D006 — Value gap: 5 states
**Decision:** fair (±15%), short (<-15%), way_short (<-40%), over (>15%), way_over (>40%).
**Why:** Prototype shows 5 distinct states with different colours and copy.
**Thresholds:** 15% and 40% — review with product if these feel off in real use.
**Watch out for:** Always use `getValueGapState()` from `lib/utils.ts`. Don't implement gap logic inline.

### D007 — "What gets accepted" social proof is a first-class pattern
**Decision:** Every listing detail page shows community patterns of what types of items trade for each other.
**Why:** Reduces anxiety for new users — "is this a good trade?" is the #1 blocker.

---

## Bartr-B (Skills/Services)

### D008 — Same warm design language, green accent
**Decision:** Bartr-B uses `#1A7A4A` green instead of `#C4312A` red. Same fonts, same parchment background.
**Why:** Visual family connection to consumer Bartr. Green = growth/money earned (Credits economy).
**Watch out for:** Bartr-B shares the same warm parchment base as consumer Bartr — only the accent colour changes (green vs red). Don't introduce a separate dark theme for Bartr-B.

### D009 — Credits economy, not cash
**Decision:** Services priced in Credits (c). Starting grant: 50c. Credits earned by delivering milestones.
**Why:** Avoids regulated payments for freelance services within the platform. Creates network effects.
**Watch out for:** Stripe IS used for milestone escrow in Bartr-B — but denominated in Credits, not £/$. Details TBD.

### D010 — Portfolio required before offering a service
**Decision:** You must add at least one portfolio item before your service listing goes live.
**Why:** Quality signal. Prevents empty listings.

---

## Infrastructure

### D011 — Supabase Row Level Security on everything
**Decision:** All tables have RLS. No exceptions. Policies in migrations.
**Why:** Security by default. Users should never be able to read/write other users' private data.
**Watch out for:** If a query returns 0 rows unexpectedly, suspect missing RLS policy before suspecting the query.

### D012 — Images stored in Supabase Storage
**Decision:** All listing + avatar images go to Supabase Storage bucket `listings`.
**Why:** Supabase Storage is free-tier friendly, integrates with auth, supports CDN.
**Watch out for:** Next.js `<Image>` needs the Supabase project URL whitelisted in `next.config.js` → `images.remotePatterns`.

---

## Things That Need Manual Setup (Claude Code Can't Do These)

| Item | Where | Notes |
|------|--------|-------|
| Supabase project creation | supabase.com dashboard | Get `NEXT_PUBLIC_SUPABASE_URL` + `ANON_KEY` |
| Google OAuth credentials | Google Cloud Console → OAuth | Add to Supabase Auth providers |
| Magic link email template | Supabase Auth → Email Templates | Use Bartr warm branding |
| Stripe webhook secret | Stripe dashboard | For Bartr-B milestone escrow |
| Vercel deployment | vercel.com | Connect GitHub repo, add env vars |
| Supabase Storage bucket | Supabase dashboard | Create `listings` bucket, set public |

---

*Last updated: 2026-03-05 — v1 complete*
