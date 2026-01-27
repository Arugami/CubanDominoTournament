# Session: Group Stage → Finals Review (Benny + Tobias)

**Date:** 2026-01-27  
**Scope:** La Oficina `/admin` tournament flow (Group Stage + Finals)  
**Attendees:** Benny Binion (Tournament Ops), Tobias van Schneider (Product/UX), Dev Team  

---

## Benny Binion — Tournament Ops Notes

- Group stage keeps teams engaged (nobody is instantly “out”).
- Finals should stay single elimination (pressure makes legends).
- Add a simple pace policy for event night:
  - “10 seconds to play your bone” (or forfeit the turn).

---

## Tobias van Schneider — UX / Craft Notes

- Admin UX must feel like a room, not a spreadsheet.
- Actions need weight + trust:
  - visible loading state on “Build Groups” and “Seed from Groups”
  - clear “what happens next” framing
- Seeding language should be sport-clear:
  - A1 vs B2, B1 vs A2 (no “Seed #1/#4”)

---

## Resulting Changes

- `/admin/round-robin` reframed as **Group Stage** (2 groups, 3 matchdays).
- `/admin/bracket` now seeds from **Group Stage** and shows A1/B2/B1/A2 labeling.
- Public `/standings` shows Group A + Group B standings.
- Public `/bracket` uses the same A1/B2/B1/A2 framing.

