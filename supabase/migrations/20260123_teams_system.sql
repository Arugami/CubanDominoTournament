-- ===========================================
-- LA MESA TEAM FORMATION (NAMESPACED)
-- Avoid collision with tournament `teams` table.
-- ===========================================

-- Teams formed in La Mesa (two registered players)
CREATE TABLE IF NOT EXISTS mesa_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  archetype TEXT NOT NULL CHECK (archetype IN (
    'los_viejos',
    'los_venenos',
    'la_tranca',
    'la_carreta',
    'los_capicuas',
    'los_pesados',
    'los_amarradores',
    'la_mula'
  )),
  player1_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  player2_id UUID NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
  player1_name TEXT NOT NULL,
  player2_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Deterministic ordering: enforce player1_id < player2_id (text compare)
  CONSTRAINT mesa_team_order CHECK (player1_id::text < player2_id::text),

  -- Ensure no duplicate memberships
  CONSTRAINT mesa_unique_player1 UNIQUE (player1_id),
  CONSTRAINT mesa_unique_player2 UNIQUE (player2_id),
  CONSTRAINT mesa_unique_pair UNIQUE (player1_id, player2_id)
);

-- Invites sent in La Mesa (pending/accepted/declined/expired)
CREATE TABLE IF NOT EXISTS mesa_team_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  to_player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  from_player TEXT NOT NULL,
  to_player TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,

  -- Prevent duplicate pending invites
  CONSTRAINT mesa_unique_pending_invite UNIQUE (from_player_id, to_player_id, status)
    DEFERRABLE INITIALLY DEFERRED
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_mesa_invites_to_player
  ON mesa_team_invites(to_player_id, status)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_mesa_invites_from_player
  ON mesa_team_invites(from_player_id);

CREATE INDEX IF NOT EXISTS idx_mesa_teams_player1
  ON mesa_teams(player1_id);

CREATE INDEX IF NOT EXISTS idx_mesa_teams_player2
  ON mesa_teams(player2_id);

-- ===========================================
-- ROW LEVEL SECURITY (baseline; tightened later)
-- ===========================================

ALTER TABLE mesa_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesa_team_invites ENABLE ROW LEVEL SECURITY;

-- Teams are viewable (names are already public-facing in the room)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'mesa_teams' AND policyname = 'Mesa teams are viewable by everyone'
  ) THEN
    EXECUTE 'CREATE POLICY "Mesa teams are viewable by everyone" ON mesa_teams FOR SELECT USING (true)';
  END IF;
END $$;

-- Baseline: only authenticated users can create teams/invites (tightened in 20260126_mesa_player_auth.sql)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'mesa_teams' AND policyname = 'Authenticated users can create mesa teams'
  ) THEN
    EXECUTE 'CREATE POLICY "Authenticated users can create mesa teams" ON mesa_teams FOR INSERT WITH CHECK (auth.role() = ''authenticated'')';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'mesa_team_invites' AND policyname = 'Authenticated users can view mesa invites'
  ) THEN
    EXECUTE 'CREATE POLICY "Authenticated users can view mesa invites" ON mesa_team_invites FOR SELECT USING (auth.role() = ''authenticated'')';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'mesa_team_invites' AND policyname = 'Authenticated users can send mesa invites'
  ) THEN
    EXECUTE 'CREATE POLICY "Authenticated users can send mesa invites" ON mesa_team_invites FOR INSERT WITH CHECK (auth.role() = ''authenticated'')';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'mesa_team_invites' AND policyname = 'Authenticated users can update mesa invites'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Authenticated users can update mesa invites"
        ON mesa_team_invites FOR UPDATE
        USING (auth.role() = 'authenticated')
        WITH CHECK (status IN ('accepted', 'declined', 'expired'))
    $policy$;
  END IF;
END $$;

-- ===========================================
-- REALTIME SUBSCRIPTIONS
-- ===========================================

ALTER PUBLICATION supabase_realtime ADD TABLE mesa_teams;
ALTER PUBLICATION supabase_realtime ADD TABLE mesa_team_invites;
