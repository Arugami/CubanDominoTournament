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
-- TEAM INVITES (safe)
-- =========================
DO $$
BEGIN
  IF to_regclass('public.team_invites') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can send team invites" ON public.team_invites';
    EXECUTE 'DROP POLICY IF EXISTS "Recipients can update invite status" ON public.team_invites';

    EXECUTE $policy$
      CREATE POLICY "Registered players can send team invites"
        ON public.team_invites FOR INSERT
        WITH CHECK (
          public.cdl_is_registered_player()
          AND public.cdl_current_player_name() = from_player
        )
    $policy$;

    EXECUTE $policy$
      CREATE POLICY "Invite participants can update status"
        ON public.team_invites FOR UPDATE
        USING (
          public.cdl_is_registered_player()
          AND (
            public.cdl_current_player_name() = from_player
            OR public.cdl_current_player_name() = to_player
          )
        )
        WITH CHECK (
          status IN ('accepted', 'declined', 'expired')
          AND (
            public.cdl_current_player_name() = from_player
            OR public.cdl_current_player_name() = to_player
          )
        )
    $policy$;
  END IF;
END $$;

-- =========================
-- TEAMS (safe; only applies to the La Mesa teams schema)
-- =========================
DO $$
BEGIN
  IF to_regclass('public.teams') IS NOT NULL
     AND EXISTS (
       SELECT 1
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = 'teams'
         AND column_name = 'player1_name'
     )
  THEN
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can create teams" ON public.teams';
    EXECUTE $policy$
      CREATE POLICY "Registered players can create teams"
        ON public.teams FOR INSERT
        WITH CHECK (
          public.cdl_is_registered_player()
          AND (
            public.cdl_current_player_name() = player1_name
            OR public.cdl_current_player_name() = player2_name
          )
        )
    $policy$;
  END IF;
END $$;
