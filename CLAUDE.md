# Bartr Project Guardrails (AI Context)

> This file is intentionally tool-agnostic despite the filename.
> Use these rules with Claude, ChatGPT, Cursor, Copilot, or any other assistant.

## Product truth

Bartr is one brand with two marketplaces:

1. **Bartr** (physical item trading, no platform cash flow on consumer side)
2. **Bartr-B** (services marketplace, Credits economy)

The UX should feel like one coherent ecosystem, not two disconnected apps.

## Non-negotiables

1. **No silent contract drift** between:
   - Supabase schema
   - TypeScript models
   - app payloads
2. **Signup should be late and intentional** when possible.
3. **Keep discovery rich and open** (users should understand value before auth walls).
4. **Do not add consumer payment/escrow flows** unless product decision log changes.

## Change checklist

Before merging any meaningful feature:

- [ ] TypeScript passes: `npm run type-check`
- [ ] Auth behavior checked for logged-out and logged-in paths
- [ ] Any DB write path verified against RLS
- [ ] If schema changed, migration added (don’t mutate history casually)
- [ ] Relevant docs updated (`README.md`, `DECISIONS.md`, `AI_WORKFLOW.md`)

## Design language

- Warm parchment base
- Bartr accent: red
- Bartr-B accent: green
- Keep typography and base spacing consistent across both experiences
- Maintain cross-marketplace discoverability from every core route

## When unsure

Prefer the safer path:
- Smaller changes
- Explicit naming
- Shared components
- Stronger checks over hidden magic

