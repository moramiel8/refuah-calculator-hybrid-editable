
-- Create storage bucket for library files
INSERT INTO storage.buckets (id, name, public) VALUES ('library-files', 'library-files', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view library files
CREATE POLICY "Anyone can view library files" ON storage.objects FOR SELECT USING (bucket_id = 'library-files');

-- Allow admins to upload library files
CREATE POLICY "Admins can upload library files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'library-files' AND public.is_admin(auth.uid()));

-- Allow admins to delete library files
CREATE POLICY "Admins can delete library files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'library-files' AND public.is_admin(auth.uid()));

-- Allow admins to update library files
CREATE POLICY "Admins can update library files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'library-files' AND public.is_admin(auth.uid()));
