# **MyFicha Notes**

Think of it as sitting down at your grandparents’ plastic table in Hialeah or Union City, but inside a phone.

I’ll break it in layers.

---

### **1\. Overall visual language**

* **Primary feel**  
   Warm, dark, intimate. It should feel like a late-night kitchen or patio game: low warm light, deep colors, the table surface clearly textured, everything else receding into shadow.

* **Color palette**

  * Background: deep navy / ink blue (the “night”).

  * Table: warm walnut / honey plastic-wood, slightly worn.

  * Accents: emerald green, tobacco brown, cream.

  * System highlights (buttons, active turn, timers): emerald and off-white.

* **Typography**

  * Strong, clean sans-serif (SF Pro / Inter / similar) for UI.

  * Occasional script or playful display type only for lingo overlays (“¡Me pegué\!”, “Pollona”) so those moments feel like someone shouting at the table.

* **Lighting**  
   Table is brightest; edges of the screen fade into darker vignette. Background props (cafecito, rum bottle, radio, fan) are suggested in silhouette or blur, never competing with tiles.

---

### **2\. Main game screen (phone first)**

#### **Layout, portrait**

* **Top bar**

  * Team scores, game to 150, session wins.

  * Tiny icons for Pollona/Viajera indicators when they happen.

  * A very subtle texture strip, like the edge of a table runner.

* **Center: table**

  * Rectangular “table” area with distinct border, maybe a thin light bevel.

  * Domino chain in the middle, tiles slightly offset and imperfect, not laser straight.

  * When you place a tile, it slides in, hits with a micro-shake, and casts a sharper shadow for a split second.

* **Player seats**

  * You at the bottom: full hand visible, tiles fanned horizontally with a little perspective.

  * Opponents at top/left/right: only tile backs and counts; avatars \+ flags or photos.

  * Each seat has a subtle “plate” with name and maybe tiny Cuban flag if they set that in profile.

* **Turn indicator**

  * A clean ring of light around the active seat, plus a thin pulse around the table edge on their side.

  * A circular timer orbiting their avatar; when it’s low, the glow intensifies.

* **Interaction**

  * Tap to select a tile; valid ends on the chain glow softly.

  * Drag tile toward left or right end: as you hover, that side “pulls” toward the tile slightly.

  * If invalid, the tile snaps back with a small shake.

* **Bottom panel**

  * Left: quick lingo chips (Me quedo, Estás agachado, Estoy en la playa, etc.).

  * Center: chat input with a GIF icon.

  * Right: small menu icon for settings and leave match.

#### **Layout, landscape**

* Same elements, but:

  * Table dominates center horizontally.

  * Your hand anchored along the bottom edge.

  * Chat and quick phrases stack to the right, like a side panel.

The entire UI always respects thumb reach: primary actions along bottom and lower-middle, never tiny tap targets in corners.

---

### **3\. Lingo & event overlays**

These should feel like somebody shouting across the table, not like sterile UI banners.

* **“¡Me pegué\!”**

  * Big, hand-lettered style text erupting from the winner’s side, with a burst of confetti confined to their third of the screen.

  * Quick, punchy animation, then it snaps away.

* **“Eso es tranque y a virarse”**

  * Wide banner across the table, slightly tilted, with tiles darkening behind it.

  * Subtle slow zoom-in on the blocked chain, then fade into scoring.

* **“Pollona”**

  * On final results screen: big illustrated chicken popping up from behind the score panel.

  * A small, looping idle animation until the user dismisses.

* **Capicúa / Bota gorda / Voy a ponerla fresca**

  * Small tags attached to the tile itself.

  * Quick glow and maybe a tiny spark trail.

  * They appear, linger 1–2 seconds, then fade.

All overlays should respect the board and never block your view of what just happened more than necessary.

---

### **4\. 2D vs “3D Havana table” mode**

**Default (2D)**

* Flat top-down or very slight 3/4 angle.

* Dominoes drawn with crisp vector art: clean pips, thin borders, drop shadows.

* Simple CSS transforms for rotation and placement.

**Optional “Havana table” mode**

* React Three Fiber rendering a shallow 3D scene:

  * Table as a 3D plane with wood material and subtle roughness.

  * Dominoes as low poly boxes with baked pip textures.

  * Soft overhead light, maybe a warmer spotlight from one side.

* Camera:

  * Fixed but slightly angled view, like you’re standing at one edge of the table.

  * Very slight camera nudge on big plays.

* UI (score, chat, lingo) stays as 2D overlay HUD above the canvas; never stuff UI into 3D.

The 3D mode is a skin, not a different app. Same layout logic and state, just rendered differently.

---

### **5\. Lobby, profile, and meta screens**

**Dashboard**

* Feels like a pared-down club wall:

  * Large “Play 1v1” / “Play 2v2” cards.

  * Background hint of domino patterns, Havana skyline silhouettes, or tiled floor.

  * Recent matches as clean rows with game icons and mini-flag avatars.

**Profile**

* Center avatar circle with a faint halo that picks up your chosen accent color.

* Stats laid out like a baseball card or fight record:

  * Wins, streaks, Pollonas, Viajeras shown as big simple numbers.

* Advanced stats in collapsible panels; graphs minimal, no clutter.

**Leaderboard**

* Dark background with glowing rows.

* Top 3 slightly elevated with subtle shine, but not casino loud.

* Your own row is always visible and highlighted, even if you’re rank \#378.

---

