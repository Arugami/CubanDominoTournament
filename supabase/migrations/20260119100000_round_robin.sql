-- ============================================
-- ROUND ROBIN + FINALS TOURNAMENT SYSTEM (LEGACY)
-- Extends matches table for two-phase tournament
-- ============================================

-- ============================================
-- PHASE 1: ALTER MATCHES TABLE
-- ============================================

-- Add phase column to distinguish round robin from finals
ALTER TABLE matches ADD COLUMN IF NOT EXISTS phase TEXT DEFAULT 'finals'
  CHECK (phase IN ('round_robin', 'finals'));

-- Add round_robin_round for scheduling (1-7 rounds for 8 teams)
ALTER TABLE matches ADD COLUMN IF NOT EXISTS round_robin_round INTEGER
  CHECK (round_robin_round IS NULL OR (round_robin_round >= 1 AND round_robin_round <= 7));

-- Update the round constraint for finals (now 1-2 instead of 1-3 since only 4 teams)
-- Round 1 = Semifinals, Round 2 = Championship
-- Note: We keep the existing constraint, but interpret differently:
--   For finals: round 1 = Semi, round 2 = Final
--   For round_robin: round is not used (use round_robin_round instead)

-- Add index for phase-based queries
CREATE INDEX IF NOT EXISTS idx_matches_phase ON matches(phase);
CREATE INDEX IF NOT EXISTS idx_matches_rr_round ON matches(round_robin_round) WHERE phase = 'round_robin';

-- ============================================
-- IMPORTANT: Fix match uniqueness for two-phase tournaments
--
-- The original schema used UNIQUE(round, match_number), which
-- conflicts once we store BOTH finals matches (round 1, match 1..2)
-- AND round robin matches (round 1, match 1..28).
--
-- We replace it with phase-scoped uniqueness.
-- ============================================

-- Drop the original uniqueness (created in 20260117_admin_and_tournament.sql)
ALTER TABLE matches
  DROP CONSTRAINT IF EXISTS matches_round_match_number_key;

DROP INDEX IF EXISTS matches_round_match_number_key;

-- Finals: unique by (phase, round, match_number)
CREATE UNIQUE INDEX IF NOT EXISTS matches_finals_unique
  ON matches(phase, round, match_number)
  WHERE phase = 'finals';

-- Round robin: unique by (phase, match_number)
CREATE UNIQUE INDEX IF NOT EXISTS matches_round_robin_unique
  ON matches(phase, match_number)
  WHERE phase = 'round_robin';

-- ============================================
-- PHASE 2: CREATE STANDINGS VIEW
-- Calculates W-L record and point differential
-- ============================================

CREATE OR REPLACE VIEW standings AS
SELECT
  team_id,
  COUNT(*) FILTER (WHERE is_winner) as wins,
  COUNT(*) FILTER (WHERE NOT is_winner AND winner_id IS NOT NULL) as losses,
  COALESCE(SUM(points_for), 0) as points_for,
  COALESCE(SUM(points_against), 0) as points_against,
  COALESCE(SUM(points_for), 0) - COALESCE(SUM(points_against), 0) as point_diff,
  COUNT(*) FILTER (WHERE winner_id IS NOT NULL) as games_played
FROM (
  -- Team 1 perspective
  SELECT
    m.team1_id as team_id,
    m.winner_id = m.team1_id as is_winner,
    m.winner_id,
    m.team1_score as points_for,
    m.team2_score as points_against
  FROM matches m
  WHERE m.phase = 'round_robin'
    AND m.status = 'completed'
    AND m.team1_id IS NOT NULL

  UNION ALL

  -- Team 2 perspective
  SELECT
    m.team2_id as team_id,
    m.winner_id = m.team2_id as is_winner,
    m.winner_id,
    m.team2_score as points_for,
    m.team1_score as points_against
  FROM matches m
  WHERE m.phase = 'round_robin'
    AND m.status = 'completed'
    AND m.team2_id IS NOT NULL
) as team_results
GROUP BY team_id;

-- ============================================
-- PHASE 3: CLEAR EXISTING BRACKET MATCHES
-- Remove old single-elimination structure
-- ============================================

