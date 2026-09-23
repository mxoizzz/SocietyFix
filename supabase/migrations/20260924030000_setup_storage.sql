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
