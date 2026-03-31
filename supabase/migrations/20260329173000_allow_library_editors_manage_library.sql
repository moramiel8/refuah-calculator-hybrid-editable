CREATE OR REPLACE FUNCTION public.can_manage_library(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = uid
      AND (
        is_admin = true
        OR primary_role IN ('owner', 'admin')
        OR (
          primary_role = 'editor'
          AND permissions IS NOT NULL
          AND 'library' = ANY(permissions)
        )
      )
  );
$$;

DROP POLICY IF EXISTS "Admins can insert libraries" ON public.libraries;
DROP POLICY IF EXISTS "Admins can update libraries" ON public.libraries;
DROP POLICY IF EXISTS "Admins can delete libraries" ON public.libraries;

CREATE POLICY "Library managers can insert libraries"
ON public.libraries FOR INSERT
TO authenticated
WITH CHECK (public.can_manage_library(auth.uid()));

CREATE POLICY "Library managers can update libraries"
ON public.libraries FOR UPDATE
TO authenticated
USING (public.can_manage_library(auth.uid()))
WITH CHECK (public.can_manage_library(auth.uid()));

CREATE POLICY "Library managers can delete libraries"
ON public.libraries FOR DELETE
TO authenticated
USING (public.can_manage_library(auth.uid()));

DROP POLICY IF EXISTS "Admins can upload library files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete library files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update library files" ON storage.objects;

CREATE POLICY "Library managers can upload library files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'library-files' AND public.can_manage_library(auth.uid()));

CREATE POLICY "Library managers can delete library files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'library-files' AND public.can_manage_library(auth.uid()));

CREATE POLICY "Library managers can update library files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'library-files' AND public.can_manage_library(auth.uid()))
WITH CHECK (bucket_id = 'library-files' AND public.can_manage_library(auth.uid()));
