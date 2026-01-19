# **MyFicha Cuban Dominoes Web App**

# 

# **Project Brief: MyFicha – Immersive Cuban Dominoes Experience** Version 1.0

---

"My Ficha" is a **beautifully crafted web app** that celebrates Cuban culture through the authentic experience of playing dominoes. Designed with **competitive mechanics, social features, and cultural flair**, it captures the essence of Cuban domino games while delivering a modern, smooth gameplay experience.

This app is more than a game—it’s a **celebration of Cuban culture and community**. From the **artful design**, rooted in Calle Ocho's essence, to the thoughtful multiplayer features that encourage **teamwork and camaraderie**, this app will feel like **sitting in a park in Havana** with friends, domino tiles in hand.

### **Executive Summary**

Project Name: MyFicha  
Tagline: Immersive Cuban Dominoes Experience  
Primary Goal: Build a culturally rich, competitive Cuban Dominoes platform that bridges casual fun and strategic depth, rooted in authenticity and community.  
Target Audience: Domino enthusiasts (casual players, competitive strategists, Cuban diaspora, and global gamers).  
---

### **Core Objectives**

| Category | Key Deliverables |
| :---- | :---- |
| Authentic Gameplay | Double-Nine rules, 1v1/2v2 modes, 150-point target, blocked rounds, automated scoring. |
| Cultural Immersion | Cuban-themed visuals/music, Spanish slang/trash talk, Havana-inspired table skins, vintage car avatars. |
| Social Dynamics | Real-time multiplayer, ephemeral chat/GIFs, private matches, spectator mode (future). |
| Competitive Depth | Cuban Domino Score (CDS), global leaderboards, advanced stats (Pollonas, Viajeras), tiered rankings (Bronze→Diamond). |
| Scalability | Backend architecture supporting 1k+ concurrent users, AI opponents (future), tournaments. |

---

### **Key Features**

#### 3.1 Game Modes

* 1v1 Matches: Traditional 150-point games or quick “Domino-Out” sessions.  
* 2v2 Team Play: Partner with friends or randoms; points deducted from losing team’s hand.  
* Custom Sessions: Best-of-X series (3, 5, 7, 10 wins).

#### 3.2 Cultural & Social Features

* Themes & Customization:

### **Color Palette**

#### **Dark Mode**

* Deep Navy Blue: \#001F3F (Primary background for a rich, immersive feel).  
* Antique White: \#FAEBD7 (Text and accents for contrast and warmth).  
* Golden Yellow: \#FFC107 (Highlights, buttons, and interactive elements).

#### **Light Mode**

* Dark Brown: \#4F3D2E (Primary background for a warm, earthy tone).  
* Antique White: \#FAEBD7 (Text and accents for readability and elegance).  
* Golden Yellow: \#FFC107 (Highlights, buttons, and interactive elements).


* Table Skins: Havana café, street-art backdrops.  
* Avatars: Flags, domino tiles, classic cars.  
* Trash Talk Mode: Optional Spanish/English quips (e.g., “¡Dale\!”).  
* Ephemeral Chat: Disappearing text/GIFs (Giphy/Tenor API).

#### 3.3 Competitive Systems

* Cuban Domino Score (CDS): Elo-inspired rating tracking wins, comebacks, and special plays.  
* Global Leaderboards: Top 10 players/teams, user rank visibility.  
* Match History: Round-by-round analytics (no chat logs).

#### 3.4 Player Progression

* Basic Stats: Wins, streaks, Pollonas/Viajeras count.  
* Advanced Metrics: Tile efficiency, bluff success, control plays (toggleable UI).  
* Achievements: Badges for milestones (e.g., “Comeback King,” “3 Capicuas in a Day”).

---

### **Cultural Integration Strategy**

* Visual Identity: Cuban motifs (palm trees, colonial architecture) in UI/icons.  
* Audio Design: Optional salsa music, street ambiance, tile-click SFX.  
* Language: Bilingual UI (English/Spanish), slang tooltips (e.g., “Pollona \= shutout”).  
* Events: Holiday tournaments (Cuban Independence Day), community leaderboards.

---

