-- SocietyFix Multi-Tenant Schema

-- Drop all existing legacy tables to cleanly migrate to the Multi-Tenant architecture
DROP TABLE IF EXISTS public.issue_status_events CASCADE;
DROP TABLE IF EXISTS public.issue_notes CASCADE;
DROP TABLE IF EXISTS public.issue_upvotes CASCADE;
DROP TABLE IF EXISTS public.issues CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.societies CASCADE;

-- Drop existing types if recreating
DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.issue_status CASCADE;
DROP TYPE IF EXISTS public.issue_category CASCADE;

CREATE TYPE public.app_role AS ENUM ('resident', 'secretary');
CREATE TYPE public.issue_status AS ENUM ('reported', 'in_progress', 'resolved');
CREATE TYPE public.issue_category AS ENUM ('electrical', 'plumbing', 'cleanliness', 'security', 'other');

-- 1. Societies Table
CREATE TABLE public.societies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.societies TO authenticated;
GRANT SELECT, INSERT ON public.societies TO anon; -- Allow checking invite code before login
GRANT ALL ON public.societies TO service_role;
ALTER TABLE public.societies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "societies_read_all" ON public.societies FOR SELECT USING (true);
CREATE POLICY "societies_insert" ON public.societies FOR INSERT WITH CHECK (true);

-- 2. Profiles Table (Updated with Society linkage)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  society_id UUID REFERENCES public.societies(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  flat_number TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. User Roles Table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Utility Function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Profile & Role Policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'secretary'));
CREATE POLICY "roles_insert_own" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE SEQUENCE IF NOT EXISTS public.issue_ref_seq START 2461;

-- 4. Issues Table (Updated with Society linkage)
CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
  ref_code TEXT NOT NULL UNIQUE DEFAULT ('SF-' || nextval('public.issue_ref_seq')),
  reported_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reporter_name TEXT NOT NULL DEFAULT 'Resident',
  flat_number TEXT NOT NULL DEFAULT '',
  category public.issue_category NOT NULL DEFAULT 'other',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  status public.issue_status NOT NULL DEFAULT 'reported',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.issues TO authenticated;
GRANT ALL ON public.issues TO service_role;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Issue Policies (Viewable by anyone in the SAME society)
CREATE POLICY "issues_select_same_society" ON public.issues FOR SELECT TO authenticated
  USING (society_id = (SELECT society_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "issues_insert_same_society" ON public.issues FOR INSERT TO authenticated
  WITH CHECK (society_id = (SELECT society_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "issues_update_secretary" ON public.issues FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'secretary'))
  WITH CHECK (society_id = (SELECT society_id FROM public.profiles WHERE id = auth.uid()));

-- 5. Issue Upvotes (NEW)
CREATE TABLE public.issue_upvotes (
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (issue_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.issue_upvotes TO authenticated;
GRANT ALL ON public.issue_upvotes TO service_role;
ALTER TABLE public.issue_upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "upvotes_select" ON public.issue_upvotes FOR SELECT TO authenticated USING (true);
CREATE POLICY "upvotes_insert" ON public.issue_upvotes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "upvotes_delete" ON public.issue_upvotes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- 6. Issue Notes Table
CREATE TABLE public.issue_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author TEXT NOT NULL DEFAULT 'Secretary',
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.issue_notes TO authenticated;
GRANT ALL ON public.issue_notes TO service_role;
ALTER TABLE public.issue_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_select" ON public.issue_notes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.issues i WHERE i.id = issue_id AND i.society_id = (SELECT society_id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "notes_insert_secretary" ON public.issue_notes FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'secretary'));

-- Triggers for Real-time event tracking
CREATE TABLE public.issue_status_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  status public.issue_status NOT NULL,
  actor TEXT NOT NULL DEFAULT 'System',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.issue_status_events TO authenticated;
GRANT ALL ON public.issue_status_events TO service_role;
ALTER TABLE public.issue_status_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_select" ON public.issue_status_events FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.log_issue_status() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.issue_status_events (issue_id, status, actor, created_at)
    VALUES (NEW.id, NEW.status, NEW.reporter_name, NEW.created_at);
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.updated_at := now();
    INSERT INTO public.issue_status_events (issue_id, status, actor)
    VALUES (NEW.id, NEW.status, COALESCE((SELECT name FROM public.profiles WHERE id = auth.uid()), 'Secretary'));
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER issues_status_insert AFTER INSERT ON public.issues FOR EACH ROW EXECUTE FUNCTION public.log_issue_status();
CREATE TRIGGER issues_status_update BEFORE UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION public.log_issue_status();

ALTER PUBLICATION supabase_realtime ADD TABLE public.issues;
ALTER PUBLICATION supabase_realtime ADD TABLE public.issue_upvotes;

-- Auth Registration Hooks (Maps raw_user_meta_data to Profiles and Roles)
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
    (new.raw_user_meta_data->>'role')::public.app_role
  );
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Securely fetch residents for the calling Secretary's society
CREATE OR REPLACE FUNCTION public.get_society_residents()
RETURNS TABLE (
  id UUID,
  name TEXT,
  flat_number TEXT,
  joined_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.name, p.flat_number, p.created_at as joined_at
  FROM public.profiles p
  JOIN public.user_roles u ON u.user_id = p.id
  WHERE p.society_id = (SELECT society_id FROM public.profiles WHERE id = auth.uid())
  AND u.role = 'resident'
  ORDER BY p.created_at DESC;
$$;
-- Create a storage bucket for issue evidence
INSERT INTO storage.buckets (id, name, public) 
VALUES ('issue_evidence', 'issue_evidence', true) 
ON CONFLICT DO NOTHING;

-- Allow authenticated users to upload to the bucket
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'issue_evidence');

-- Allow public viewing of evidence
DROP POLICY IF EXISTS "Allow public viewing" ON storage.objects;
CREATE POLICY "Allow public viewing" ON storage.objects FOR SELECT USING (bucket_id = 'issue_evidence');
-- Create Notices Table
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    society_id UUID NOT NULL REFERENCES public.societies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Administration',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Residents can read notices for their society
CREATE POLICY "notices_select_own_society" ON public.notices FOR SELECT TO authenticated
  USING (society_id = (SELECT society_id FROM public.profiles WHERE id = auth.uid()));

-- Secretaries can insert/update/delete notices for their society
CREATE POLICY "notices_modify_own_society_secretary" ON public.notices FOR ALL TO authenticated
  USING (
    society_id = (SELECT society_id FROM public.profiles WHERE id = auth.uid()) AND
    public.has_role(auth.uid(), 'secretary')
  );

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notices;
