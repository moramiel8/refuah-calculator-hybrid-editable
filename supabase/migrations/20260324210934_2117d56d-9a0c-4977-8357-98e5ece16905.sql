
-- Fix overly permissive INSERT policy on community_mentions
DROP POLICY IF EXISTS "Auth users can insert mentions" ON public.community_mentions;

CREATE POLICY "Auth users can insert mentions" ON public.community_mentions
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.community_replies r WHERE r.id = reply_id AND r.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.community_questions q WHERE q.id = question_id AND q.user_id = auth.uid()
    )
  );