### **User Experience (UX)**

* Onboarding: Interactive tutorial for rules/strategy.  
* Dashboard: Clean layout with quick-play button, stat highlights, leaderboard teasers.  
* Match Flow:  
  * Quick Play: \<30 sec matchmaking.  
  * Private Matches: Room codes for friends.  
  * Post-Game: CDS update, “Rematch” prompt, shareable results.

---

# 

# **Key Features for MyFicha**

---

### **Core Gameplay Features**

1. Game Modes  
   * 1v1 Matches: Traditional scoring to 150 points, "Domino-Out" short sessions.  
   * 2v2 Team Play: Partner with friends/randoms; points deducted from losing team’s hand.  
   * Custom Sessions: Best-of-X series (3, 5, 7, 10 wins).  
2. Rules Automation  
   * Double-Nine domino logic (55 tiles, blocked rounds, Capicua recognition).  
   * Auto-shuffling, tile distribution, and valid move enforcement.  
   * Turn timer (30 seconds) \+ auto-pass for inactive players.  
3. Real-Time Multiplayer  
   * Matchmaking for Quick Play (1v1/2v2) and Private Matches (room codes).  
   * Spectator Mode (future phase) with delayed moves to prevent cheating.

---

### **Cultural Immersion Features**

4. Visual & Audio Design  
   * Themes: Havana café, street-art table skins; Dark Mode (navy, emerald, brown).  
   * Avatars: Pre-loaded Cuban icons (vintage cars, domino tiles, flags).  
   * Music/SFX: Optional salsa, son Cubano, or ambient street sounds.  
5. Language & Social Features  
   * Bilingual UI (English/Spanish) with slang tooltips (e.g., “Pollona \= shutout”).  
   * “Trash Talk Mode”: Lighthearted Spanish phrases (“¡Asere\!”, “¡Dale\!”).  
   * Ephemeral chat with Cuban-themed GIFs (Giphy/Tenor API).

---

### **Social & Competitive Systems**

6. Social Interaction  
   * Friend lists, invites, and private match codes.  
   * Ephemeral chat (text/GIFs) that disappears post-match.  
7. Competitive Depth  
   * Cuban Domino Score (CDS): Elo-like rating tracking wins, comebacks, and special plays (Pollonas, Viajeras).  
   * Global Leaderboards: Top 10 players/teams, tiered rankings (Bronze→Diamond).  
   * Advanced Stats: Tile efficiency, bluff success, control plays (toggleable UI).  
   * Achievements: Badges for milestones (e.g., “3 Capicuas in a Day”).  
8. Player Progression  
   * Match history with round-by-round analytics (no chat logs).  
   * Basic vs. Advanced stats toggle for casual/competitive players.

---

### **Future-Proofing**

15. Modular Architecture  
    * AI Opponents: Plug-in system for difficulty levels (easy, medium, hard).  
    * Tournaments: Swiss-style or elimination brackets (future update).  
    * Localization: Support for additional languages (French, Portuguese).  
16. Performance Optimization  
    * CDN: Fast asset delivery for global users.  
    * Load Testing: Simulate 10k+ users pre-launch with tools like JMeter.

---

### **Key Deliverables Timeline**

| Phase | Features |
| :---- | :---- |
| MVP Launch | Core gameplay, CDS, leaderboards, ephemeral chat, basic Cuban theming. |
| Post-Launch | AI opponents, tournaments, spectator mode, advanced analytics. |
| Long-Term | Mobile app, localized leaderboards, voice chat integration. |

---

Success Metrics:

* 80% matchmaking success rate under 30 seconds.  
* \<100ms latency for real-time gameplay.  
* 70% user retention after 30 days.

This framework ensures a balance of cultural authenticity, competitive rigor, and technical robustness. Let’s build a domino empire\! 🎲🇨🇺

---

MyFicha aims to deliver an **immersive Cuban Dominoes experience** that is both faithful to cultural traditions and appealing to modern gamers seeking competition. By **prioritizing essential features** (1v1 & 2v2, real-time multiplayer, ephemeral chat) and an **accessible design** (intuitive UI, optional advanced stats, theme customization), the platform will cater to a wide audience—from casual fans to hardcore strategists.

