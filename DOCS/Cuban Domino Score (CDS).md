# **Cuban Domino Score (CDS): Framework**

## **1\. Principles of CDS**

1. **Skill-Reflective**  
   * Ratings should rise significantly when beating higher-rated opponents and drop more when losing to lower-rated opponents.  
   * Conversely, players gain fewer rating points when beating a much weaker opponent and lose fewer points when losing to a much stronger one.  
2. **Game Context Sensitivity**  
   * Incorporates special domino achievements (Pollonas, Viajeras, Capicuas) and game dynamics (e.g., blocking, big comeback wins) into adjustments.  
   * Rewards significant point differentials and momentum recoveries.  
3. **Mode-Specific Ratings**  
   * Maintains **separate ratings** for **1v1** and **2v2**.  
   * **Overall Rating** is calculated as a **weighted average** of these two modes (e.g., 60% weight on the mode a player most frequently participates in, or a 50/50 split if usage is balanced).  
4. **New Player Adjustment**  
   * New players start with a **provisional rating** (e.g., **1500**).  
   * Use a **higher K-factor** in their initial matches so the rating quickly converges to a more accurate level.  
5. **Leaderboards and Achievements**  
   * **Global**, **regional**, and **mode-specific** leaderboards.  
   * Badges for milestones (e.g., streaks, pollonas, top rating thresholds).

---

## **2\. Base CDS Formula**

Since there are **no draws** in Cuban Dominoes, the outcome SSS is either 1 (win) or 0 (loss). The formula is a modified Elo approach:

R′=R+K×\[(S+M)−E\]R' \= R \+ K \\times \[(S \+ M) \- E\]R′=R+K×\[(S+M)−E\]

Where:

* R′R'R′: **New rating** after the game.  
* RRR: **Current rating** (pre-match).  
* KKK: **K-factor**, controlling how much a rating changes.  
* SSS: **Match outcome** (1 for a win, 0 for a loss; ties do not exist).  
* MMM: **Performance modifier**, reflecting extra in-game achievements.  
* EEE: **Expected score**, based on rating differentials.

### **2.1 Expected Score (E)**

The expected score accounts for the skill gap. For a player with rating RRR facing an opponent with rating RopponentR\_{\\text{opponent}}Ropponent​:

E=11+10(Ropponent−R)/400E \= \\frac{1}{1 \+ 10^{(R\_{\\text{opponent}} \- R) / 400}}E=1+10(Ropponent​−R)/4001​

In Cuban Dominoes, the “score” of 1 or 0 simply indicates win or loss—no partial credit for draws.

---

## **3\. Performance Modifier (M)**

MMM is a sum of bonuses or penalties reflecting specific achievements or scenarios in the match.  
To **prevent extreme volatility**, you may apply an **optional cap** to MMM (e.g., Mmax⁡=+1.0M\_{\\max} \= \+1.0Mmax​=+1.0 and Mmin⁡=−1.0M\_{\\min} \= \-1.0Mmin​=−1.0) so that no single match yields overly drastic changes.

### **3.1 Point Differential**

* **\+0.05** for every 10 points **above** opponent’s total.  
* **\-0.05** for every 10 points **below** opponent’s total.

*Example*: Winning 150–120 nets (30/10)×0.05=+0.15(30 / 10\) \\times 0.05 \= \+0.15(30/10)×0.05=+0.15.

### **3.2 Special Wins**

* **Pollona** (opponent scores 0): **\+0.2**  
* **Viajera** (100+ points in a single round): **\+0.1**  
* **Capicua** (last tile matches both ends): **\+0.1**  
* **Capicua in a Blocked Game**: Additional **\+0.1** (total **\+0.2**)

### **3.3 Momentum Recovery**

* Winning after trailing by **50+ points** at any stage: **\+0.15**  
* Winning after trailing by **100+ points**: **\+0.25**

*(These are mutually exclusive—use the highest that applies.)*

### **3.4 Critical Rounds / Blocking**

* **Blocked Round Win**: **\+0.1**  
* **Win Secured by a Critical Block** (e.g., you forced the block or made the key move): **\+0.1**

### **3.5 Opponent Strength**

* **\+0.05** for every 100-point gap when defeating a **stronger** opponent.  
* **\-0.05** for every 100-point gap when losing to a **weaker** opponent.

---

## **4\. K-Factor Guidelines**

1. **High K (40)**  
   * **New players** (first X matches) or **special tournaments**.  
   * Allows rapid adjustments to better reflect true skill.  
2. **Medium K (20)**  
   * **Standard** for most matches once players have established ratings.  
3. **Low K (10)**  
   * **High-rated veterans**, or **casual/friendly matches** that shouldn’t drastically shift ratings.

---

