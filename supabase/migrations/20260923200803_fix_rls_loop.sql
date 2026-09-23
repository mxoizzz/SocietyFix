-- Replace the broken policy
DROP POLICY IF EXISTS "profiles_select_own_or_same_society" ON public.profiles;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());
