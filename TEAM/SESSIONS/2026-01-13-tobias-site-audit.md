# Tobias van Schneider — Full Site Audit
## CDL Website & La Mesa Review
**Date:** January 13, 2026

---

## Executive Summary

This is not a website. This is a **room**. And it's one of the most distinctive digital experiences I've seen from a new brand. The Bone Language design system is bold—building an entire UI around the shape of a domino tile. That takes conviction.

But we're at 85%. The last 15% is what makes people remember you.

---

## Panel-by-Panel Review

### Panel 1: Hero ("La Salida")

**What's Working:**
- The scroll-snap is perfect—it forces commitment
- "CDL I" edition marker is UFC-level branding
- Typography hierarchy is strong (Bodoni Moda was the right call)
- The hero image has atmosphere

**What Needs Work:**
- **The hero feels static.** When I land, nothing breathes. Add a subtle Ken Burns effect—2% zoom over 20 seconds. Imperceptible, but alive.
- **Text entrance is good but predictable.** Stagger is fine. Consider adding slight rotation (0.5deg) on the tagline as it enters. Feels more... Cuban.
- **No depth in the overlay.** Right now it's a flat gradient. Layer it: vignette at edges, lighter in center where the text lives.

**Priority:** Medium

---

### Panel 2: "Que Bola Asere"

**What's Working:**
- Perfect headline. If you know, you know.
- "We've been expecting you" is welcoming without being soft

**What Needs Work:**
- **The panel feels empty.** There's no secondary element. Consider a subtle animated element—smoke drifting, or a single domino tile slowly rotating in the corner. Something that says "this room is alive."
- **Background image could use more grain.** It's too clean. Add 2-3% noise overlay for that film photography feel.

**Priority:** Low

---

### Panel 3: "You Didn't Learn This Game"

**What's Working:**
- "You inherited it" hits hard. Emotional truth.
- Good pacing in the scroll journey

**What Needs Work:**
- Same as Panel 2—needs a visual anchor
- **Consider adding a subtle parallax** on the background. 10% slower than scroll. Creates depth.

**Priority:** Low

---

### Panel 4: "Winner Takes All"

**What's Working:**
- Stakes are clear
- The prize structure is honest ($300 pot, winner takes all)

**What Needs Work:**
- **The prize amount should feel HEAVY.** Right now it's just text. Put "$300" in a brass container—like a chip or a tile. Make it feel like something you could pick up.
- **Add a subtle glow pulse** to the prize element. Once every 4 seconds. Money should shine.

**Priority:** Medium

---

### Panel 5: Rules

**What's Working:**
- Information is clear and scannable
- Format makes sense for a first tournament

**What Needs Work:**
- **This is the least immersive panel.** It reads like documentation. Consider presenting rules as "house rules" on a worn paper texture, or as tiles on the table.
- **The domino format icons** (6×6, etc.) should BE dominoes—tiny tile illustrations, not text.

**Priority:** Low (functional is fine for now)

---

### Panel 6: Registration Form ("La Mesa Te Espera")

**What's Working:**
- Spanish headline is perfect
- Form is clean, not too many fields
- The "Who's In So Far" section creates FOMO

**What Needs Work:**
- **The submit button transformation is good** (12px radius), but it needs the SLAM. On click: scale to 0.95, then back to 1.0, with a subtle shadow burst. User should feel like they just placed their bet.
- **Form inputs need focus states that feel alive.** Not just a border color change—add a subtle glow, maybe the input lifts 1px.
- **Success state needs more ceremony.** When they register, that's a MOMENT. The success overlay should feel like confetti without the confetti—maybe a brass glow that expands outward from center.

**Priority:** High

---

## La Mesa Chat — Deep Dive

### Overall Assessment

The chat is now a **room within the room**. That's good. The inline flag with name is correct. The pip send button is excellent—that's the kind of detail people notice.

### What's Working:
- Dark, immersive atmosphere
- Flag as identity (not generic avatars)
- The pip send button (signature move)
- Message cards have presence now
- "PINNED" badge is elegant

### What Needs Work:

