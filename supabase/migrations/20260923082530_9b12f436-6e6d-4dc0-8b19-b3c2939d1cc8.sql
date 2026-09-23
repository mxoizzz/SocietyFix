
CREATE TYPE public.app_role AS ENUM ('resident', 'secretary');
CREATE TYPE public.issue_status AS ENUM ('reported', 'in_progress', 'resolved');
CREATE TYPE public.issue_category AS ENUM ('electrical', 'plumbing', 'cleanliness', 'security', 'other');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  flat_number TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'secretary'));
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'secretary'));
CREATE POLICY "roles_insert_own" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE SEQUENCE public.issue_ref_seq START 2461;

CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
GRANT SELECT, INSERT, UPDATE ON public.issues TO authenticated;
GRANT ALL ON public.issues TO service_role;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "issues_select" ON public.issues FOR SELECT TO authenticated
  USING (reported_by = auth.uid() OR public.has_role(auth.uid(), 'secretary'));
CREATE POLICY "issues_insert_own" ON public.issues FOR INSERT TO authenticated
  WITH CHECK (reported_by = auth.uid());
CREATE POLICY "issues_update_secretary" ON public.issues FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'secretary'))
  WITH CHECK (public.has_role(auth.uid(), 'secretary'));

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
  USING (EXISTS (SELECT 1 FROM public.issues i WHERE i.id = issue_id
    AND (i.reported_by = auth.uid() OR public.has_role(auth.uid(), 'secretary'))));
CREATE POLICY "notes_insert_secretary" ON public.issue_notes FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'secretary'));

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

CREATE POLICY "events_select" ON public.issue_status_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.issues i WHERE i.id = issue_id
    AND (i.reported_by = auth.uid() OR public.has_role(auth.uid(), 'secretary'))));

CREATE OR REPLACE FUNCTION public.log_issue_status() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

CREATE TRIGGER issues_status_insert AFTER INSERT ON public.issues
  FOR EACH ROW EXECUTE FUNCTION public.log_issue_status();
CREATE TRIGGER issues_status_update BEFORE UPDATE ON public.issues
  FOR EACH ROW EXECUTE FUNCTION public.log_issue_status();

ALTER PUBLICATION supabase_realtime ADD TABLE public.issues;
ALTER PUBLICATION supabase_realtime ADD TABLE public.issue_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.issue_status_events;

INSERT INTO public.issues (reporter_name, flat_number, category, title, description, status, created_at) VALUES
('Anita Desai', 'A-102', 'electrical', 'Ground-floor lobby light not switching on', 'The main lobby downlight near the noticeboard has been dead since last night. It is quite dark by the letterboxes in the evening.', 'reported', now() - interval '2 hours'),
('Rohit Menon', 'B-204', 'plumbing', 'Leak under the B-wing stairwell sink', 'Slow drip from the pipe joint under the common sink. Water is pooling on the floor and it gets slippery.', 'reported', now() - interval '5 hours'),
('Arjun Rao', 'Club House', 'plumbing', 'Water discolouration after tank refill', 'Refill tank showed discolouration and an off-putting odour this morning. Several flats on floors 3 and 4 are affected.', 'in_progress', now() - interval '1 day'),
('Kavya Iyer', 'C-401', 'security', 'Lift keycard reader failing on 4th floor', 'The keycard reader beeps red for valid cards. Residents have been propping the lift lobby door open, which is not safe.', 'in_progress', now() - interval '2 days'),
('Sunil Bhat', 'A-005', 'cleanliness', 'Overflowing bin near the mailroom', 'Bins by the mailroom were not cleared for two days and there is a smell in the corridor.', 'resolved', now() - interval '3 days'),
('Priya Nair', 'East Stair', 'other', 'Broken stair railing on the east side', 'The handrail between the second and third landing is loose and wobbles when held.', 'resolved', now() - interval '5 days'),
('Meera Kapoor', 'B-105', 'electrical', 'Block B power tripping in the evenings', 'The common area MCB trips most evenings around 8pm. Corridor lights and the lift go out for a few minutes.', 'in_progress', now() - interval '6 days');

UPDATE public.issues SET status = status;

INSERT INTO public.issue_notes (issue_id, author, text, created_at)
SELECT id, 'Priya Nair (Secretary)', 'Tank contractor booked for 4pm today for descaling and a fresh refill.', now() - interval '20 hours'
FROM public.issues WHERE title LIKE 'Water discolouration%';
INSERT INTO public.issue_notes (issue_id, author, text, created_at)
SELECT id, 'Priya Nair (Secretary)', 'Replacement reader ordered. Guard posted at the lift lobby until it arrives.', now() - interval '1 day'
FROM public.issues WHERE title LIKE 'Lift keycard%';
INSERT INTO public.issue_notes (issue_id, author, text, created_at)
SELECT id, 'Priya Nair (Secretary)', 'Housekeeping cleared the bins and the pickup schedule is now daily.', now() - interval '2 days'
FROM public.issues WHERE title LIKE 'Overflowing bin%';
