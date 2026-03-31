CREATE OR REPLACE FUNCTION public.has_profile_permission(uid uuid, permission_name text)
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
          AND permission_name = ANY(permissions)
        )
      )
  );
$$;

DROP POLICY IF EXISTS "Admins can insert announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can delete announcements" ON public.announcements;

CREATE POLICY "Post managers can insert announcements"
ON public.announcements FOR INSERT
TO authenticated
WITH CHECK (public.has_profile_permission(auth.uid(), 'posts'));

CREATE POLICY "Post managers can update announcements"
ON public.announcements FOR UPDATE
TO authenticated
USING (public.has_profile_permission(auth.uid(), 'posts'))
WITH CHECK (public.has_profile_permission(auth.uid(), 'posts'));

CREATE POLICY "Post managers can delete announcements"
ON public.announcements FOR DELETE
TO authenticated
USING (public.has_profile_permission(auth.uid(), 'posts'));

DROP POLICY IF EXISTS "Admins can insert questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can delete questions" ON public.questions;

CREATE POLICY "FAQ managers can insert questions"
ON public.questions FOR INSERT
TO authenticated
WITH CHECK (public.has_profile_permission(auth.uid(), 'faq'));

CREATE POLICY "FAQ managers can update questions"
ON public.questions FOR UPDATE
TO authenticated
USING (public.has_profile_permission(auth.uid(), 'faq'))
WITH CHECK (public.has_profile_permission(auth.uid(), 'faq'));

CREATE POLICY "FAQ managers can delete questions"
ON public.questions FOR DELETE
TO authenticated
USING (public.has_profile_permission(auth.uid(), 'faq'));
