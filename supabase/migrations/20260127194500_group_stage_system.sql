-- ============================================
-- GROUP STAGE + FINALS TOURNAMENT SYSTEM (CDL 1)
-- 8 teams -> 2 groups of 4 -> semis -> final
-- ============================================

-- ============================================
-- PHASE 1: TEAM + MATCH GROUPING
-- ============================================

-- Assign each team to Group A or Group B
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS group_code TEXT;

ALTER TABLE teams
  DROP CONSTRAINT IF EXISTS teams_group_code_check;

ALTER TABLE teams
  ADD CONSTRAINT teams_group_code_check
  CHECK (group_code IS NULL OR group_code IN ('A', 'B'));

CREATE INDEX IF NOT EXISTS idx_teams_group_code ON teams(group_code);

-- Add group code to matches for group-stage scheduling
ALTER TABLE matches
  ADD COLUMN IF NOT EXISTS group_code TEXT;

ALTER TABLE matches
  DROP CONSTRAINT IF EXISTS matches_group_code_check;

ALTER TABLE matches
  ADD CONSTRAINT matches_group_code_check
  CHECK (
    (phase != 'group')
    OR (group_code IN ('A', 'B') AND round_robin_round IS NOT NULL)
  );

CREATE INDEX IF NOT EXISTS idx_matches_group_code ON matches(group_code) WHERE group_code IS NOT NULL;

-- Expand phase constraint to include group stage
ALTER TABLE matches
  DROP CONSTRAINT IF EXISTS matches_phase_check;

ALTER TABLE matches
  ADD CONSTRAINT matches_phase_check
  CHECK (phase IN ('group', 'round_robin', 'finals'));

-- ============================================
-- PHASE 2: FIX MATCH UNIQUENESS
-- The original UNIQUE(round, match_number) blocks
-- having both group stage + finals matches.
-- ============================================

ALTER TABLE matches
  DROP CONSTRAINT IF EXISTS matches_round_match_number_key;

DROP INDEX IF EXISTS matches_round_match_number_key;

-- If the unique constraint exists but under a different name, drop it as well.
ALTER TABLE matches
  DROP CONSTRAINT IF EXISTS matches_round_match_number_unique;

-- Finals: unique by (phase, round, match_number)
CREATE UNIQUE INDEX IF NOT EXISTS matches_finals_unique
  ON matches(phase, round, match_number)
  WHERE phase = 'finals';

-- Group stage: unique by (phase, group, matchday, match_number)
CREATE UNIQUE INDEX IF NOT EXISTS matches_group_unique
  ON matches(phase, group_code, round_robin_round, match_number)
  WHERE phase = 'group';

-- Helpful query indexes
CREATE INDEX IF NOT EXISTS idx_matches_group_round
  ON matches(round_robin_round)
  WHERE phase = 'group';

-- ============================================
-- PHASE 3: STANDINGS (GROUP STAGE)
-- ============================================

CREATE OR REPLACE VIEW group_standings AS
SELECT
  group_code,
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
    m.group_code,
    m.team1_id as team_id,
    m.winner_id = m.team1_id as is_winner,
    m.winner_id,
    m.team1_score as points_for,
    m.team2_score as points_against
  FROM matches m
  WHERE m.phase = 'group'
    AND m.status = 'completed'
    AND m.team1_id IS NOT NULL

  UNION ALL

  -- Team 2 perspective
  SELECT
    m.group_code,
    m.team2_id as team_id,
    m.winner_id = m.team2_id as is_winner,
    m.winner_id,
    m.team2_score as points_for,
    m.team1_score as points_against
  FROM matches m
  WHERE m.phase = 'group'
    AND m.status = 'completed'
    AND m.team2_id IS NOT NULL
) as team_results
GROUP BY group_code, team_id;

-- Back-compat: standings now reflects group standings totals
CREATE OR REPLACE VIEW standings AS
SELECT
  gs.team_id,
  gs.group_code,
  gs.wins,
  gs.losses,
  gs.points_for,
  gs.points_against,
  gs.point_diff,
  gs.games_played
FROM group_standings gs;

-- ============================================
-- PHASE 4: RPC - ASSIGN GROUPS + GENERATE MATCHES
-- 2 groups of 4, 3 matchdays each, 2 matches/day.
-- Group assignment uses a "snake" seed split:
--   Group A: 1,4,5,8
--   Group B: 2,3,6,7
-- ============================================

CREATE OR REPLACE FUNCTION assign_teams_to_group_stage()
RETURNS void AS $$
DECLARE
  seeded UUID[];
  group_a UUID[];
  group_b UUID[];
  schedule INTEGER[][];
  g TEXT;
  i INTEGER;
  matchday INTEGER;
  match_num INTEGER;
  pos1 INTEGER;
  pos2 INTEGER;
  t1 UUID;
  t2 UUID;
