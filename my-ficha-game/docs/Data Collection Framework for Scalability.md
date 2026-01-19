# **Data Collection Framework for Scalability**

The key is to **design the data collection process now** so that even if you're not immediately using certain metrics, the raw data is still being gathered in the background. 

To ensure your data collection is **comprehensive and future-proof**, it’s essential to design the system so that **all gameplay actions and outcomes are tracked** across **Overall**, **1v1**, and **2v2** modes. By collecting **raw data** uniformly, you’ll have the flexibility to derive additional insights or pivot to more advanced metrics later.

Here’s a framework to achieve this:

---

### **1\. Core Data to Record for Every Match**

At the heart of the data collection process is **logging every game-related action**. The following raw data points should be tracked universally for **Overall**, **1v1**, and **2v2**, ensuring nothing is missed:

#### **Match Metadata**

* **Game ID**: Unique identifier for each game.  
* **Game Mode**: Specify if it’s **1v1** or **2v2**.  
* **Player IDs**: Identify all participants (and their teams for 2v2).  
* **Date and Time**: Timestamp for when the game started and ended.  
* **Target Score**: The score needed to win the game (e.g., 150 points).

#### **Round Data**

* **Round ID**: Unique identifier for each round within a game.  
* **Starting Player**: Player who starts the round.  
* **Tiles Dealt**: Record the specific tiles dealt to each player (including doubles).  
* **Tiles Played**: Log each tile played during the round, in order.  
* **Pass Events**: Track each player pass (who passed and when).  
* **Blocked Status**: Note if the round ends in a block.  
* **Winning Player/Team**: Record the round winner.  
* **Points Scored**: Points earned by the winning player or team.

#### **Tile-Specific Data**

* **Opening Tile**: The tile used to start the round.  
* **Doubles Played**: Track each double played and its impact (e.g., caused a pass or block).  
* **Unplayed Tiles**: Record tiles left in players' hands at the end of the round.

#### **Game Outcome**

* **Winner**: Player or team that won the game.  
* **Final Scores**: Final scores for all players or teams.  
* **Pollonas**: If the losing team scored zero.  
* **Viajeras**: If a player or team scored 100+ points in a single round.

---

### **2\. Metrics Derived from Raw Data**

By tracking the **core data**, you can calculate all relevant metrics for **Overall**, **1v1**, and **2v2** modes without requiring separate collection efforts. Here’s how this approach supports each metric category:

#### **Match Stats**

* **Total Wins**: Derived by counting games won per player or team.  
* **Win Rate (%)**: Calculated from the ratio of wins to games played.  
* **Longest/Current Win Streak**: Tracked using consecutive wins from game outcomes.  
* **Pollonas & Viajeras**: Identified from game and round outcomes.

#### **Gameplay Metrics**

* **Turn Efficiency**: Calculated from the total turns logged in rounds versus wins.  
* **Tile Efficiency**: Derived from tiles played per round per player.  
* **Momentum Recovery**: Identified from scores logged at key points in a game.  
* **Capicuas**: Detected from logged end-of-round plays.

#### **Doubles and Specials**

* **Doubles Played**: Logged directly.  
* **Doubles Placement Efficiency**: Calculated from doubles that lead to passes or blocks.  
* **Double Block Usage**: Derived from blocked rounds and logged doubles played.  
* **Double Burden Rate**: Tracked from tiles left unplayed in blocked rounds.

#### **Advanced Strategy**

* **Control Plays Established**: Determined from consecutive plays of the same number (4+ tiles).  
* **Opponent Denial Wins**: Calculated from opponent pass events.

---

### **3\. Ensuring Robust Data Collection for Future Insights**

To guarantee flexibility for deeper analytics, follow these best practices:

#### **Log All Actions Uniformly**

* Regardless of mode, log all **player actions**, including:  
  * Tiles played  
  * Passes  
  * Blocks  
  * Points scored  
* This ensures you can calculate any metric for **Overall**, **1v1**, and **2v2** later.

#### **Include Player and Team Context**

* In **2v2**, distinguish between individual player actions (e.g., who played a double) and team outcomes (e.g., team points scored). This enables calculation of team-specific metrics like:  
  * **Partner Salvage Rate**  
  * **Team Knock Performance**

#### **Track Round-Level Data**

* Round-specific data (e.g., points scored, blocking, passes) ensures fine-grained insights for metrics like:  
  * **First Tile Efficiency**  
  * **Blocked Wins**  
  * **Opening Number Success**

#### **Store Relationships Between Tables**

Use a relational database to organize the data:

* **Games Table**: Stores game-level metadata (e.g., mode, participants, winner).  
* **Rounds Table**: Links to games and logs round-level data (e.g., points scored, blocked status).  
* **Actions Table**: Logs every tile played or passed, linked to rounds and players.

---

### **4\. Benefits of This Approach**

1. **Unified Data Collection**:  
   * You don’t need separate systems for **Overall**, **1v1**, and **2v2**. The same raw data can power all insights.  
2. **Future-Proof**:  
   * Even if certain metrics (e.g., **Team Knock Performance**) aren’t used now, you’ll have the data to calculate them later.  
3. **Player Insights Across Modes**:  
   * You can directly compare metrics across modes (e.g., how a player’s doubles efficiency differs between 1v1 and 2v2).  
4. **Scalability**:  
   * Adding new metrics or modes in the future (e.g., a new scoring system) will be straightforward since the raw data structure already supports granular analysis.

---

### **Example Data Flow**

**Game 1 (2v2):**

* **Game ID**: 001  
* **Mode**: 2v2  
* **Participants**: Player A, Player B (Team 1); Player C, Player D (Team 2\)  
* **Rounds**:  
  * Round 1:  
    * Starting Player: Player A  
    * Tiles Played: \[9|5\], \[5|4\], \[4|4\]  
    * Pass Events: Player D passed once.  
    * Winning Team: Team 1  
    * Points Scored: 25  
  * Round 2:  
    * Starting Player: Player C  
    * Tiles Played: \[8|8\], \[8|2\], \[2|3\]  
    * Pass Events: None  
    * Winning Team: Team 2  
    * Points Scored: 30  
* **Game Outcome**:  
  * Winner: Team 2  
  * Final Scores: Team 1 (100), Team 2 (150)

---

### **Conclusion**

By recording **universal raw data** for every game, round, and player action, you create a robust system capable of supporting **Overall**, **1v1**, and **2v2** metrics. Even if you don’t use some metrics immediately, you’ll have enough data to calculate or pivot to new insights without redesigning the system.

