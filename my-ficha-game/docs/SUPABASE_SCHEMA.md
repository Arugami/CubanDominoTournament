# MyFicha Supabase Schema

## Overview

This document defines the database schema for MyFicha using Supabase (PostgreSQL). The schema supports real-time multiplayer Cuban Dominoes with user profiles, match history, rankings, and chat.

## Tables

### `users`

User profiles and authentication data.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  country_code TEXT, -- For flags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Stats
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_pollonas INTEGER DEFAULT 0,
  total_viajeras INTEGER DEFAULT 0,

  -- CDS (Cuban Domino Score)
  cds_1v1 INTEGER DEFAULT 1500,
  cds_2v2 INTEGER DEFAULT 1500,
  cds_overall INTEGER DEFAULT 1500,

  -- Preferences
  preferred_language TEXT DEFAULT 'en', -- 'en' | 'es'
  dark_mode BOOLEAN DEFAULT true,
  sound_enabled BOOLEAN DEFAULT true,

  CONSTRAINT username_length CHECK (length(username) >= 3 AND length(username) <= 20)
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_cds_overall ON users(cds_overall DESC);
CREATE INDEX idx_users_cds_1v1 ON users(cds_1v1 DESC);
CREATE INDEX idx_users_cds_2v2 ON users(cds_2v2 DESC);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### `matches`

Game match records.

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode TEXT NOT NULL, -- '1v1' | '2v2'
  status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting' | 'in_progress' | 'finished' | 'abandoned'
  target_score INTEGER DEFAULT 150,
  winner_id UUID REFERENCES users(id),

  -- Match metadata
  room_code TEXT UNIQUE, -- For private matches
  is_private BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT valid_mode CHECK (mode IN ('1v1', '2v2'))
);

CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_room_code ON matches(room_code) WHERE room_code IS NOT NULL;
CREATE INDEX idx_matches_created_at ON matches(created_at DESC);

-- RLS Policies
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view matches they're in" ON matches
  FOR SELECT USING (
    id IN (
      SELECT match_id FROM match_players WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create matches" ON matches
  FOR INSERT WITH CHECK (true);
```

### `match_players`

Players in each match.

```sql
CREATE TABLE match_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  player_position INTEGER NOT NULL, -- 0, 1, 2, 3
  team INTEGER, -- 0 or 1 (for 2v2 mode)
  final_score INTEGER DEFAULT 0,
  cds_change INTEGER DEFAULT 0, -- CDS gained/lost in this match

  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT unique_match_position UNIQUE(match_id, player_position)
);

CREATE INDEX idx_match_players_match ON match_players(match_id);
CREATE INDEX idx_match_players_user ON match_players(user_id);

-- RLS Policies
ALTER TABLE match_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view match players" ON match_players
  FOR SELECT USING (
    match_id IN (
      SELECT match_id FROM match_players WHERE user_id = auth.uid()
    )
  );
```

### `game_rounds`

Individual rounds within a match.

```sql
CREATE TABLE game_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  winner_id UUID REFERENCES users(id),
  points_scored INTEGER NOT NULL,
  was_blocked BOOLEAN DEFAULT false,

  -- Special plays
  had_capicua BOOLEAN DEFAULT false,
  had_pollona BOOLEAN DEFAULT false,
  had_viajera BOOLEAN DEFAULT false,

  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT unique_match_round UNIQUE(match_id, round_number)
);

CREATE INDEX idx_game_rounds_match ON game_rounds(match_id);

-- RLS Policies
ALTER TABLE game_rounds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view rounds from their matches" ON game_rounds
  FOR SELECT USING (
    match_id IN (
      SELECT match_id FROM match_players WHERE user_id = auth.uid()
    )
  );
```

### `game_moves`

Individual tile placements in each round.

```sql
CREATE TABLE game_moves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID REFERENCES game_rounds(id) ON DELETE CASCADE,
  player_id UUID REFERENCES users(id),
  move_number INTEGER NOT NULL,

  -- Move details
  tile_left INTEGER NOT NULL, -- 0-9
  tile_right INTEGER NOT NULL, -- 0-9
  placement_end TEXT NOT NULL, -- 'left' | 'right'
  was_flipped BOOLEAN DEFAULT false,
  was_pass BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT tile_values CHECK (tile_left >= 0 AND tile_left <= 9 AND tile_right >= 0 AND tile_right <= 9),
  CONSTRAINT unique_round_move UNIQUE(round_id, move_number)
);

CREATE INDEX idx_game_moves_round ON game_moves(round_id);

