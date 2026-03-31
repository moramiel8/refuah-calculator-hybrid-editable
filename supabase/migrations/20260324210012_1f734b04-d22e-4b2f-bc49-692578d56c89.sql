
-- Community Questions
CREATE TABLE public.community_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community Replies
CREATE TABLE public.community_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES public.community_questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_best BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community Likes (polymorphic: question or reply)
CREATE TABLE public.community_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.community_questions(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.community_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id),
  UNIQUE(user_id, reply_id)
);

-- RLS
ALTER TABLE public.community_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

-- community_questions policies
CREATE POLICY "Anyone can view community questions" ON public.community_questions FOR SELECT TO public USING (true);
CREATE POLICY "Auth users can insert community questions" ON public.community_questions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own questions" ON public.community_questions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users or admins can delete questions" ON public.community_questions FOR DELETE TO authenticated USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- community_replies policies
CREATE POLICY "Anyone can view community replies" ON public.community_replies FOR SELECT TO public USING (true);
CREATE POLICY "Auth users can insert community replies" ON public.community_replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own replies" ON public.community_replies FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users or admins can delete replies" ON public.community_replies FOR DELETE TO authenticated USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- community_likes policies
CREATE POLICY "Anyone can view community likes" ON public.community_likes FOR SELECT TO public USING (true);
CREATE POLICY "Auth users can insert community likes" ON public.community_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON public.community_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Admin can pin/mark best
CREATE POLICY "Admins can update any question" ON public.community_questions FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can update any reply" ON public.community_replies FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_questions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_likes;
