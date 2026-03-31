-- Allow anyone to view basic profile info for public profiles
CREATE POLICY "Anyone can view public profile info"
ON public.profiles
FOR SELECT
TO public
USING (deleted_at IS NULL AND banned_at IS NULL);