-- RLS Policies
ALTER TABLE game_moves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view moves from their rounds" ON game_moves
  FOR SELECT USING (
    round_id IN (
      SELECT id FROM game_rounds WHERE match_id IN (
        SELECT match_id FROM match_players WHERE user_id = auth.uid()
      )
    )
  );
```

### `game_state`

Real-time game state for active matches.

```sql
CREATE TABLE game_state (
  match_id UUID PRIMARY KEY REFERENCES matches(id) ON DELETE CASCADE,

  -- Current state
  current_round INTEGER DEFAULT 1,
  current_player_position INTEGER NOT NULL,
  chain_left_end INTEGER, -- 0-9 or NULL
  chain_right_end INTEGER, -- 0-9 or NULL
  consecutive_passes INTEGER DEFAULT 0,

  -- Player hands (encrypted JSON)
  hands JSONB NOT NULL, -- { "0": [tiles], "1": [tiles], ... }

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_game_state_match ON game_state(match_id);

-- RLS Policies
ALTER TABLE game_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view game state" ON game_state
  FOR SELECT USING (
    match_id IN (
      SELECT match_id FROM match_players WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Players can update game state" ON game_state
  FOR UPDATE USING (
    match_id IN (
      SELECT match_id FROM match_players WHERE user_id = auth.uid()
    )
  );
```

### `chat_messages`

Ephemeral chat messages (deleted after match).

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  message_type TEXT NOT NULL DEFAULT 'text', -- 'text' | 'gif' | 'lingo'
  content TEXT NOT NULL,
  gif_url TEXT, -- For GIF messages

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Auto-delete after match

  CONSTRAINT valid_message_type CHECK (message_type IN ('text', 'gif', 'lingo'))
);

CREATE INDEX idx_chat_messages_match ON chat_messages(match_id, created_at);
CREATE INDEX idx_chat_messages_expires ON chat_messages(expires_at) WHERE expires_at IS NOT NULL;

-- RLS Policies
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view match chat" ON chat_messages
  FOR SELECT USING (
    match_id IN (
      SELECT match_id FROM match_players WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Players can send messages" ON chat_messages
  FOR INSERT WITH CHECK (
    match_id IN (
      SELECT match_id FROM match_players WHERE user_id = auth.uid()
    ) AND user_id = auth.uid()
  );
```

### `friendships`

Friend connections between users.

```sql
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'accepted' | 'blocked'

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT no_self_friendship CHECK (user_id != friend_id),
  CONSTRAINT unique_friendship UNIQUE(user_id, friend_id),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'blocked'))
);

CREATE INDEX idx_friendships_user ON friendships(user_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- RLS Policies
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their friendships" ON friendships
  FOR SELECT USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "Users can create friendship requests" ON friendships
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their friendships" ON friendships
  FOR UPDATE USING (user_id = auth.uid() OR friend_id = auth.uid());
```

## Functions

### Update CDS after match

```sql
CREATE OR REPLACE FUNCTION update_player_cds(
  p_user_id UUID,
  p_mode TEXT,
  p_cds_change INTEGER
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_mode = '1v1' THEN
    UPDATE users
    SET
      cds_1v1 = cds_1v1 + p_cds_change,
      cds_overall = (cds_1v1 + cds_2v2) / 2
    WHERE id = p_user_id;
  ELSIF p_mode = '2v2' THEN
    UPDATE users
    SET
      cds_2v2 = cds_2v2 + p_cds_change,
      cds_overall = (cds_1v1 + cds_2v2) / 2
    WHERE id = p_user_id;
  END IF;
END;
$$;
```

### Clean up expired chat messages

```sql
CREATE OR REPLACE FUNCTION cleanup_expired_chat()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM chat_messages
  WHERE expires_at < NOW();
END;
$$;

-- Schedule cleanup (run every hour)
-- This would be set up via Supabase cron or external scheduler
```

## Realtime Subscriptions

Enable realtime for active game tables:

```sql
-- Enable realtime for game state
ALTER PUBLICATION supabase_realtime ADD TABLE game_state;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
```

## Setup Instructions

1. Create a new Supabase project
2. Run these SQL commands in the SQL Editor
3. Set up authentication providers (Google, Facebook, Email)
4. Configure environment variables in your app:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Enable Row Level Security for all tables
6. Set up realtime subscriptions in your client code

## Notes

- All timestamps are UTC
- Chat messages expire after match completion (set `expires_at`)
- CDS (Cuban Domino Score) starts at 1500 for all players
- Player positions: 0 = bottom, 1 = left, 2 = top, 3 = right (in 2v2)
- Teams in 2v2: Team 0 = positions 0&2, Team 1 = positions 1&3
