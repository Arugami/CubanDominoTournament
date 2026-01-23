-- ===========================================
-- TEAMS SYSTEM - La Mesa Team Formation
-- "Dominoes is about teams. Make it a BIG moment."
-- ===========================================

-- Teams table - stores formed teams with their identity
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  archetype TEXT NOT NULL CHECK (archetype IN (
    'los_viejos',     -- The Wise Ones
    'los_venenos',    -- The Poisoners
    'la_tranca',      -- The Blockers
    'la_carreta',     -- The Rollers
    'los_capicuas',   -- The Precision
    'los_pesados',    -- The Heavy Hitters
    'los_amarradores', -- The Trappers
    'la_mula'         -- The Mules
  )),
  player1_name TEXT NOT NULL,
  player2_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure no duplicate team memberships
  CONSTRAINT unique_player1 UNIQUE (player1_name),
  CONSTRAINT unique_player2 UNIQUE (player2_name)
);

-- Team invites table - tracks pending/accepted/declined invitations
CREATE TABLE IF NOT EXISTS team_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_player TEXT NOT NULL,
  to_player TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,

  -- Prevent duplicate pending invites
  CONSTRAINT unique_pending_invite UNIQUE (from_player, to_player, status)
    DEFERRABLE INITIALLY DEFERRED
);

-- Add team-related columns to messages table for whispers
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS is_team_whisper BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id);

-- Create index for team whispers (filtered queries)
CREATE INDEX IF NOT EXISTS idx_messages_team_whisper
  ON messages(team_id, is_team_whisper)
  WHERE is_team_whisper = true;

-- Index for team invites by player
CREATE INDEX IF NOT EXISTS idx_team_invites_to_player
  ON team_invites(to_player, status)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_team_invites_from_player
  ON team_invites(from_player);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

-- Teams: Everyone can view, only team members can create/manage
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams are viewable by everyone"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create teams"
  ON teams FOR INSERT
  WITH CHECK (true);

-- Team invites: View own invites, create invites
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team invites viewable by participants"
  ON team_invites FOR SELECT
  USING (true);  -- For La Mesa public announcements

CREATE POLICY "Anyone can send team invites"
  ON team_invites FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Recipients can update invite status"
  ON team_invites FOR UPDATE
  USING (true)
  WITH CHECK (status IN ('accepted', 'declined', 'expired'));

-- ===========================================
-- REALTIME SUBSCRIPTIONS
-- ===========================================

-- Enable realtime for team-related events
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE team_invites;

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Function to get a player's team (if any)
CREATE OR REPLACE FUNCTION get_player_team(player_name_param TEXT)
RETURNS TABLE (
  team_id UUID,
  team_name TEXT,
  archetype TEXT,
  teammate_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    t.archetype,
    CASE
      WHEN t.player1_name = player_name_param THEN t.player2_name
      ELSE t.player1_name
    END as teammate_name
  FROM teams t
  WHERE t.player1_name = player_name_param
     OR t.player2_name = player_name_param;
END;
$$ LANGUAGE plpgsql;

-- Function to check if player has pending invites
CREATE OR REPLACE FUNCTION get_pending_invites(player_name_param TEXT)
RETURNS TABLE (
  invite_id UUID,
  from_player TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ti.id,
    ti.from_player,
    ti.created_at
  FROM team_invites ti
  WHERE ti.to_player = player_name_param
    AND ti.status = 'pending'
    AND ti.created_at > NOW() - INTERVAL '24 hours';  -- Invites expire after 24h
END;
$$ LANGUAGE plpgsql;
