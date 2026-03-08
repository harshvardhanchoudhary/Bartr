# Founder Command Center (Daily 10-Minute Workflow)

Use this as your single control panel when working with multiple AI assistants.

## 1) Pick one operator per session (60s)
- Choose: **Codex** OR **Claude** for this session.
- Record owner in `STATUS.md` before any code changes.
- Rule: one operator edits shared docs in a session (`README.md`, `DECISIONS.md`, `STATUS.md`, `FOUNDER_OPERATING_SYSTEM.md`).

## 2) Define one outcome (60s)
Write one sentence:
- "By end of session, we will ________."

If outcome is bigger than 1 PR, split it.

## 3) Open-session checklist (2 min)
- Read `CLAUDE.md`
- Read `DECISIONS.md`
- Read `STATUS.md`
- Confirm current open PRs and owners

## 4) Build in one branch, one PR (3 min)
Branch naming:
- `feat/<goal>`
- `fix/<issue>`
- `ops/<process-change>`

PR should include:
- problem statement
- scope / non-scope
- risks
- rollback plan
- test evidence

## 5) Pre-merge quality gate (2 min)
Run:
```bash
npm run lint
npm run type-check
npm run build
```

If `build` fails due external font/network limitation, note it explicitly in PR.

## 6) Conflict protocol (when GitHub says "can't merge")
```bash
git fetch origin
git checkout <your-branch>
git merge origin/main
# resolve conflicts
npm run lint && npm run type-check
```
Then commit with: `Resolve merge conflicts with main`.

## 7) End-session closeout (1 min)
- Update `STATUS.md` (what changed, open risks, next 3 priorities)
- Update `DECISIONS.md` only for durable, non-obvious decisions
- Hand off in 3 bullets:
  1. done
  2. blocked
  3. next action

---

## Why you saw "two automatic deployments"
This is normal and usually means:
1. **Preview deployment** for your PR branch (every push to PR triggers this)
2. **Production deployment** for `main` (when something merges to main)

You may also see multiple previews if both Codex and Claude open separate PR branches.

To keep deployment noise low:
- keep one active PR per feature area
- avoid parallel PRs editing the same shared docs
- merge in sequence (oldest foundational PR first)
