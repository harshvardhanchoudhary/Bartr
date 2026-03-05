# Bartr — Project Context for Claude Code

## What This Is
Peer-to-peer barter marketplace. Users trade physical items (fashion, electronics, books)
without cash. Public ledger is the trust layer — NO escrow, NO deposits on consumer Bartr.
Bartr-B is the business/skills layer for freelancers (Credits economy, milestones).

## Stack
- Next.js 14 (App Router), TypeScript
- Supabase (DB + Auth + Storage)
- Stripe (Bartr-B milestone escrow ONLY — not consumer Bartr)
- Tailwind CSS
- Vercel deployment

## Design System
```css
--bg:    #F6F4F1   /* warm parchment */
--bg2:   #EDEAE5
--surf:  #FDFCFA
--brd:   #E0DCD5
--brd2:  #CAC5BC
--ink:   #1A1814
--ink2:  #3C3830
--muted: #78746E
--faint: #B4B0A8
--red:   #C4312A   /* Bartr red */
--rbg:   #FDF0EF
--rbd:   #EACAC7
--grn:   #1A7A4A   /* Bartr-B green */
--gbg:   #EFF9F4
--gbd:   #B5DDC8
--blu:   #1D5FA8
--blubg: #EFF5FD
--blubd: #BACDE8
--gld:   #9A6C18
--gldbg: #FDF6EC
--gldbd: #E3CCAA
```

## Fonts
- **Instrument Serif** — display/headings/wordmark
- **DM Sans** — body text
- **DM Mono** — labels, monospace data, badges
- NEVER dark backgrounds on consumer Bartr

## Offer Value Gap Logic (5 states)
- **Fair** (within 15%): green border/badge "Fair trade"
- **Short** (you offering less): amber/red warning
- **Way short** (big gap): red with strong warning
- **Over** (you offering more): blue — nudge to request something extra
- **Way over** (big surplus): gold — strong nudge to request extra

## Root Landing (`/`)
Earn-the-signup experience:
1. Hero: wordmark + tagline + "Browse listings" CTA (no sign-up wall)
2. Live listing scroll — real listings, tappable
3. Ticker: "X items traded this week"
4. How-it-works: 3 steps
5. Sign-up gate: slides up from bottom when user tries to make offer

## Key Principles
- **Earn the signup**: show listings BEFORE asking to create account
- **One job per screen**
- **Card anatomy**: Who → What → Value → One action
- **No jargon on first encounter** — "trade" not "barter"
- **"What gets accepted"** social proof on listings (community pattern)
- **YC design principles**: clear CTAs, storytelling, visible user flow
- **Public ledger is trust** (no escrow, no payments on consumer Bartr)

## Build Status
Phase 1 (built): Auth, listing creation, browse feed, listing detail, offer flow,
                 messages, profile, Bartr-B foundation
Phase 2 (next): Verification badges, trust scoring, taste matching, disputes, carbon credits
Phase 3 (next): Bartr-B milestones, Credits escrow via Stripe, portfolio enforcement

## Bartr-B Design
Same warm/light design language as consumer Bartr, but green accent (#1A7A4A)
instead of red. Credits economy. Portfolio required to offer services.

## Architecture decisions
See DECISIONS.md for full log of every non-obvious decision made.