1. **Finalize UI/UX Wireframes** and user flows.  
2. **Set Up Backend Infrastructure** for real-time play (WebSockets).  
3. **Implement Core Gameplay** logic and Cuban Domino rules.  
4. **Conduct Alpha Testing** on gameplay stability and user satisfaction.  
5. **Iterate** based on feedback, then roll out advanced features (CDS, tournaments) in phases.

# **MoSCoW Prioritization for MyFicha** (Must-Have, Should-Have, Could-Have, Won’t-Have)

---

### **MUST-HAVE (Core MVP Features)**

1. Core Gameplay  
   * Double-Nine Cuban Domino rules (1v1 and 2v2 modes).  
   * Automated scoring (150-point target, blocked rounds, Capicua/Pollona detection).  
   * Real-time multiplayer with matchmaking (Quick Play, Private Matches via codes).  
2. Technical Foundation  
   * Backend for real-time sync (Node.js/Socket.io).  
   * User authentication (OAuth \+ guest play).  
   * Basic match history (final scores, participants).  
   * Anti-cheat and move validation.  
3. Cultural Essentials  
   * Cuban-themed visuals (Havana café table, vintage car avatars).  
   * Bilingual UI (English/Spanish).  
   * Ephemeral text chat (disappears post-match).  
4. Competitive Basics  
   * Cuban Domino Score (CDS) calculation.  
   * Global leaderboards (Top 10 players/teams).

---

### **SHOULD-HAVE (Important but Post-MVP)**

1. Enhanced Social Features  
   * GIF integration (Cuban-themed via Giphy/Tenor).  
   * Friend lists and direct challenges.  
   * Basic achievements (e.g., "First Pollona").  
2. Advanced Gameplay  
   * Custom session lengths (best-of-3/5/7).  
   * Reshuffling for hands with 5+ doubles.  
   * Turn timer adjustments (user preferences).  
3. UI/UX Polish  
   * Dark Mode with Cuban color palettes.  
   * Basic stat dashboard (wins, streaks, Pollonas).  
   * Interactive onboarding tutorial.  
4. Technical Scalability  
   * AI takeover for disconnected players.  
   * Load testing for 1k+ concurrent users.

---

### **COULD-HAVE (Nice-to-Have Enhancements)**

1. Cultural Flair  
   * Optional Cuban music/street sounds.  
   * Expanded avatar customization (user uploads).  
   * Seasonal Cuban holiday events (e.g., May 20 tournaments).  
2. Competitive Depth  
   * Tiered rankings (Bronze→Diamond).  
   * Advanced stats toggle (bluff success, tile efficiency).  
   * Post-match replays for key moments.  
3. Social Expansion  
   * Clubs/groups for community building.  
   * Spectator Mode (delayed moves to prevent cheating).  
   * Voice chat for team coordination.  
4. Analytics  
   * Player heatmaps (common opening moves).  
   * Win rate by opponent skill tier.

---

### **WON’T-HAVE (Explicitly Deferred or Out of Scope)**

1. Non-Core Features  
   * AI opponents (post-launch phase).  
   * Tournament systems (Swiss-style brackets).  
   * Localized leaderboards (regional rankings).  
2. Complex Integrations  
   * In-app purchases for cosmetics (monetization later).  
   * Advanced bot scripting (AI difficulty levels).  
   * Multi-language support beyond English/Spanish.  
3. Overhead-Intensive Features  
   * Full match replays with chat logs.  
   * Real-time "commentary" spectator chat.  
   * Bluff detection algorithms (overly niche).

---

Rationale:

* Must-Haves ensure the app is playable, culturally authentic, and competitively viable at launch.  
* Should-Haves refine UX and deepen engagement post-MVP.  
* Could-Haves add polish and community-driven features as resources allow.  
* Won’t-Haves focus on avoiding scope creep while leaving room for future updates.

This framework balances delivering a functional, culturally rich MVP while laying groundwork for long-term growth. 🇨🇺🎲