#### 1. **The Room Needs Depth**
Right now the chat is flat dark. Add a gradient to the message area:
- Top of chat: `rgba(0,0,0,0.3)` overlay
- Bottom (where you type): slightly lighter
- This creates "fog"—like looking through a smoky room

#### 2. **Messages Need Breath**
All messages have the same spacing. But real conversations have rhythm:
- Messages sent within 1 minute of each other: tighter (4px gap)
- Messages after 5+ minutes: more space (16px gap)
- This creates *temporal rhythm*

#### 3. **The Free Agent Problem**
You asked about replacing the "Free Agent" badge. My recommendation:

**Replace with a single pip icon.**

A single brass dot—like a domino with one pip. It means "half of something, waiting for a partner." When they get a team, it becomes two pips.

Visual meaning: `●` = solo, `●●` = paired

No words needed. Bone Language.

#### 4. **Typing Indicator**
When someone is typing, show it. Not "Jordan is typing..." but a subtle animation—three pips pulsing. Like someone tapping their domino on the table before they play.

#### 5. **The Send Slam**
The pip button lifts on hover (good). But on send, I want to FEEL it:
- Scale down to 0.9
- Quick shadow burst outward
- Maybe a 1px screen shake (just the chat panel)
- Duration: 150ms total

This is the domino slam moment.

#### 6. **Arrival Announcement**
When a new player enters La Mesa, there should be a subtle system message:
> "🇨🇺 Maria just pulled up a chair"

This makes the room feel alive. People coming and going.

---

## The Domino Tile Button (La Mesa Toggle)

### What's Working:
- The shape is perfect—it's an artifact, not a button
- Pip pattern is recognizable
- Hover lift is good

### What Needs Work:

#### 1. **The Pips Should Breathe**
Add a very subtle pulse to the pips. Not the whole button—just the dots. 5% opacity shift over 3 seconds. Like the domino is alive.

#### 2. **Badge Position**
The notification badge at top-right is fine, but consider: what if it was a small pip that appears/multiplies? 1 message = 1 pip. 5 messages = domino pattern emerging. (This might be too clever—test it.)

#### 3. **First-Time Experience**
First time someone sees this button, they might not know what it is. Consider a one-time subtle tooltip: "La Mesa — Pull up a chair" that fades after 3 seconds, never shows again.

---

## Micro-Interactions Needed