DELETE FROM matches WHERE phase = 'finals' OR phase IS NULL;

-- ============================================
-- PHASE 4: INSERT FINALS MATCHES (3 total)
-- 4-team bracket: 2 Semifinals + 1 Final
-- ============================================

INSERT INTO matches (round, match_number, phase, status) VALUES
  -- Semifinals (Round 1)
  (1, 1, 'finals', 'pending'),  -- Semi 1: Seed 1 vs Seed 4
  (1, 2, 'finals', 'pending'),  -- Semi 2: Seed 2 vs Seed 3
  -- Championship (Round 2)
  (2, 1, 'finals', 'pending');  -- Final: Winner Semi 1 vs Winner Semi 2

-- ============================================
-- PHASE 5: ROUND ROBIN MATCH GENERATION
-- 28 matches (8 teams, 7 rounds)
-- Using circle/polygon scheduling method
-- ============================================

-- Function to generate round robin schedule
CREATE OR REPLACE FUNCTION generate_round_robin_schedule()
RETURNS void AS $$
DECLARE
  rr_round INTEGER;
  match_num INTEGER;
  -- Standard circle method schedule for 8 teams (0-indexed internally)
  -- Each round has 4 matches (8 teams / 2)
  schedule INTEGER[][];
BEGIN
  -- Circle method schedule (1-indexed team numbers):
  -- Round 1: 1v8, 2v7, 3v6, 4v5
  -- Round 2: 1v7, 8v6, 2v5, 3v4
  -- Round 3: 1v6, 7v5, 8v4, 2v3
  -- Round 4: 1v5, 6v4, 7v3, 8v2
  -- Round 5: 1v4, 5v3, 6v2, 7v8
  -- Round 6: 1v3, 4v2, 5v8, 6v7
  -- Round 7: 1v2, 3v8, 4v7, 5v6

  schedule := ARRAY[
    -- Round 1
    ARRAY[1, 8], ARRAY[2, 7], ARRAY[3, 6], ARRAY[4, 5],
    -- Round 2
    ARRAY[1, 7], ARRAY[8, 6], ARRAY[2, 5], ARRAY[3, 4],
    -- Round 3
    ARRAY[1, 6], ARRAY[7, 5], ARRAY[8, 4], ARRAY[2, 3],
    -- Round 4
    ARRAY[1, 5], ARRAY[6, 4], ARRAY[7, 3], ARRAY[8, 2],
    -- Round 5
    ARRAY[1, 4], ARRAY[5, 3], ARRAY[6, 2], ARRAY[7, 8],
    -- Round 6
    ARRAY[1, 3], ARRAY[4, 2], ARRAY[5, 8], ARRAY[6, 7],
    -- Round 7
    ARRAY[1, 2], ARRAY[3, 8], ARRAY[4, 7], ARRAY[5, 6]
  ];

  -- Insert round robin matches
  FOR i IN 1..28 LOOP
    rr_round := ((i - 1) / 4) + 1;
    match_num := ((i - 1) % 4) + 1;

    INSERT INTO matches (round, match_number, round_robin_round, phase, status)
    VALUES (
      1,  -- round is 1 for all round robin (not used for ordering, use round_robin_round)
      match_num + ((rr_round - 1) * 4),  -- unique match number 1-28
      rr_round,
      'round_robin',
      'pending'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to generate schedule
SELECT generate_round_robin_schedule();

-- Clean up the function (optional, can keep for re-generation)
-- DROP FUNCTION generate_round_robin_schedule();

-- ============================================
-- PHASE 6: HELPER FUNCTION - SEED FINALS
-- Seeds top 4 from standings into finals bracket
-- ============================================

CREATE OR REPLACE FUNCTION seed_finals_from_standings()
RETURNS void AS $$
DECLARE
  top4_teams UUID[];
  semi1 RECORD;
  semi2 RECORD;
BEGIN
  -- Get top 4 team IDs by wins, then point differential
  SELECT ARRAY(
    SELECT s.team_id
    FROM standings s
    JOIN teams t ON t.id = s.team_id
    ORDER BY s.wins DESC, s.point_diff DESC
    LIMIT 4
  ) INTO top4_teams;

  -- Validate we have 4 teams
  IF array_length(top4_teams, 1) < 4 THEN
    RAISE EXCEPTION 'Need at least 4 teams with completed round robin matches';
  END IF;

  -- Get semi matches
  SELECT * INTO semi1 FROM matches WHERE phase = 'finals' AND round = 1 AND match_number = 1;
  SELECT * INTO semi2 FROM matches WHERE phase = 'finals' AND round = 1 AND match_number = 2;

  -- Seed: Semi 1 = #1 vs #4, Semi 2 = #2 vs #3
  UPDATE matches SET
    team1_id = top4_teams[1],
    team2_id = top4_teams[4]
  WHERE id = semi1.id;

  UPDATE matches SET
    team1_id = top4_teams[2],
    team2_id = top4_teams[3]
  WHERE id = semi2.id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PHASE 7: TEAM ASSIGNMENT TO ROUND ROBIN
-- Function to assign teams to round robin matches
-- ============================================

CREATE OR REPLACE FUNCTION assign_teams_to_round_robin()
RETURNS void AS $$
DECLARE
  teams_array UUID[];
  schedule INTEGER[][];
  rr_match RECORD;
  match_idx INTEGER;
  seed1 INTEGER;
  seed2 INTEGER;
BEGIN
  -- Get seeded teams (need exactly 8)
  SELECT ARRAY(
    SELECT id FROM teams WHERE seed IS NOT NULL ORDER BY seed LIMIT 8
  ) INTO teams_array;

  IF array_length(teams_array, 1) < 8 THEN
    RAISE EXCEPTION 'Need exactly 8 seeded teams for round robin. Currently have %',
      COALESCE(array_length(teams_array, 1), 0);
  END IF;

  -- Schedule mapping (seed numbers for each match by round_robin_round and match within round)
  schedule := ARRAY[
    -- Round 1: matches 1-4
    ARRAY[1, 8], ARRAY[2, 7], ARRAY[3, 6], ARRAY[4, 5],
    -- Round 2: matches 5-8
    ARRAY[1, 7], ARRAY[8, 6], ARRAY[2, 5], ARRAY[3, 4],
    -- Round 3: matches 9-12
    ARRAY[1, 6], ARRAY[7, 5], ARRAY[8, 4], ARRAY[2, 3],
    -- Round 4: matches 13-16
    ARRAY[1, 5], ARRAY[6, 4], ARRAY[7, 3], ARRAY[8, 2],
    -- Round 5: matches 17-20
    ARRAY[1, 4], ARRAY[5, 3], ARRAY[6, 2], ARRAY[7, 8],
    -- Round 6: matches 21-24
    ARRAY[1, 3], ARRAY[4, 2], ARRAY[5, 8], ARRAY[6, 7],
    -- Round 7: matches 25-28
    ARRAY[1, 2], ARRAY[3, 8], ARRAY[4, 7], ARRAY[5, 6]
  ];

  -- Update each round robin match
  match_idx := 1;
  FOR rr_match IN
    SELECT * FROM matches
    WHERE phase = 'round_robin'
    ORDER BY round_robin_round, match_number
  LOOP
    seed1 := schedule[match_idx][1];
    seed2 := schedule[match_idx][2];

    UPDATE matches SET
      team1_id = teams_array[seed1],
      team2_id = teams_array[seed2]
    WHERE id = rr_match.id;

    match_idx := match_idx + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify match counts
DO $$
DECLARE
  rr_count INTEGER;
  finals_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO rr_count FROM matches WHERE phase = 'round_robin';
  SELECT COUNT(*) INTO finals_count FROM matches WHERE phase = 'finals';

  IF rr_count != 28 THEN
    RAISE NOTICE 'Warning: Expected 28 round robin matches, found %', rr_count;
  END IF;

  IF finals_count != 3 THEN
    RAISE NOTICE 'Warning: Expected 3 finals matches, found %', finals_count;
  END IF;

  RAISE NOTICE 'Migration complete: % round robin matches, % finals matches', rr_count, finals_count;
END $$;
