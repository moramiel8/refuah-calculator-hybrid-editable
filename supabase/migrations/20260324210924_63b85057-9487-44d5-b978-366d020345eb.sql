
-- Add status column to community_questions
ALTER TABLE public.community_questions 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'open';

-- Create community_mentions table
CREATE TABLE IF NOT EXISTS public.community_mentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES public.community_questions(id) ON DELETE CASCADE,
  reply_id uuid REFERENCES public.community_replies(id) ON DELETE CASCADE,
  mentioned_user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.community_mentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view mentions" ON public.community_mentions
  FOR SELECT TO public USING (true);

CREATE POLICY "Auth users can insert mentions" ON public.community_mentions
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can delete own mentions" ON public.community_mentions
  FOR DELETE TO authenticated USING (
    mentioned_user_id = auth.uid() OR is_admin(auth.uid())
  );

-- Add question_id to notifications for community question references
ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS community_question_id uuid REFERENCES public.community_questions(id) ON DELETE CASCADE;

-- Add parent_id to community_replies for threaded replies
ALTER TABLE public.community_replies
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.community_replies(id) ON DELETE CASCADE;

-- Enable realtime for mentions
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_mentions;
