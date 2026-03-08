# Bartr Founder Operating System (v1)

This is a practical operating model for a solo founder building a **real production-grade product**, not just a demo.

Use this as your default workflow until team size or scale forces a change.

---

## 1) North Star: Quality over hacks

For Bartr, success is:
1. Reliable product behavior
2. Secure user data
3. Fast iteration with low breakage
4. Visible, auditable decisions

Rule: every change must improve at least one of those without hurting the others.

---

## 2) Weekly operating cadence (solo founder)

## Monday — Plan and de-risk
- Review metrics (activation, listing created, offer sent, message reply rate)
- Review top bugs/incidents
- Pick 1 major product outcome for the week
- Write 3-5 execution tasks max

## Tuesday–Thursday — Build and validate
- Ship one scoped feature at a time
- Keep PRs small enough to review in < 20 minutes
- Run lint + type-check + manual QA before every merge

## Friday — Stabilize and document
- Resolve all high/critical bugs opened this week
- Update docs (`DECISIONS.md`, `STATUS.md`, `README.md` if needed)
- Prepare release notes and rollback notes

---

## 3) Branching + PR workflow that scales

- `main` = always deployable
- Feature branches: `feat/<short-name>`
- Bug branches: `fix/<short-name>`

For every PR:
1. Problem statement (1-2 lines)
2. Scope (what changed / what did not)
3. Risks
4. Manual test plan
5. Rollback plan

If conflicts appear:
1. `git fetch origin`
2. `git checkout <your-branch>`
3. `git merge origin/main`
4. Resolve conflicts file-by-file
5. Re-run `npm run lint` and `npm run type-check`
6. Commit merge-resolution with explicit message: `Resolve merge conflicts with main`

---

## 4) Release workflow (production-safe)

Before deploy:
- `npm run lint`
- `npm run type-check`
- `npm run build`
- Manual smoke test of key journeys:
  - Browse listings without login
  - Login/signup
  - Create listing
  - Make offer
  - Open messages

After deploy (first 30 mins):
- Check logs (Supabase + Vercel)
- Verify no auth errors / 500s spike
- Verify DB writes for new listings/offers

If failure:
- Roll back immediately
- Open incident note in `STATUS.md`
- Add prevention decision in `DECISIONS.md`

---

## 5) Data + migration workflow (avoid future pain)

Never mutate production schema manually without a migration.

Process:
1. Write migration SQL in `supabase/migrations/`
2. Add/adjust RLS policies in same migration
3. Test migration on staging project first
4. Document decision impact in `DECISIONS.md`

Rules:
- No destructive migration without backup path
- No table without explicit RLS policy
- No secret keys in client code

---

## 6) Incident workflow (when things break)

Severity model:
- **SEV-1:** Login/data loss/core flow down
- **SEV-2:** Major flow degraded, workaround exists
- **SEV-3:** Minor bug

SEV-1 playbook:
1. Stop feature work
2. Create hotfix branch `hotfix/<issue>`
3. Patch + test + deploy
4. Write postmortem in `STATUS.md`:
   - timeline
   - root cause
   - fix
   - prevention

---

## 7) AI-assisted startup protocol ("always-updated system")

You asked for a system that gets updated every session. Use this structure:

- `CLAUDE.md`: stable product context + constraints
- `DECISIONS.md`: permanent architecture/product decisions
- `STATUS.md`: rolling execution log (weekly goals, open risks, latest incidents)

At the start of each AI session, ask AI to:
1. Read `CLAUDE.md`, `DECISIONS.md`, `STATUS.md`
2. Propose updates if stale
3. Execute requested work
4. Update `STATUS.md` and (if needed) `DECISIONS.md` before finishing

This gives you continuity and "institutional memory" even as you move fast.

---

## 8) Founder scorecard (review weekly)

Track these minimum metrics:
- % of PRs passing lint + type-check on first run
- Number of production incidents/week
- Time to recover from incidents
- % of work with documented decisions
- Activation funnel: visitor → browse → signup → listing/offer

If quality drops for 2 weeks, pause feature velocity and stabilize.

---

## 9) Non-negotiables

- No direct pushes to `main` for risky changes
- No merge without validation commands
- No schema change without migration + RLS review
- No unresolved conflict markers in merged code
- No hidden decisions (if it matters, log it)