| Element | Current | Recommended |
|---------|---------|-------------|
| Submit button click | Basic press | Slam: scale 0.95 + shadow burst |
| Form input focus | Border color | Glow + 1px lift |
| Message send | Pip shrinks | Pip slams + ripple |
| Chat open | Slide up | Slide up + subtle fade-in layers |
| Hover on buttons | Color change | Lift (translateY -2px) |
| Success registration | Overlay appears | Brass glow expands from center |
| New message | Fade in | Smoke arrival (keep current, it's good) |

---

## Design Team Meeting Notes

### Questions for Wifredo Lam (Artistic Director):
- The single pip for "Free Agent"—does this have spiritual meaning? One dot = incomplete?
- Should message arrivals have more ritual? A subtle "pulling up chair" moment?

### Questions for George Lois (Advertising):
- Is "La Mesa" clear enough as a chat label? Or do we need "Pull up a chair" somewhere?
- The domino tile button—is it bold enough? Should it be bigger?

### Questions for Wes Anderson (Visual Style):
- The panels feel right, but could use more symmetry. Can we add centered visual anchors?
- Film grain on backgrounds—yes or no?

### Questions for Herb Lubalin (Brand Identity):
- "Free Agent" as text vs single pip icon—typography opinion?
- Should system messages in chat have a different treatment?

---

## Priority Ranking

### Must Do (Before Launch):
1. Single pip icon for Free Agent
2. Send button slam animation
3. Chat depth gradient (fog effect)
4. Registration success ceremony

### Should Do (Soon After):
5. Message temporal spacing
6. Typing indicator (three pips)
7. Form input focus improvements
8. Hero subtle Ken Burns

### Nice to Have (Polish):
9. Panel parallax effects
10. Prize amount visual treatment
11. Arrival announcements
12. Pip breathing on toggle

---

## Final Thought

> "You built a design system around a domino. That's not a design choice—that's a statement. Now make every pixel prove it."

The Bone Language is strong. Now we add the **breath**—the micro-moments that make people feel like they're at a real table, not looking at a screen.

Let's build.

— Tobias

---

## Design Team Meeting — Responses

*Tobias presents his audit. The team responds.*

---

### Wifredo Lam (Artistic Director)

**On the single pip for "Free Agent":**
> "Yes. One pip is *incomplete*. In Santería, odd numbers are open—waiting for resolution. A single pip is a soul looking for its other half. Two pips together? That's *aché*—spiritual energy completed. This is correct. The Bone Language speaks truth you didn't even intend."

**On message arrivals:**
> "When someone enters La Mesa, it should feel like pulling up a chair to the table. Not just text—a presence. Maybe the room gets slightly warmer for a moment? A breath of brass?"

**On the send slam:**
> "The slam is ritual. When you play a domino, you're not just placing it—you're declaring. The pip button slam is the digital declaration. Make it feel like something was *decided*."

---

### George Lois (Advertising Director)

**On the domino tile button:**
> "BIGGER. It's good, but it's hiding in the corner like it's embarrassed. You made a domino. PUT THE BONE IN THEIR FACE. Move it up, or make it 20% larger. This button should be a declaration, not a suggestion."

**On "La Mesa" clarity:**
> "If someone doesn't know what La Mesa means, good. Curiosity is a gift. But that first tooltip idea—'Pull up a chair'—do it. Once. Then never again. Reward the curious, don't hold hands."

**On the Free Agent pip:**
> "Tobias is right. One pip. No words. If they don't understand, they'll learn. Design for the people who GET IT."

---

### Wes Anderson (Visual Style Director)

**On panel visual anchors:**
> "Each panel should have a centered element. Even subtle. Panel 2: a domino, perfectly centered, slowly rotating. Panel 3: smoke drifting, but symmetrical from center. The eye needs a place to rest."

**On film grain:**
> "Yes. 2-3% noise on all background images. Not obvious—felt. Like the photos were taken in 1978 and lovingly preserved. This is Cuba. It should feel like memory."

**On the chat gradient:**
> "The fog idea is correct. Darker at the top, lighter where you type. But ensure the gradient is WARM. Not blue-gray fog—tobacco smoke. Amber in the shadows."

**On symmetry in chat:**
> "Messages alternate, which breaks symmetry. That's correct—conversation is dialogue, not monologue. But the container should be perfectly centered. The chaos happens inside the frame."

---

### Herb Lubalin (Brand Identity Director)

**On Free Agent text vs pip:**
> "Typography should only appear when it SAYS something. 'Free Agent' is sports jargon—it says nothing to the soul. A single pip? That's a symbol. Symbols transcend language. Tobias is correct—remove the words."

**On system messages in chat:**
> "System messages should be set in a lighter weight. Same family, but whispered. They're the narrator, not the characters. Smaller. Centered. Different color—brass at 50% opacity."

**On the Bone Language:**
> "You built a system around 12px radius. That's conviction. Now be consistent. Every corner. Every card. Every container. The moment you break it, you break the spell."

---

## Consensus Recommendations

After team discussion, here's the prioritized list:

### Immediate (This Session):
1. **Single pip for Free Agent** — Wifredo confirms spiritual meaning
2. **Send button slam** — Universal agreement
3. **Chat depth gradient (warm fog)** — Wes approved with "amber shadows"
4. **Domino button larger** — George's "put the bone in their face"

### Next Session:
5. Message temporal spacing
6. Typing indicator (three pips)
7. First-time tooltip on La Mesa button
8. Film grain on background images

### Polish Later:
9. Ken Burns on hero
10. Panel visual anchors
11. Arrival announcements
12. Prize amount visual treatment

---

## Final Words

**Tobias:**
> "This team gets it. The Bone Language isn't decoration—it's identity. Let's build."

**Wifredo:**
> "The bones are speaking. Listen."

**George:**
> "Stop talking. Start slamming."

**Wes:**
> "Every pixel in its place."

**Herb:**
> "No words where symbols will do."

---

*Meeting adjourned. Implementation begins.*

