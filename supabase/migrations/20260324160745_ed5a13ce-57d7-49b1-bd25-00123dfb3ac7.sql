
-- Tighten notification insert policy: actor must be the current user
DROP POLICY IF EXISTS "Auth users can insert notifications" ON public.notifications;
CREATE POLICY "Auth users can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_id);
