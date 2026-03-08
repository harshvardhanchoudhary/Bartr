# AI Workflow Playbook (Tool-Agnostic)

This document defines how we use any AI coding assistant safely.

## Who this is for

- Non-technical founder/operator
- Engineers
- AI agents

## Goal

Use AI to move fast **without** breaking architecture, schema, or product trust.

---

## 1) Standard operating loop

1. **Plan first** (what files, what user impact, what risks).
2. **Implement in small increments** (avoid giant opaque rewrites).
3. **Run checks** (`type-check`, lint, key flow smoke test).
4. **Summarize with evidence** (files changed + what was tested).
5. **Update docs when behavior/architecture changed**.

---

## 2) Required guardrails for AI-generated code

### A. Schema + types
If DB structure or payloads are touched:
- verify table columns and constraints
- verify TS interfaces match
- verify inserts/selects use correct names

### B. Auth + intent
If flow crosses auth boundary:
- preserve intent with `next` redirect or local draft
- never drop user progress without explicit reason

### C. Migrations
- Prefer additive migration files.
- Avoid rewriting old migration history unless this is a full reset decision.

### D. UI consistency
- Reuse shared components before creating one-off UI patterns.
- Keep Bartr and Bartr-B visually connected as one brand family.

---

## 3) Definition of done (DoD)

A feature is done only when:

1. It works in code.
2. It passes baseline checks.
3. It is reflected in docs.
4. The PR explains tradeoffs and known limitations.

---

## 4) PMF instrumentation baseline

Every major feature should consider event tracking for:
- listing viewed
- offer started
- offer sent
- offer accepted
- trade completed
- brief posted (Bartr-B)
- application submitted (Bartr-B)

Even simple logs > no visibility.

---

## 5) Communication format for AI outputs

Ask AI to always provide:

- what changed
- why it changed
- risks/assumptions
- exact tests run
- what still needs manual verification

---

## 6) Anti-patterns to avoid

- Huge changes with no tests
- Silent schema/type mismatches
- Aggressive early auth walls that kill exploration
- Feature additions without route discoverability
- “Looks good” PRs with no reproducible checks