# **MVP Screen/Page Breakdown for MyFicha** Prioritized for Core Functionality and Cultural Immersion

---

### **1\. Login/Signup Screen**

Purpose: User authentication and onboarding.  
Key Elements:

* OAuth buttons (Google, Facebook) \+ guest play option.  
* Email/password signup with validation.  
* Password recovery link.  
* Brief tagline: “Play Cuban Dominoes like never before.”

---

### **2\. Dashboard/Home Screen**

Purpose: Central hub for navigation and quick actions.  
Key Elements:

* Quick Play Button (1v1/2v2 with default settings).  
* Recent Matches: Thumbnails of last 3 games (scores, participants).  
* Leaderboard Teaser: Top 3 players/teams.  
* Notifications: Match invites, CDS updates.  
* Navigation menu (Profile, Play, History, Leaderboard, Settings).

---

### **3\. Profile Screen**

Purpose: User customization and stat tracking.  
Key Elements:

* Avatar Customization: Pre-loaded Cuban icons (flags, cars) \+ username edit.  
* Stats Tabs:  
  * Basic: Wins, streaks, Pollonas/Viajeras.  
  * Advanced (toggleable): Tile efficiency, bluff success.  
* Settings: Dark Mode toggle, language (English/Spanish).  
* Logout button.

---

### **4\. Play Game Screen**

Purpose: Match type selection and setup.  
Key Elements:

* Mode Selector: 1v1 / 2v2 toggle.  
* Session Length: Default (150 points) or “Domino-Out” (short).  
* Match Type:  
  * Quick Play (automated matchmaking).  
  * Private Match (generate/join room code).  
  * Friend Match (invite from friend list).  
* Start/Cancel buttons.

---

### **5\. Private Match Setup Screen**

Purpose: Create or join a private game.  
Key Elements:

* Room Code Generator: Unique 6-digit code for hosts.  
* Lobby List: Avatars of joined players (max 4 for 2v2).  
* Start Match Button (host-only).  
* Copyable invite link.

---

### **6\. Game Screen**

Purpose: Core domino gameplay interface.  
Key Elements:

* Domino Table: Cuban-themed design (Havana café/street art).  
* Player Hands: Tile display (drag-and-drop functionality).  
* Scoreboard: Real-time points, turn indicator, CDS preview.  
* Chat Panel: Ephemeral text/GIFs (disappears post-match).  
* Pass Button: Auto-highlighted when no valid moves.  
* Timer: 30-second countdown per turn.  
* Disconnection handling (AI takeover after 2 minutes).

---

### **7\. Match Result Screen**

Purpose: Post-game summary and progression.  
Key Elements:

* Final score and CDS change (+/- points).  
* Achievements Unlocked: Badges (e.g., “First Pollona\!”).  
* Rematch Button: Quick restart with same players.  
* Share Results: Social media or direct link.  
* Navigation to Dashboard or History.

---

### **8\. Match History Screen**

Purpose: Review past games and performance.  
Key Elements:

* Recent Matches List: Date, participants, final score.  
* Detailed View:  
  * Round-by-round breakdown (points, tiles left).  
  * Special plays (Capicua, Viajeras).  
* Filter by mode (1v1/2v2) or outcome (win/loss).

---

### **9\. Leaderboard Screen**

Purpose: Track global and personal rankings.  
Key Elements:

