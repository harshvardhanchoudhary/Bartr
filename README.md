# BARTR

Peer-to-peer barter marketplace. Trade what you have for what you love — no cash needed.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Auth + Postgres + Realtime + Storage)
- **Stripe Connect** (10% deposit escrow)
- **Tailwind CSS** (custom design system)
- **Vercel** (deployment)

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

Fill in the values in `.env.local`:
- **Supabase**: Create a project at [supabase.com](https://supabase.com), get URL + anon key from Settings → API
- **Stripe**: Get keys from [dashboard.stripe.com](https://dashboard.stripe.com/apikeys)
- **eBay**: Register at [developer.ebay.com](https://developer.ebay.com)
- **Resend**: Get API key from [resend.com](https://resend.com)

### 3. Set up the database

In your Supabase project SQL editor, run `supabase/migrations/001_initial_schema.sql`.

Or with the Supabase CLI:
```bash
npm install -g supabase
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
│   ├── (app)/              # Main app shell (with bottom nav)
│   │   ├── browse/         # Market feed — public, no login needed
│   │   ├── social/         # Social feed
│   │   ├── messages/       # Inbox + threads
│   │   ├── offer/[id]/     # Offer builder
│   │   ├── list/           # Create listing
│   │   ├── listings/[id]/  # Listing detail
│   │   └── profile/        # User profiles + shop
│   ├── (auth)/
│   │   └── login/          # Magic link + Google OAuth
│   ├── auth/callback/      # OAuth callback handler
│   ├── layout.tsx
│   └── page.tsx            # Root landing (3 elements only)
├── components/
│   ├── layout/             # TopBar, BottomNav
│   ├── listings/           # ListingCard
│   └── ui/                 # Chip, Avatar, Drawer, ValueGapBadge, TierBadge
├── lib/
│   ├── supabase/           # client, server, middleware
│   └── utils.ts            # Value gap logic, formatters
├── types/                  # TypeScript types
└── middleware.ts            # Auth route protection
supabase/
├── migrations/             # SQL schema (run this first)
└── config.toml
reference/
└── prototype-v10.html      # Original HTML prototype (design reference)
```

## Key design decisions

- **Earn the signup**: Browse feed is public — no account needed to discover listings
- **One job per screen**: Each page has a single primary action
- **5-state value gap**: Fair / Under / Big under / Over / Big over — colour-coded
- **Public ledger**: All completed trades are permanently recorded
- **10% deposit escrow**: Via Stripe, returned on successful trade completion

## Build phases

- **Phase 1 (current)**: Auth, listings, browse, offers, messages, profiles
- **Phase 2**: Verification badges, taste matching, disputes, carbon credits
- **Phase 3**: Bartr-B — skills/services, credits economy, milestone escrow

## Deploy to Vercel

Connect your GitHub repo to Vercel, set the environment variables in the Vercel dashboard, and it will auto-deploy on push.