BEGIN
  -- Get seeded teams (need exactly 8)
  SELECT ARRAY(
    SELECT id FROM teams WHERE seed IS NOT NULL ORDER BY seed LIMIT 8
  ) INTO seeded;

  IF array_length(seeded, 1) < 8 THEN
    RAISE EXCEPTION 'Need exactly 8 seeded teams for group stage. Currently have %',
      COALESCE(array_length(seeded, 1), 0);
  END IF;

  -- Snake split for balanced groups
  group_a := ARRAY[seeded[1], seeded[4], seeded[5], seeded[8]];
  group_b := ARRAY[seeded[2], seeded[3], seeded[6], seeded[7]];

  -- Persist group membership on teams
  UPDATE teams SET group_code = NULL WHERE id = ANY(seeded);
  UPDATE teams SET group_code = 'A' WHERE id = ANY(group_a);
  UPDATE teams SET group_code = 'B' WHERE id = ANY(group_b);

  -- Clear any previous group-stage / legacy round robin matches
  DELETE FROM matches WHERE phase IN ('group', 'round_robin');

  -- 4-team round robin schedule (positions 1..4, 3 rounds, 2 matches each)
  -- Day 1: 1v4, 2v3
  -- Day 2: 1v3, 4v2
  -- Day 3: 1v2, 3v4
  schedule := ARRAY[
    ARRAY[1, 4], ARRAY[2, 3],
    ARRAY[1, 3], ARRAY[4, 2],
    ARRAY[1, 2], ARRAY[3, 4]
  ];

  FOREACH g IN ARRAY ARRAY['A', 'B']
  LOOP
    FOR i IN 1..6 LOOP
      matchday := ((i - 1) / 2) + 1; -- 1..3
      match_num := ((i - 1) % 2) + 1; -- 1..2

      pos1 := schedule[i][1];
      pos2 := schedule[i][2];

      IF g = 'A' THEN
        t1 := group_a[pos1];
        t2 := group_a[pos2];
      ELSE
        t1 := group_b[pos1];
        t2 := group_b[pos2];
      END IF;

      INSERT INTO matches (
        phase,
        group_code,
        round_robin_round,
        match_number,
        round,
        status,
        team1_id,
        team2_id,
        team1_score,
        team2_score,
        winner_id,
        completed_at
      ) VALUES (
        'group',
        g,
        matchday,
        match_num,
        1,
        'pending',
        t1,
        t2,
        0,
        0,
        NULL,
        NULL
      );
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PHASE 5: RPC - SEED FINALS FROM GROUPS
-- Semis:
--   Semi 1: A1 vs B2
--   Semi 2: B1 vs A2
-- ============================================

CREATE OR REPLACE FUNCTION seed_finals_from_group_standings()
RETURNS void AS $$
DECLARE
  completed_count INTEGER;
  a1 UUID;
  a2 UUID;
  b1 UUID;
  b2 UUID;
BEGIN
  SELECT COUNT(*) INTO completed_count
  FROM matches
  WHERE phase = 'group' AND status = 'completed';

  IF completed_count < 12 THEN
    RAISE EXCEPTION 'Complete group stage first (%/12 matches completed)', completed_count;
  END IF;

  WITH ranked AS (
    SELECT
      gs.group_code,
      gs.team_id,
      ROW_NUMBER() OVER (
        PARTITION BY gs.group_code
        ORDER BY gs.wins DESC, gs.point_diff DESC, gs.points_for DESC, t.seed ASC
      ) AS rnk
    FROM group_standings gs
    JOIN teams t ON t.id = gs.team_id
    WHERE gs.group_code IN ('A', 'B')
  )
  SELECT
    MAX(CASE WHEN group_code = 'A' AND rnk = 1 THEN team_id END),
    MAX(CASE WHEN group_code = 'A' AND rnk = 2 THEN team_id END),
    MAX(CASE WHEN group_code = 'B' AND rnk = 1 THEN team_id END),
    MAX(CASE WHEN group_code = 'B' AND rnk = 2 THEN team_id END)
  INTO a1, a2, b1, b2
  FROM ranked;

  IF a1 IS NULL OR a2 IS NULL OR b1 IS NULL OR b2 IS NULL THEN
    RAISE EXCEPTION 'Need top 2 teams from each group to seed finals';
  END IF;

  -- Semi 1: A1 vs B2
  UPDATE matches SET
    team1_id = a1,
    team2_id = b2,
    team1_score = 0,
    team2_score = 0,
    winner_id = NULL,
    status = 'pending',
    completed_at = NULL
  WHERE phase = 'finals' AND round = 1 AND match_number = 1;

  -- Semi 2: B1 vs A2
  UPDATE matches SET
    team1_id = b1,
    team2_id = a2,
    team1_score = 0,
    team2_score = 0,
    winner_id = NULL,
    status = 'pending',
    completed_at = NULL
  WHERE phase = 'finals' AND round = 1 AND match_number = 2;

  -- Reset the final slot
  UPDATE matches SET
    team1_id = NULL,
    team2_id = NULL,
    team1_score = 0,
    team2_score = 0,
    winner_id = NULL,
    status = 'pending',
    completed_at = NULL
  WHERE phase = 'finals' AND round = 2 AND match_number = 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PHASE 6: BACK-COMPAT RPC NAMES
-- ============================================

CREATE OR REPLACE FUNCTION assign_teams_to_round_robin()
RETURNS void AS $$
BEGIN
  PERFORM assign_teams_to_group_stage();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION seed_finals_from_standings()
RETURNS void AS $$
BEGIN
  PERFORM seed_finals_from_group_standings();
END;
$$ LANGUAGE plpgsql;