## **5\. Handling Blocked Games**

* In Cuban Dominoes, the side with the **lowest pip total** in hand wins a blocked round. That team (or player) is credited with the round win.  
* There is **no possibility** of a tie.  
* Bonuses for **blocked round** (if you force or win in a blocked scenario) remain as part of the performance modifier.

---

## **6\. Example CDS Calculation**

**Scenario:**

* Player A (R=1550R \= 1550R=1550) beats Player B (R=1500R \= 1500R=1500).  
* **Point Differential**: 30 (150–120).  
* **Capicua in a Blocked Game**: \+0.2 total.  
* **Momentum Recovery**: Player A was trailing by 50+ at some point. \+0.15.

**Steps**:

1. **Expected Score** (EEE):

E=11+10(1500−1550)/400=11+10−50/400≈0.57E \= \\frac{1}{1 \+ 10^{(1500 \- 1550)/400}} \= \\frac{1}{1 \+ 10^{-50/400}} \\approx 0.57E=1+10(1500−1550)/4001​=1+10−50/4001​≈0.57

2. **Match Outcome** (SSS) \= 1 (win).  
3. **Performance Modifier** (MMM):  
   * Differential: \+0.15 (3 increments of \+0.05, because 30 points difference).  
   * Capicua in Blocked Game: \+0.2.  
   * Momentum Recovery (50+): \+0.15.  
   * **Total** M=+0.15+0.2+0.15=+0.5M \= \+0.15 \+ 0.2 \+ 0.15 \= \+0.5M=+0.15+0.2+0.15=+0.5.  
4. **Rating Update** (R′R'R′) using **Medium K \= 20**:

R′=1550+20×\[(1+0.5)−0.57\]=1550+20×0.93=1550+18.6=1568.6≈1569R' \= 1550 \+ 20 \\times \[(1 \+ 0.5) \- 0.57\] \= 1550 \+ 20 \\times 0.93 \= 1550 \+ 18.6 \= 1568.6 \\approx 1569R′=1550+20×\[(1+0.5)−0.57\]=1550+20×0.93=1550+18.6=1568.6≈1569

Hence, Player A’s new rating is **1569** (rounded).

*(If you want a cap on MMM, you’d check if \+0.5+0.5+0.5 exceeds your limit. In this example, it likely doesn’t, so it applies in full.)*

---

## **7\. Leaderboards & Special Metrics**

1. **Global Rankings**  
   * Based on the combined or “Overall” CDS (weighted from 1v1 & 2v2).  
2. **Mode-Specific Rankings**  
   * Separate charts for top 1v1 and top 2v2 players/teams.  
3. **Regional Rankings**  
   * Break down by location if desired.  
4. **Special Achievement Leaderboards**  
   * **Capicua Leaderboard**: Who has the most overall Capicuas (or best Capicua Efficiency).  
   * **Pollona Leaderboard**: Tracks total Pollonas inflicted.  
   * **Viajera Leaderboard**: Tracks 100+ point rounds.

---

## **8\. Benefits of This Revised CDS System**

1. **No Tie Confusion**  
   * Cuban Dominoes always has a winner—so SSS is strictly 0 or 1\. No partial .5 scoring.  
2. **Rewards Risk & Skill**  
   * Achievements like Pollonas, Capicuas, big comebacks, and blocked round wins feed directly into rating adjustments.  
3. **Controls Volatility**  
   * K-factor scaling \+ optional capping of MMM ensures the system doesn’t produce absurd rating spikes in rare super-combo scenarios.  
4. **Flexible for 1v1 and 2v2**  
   * Each mode remains distinct, yet merges into an Overall rating if desired.

---

## **Conclusion & Implementation Tips**

* This **modified Elo** with **Performance Modifiers** is well-suited for Cuban Dominoes.  
* **Implementation Steps**:  
  * After each match, calculate who won (no draws).  
  * Determine the final point differential, special achievements (Pollonas, Viajeras, Capicuas), any momentum comebacks, etc.  
  * Sum up performance modifier MMM, applying an optional cap (e.g., max \+1.0).  
  * Compute the new rating via R′=R+K×\[(S+M)−E\]R' \= R \+ K \\times \[(S \+ M) \- E\]R′=R+K×\[(S+M)−E\].  
  * Persist updated ratings and relevant stats for leaderboard and badge tracking.  
* **Periodic Adjustments**:  
  * Keep an eye on real-world data to see if the rating system remains stable and fair. Tweak the performance modifier values if they over- or under-reward certain achievements.

By **removing the draw scenario** and **implementing an optional cap** on performance modifiers, this revised CDS framework aligns more closely with the unique nature of Cuban Dominoes—providing a **fun, fair, and motivating** rating system that celebrates the game’s distinctive plays.

