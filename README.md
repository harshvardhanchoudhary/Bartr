# Bartr

Bartr is a two-sided barter network with one brand:

- **Bartr (consumer)**: trade physical items without cash.
- **Bartr-B (business)**: trade services and skills using internal Credits.

This project is currently **Day 1 foundations + iterative MVP build**.

---

## Why this repo exists

This codebase is designed to help us learn quickly and safely:

1. Ship product changes fast.
2. Keep DB/auth/security correct.
3. Make UX coherent across landing, consumer, and Bartr-B.
4. Prevent AI-assisted mistakes via clear operating docs.

---

## Stack

- Next.js 14 (App Router + TypeScript)
- Supabase (Auth + Postgres + RLS + Realtime + Storage)
- Tailwind + CSS variables (warm parchment design)
- Stripe (Bartr-B milestone escrow path only)

---

## Product map

### 1) Landing (`/`)
Brand hub that introduces both marketplaces and lets users browse without signup.

### 2) Bartr (consumer)
Routes under `(app)`:
- `/browse`
- `/listings/[id]`
- `/offer/[listingId]`
- `/messages`
- `/social`
- `/profile`

### 3) Bartr-B (services)
Routes under `/b`:
- `/b/browse`
- `/b/list`
- `/b/briefs`
- `/b/listings/[id]`
- `/b/profile`

---

## Core architecture (must keep consistent)

### Contract consistency
The most important rule in this repo:

> **DB schema, TypeScript types, and UI payloads must match exactly.**

If any two drift, you get silent product bugs.

### Auth and gating philosophy
- Browsing and discovery should remain highly open.
- Ask for auth at natural commit points (sending offers, posting, creating listings).
- Preserve user intent across auth boundaries (draft restore / `next=` redirects).

### RLS-first security
All sensitive tables use Supabase RLS. If something “mysteriously returns no rows,” inspect policy first.

---

## Getting started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

### Required environment vars
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Stripe + Resend vars as needed by feature paths

---

## Database migrations

Run in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_bartr_b_schema.sql`
3. `supabase/migrations/003_offer_value_gap_state_alignment.sql`

---

## Testing and checks (minimum every change)

```bash
npm run type-check
npm run lint   # once eslint is initialized
```

Recommended for feature changes:
- Validate affected route manually in dev.
- Validate auth path (logged out and logged in).
- Validate DB write path against RLS (if feature writes data).

---

## AI collaboration rules (tool-agnostic)

Read these files before any major AI-assisted change:

1. `AI_WORKFLOW.md` (how to work safely, regardless of AI tool)
2. `CLAUDE.md` (project context + product guardrails)
3. `DECISIONS.md` (non-obvious architecture decisions)

---

## Near-term priorities

1. Cohesive network UX across landing/consumer/Bartr-B.
2. Strong contract tests and migration discipline.
3. PMF instrumentation (activation, offer sent, accepted trade, repeat usage).
4. Trust-layer improvements (verification/dispute/reporting foundations).

