# ADR-004: Tournament I Format — Group Stage → Finals

**Status:** ✅ Implemented (Pending DB migration run)  
**Date Created:** 2026-01-27  
**Last Updated:** 2026-01-27  
**Owner:** Benny Binion (Tournament Ops), Tobias van Schneider (UX), Dev Team  

---

## Context

The previous tournament system used a full 8-team round robin (**28 matches / 7 rounds**) feeding a 4-team finals bracket.

For Tournament I (one-night, mobile-run operations), that format creates:
- Too many matches to manage.
- Too much admin overhead.
- Slow escalation into “high stakes” moments.

We want a format that:
- Keeps teams engaged early.
- Creates a clean story arc.
- Produces elimination pressure at the right time.
- Is simple to run from a phone in La Oficina.

---

## Decision

Use this structure for Tournament I:

1. **16 players → 8 teams**
2. **Group Stage:** 2 groups of 4 (Group A / Group B)
   - Each team plays the other 3 teams in its group.
   - **6 matches per group** (3 matchdays, 2 matches per matchday).
   - **Top 2** from each group advance.
3. **Finals (Single Elimination):**
   - Semis: **A1 vs B2** and **B1 vs A2**
   - Final: winners play for the title

---

## Tournament Ops Notes (Benny Binion)

- Group stage keeps people in the room (no immediate elimination).
- Semis/final are clean stakes (single elimination = legend-making).
- Recommended follow-up: a simple **pace policy** (shot clock / move clock) to keep energy high.

---

## UX Notes (Tobias van Schneider)

- Mobile-first admin control is non-negotiable.
- Seeding must be instantly readable:
  - “A1 / B2 / B1 / A2” reads like sport seeding (not spreadsheet logic).
- Critical actions need “weight”:
  - slam interaction
  - visible loading state
  - clear confirmation

---

## Implementation

### Database

- Migration: `supabase/migrations/20260127194500_group_stage_system.sql`
  - `teams.group_code` (A/B)
  - `matches.phase` now includes `group`
  - Fixes matches uniqueness (finals + group stage can coexist)
  - `group_standings` view
  - RPCs:
    - `assign_teams_to_group_stage()`
    - `seed_finals_from_group_standings()`
  - Back-compat wrappers:
    - `assign_teams_to_round_robin()`
    - `seed_finals_from_standings()`

### Admin UI (La Oficina)

- Group stage management: `src/pages/admin/round-robin.astro` (now “Group Stage”)
- Finals management: `src/pages/admin/bracket.astro` (seeds from group stage)

### Public UI

- Standings: `src/pages/standings.astro` (Group A + Group B)
- Bracket: `src/pages/bracket.astro` (A1/B2, B1/A2 labels)

---

## How To Run (Local)

Docker is required for Supabase CLI local stack.

```bash
supabase start
supabase db reset
```

