
-- Security definer function to check admin status (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE user_id = _user_id),
    false
  )
$$;

-- Admin can INSERT announcements
CREATE POLICY "Admins can insert announcements"
ON public.announcements FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Admin can UPDATE announcements
CREATE POLICY "Admins can update announcements"
ON public.announcements FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can DELETE announcements
CREATE POLICY "Admins can delete announcements"
ON public.announcements FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can INSERT steps
CREATE POLICY "Admins can insert steps"
ON public.steps FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Admin can UPDATE steps
CREATE POLICY "Admins can update steps"
ON public.steps FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can DELETE steps
CREATE POLICY "Admins can delete steps"
ON public.steps FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can INSERT questions
CREATE POLICY "Admins can insert questions"
ON public.questions FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Admin can UPDATE questions
CREATE POLICY "Admins can update questions"
ON public.questions FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can DELETE questions
CREATE POLICY "Admins can delete questions"
ON public.questions FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can INSERT libraries
CREATE POLICY "Admins can insert libraries"
ON public.libraries FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Admin can UPDATE libraries
CREATE POLICY "Admins can update libraries"
ON public.libraries FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can DELETE libraries
CREATE POLICY "Admins can delete libraries"
ON public.libraries FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can INSERT paths
CREATE POLICY "Admins can insert paths"
ON public.paths FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Admin can UPDATE paths
CREATE POLICY "Admins can update paths"
ON public.paths FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can DELETE paths
CREATE POLICY "Admins can delete paths"
ON public.paths FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can view all profiles (for user management)
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Admin can update any profile (for promoting to admin)
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));
