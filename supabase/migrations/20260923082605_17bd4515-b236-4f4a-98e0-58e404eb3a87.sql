
REVOKE ALL ON FUNCTION public.log_issue_status() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

CREATE POLICY "issue_photos_upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'issue-photos' AND owner = auth.uid());
CREATE POLICY "issue_photos_read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'issue-photos');
