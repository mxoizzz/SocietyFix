-- Database Expansion for Dashboard Residents View & Settings
-- This securely grants the Secretary access to list members and update configurations without risking recursion bugs!

-- 1. Create a Secure Function to fetch Residents
-- Using SECURITY DEFINER allows it to bypass row-level-security restrictions on the profiles table, safely resolving the list!
CREATE OR REPLACE FUNCTION public.get_society_residents()
RETURNS TABLE (id UUID, name TEXT, flat_number TEXT, joined_at TIMESTAMPTZ) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.flat_number, p.created_at
  FROM public.profiles p
  INNER JOIN public.user_roles r ON p.id = r.user_id
  WHERE p.society_id = (
    SELECT society_id FROM public.profiles WHERE id = auth.uid()
  )
  -- Specifically filter only residents, not admins
  AND r.role = 'resident';
END;
$$ LANGUAGE plpgsql;

-- 2. Allow Society Update modifications for Settings Page
CREATE POLICY "societies_update" ON public.societies FOR UPDATE TO authenticated
USING (
  id = (SELECT society_id FROM public.profiles WHERE id = auth.uid())
);
