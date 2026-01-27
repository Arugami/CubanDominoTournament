-- ============================================
-- CDL La Mesa: Login-required policies
-- Enforce that only registered players can write
-- ============================================

-- Helper: Is the current authenticated user a registered/confirmed player?
CREATE OR REPLACE FUNCTION public.cdl_is_registered_player()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.players p
    WHERE lower(p.email) = lower(auth.jwt() ->> 'email')
      AND p.status IN ('registered', 'confirmed')
  );
$$;

-- Helper: Current player's registered name (by auth email)
CREATE OR REPLACE FUNCTION public.cdl_current_player_name()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT p.name
  FROM public.players p
  WHERE lower(p.email) = lower(auth.jwt() ->> 'email')
  LIMIT 1;
$$;

-- Helper: Current player's id (by auth email)
CREATE OR REPLACE FUNCTION public.cdl_current_player_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT p.id
  FROM public.players p
  WHERE lower(p.email) = lower(auth.jwt() ->> 'email')
  LIMIT 1;
$$;

-- =========================
-- MESSAGES (safe)
-- =========================
DO $$
BEGIN
  IF to_regclass('public.messages') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can send messages" ON public.messages';
    EXECUTE $policy$
      CREATE POLICY "Registered players can send messages"
        ON public.messages FOR INSERT
        WITH CHECK (public.cdl_is_registered_player())
    $policy$;
  END IF;
END $$;

-- =========================
-- MESA TEAM INVITES (safe)
-- =========================
DO $$
BEGIN
  IF to_regclass('public.mesa_team_invites') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can view mesa invites" ON public.mesa_team_invites';
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can send mesa invites" ON public.mesa_team_invites';
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can update mesa invites" ON public.mesa_team_invites';

    EXECUTE $policy$
      CREATE POLICY "Registered players can view mesa invites"
        ON public.mesa_team_invites FOR SELECT
        USING (
          public.cdl_is_registered_player()
          AND (
            public.cdl_current_player_id() = from_player_id
            OR public.cdl_current_player_id() = to_player_id
          )
        )
    $policy$;

    EXECUTE $policy$
      CREATE POLICY "Registered players can send mesa invites"
        ON public.mesa_team_invites FOR INSERT
        WITH CHECK (
          public.cdl_is_registered_player()
          AND public.cdl_current_player_id() = from_player_id
          AND public.cdl_current_player_name() = from_player
        )
    $policy$;

    EXECUTE $policy$
      CREATE POLICY "Mesa invite participants can update status"
        ON public.mesa_team_invites FOR UPDATE
        USING (
          public.cdl_is_registered_player()
          AND (
            public.cdl_current_player_id() = from_player_id
            OR public.cdl_current_player_id() = to_player_id
          )
        )
        WITH CHECK (
          status IN ('accepted', 'declined', 'expired')
          AND (
            public.cdl_current_player_id() = from_player_id
            OR public.cdl_current_player_id() = to_player_id
          )
        )
    $policy$;
  END IF;
END $$;

-- =========================
-- MESA TEAMS (safe)
-- =========================
DO $$
BEGIN
  IF to_regclass('public.mesa_teams') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can create mesa teams" ON public.mesa_teams';
    EXECUTE $policy$
      CREATE POLICY "Registered players can create mesa teams"
        ON public.mesa_teams FOR INSERT
        WITH CHECK (
          public.cdl_is_registered_player()
          AND (
            public.cdl_current_player_id() = player1_id
            OR public.cdl_current_player_id() = player2_id
          )
        )
    $policy$;
  END IF;
END $$;