### **6\. Micro-details that make it feel Cuban and physical**

* Table edges slightly chipped or scratched in the texture, like they’ve seen years of games.

* Occasional ambient motion:

  * Ceiling fan shadow slowly sweeping across the table in the background.

  * Tiny animated smoke curl or coffee steam off in the vignette, never distracting.

* Sound-visible:

  * When tiles slam, shadows sharpen momentarily and the table nudges by 1–2 pixels, like the camera vibrated.

* Color temperature:

  * Warm highlights (yellows/oranges) on tiles, cooler shadows in the background.

The end result: when someone in your family opens the app, they recognize the vibe immediately. It feels like “Friday night at the house” inside a browser, not a sterile casino app or a generic puzzle game.

Imagine opening the app and being instantly teleported to a midnight domino table in Habana Vieja—no neon, no candy-colors, just the warm, smoky glow of a single vintage bulb swinging gently above a scarred mahogany table. That’s the whole aesthetic in one mental snapshot; everything else is detail that serves that moment.

1\. First paint on screen    
   The launch icon is a cracked double-nine tile stamped into a weathered brass token. Tap → the screen fades in from black, revealing the table already waiting—no lobby chrome visible until you swipe up. The table fills 100 % width; edges fade into darkness so the felt becomes the world.

2\. The table itself    
   \- 15-degree orthographic angle (almost top-down, but enough depth to see tile thickness).    
   \- Wood texture is macro-photographed 2048×2048 mahogany—pores, dents, cigar ash scars. A subtle 2-frame normal map makes varnish shimmer when you tilt the phone.    
   \- Felt inlay is deep emerald with faint cigar-burn halos; the line between wood and felt is a slightly beveled gold strip, like old picture-frame edging.    
   \- Four seat positions are not UI buttons—they’re simply worn spots where the varnish is matte instead of glossy, plus a faint brass tack indicating “your side.”

3\. Tiles    
   \- Ivory body, not plastic-white; micro-cracks, slight yellow gradient toward the outer edge.    
   \- Pips are inkless indentations—inside each pit is a 2-pixel shadow \+ single white specular that flickers when the overhead light pulses.    
   \- Thickness is exaggerated (6 px on screen) so when a tile slides it casts a soft 8-px drop-shadow that stretches / squashes with the motion curve (fake motion-blur).    
   \- Doubles rotate 90 ° on placement and “snick” into a shallow routed recess so they sit flush—animated with a 60 ms overshoot.

4\. Lighting & atmosphere    
   \- One dominant point-light hangs slightly off-center; its bulb is never shown, but you see the cone of light and the slow-moving fan blade shadows crossing the table every 12 s.    
   \- Secondary warm fill from the left (street window) is only 8 % intensity, enough to kiss the left edge of stacked tiles.    
   \- Every slam triggers a 4 % brightness pulse \+ 100 ms camera shake (2 px, low-passed) so the whole scene feels like a physical object you just hit.

5\. Color & UI chrome    
   \- No floating cards. Scores are branded into the wood: numbers glow ember-orange then settle to dark gold.    
   \- Buttons are brass coins; on press they depress 2 px, emit a muted “clink” and a 1 ms haptic tap.    
   \- Chat messages appear as folded paper notes tossed onto the felt—off-white, torn edge, 0.75 s slide+rotate, fade after 4 s.    
   \- Cuban lingo overlays arrive on cigar bands: curled parchment strips that slide in from screen-right, pause, then roll away like you flicked them.

6\. Motion language    
   \- Tile play: 280 ms slide, cubic-bezier(.4,0,.1,1.4) → overshoot 4 % past target, settle back; slight random angle jitter (±1 °) so no two placements feel robotic.    
   \- Score update: 400 ms after round ends, numbers flip like an old analog airport clock, sound is a single wooden flap clack.    
   \- Win moment: “Me pegué” stamp burns into the table with tiny gold sparks; 12 confetti squares drift downward, subtly affected by the fan wind vector.

7\. Optional 3D toggle (feature-flagged, off by default)    
   \- Same table model, but camera tilts to 25 °, adds paper-lantern area light above and very soft teal rim from the imaginary street.    
   \- Tiles are now 3-mm thick meshes; no physics—every move is still an authored animation.    
   \- Background falls off into a dark volumetric haze so performance stays light.

8\. Audio & haptics    
   \- Six tile-slam samples, randomly chosen, volume ±5 %, panned to seat position.    
   \- Shuffle loop is low-passed so it never masks voice chat.    
   \- Background salsa guitar is 68 BPM, side-chained −2 dB when tiles hit.    
   \- Phones: light slam \= 1 ms haptic, pass/knock \= 3 pulses, domino win \= ascending 5-pulse flourish.

9\. Responsive slices    
   \- Phone portrait: only your hand \+ board visible; partner hand peeks as tiny fanned stack on left edge.    
   \- Tablet: full cruciform view; pinch to zoom board.    
   \- Desktop: 16:9 table centered, sidebars slide in as wooden drawers.

10\. Accessibility    
    \- High-contrast mode swaps felt to \#0A4439 and text to \#FFD966.    
    \- Sound-off replaces audio with short haptic codes.    
    \- Color-blind safe: pip count also shown as tiny embossed numbers on tile side.

End result: it doesn’t look like “an app themed as a domino game”—it looks like you’re staring down at a real table, fingertips greasy from tostones, waiting for your abuelo to slam that double-four.  