* Top 10 Players/Teams: CDS, wins, Pollonas.  
* User Rank: Current position and tier (e.g., \#45 Bronze).  
* Search bar to find friends or rivals.  
* Toggle between 1v1 and 2v2 leaderboards.

---

### **10\. Settings Screen**

Purpose: Manage app preferences.  
Key Elements:

* Theme: Dark Mode toggle with Cuban color palettes.  
* Notifications: Match invites, CDS updates.  
* Language: English/Spanish switch.  
* Account Management: Delete account, privacy policy.

---

### **11\. Error/404 & Loading Screens/ Splash Screen**

Purpose: Handle invalid routes or delays.  
Key Elements:

* 404 Screen: Cuban domino-themed artwork \+ “¡Oops\! Page not found.”  
* Loading Spinner: Animated domino tile \+ tip (e.g., “Did you know? Capicua means ‘palindrome’ in Cuban slang”).

---

### **Key Technical Considerations**

1. Responsive Design: Optimized for desktop and mobile (collapsible menus on smaller screens).  
2. Real-Time Sync: WebSocket (Socket.io) for live gameplay and chat.  
3. Performance: Lazy loading for match history and leaderboards.  
4. Security: End-to-end encryption for private matches and user data.

---

Rationale:

* Prioritizes Must-Have features from MoSCoW (core gameplay, CDS, Cuban theming).  
* Balances simplicity for casual players with depth for competitive users (toggleable stats).  
* Lays groundwork for future expansions (AI, tournaments) via modular design.

This structure ensures a polished MVP that honors Cuban culture while delivering a seamless, competitive domino experience. 🎲🇨🇺

### **Future**

---

### **13\. Tournament Screen *(Optional Next Phase)***

### 

### **14\. Clubs / Community Hub *(Optional Next Phase)***

# **Technical Requirements for MyFicha**

---

### **1\. Core Backend Requirements**

#### **1.1 Database**

* Type: PostgreSQL (Supabase).  
* Tables:  
  * users: User profiles, authentication, and stats.  
  * matches: Completed matches and outcomes.  
  * match\_history: Round-by-round details for each match.  
  * leaderboard: Global rankings and CDS scores.  
  * game\_state: Active game states for real-time sync.  
* Row-Level Security (RLS): Restrict access to sensitive data.

#### **1.2 Authentication**

* OAuth Providers: Google, Facebook, GitHub.  
* Email/Password: Standard login/signup.  
* Anonymous Accounts: Guest play support.  
* JWT: Secure session management.

#### **1.3 Real-Time Sync**

* Supabase Realtime: Subscriptions for live updates (e.g., game state, chat).  
* WebSocket Fallback: Custom WebSocket server (e.g., Socket.io) for advanced real-time needs.

#### **1.4 Matchmaking**

* Quick Play: Pair players based on CDS and latency.  
* Private Matches: Room codes for friend invites.  
* Edge Functions: Custom logic for match creation and validation.

#### **1.5 File Storage**

* Supabase Storage: Host avatars, table skins, and other assets.  
* Buckets:  
  * avatars: Pre-loaded Cuban icons and user uploads.  
  * table\_skins: Havana café, street-art backgrounds.

#### **1.6 Serverless Functions**

* Edge Functions:  
  * Scoring logic (Pollonas, Viajeras, blocked rounds).  
  * CDS updates (Elo-like formula).  
  * AI takeover for disconnected players.

---

### **2\. Frontend Requirements**

#### **2.1 Framework**

* React.js: Component-based UI for responsiveness.  
* Phaser.js/Unity: Domino tile animations and drag-and-drop mechanics.

#### **2.2 Pages/Screens**

* Login/Signup: OAuth, email/password, guest play.  
* Dashboard: Quick Play, recent matches, leaderboard teaser.  
* Profile: Avatar customization, stats (basic/advanced).  
* Play Game: Mode selection (1v1/2v2), session length.  
* Private Match Setup: Room codes, lobby list.  
* Game Screen: Domino table, scoreboard, ephemeral chat.  
* Match Result: Final scores, CDS updates, achievements.  
* Match History: Round-by-round breakdowns.  
* Leaderboard: Top 10 players/teams, user rank.  
* Settings: Dark Mode, notifications, language.  
* Error/404 & Loading: Fallback screens for invalid routes or delays.

#### **2.3 APIs**

* Supabase Client: Interact with backend services (auth, database, storage).  
* Third-Party APIs:  
  * Giphy/Tenor: Cuban-themed GIFs for chat.  
  * Mixpanel/Google Analytics: User engagement tracking.

---

### **3\. Infrastructure Requirements**

#### **3.1 Hosting**

* Frontend: Vercel/Netlify for static site hosting.  
* Backend: Supabase for database, auth, and real-time sync.

#### **3.2 Scalability**

* Database: PostgreSQL with read replicas for horizontal scaling.  
* Storage: S3-compatible storage for assets.  
* Edge Functions: Auto-scaling for custom logic.

#### **3.3 Security**

* Authentication: OAuth, JWT, and RLS for data protection.  
* Encryption: End-to-end encryption for sensitive data.  
* Anti-Cheat: Server-side validation for moves and scores.

---

### **4\. Performance Requirements**

* Latency: \<100ms for real-time gameplay updates.  
* Concurrency: Support 1k+ concurrent users at launch.  
* Load Testing: Simulate 10k+ users with tools like JMeter.

---

### **5\. Third-Party Integrations**

* Giphy/Tenor API: Fetch GIFs for ephemeral chat.  
* Mixpanel/Google Analytics: Track user behavior and retention.  
* Push Notifications: Alert users for match invites, CDS updates.

---

### **6\. Development Tools**

* Version Control: GitHub for collaboration.  
* CI/CD: GitHub Actions for automated deployments.  
* Monitoring: Supabase logs \+ Sentry for error tracking.

---

### **7\. Future-Proofing**

* Modular Design: Plug-in system for AI opponents, tournaments.  
* Localization: Support for additional languages (e.g., French, Portuguese).  
* Mobile Optimization: Progressive Web App (PWA) for mobile compatibility.

---

### **Summary**

This technical requirements document outlines the necessary components to build MyFicha using Supabase as the core backend solution. It covers:

* Database schema and authentication.  
* Real-time gameplay sync and matchmaking.  
* Frontend framework and pages.  
* Infrastructure, security, and performance needs.

By following these requirements, you can deliver a scalable, culturally rich, and competitive Cuban Dominoes platform. 🎲🇨🇺

# 

# 

# **User Flows**

Below are **typical user flows** describing how players will navigate these wireframes for core tasks.

---

## **2.1 User Flow: Login and Quick Play (1v1)**

1. **User opens app** → Sees **Login/Signup** screen.  
2. User **selects Google Login** → On success, redirected to **Dashboard**.  
3. On **Dashboard**, user clicks **Quick Play**.  
4. **Play Game Screen** appears (or a modal):  
   * 1v1 is default (or user chooses it).  
   * Session length is set to 3 or 5\.  
5. User clicks **Quick Play** again → System places user in a matchmaking queue.  
6. Once matched, user is redirected to **Game Screen**.  
7. **Game** commences:  
   * Domino table loads, user’s hand shown.  
   * Chat is available.  
   * Scoreboard updates in real time.  
8. On finishing the match, the app shows a **Match Result** overlay or returns to an updated scoreboard.  
9. System updates the user’s rating, logs match in **Match History**.

---

## **2.2 User Flow: Private 2v2 Match**

1. User logs in → Goes to **Dashboard**.  
2. Clicks **Create Private Match** → Goes to **Private Match Setup**.  
3. Clicks **Create Room** → Receives code, e.g., `ABC123`.  
4. User shares code with 3 friends via chat or link.  
5. Friends each log in, go to **Private Match Setup** → Enter code.  
6. As they join, they appear in the **Lobby** list.  
7. Once 4 players are in, the **host** clicks **Start Match**.  
8. All 4 are redirected to the **Game Screen**.  
9. Game is played in 2v2 style.  
10. Upon match conclusion, all players see final scoreboard.  
11. Ratings are updated (if you apply ratings to private matches).

---

## **2.3 User Flow: Checking Match History**

1. From **Dashboard**, user clicks **Match History** in the nav menu.  
2. **Match History Screen** loads, listing recent matches.  
3. User clicks a match labeled “View Details.”  
4. **Detailed Match View**: sees round-by-round breakdown.  
5. User clicks “Back to History” to return, or “Back to Dashboard.”

---

## **2.4 User Flow: Viewing / Searching Leaderboard**

1. From **Dashboard**, user clicks **Leaderboard** in the nav.  
2. **Leaderboard Screen** loads with top 10 players.  
3. User sees their rank (e.g., \#45).  
4. They type a friend’s username in the search bar, results appear.  
5. (Optional) Switch to “Teams” tab to view 2v2 ratings.

---

## **2.5 User Flow: Updating Profile & Changing Theme**

1. User clicks **Profile Icon** in the nav → **Profile Screen**.  
2. User chooses to change **Avatar** or update **Username**.  
3. Presses **Save** → Changes are stored in the database.  
4. Toggle **Dark Mode** → The UI switches to the Cuban-themed palette.

# **App Overview: MyFicha – The Soul of Cuban Dominoes** Big Vision & Cultural Mission

---

### **Tagline**

"Where Tradition Meets Competition, and Every Tile Tells a Story."  
---

### **Core Vision**

MyFicha is more than a game—it’s a digital celebration of Cuban culture, strategy, and community. Designed to honor the vibrant legacy of Cuban Dominoes, the app bridges generations and geographies, offering a space where players worldwide can experience the thrill, camaraderie, and "sabor" (flavor) of a Havana park game night—no matter where they are.  
---

### **Key Pillars**

#### **1\.** **Cultural Immersion**

* Authentic Cuban Atmosphere:  
  * Play on virtual tables styled after Havana cafés, bustling street corners, or retro Cuban living rooms.  
  * Soak in the sounds of salsa, son Cubano, or the chatter of a lively "parque de dominó."  
  * Optional "Habana Mode": Trash talk with classic Cuban phrases ("¡Dale, asere\!") and playful emojis (🇨🇺☕🚬).

#### **2\. Accessible, Yet Deep Gameplay**

* For Everyone:  
  * Newcomers learn with interactive tutorials guided by a virtual "abuelo dominó" (domino grandpa).  
  * Veterans flex strategy in ranked matches, tracking advanced stats like Pollonas (shutouts) and Viajeras (100+ point rounds).  
* Game Modes:  
  * Quick Play: Casual 1v1 or 2v2 matches.  
  * Café Cubano: Slow-paced games with friends, paired with virtual cafecito breaks.

#### **3\.** **Global Community, Cuban Soul**

* Social Play:  
  * Bond over "mierda" (lighthearted trash talk) and GIFs of dancing mojitos or vintage Chevys.  
  * Join "Clubes de Dominó" to represent your hometown (e.g., Club Miami vs. Club Havana).  
* Cultural Events:  
  * Seasonal tournaments celebrating Cuban holidays (May 20 Independence Day).  
  * Virtual domino leagues hosted by Cuban cultural icons.

#### **4\.** **Competitive Legacy**

* Cuban Domino Score (CDS):  
  * A globally recognized Elo-like rating system that respects Cuban playstyles (comebacks, bluffs, shutouts).  
  * Climb leaderboards to earn titles like "Maestro" or "Leyenda del Dominó."  
* Legends Program:  
  * Spotlight real-life Cuban domino champions through in-app profiles and strategy videos.

#### **5\.** **A Living Tradition**

* Preservation:  
  * Partner with Cuban historians to document regional domino rules and oral histories.  
  * Host virtual "Tertulias" (community talks) about domino’s role in Cuban identity.  
* Innovation:  
  * Future plans for AI opponents modeled after legendary Cuban players.

---

### **Why MyFicha?**

Cuban Dominoes isn’t just a game—it’s a ritual, a social glue, and a source of pride. MyFicha captures this essence by:

* Respecting Roots: Every design choice, from color palettes to slang, reflects Cuban heritage.  
* Building Bridges: Connecting the Cuban diaspora and global players through shared passion.  
* Elevating the Game: Transforming backyard dominoes into a globally respected, strategic sport.

---

### **Long-Term Vision**

* Cultural Hub: Expand beyond dominoes to host Cuban music festivals, art showcases, and virtual "fiestas."  
* Mobile & VR: Launch a mobile app and VR mode where players can "sit" at a virtual Malecón seawall.  
* Legacy Tournaments: Annual "Copa de La Habana" with cash prizes and real-world trophies.

---

### **Mission Statement**

"To preserve and share the joy, strategy, and soul of Cuban Dominoes—one tile, one laugh, and one comeback at a time."  
---

MyFicha isn’t just an app. It’s a front porch in Havana, a park bench in Miami, and a global table where passion meets tradition. 🎲☀️🇨🇺

