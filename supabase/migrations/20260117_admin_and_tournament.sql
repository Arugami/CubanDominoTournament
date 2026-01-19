-- ============================================
-- ADMIN DASHBOARD + LA MESA MEMBER HUB
-- Database Schema Migration
-- ============================================

-- ============================================
-- ADMIN USERS TABLE
-- Controls access to /admin dashboard
-- ============================================
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Index for email lookups during auth
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can view admin list
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

-- ============================================
-- PLAYERS TABLE
-- Registered tournament players
-- ============================================
CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'waitlist', 'cancelled')),
  team_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_players_email ON players(email);
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_players_status ON players(status);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Public can read players (for LA MESA member verification)
CREATE POLICY "Players are viewable by everyone"
  ON players FOR SELECT
  USING (true);

-- Only admins can modify players
CREATE POLICY "Admins can insert players"
  ON players FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

CREATE POLICY "Admins can update players"
  ON players FOR UPDATE
  USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

CREATE POLICY "Admins can delete players"
  ON players FOR DELETE
  USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

-- ============================================
-- TEAMS TABLE
-- Two-player team pairings
-- ============================================
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  player1_id UUID REFERENCES players(id) ON DELETE SET NULL,
  player2_id UUID REFERENCES players(id) ON DELETE SET NULL,
  seed INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key to players table
ALTER TABLE players ADD CONSTRAINT fk_players_team
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX idx_teams_seed ON teams(seed);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Public can read teams (for bracket display)
CREATE POLICY "Teams are viewable by everyone"
  ON teams FOR SELECT
  USING (true);

-- Only admins can modify teams
CREATE POLICY "Admins can insert teams"
  ON teams FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

CREATE POLICY "Admins can update teams"
  ON teams FOR UPDATE
  USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

CREATE POLICY "Admins can delete teams"
  ON teams FOR DELETE
  USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

-- ============================================
-- MATCHES TABLE
-- Tournament bracket (single elimination)
-- 8 teams = 7 matches (4 QF + 2 SF + 1 Final)
-- ============================================
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  round INTEGER NOT NULL CHECK (round >= 1 AND round <= 3),
  match_number INTEGER NOT NULL,
  team1_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  team2_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  team1_score INTEGER DEFAULT 0,
  team2_score INTEGER DEFAULT 0,
  winner_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(round, match_number)
);

-- Indexes
CREATE INDEX idx_matches_round ON matches(round);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_winner ON matches(winner_id);

-- Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Public can read matches (for bracket display)
CREATE POLICY "Matches are viewable by everyone"
  ON matches FOR SELECT
  USING (true);

-- Only admins can modify matches
CREATE POLICY "Admins can insert matches"
  ON matches FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

CREATE POLICY "Admins can update matches"
  ON matches FOR UPDATE
  USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

CREATE POLICY "Admins can delete matches"
  ON matches FOR DELETE
  USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

-- ============================================
-- ANNOUNCEMENTS TABLE
-- Admin-controlled ticker messages
-- ============================================
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'alert', 'winner', 'hype')),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for active announcements query
CREATE INDEX idx_announcements_active ON announcements(is_active, priority DESC) WHERE is_active = true;

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Public can read active announcements (for ticker)
CREATE POLICY "Active announcements are viewable by everyone"
  ON announcements FOR SELECT
  USING (is_active = true OR auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

-- Only admins can modify announcements
CREATE POLICY "Admins can insert announcements"
  ON announcements FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

CREATE POLICY "Admins can update announcements"
  ON announcements FOR UPDATE
  USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

CREATE POLICY "Admins can delete announcements"
  ON announcements FOR DELETE
  USING (
    auth.jwt() ->> 'email' IN (SELECT email FROM admin_users)
  );

-- ============================================
-- ENABLE REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;

-- ============================================
-- UPDATE TRIGGERS (auto-update updated_at)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL BRACKET SETUP
-- Pre-create the 7 matches for single elimination
-- ============================================
INSERT INTO matches (round, match_number, status) VALUES
  -- Quarterfinals (Round 1)
  (1, 1, 'pending'),
  (1, 2, 'pending'),
  (1, 3, 'pending'),
  (1, 4, 'pending'),
  -- Semifinals (Round 2)
  (2, 1, 'pending'),
  (2, 2, 'pending'),
  -- Finals (Round 3)
  (3, 1, 'pending');

-- ============================================
-- SEED INITIAL ADMIN
-- Add Erik as first admin (update email as needed)
-- ============================================
-- NOTE: Update this email before running migration
-- INSERT INTO admin_users (email, name, role) VALUES
--   ('erik@example.com', 'Erik', 'super_admin');
