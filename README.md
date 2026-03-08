# Bartr

Peer-to-peer trading marketplace. Trade what you have for what you love — no cash needed.

Also includes **Bartr-B**: a skills/services exchange where freelancers trade work and earn Credits.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Auth + Postgres + Realtime + Storage)
- **Stripe** (Bartr-B milestone escrow only — not used on consumer Bartr)
- **Tailwind CSS** + CSS custom properties (warm parchment design system)
- **Vercel** (deployment)

## Design system

Warm parchment palette (`#F6F4F1` base). Instrument Serif for display, DM Sans for body, DM Mono for labels.
All colours defined as CSS vars in `globals.css`. See `DECISIONS.md` for full rationale.

## Getting started

### 1. Clone and install

```bash
git clone <repo-url>
cd Bartr
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:
- **Supabase**: Create a project at [supabase.com](https://supabase.com) → Settings → API
- **Stripe**: Keys from [dashboard.stripe.com](https://dashboard.stripe.com/apikeys) (Bartr-B only)
- **Resend**: API key from [resend.com](https://resend.com) (transactional email)

### 3. Set up the database

Run migrations in order in the Supabase SQL editor:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_bartr_b_schema.sql
```

Or with the Supabase CLI:
```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/
│   ├── (app)/                  # Main app shell (bottom nav)
│   │   ├── browse/             # Market feed — public, no login needed
│   │   ├── social/             # Social feed
│   │   ├── messages/           # Inbox + trade threads
│   │   ├── offer/[listingId]/  # Offer builder (3-col grid + value gap bar)
│   │   ├── list/               # Create a listing
│   │   ├── listings/[id]/      # Listing detail + "what they'll accept"
│   │   └── profile/            # User profile + trade history
│   ├── (auth)/
│   │   └── login/              # Magic link + Google OAuth
│   ├── auth/callback/          # OAuth callback handler
│   ├── b/                      # Bartr-B (skills marketplace)
│   │   ├── page.tsx            # Bartr-B landing
│   │   └── (shell)/            # Bartr-B app shell (green accent nav)
│   │       ├── browse/         # Skills feed
│   │       ├── list/           # Offer a skill
│   │       ├── briefs/         # Open briefs + post a brief
│   │       ├── listings/[id]/  # Service detail
│   │       └── profile/        # Portfolio profile
│   ├── layout.tsx              # Root layout (fonts: Instrument Serif, DM Sans, DM Mono)
│   └── page.tsx                # Landing — earn-the-signup, browse before account
├── components/
│   ├── landing/                # LandingGate (sign-up slide-up sheet)
│   ├── layout/                 # TopBar, BottomNav
│   ├── listings/               # ListingCard
│   ├── b/                      # BTopBar, BBottomNav, ServiceCard
│   └── ui/                     # Avatar, ValueGapBadge, TierBadge
├── lib/
│   ├── supabase/               # client.ts, server.ts
│   └── utils.ts                # Value gap logic, formatters
└── types/
    ├── index.ts                # Core types (Listing, Offer, Thread, Trade…)
    └── bartr-b.ts              # Bartr-B types (ServiceListing, Brief, Milestone…)
supabase/
├── migrations/
│   ├── 001_initial_schema.sql  # Core tables + RLS policies
│   └── 002_bartr_b_schema.sql  # Bartr-B tables + triggers
└── config.toml
DECISIONS.md                    # Architecture decision log
```

## Key design decisions

See `DECISIONS.md` for the full log. Short version:

- **Earn the signup**: Landing and browse are fully public — no account needed to discover listings
- **No escrow on consumer Bartr**: Public trade ledger is the trust layer, no payments
- **5-state value gap**: Fair / Short / Way short / Over / Way over — colour-coded in offer builder
- **"What gets accepted"**: Community patterns shown on every listing — reduces offer anxiety
- **Bartr-B = same warm design, green accent**: Credits economy, milestones, not a time-bank


## Founder operating workflow (recommended)

If you're a solo founder aiming for production quality from day one, follow:
- `FOUNDER_OPERATING_SYSTEM.md` (weekly cadence, release discipline, incident process)
- `STATUS.md` (live execution log; update every active session)
- `DECISIONS.md` (long-term architecture decisions)
- `CLAUDE.md` (AI context and startup ritual)

- `.github/workflows/ci.yml` (automated PR validation: lint, type-check, build)
- `.github/pull_request_template.md` (release/risk/conflict checklist on every PR)
- `INCIDENT_TEMPLATE.md` (standardized postmortem format)

### Handling PR conflicts quickly

If a PR reports conflicts:

```bash
git fetch origin
git checkout <your-branch>
git merge origin/main
# resolve conflicts manually
npm run lint && npm run type-check
```

Then commit with an explicit conflict-resolution message and push again.

## Manual setup required (browser/dashboard)

These cannot be done from code:

| Step | Where |
|------|-------|
| Create Supabase project | supabase.com |
| Enable Google OAuth provider | Supabase → Auth → Providers |
| Customise magic link email template | Supabase → Auth → Email Templates |
| Create `listings` storage bucket (set to public) | Supabase → Storage |
| Connect repo to Vercel | vercel.com → Add New Project |
| Add env vars to Vercel | Vercel → Project → Settings → Environment Variables |

## Build phases

- **Phase 1 (current)**: Auth, listings, browse, offer flow, messages, list, profiles, Bartr-B foundation
- **Phase 2**: Verification badges, taste matching, disputes, carbon credits
- **Phase 3**: Bartr-B milestones + Credits escrow via Stripe, portfolio requirements enforcement

## Deploy

Connect this repo to Vercel. It will auto-deploy on every push to `main`.
Add all environment variables in the Vercel dashboard before the first deploy.
