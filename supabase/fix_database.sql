-- 1. FIX THE INFINITE RECURSION BUG ON PROFILES
-- There was a database-level circular loop that caused Supabase to crash 
-- every time the app tried to load your profile or Issues! 
DROP POLICY IF EXISTS "profiles_select_own_or_same_society" ON public.profiles;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

-- 2. ENSURE THE AUTHENTICATION TRIGGER IS PERFECT
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, flat_number, society_id)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'flat_number', ''),
    (new.raw_user_meta_data->>'society_id')::uuid
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'role', 'resident')::public.app_role
  );
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. SEED THE DASHBOARD IMMEDIATELY WITH TEST DATA
DO $$
DECLARE
  v_society_id UUID;
  v_issue1_id UUID;
  v_issue2_id UUID;
  v_issue3_id UUID;
BEGIN
  -- Grab the latest society created (to bypass any broken early ones)
  SELECT id INTO v_society_id FROM public.societies ORDER BY created_at DESC LIMIT 1;
  
  IF v_society_id IS NOT NULL THEN
      -- Inject 3 gorgeous test cases
      INSERT INTO public.issues (society_id, title, description, flat_number, category, status, reporter_name, created_at, updated_at)
      VALUES (v_society_id, 'Low water pressure on upper floors', 'Pressure drops sharply between 7:00 and 9:00 am in flats above the seventh floor.', 'B-902', 'plumbing', 'in_progress', 'Priya Nair', now() - interval '2 days', now() - interval '12 hours') RETURNING id INTO v_issue1_id;

      INSERT INTO public.issue_status_events (issue_id, status, actor, created_at) VALUES (v_issue1_id, 'reported', 'Priya Nair', now() - interval '2 days');
      INSERT INTO public.issue_notes (issue_id, text, author, created_at) VALUES (v_issue1_id, 'Pump contractor inspected the pressure valves. Replacement parts are expected tomorrow.', 'Secretary', now() - interval '12 hours');

      INSERT INTO public.issues (society_id, title, description, flat_number, category, status, reporter_name, created_at, updated_at)
      VALUES (v_society_id, 'Main gate intercom not connecting to flats', 'The visitor intercom at the main gate rings but does not connect.', 'A-304', 'security', 'reported', 'Rohan Shah', now() - interval '3 hours', now() - interval '3 hours') RETURNING id INTO v_issue2_id;

      INSERT INTO public.issues (society_id, title, description, flat_number, category, status, reporter_name, created_at, updated_at)
      VALUES (v_society_id, 'Basement lights flickering near ramp', 'Three tube lights near the basement entry ramp flicker continuously.', 'C-1102', 'electrical', 'resolved', 'Nisha Kapoor', now() - interval '5 days', now() - interval '1 day') RETURNING id INTO v_issue3_id;
  END IF;
END $$;
