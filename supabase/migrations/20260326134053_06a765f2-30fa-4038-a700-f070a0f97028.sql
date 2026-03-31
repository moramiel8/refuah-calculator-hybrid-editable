-- Add auto_group_key to conversations for identifying auto-generated groups
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS auto_group_key TEXT DEFAULT NULL;

-- Add unique constraint so we don't create duplicate auto groups
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_auto_group_key ON public.conversations(auto_group_key) WHERE auto_group_key IS NOT NULL;

-- Track which auto groups users have left (so we don't re-add them)
CREATE TABLE IF NOT EXISTS public.auto_group_leaves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  auto_group_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, auto_group_key)
);

ALTER TABLE public.auto_group_leaves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leaves" ON public.auto_group_leaves FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own leaves" ON public.auto_group_leaves FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own leaves" ON public.auto_group_leaves FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Allow participants to delete themselves from auto groups (leave)
CREATE POLICY "Users can leave auto groups" ON public.conversation_participants FOR DELETE TO authenticated USING (user_id = auth.uid());