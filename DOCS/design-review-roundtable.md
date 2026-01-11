# Design Review Roundtable
## Cuban Domino Tournament Landing Page

*Three legendary designers review and debate the cinematic scroll experience.*

---

## The Designers

| Designer | Known For | Design Philosophy |
|----------|-----------|-------------------|
| **Jony Ive** | Apple's iconic products, iOS, iMac | Refined simplicity, tactile quality, narrative experience |
| **Paula Scher** | Pentagram, Citibank, Public Theater | Bold typography, graphic energy, personality over polish |
| **Massimo Vignelli** | NYC Subway map, American Airlines | Grid discipline, clarity, "less but better" |

---

## Individual Reviews

### Jony Ive

**What Works:**
- The vertical scroll-snap experience is "beautifully strategic" - each panel acts as a chapter in a story
- Thematic consistency across panels strengthens brand identity
- Glassmorphism offers sophistication with legibility
- Typography pairing (Fraunces + IBM Plex Sans) balances heritage and modernity
- Copper and Brass colors evoke "polished, timeless elegance"

**Recommendations:**
- Add subtle parallax effects between panels for narrative progression
- Refine animation easing on progress tracker - give it "tactile quality"
- Consider micro-animations on dominoes - "an almost imperceptible ripple"
- Improve contrast to guide eye toward CTAs
- Test glassmorphism readability across devices

---

### Paula Scher

**What Works:**
- Cinematic panels create drama and narrative flow
- Cultural hook with "¿Que Bola?" screams energy
- Font pairing is solid foundation

**What Needs More Guts:**
- Typography must "pop even more" - assert against busy backgrounds
- Panel 3 ("Bring Your A-Game") should be the visual crescendo
- Type should "almost seem in motion" to embody competitive tension
- Glassmorphism feels "overly delicate" next to muscular domino vibe
- Push typography harder: bolder weights, aggressive tracking
- "Don't be afraid to let the typography bleed more personality"

**Key Quote:**
> "The concept is cinematic and immersive, but it needs the kind of typographic bravado that turns heads. Mix raw energy with polished sharpness."

---

### Massimo Vignelli

**What Works:**
- Theatrical narrative concept is promising
- Color palette evokes Cuban spirit

**What Needs More Rigor:**
- Enforce strict grid discipline - consistent margins, spacing, baseline rhythm
- Every element must serve a clear communicative purpose
- Strip away visual clutter - "less is better"
- Glassmorphism shouldn't overshadow registration CTA
- Typography must yield hierarchy without ornamentation
- Progress tracker should be "integrated cleanly, not floating free"
- Color palette should function hierarchically, not just aesthetically

**Key Quote:**
> "By stripping away unnecessary decorative elements and enforcing a rigorously applied grid and typographic system, the landing page will communicate with precision and clarity."

---

## The Roundtable Debate

**Jony Ive:** "The narrative scroll-snap architecture is key - every panel is a chapter. I envision parallax transitions and refined easing on the progress tracker. Micro-animations on each domino could really bring the Cuban energy, but we must ensure CTAs have strong contrast."

**Paula Scher:** "While I appreciate the storytelling, my heart is in a bolder typographic approach. Headlines need to assert themselves more powerfully over busy backgrounds. In Panel 3, 'Bring Your A-Game' should practically be in motion. The delicate glassmorphism might dilute the aggressive energy we need."

**Massimo Vignelli:** "Both of you bring creative impulses, yet I insist on strict grid discipline and clear hierarchy throughout. Every element must serve a communicative function. Parallax and transitions add flair, but they must be integrated cleanly - especially the progress tracker."

**Jony Ive:** "True, Massimo. The grid discipline is non-negotiable for clarity. But I worry that over-simplifying might dampen the immersive, cinematic feel we're aiming for."

**Paula Scher:** "Exactly - we need that tension between structure and raw energy. Typography shouldn't just 'fit' into the grid - it must break free occasionally to make an impact. Our design personality can't get lost in the grid's rigidity."

**Massimo Vignelli:** "I'm not advocating for a sterile layout. The bold statement you desire, Paula, can be achieved within a strict grid that respects margins, spacing, and baseline rhythm. This ensures that no matter how dynamic the transitions, the CTA remains the focal point."

**Jony Ive:** "Perhaps the solution lies in synthesis - adopting dynamic narrative transitions and expressive typography while anchoring them in a disciplined grid structure."

**Paula Scher:** "By integrating aggressive typographic choices within a defined structure, we can let the design bleed personality without chaos."

**Massimo Vignelli:** "Then our synthesis is clear. We marry expressive storytelling with disciplined design. Every animated flourish, every typographic twist must align with a strict grid system."

---

## Collective Top 3 Recommendations

### 1. Dynamic Structure with Grid Discipline
Combine parallax transitions and micro-animations with a strict, disciplined grid. Visual clarity and consistent hierarchy must anchor the narrative experience.

### 2. Bolder Typography Within Structure
Enhance typography with more expressive, bolder weights - especially Panel 3 as the crescendo. But keep it unified within margins, spacing, and baseline rhythm.

### 3. CTA Prominence Above All
The registration form must stand out against visually rich elements. Clear contrast, functional hierarchy, tested across all devices.

---

## Implementation Priorities

| Priority | Change | Effort |
|----------|--------|--------|
| High | Increase headline font weights / contrast | Low |
| High | Add text-shadow or backdrop to improve legibility | Low |
| Medium | Implement subtle parallax on scroll | Medium |
| Medium | Add micro-animation to progress tracker | Low |
| Medium | Tighten grid consistency across panels | Medium |
| Low | Domino ripple micro-animation | High |

---

## Design System Refinements

**Typography Scale (Proposed):**
```
Panel 1 Headline: 700 weight → 800 weight
Panel 3 Headline: Add letter-spacing: 0.02em for tension
All Headlines: Increase text-shadow spread
```

**Color Hierarchy:**
```
Primary Action: Copper (#b76a3b) - buttons, key CTAs
Secondary Info: Brass (#d4a574) - accents, highlights
Background: Dark gradients with stronger opacity on overlays
```

**Grid Baseline:**
```
Consistent 24px vertical rhythm
Panel content max-width: 900px centered
Form max-width: 520px
Progress tracker: 400px, centered with form
```

---

*Document generated from design roundtable session*
*Designers: Jony Ive, Paula Scher, Massimo Vignelli*
