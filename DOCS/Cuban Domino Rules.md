# **Cuban Domino Rules**

### **Cuban Domino Rules for Web App**

#### **Overview**

Cuban Dominoes is a strategic and fast-paced game played with a Double-Nine domino set (55 tiles). Designed for both 2v2 (team play) and 1v1 formats, the objective is to score points by winning rounds. The first player or team to reach 150 points wins. Automated rules ensure fair and competitive gameplay.

---

### **Players and Equipment**

* **Players**:  
  * 4 players in fixed partnerships (2v2) or 2 players (1v1).  
* **Tiles**:  
  * A Double-Nine domino set with 55 tiles.  
* **Objective**:  
  * Be the first player or team to score **150 points**.

---

### **Game Setup**

1. **Shuffling and Drawing**:  
   * The app automatically shuffles all 55 tiles before the game begins.  
   * Each player is dealt 10 tiles.  
   * The remaining tiles are set aside:  
     * **2v2**: 15 tiles are excluded from play.  
     * **1v1**: 35 tiles are excluded from play.  
2. **Determining the Starting Player**:  
   * Before the first round, each player draws one domino from the **remaining tiles**:  
     * **2v2**: From the 15 excluded tiles.  
     * **1v1**: From the 35 excluded tiles.  
   * The player with the **highest pip count** on their drawn domino starts the game.  
   * In case of a tie, the tied players draw again.  
   * For subsequent rounds, the winner of the previous round starts.  
   * The app automates this process.  
3. **Seating Arrangement**:  
   * **2v2**: Players are seated so that teammates sit opposite each other.  
   * **1v1**: Players alternate turns.

---

### **Gameplay Rules**

1. **Turn Order**:  
   * Play proceeds **counter-clockwise** throughout the game.  
2. **Starting the Round**:  
   * The starting player plays any tile from their hand to begin the domino chain.  
3. **Making a Move**:  
   * On their turn, a player must place a tile that matches one open end of the domino chain.  
   * Doubles are placed perpendicular to the chain and treated as regular tiles (not spinners).  
   * The app ensures players can only make valid moves by highlighting available options.  
4. **Passing a Turn**:  
   * If a player cannot make a valid move, they must pass (knock).  
   * The app automatically registers a pass if no valid moves are available.  
5. **Mandatory Play**:  
   * If a player has a valid move, they must play a tile. The app enforces this rule.  
6. **Ending a Round**:  
   * A round ends when:  
     * A player plays all their tiles (“Domino\!”), or  
     * No player can make a valid move (the game is blocked).

---

### **Scoring**

1. **Winning a Round**:  
   * The round is won by:  
     * The team/player who plays all their tiles.  
     * In a blocked game, the team/player with the **lowest pip count** in their hand wins.  
2. **Calculating Points**:  
   * The winner scores the total pip value of the losing side’s remaining tiles.  
   * The app calculates and updates scores automatically.  
3. **Special Scenarios**:  
   * **Capicua**: If the last tile is placed at both ends of the chain, it is noted as a special move but does not double points.  
   * **Pollona**: Winning a game where the opponents score zero points.  
   * **Viajera**: Scoring 100+ points in a single round.  
4. **Round Tie Resolution**:  
   * **First Round Tie**:  
     * Winner is determined by who played the highest domino at the start of the match.  
     * The losing team/player’s pip total is added to their score.  
   * **Other Round Ties**:  
     * Winner is the team/player who won the previous round.  
     * The losing team/player’s pip total is added to their score.  
   * **Key Principle**: Ties always have a clear winner, and only the losing side’s points are added.

---

### **Automatic Features**

1. **Turn Timer**:  
   * Players have **30 seconds** to make a move.  
   * If time expires, the app automatically passes their turn.  
2. **Disconnection Management**:  
   * If a player disconnects:  
     * The game pauses for up to **2 minutes** to allow reconnection.  
     * If reconnection fails, the app replaces the player with an AI.  
   * The AI follows basic strategy rules to maintain fairness.  
3. **Reshuffling**:  
   * If a player’s initial hand includes **5 or more doubles**, the app offers a reshuffle option.  
   * If accepted, all hands are discarded, tiles reshuffled, and new hands dealt.  
4. **Error Prevention**:  
   * Invalid moves are not allowed. The app highlights valid moves, ensuring fair play.  
5. **Spectator Rules**:  
   * Spectators cannot interact with players during the game.  
   * Spectators can review previous moves but cannot disrupt live gameplay.

---

### **Gameplay Strategy**

1. **Tile Management**:  
   * Play high-pip tiles early to avoid penalties in blocked rounds.  
   * Use doubles strategically or early to prevent limiting your options.  
2. **Team Coordination** (2v2):  
   * Avoid “eating the salida” playing over your partner’s opening number) unless it’s strategically necessary.  
   * Support your partner by extending their plays or keeping key numbers open.  
   * Develop non-verbal cues for strong hands (e.g., feeling “great” to take the lead)  
3. **Bluffing and Psychological Play**:  
   * Mislead opponents by delaying strong plays or playing misleading moves.  
   * Engage in playful banter to enhance the fun and distract opponents (optional).  
4. **Control and Blocks**:  
   * Establish control over a number by playing it repeatedly, forcing opponents to pass.  
   * Avoid self-blocking your own strong numbers or limiting your partner's options.

---

### **Rankings and Fairness**

* **Fixed Target Score**:  
  * All games are played to **150 points** to maintain consistent rankings.  
* **Stat Tracking**:  
  * The app tracks detailed individual and team stats, including win rate, streaks, and advanced metrics.  
* **Tiebreakers**:  
  * Ties are always resolved, and points only add to the losing side’s total.

---

### **Etiquette and Fun**

1. **Playful Banter**:  
   * Talking “mierda” (trash-talking) is an integral part of Cuban Dominoes.  
   * Keep it lighthearted and fun, especially with unfamiliar players.  
2. **Respect Elders**:  
   * Avoid mischievous behavior with senior or serious players.  
3. **Celebrate the Game**:  
   * Win or lose, Cuban Dominoes is about camaraderie, strategy, and shared moments.

