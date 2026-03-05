# Bartr — Project Context for Claude Code

## What This Is
Peer-to-peer barter marketplace. Users trade physical items (fashion, electronics, books) 
without cash. Bartr-B is the business/skills layer for freelancers.

## Stack
- Next.js 14 (App Router), TypeScript
- Supabase (DB + Auth + Storage)
- Stripe Connect (escrow/deposits)
- Tailwind CSS
- Vercel deployment

## Design System
- Background: #0a0a0a
- Surface: #141414
- Red accent (Bartr): #C8352A
- Green accent (Bartr-B): #2D6A4F
- Fonts: Bebas Neue (display), DM Sans (body), DM Mono (labels)
- NEVER purple gradients, NEVER Inter/Roboto

## Root Landing
Literally three elements only: BARTR wordmark + two buttons (Bartr / Bartr-B). Nothing else.

## Key Principles
- Earn the signup: show listings BEFORE asking to create account
- One job per screen
- Card anatomy: Who → What → Value → One action
- No jargon on first encounter

## Offer Value Logic (5 states)
- Equal (within 15%): green "Fair trade"
- You're offering less: amber/red warning
- You're offering more: blue nudge to request something extra
- Big gap either way: red with strong indicator

## Build Priority
Phase 1: Auth, listing creation, browse feed, listing detail, offer flow, 
         deposit escrow, post-trade confirmation, profile, messaging
Phase 2: Verification, trust badges, taste matching, disputes, carbon credits
Phase 3: Bartr-B (service listings, briefs, milestones, credits economy)

## Full context
See /reference/bartr-handoff.docx for complete project history and decisions.
