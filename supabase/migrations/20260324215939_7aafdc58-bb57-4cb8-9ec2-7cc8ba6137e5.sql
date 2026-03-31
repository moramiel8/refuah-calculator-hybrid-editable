
-- Create community_votes table for upvote/downvote system
CREATE TABLE public.community_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  target_id uuid NOT NULL,
  target_type text NOT NULL DEFAULT 'question',
  value smallint NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT community_votes_value_check CHECK (value IN (1, -1)),
  CONSTRAINT community_votes_target_type_check CHECK (target_type IN ('question', 'reply')),
  CONSTRAINT community_votes_unique UNIQUE (user_id, target_id, target_type)
);

-- Enable RLS
ALTER TABLE public.community_votes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view votes" ON public.community_votes
  FOR SELECT TO public USING (true);

CREATE POLICY "Auth users can insert votes" ON public.community_votes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON public.community_votes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON public.community_votes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_votes;
