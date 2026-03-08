# Bartr Status Log

This file is updated during active implementation sessions.
It is the execution snapshot (short-term), while `DECISIONS.md` is the long-term memory.

---

## Current focus
- Operational hardening so quality is enforced (not optional)
- Founder-friendly workflows that keep shipping velocity without reliability regressions

## This session updates
- Added CI workflow at `.github/workflows/ci.yml` for lint + type-check + build
- Added `.github/pull_request_template.md` with risk, rollback, and conflict-resolution checklist
- Added `INCIDENT_TEMPLATE.md` for standardized postmortems
- Added ESLint config (`.eslintrc.json`) so `npm run lint` runs non-interactively
- Updated docs (`README.md`, `FOUNDER_OPERATING_SYSTEM.md`, `DECISIONS.md`) to reflect enforcement workflows

## Open risks
- Build can fail in restricted environments if `next/font` cannot reach Google Fonts
- Need alerting implementation details (exact channels, paging rules)
- Need staging environment parity checklist with owner + cadence

## Next 3 priorities
1. Configure Vercel/Supabase alert routing and on-call notification channel
2. Add staging parity checklist to repo docs and enforce pre-release signoff
3. Add basic E2E smoke test automation for browse/auth/listing/offer flows

## Last updated
2026-03-08
