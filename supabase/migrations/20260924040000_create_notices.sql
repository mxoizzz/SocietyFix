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
