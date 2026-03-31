-- Profile wall posts table
CREATE TABLE public.wall_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_owner_id uuid NOT NULL,
  author_id uuid NOT NULL,
  content text NOT NULL,
  parent_id uuid REFERENCES public.wall_posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  deleted_by uuid
);

-- Wall post likes
CREATE TABLE public.wall_post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.wall_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.wall_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wall_post_likes ENABLE ROW LEVEL SECURITY;

-- Wall posts policies
CREATE POLICY "Anyone can view wall posts" ON public.wall_posts
  FOR SELECT TO public USING (deleted_at IS NULL);

CREATE POLICY "Auth users can insert wall posts" ON public.wall_posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own wall posts" ON public.wall_posts
  FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Users or admins can delete wall posts" ON public.wall_posts
  FOR DELETE TO authenticated USING (auth.uid() = author_id OR auth.uid() = profile_owner_id OR is_admin(auth.uid()));

-- Wall post likes policies
CREATE POLICY "Anyone can view wall post likes" ON public.wall_post_likes
  FOR SELECT TO public USING (true);

CREATE POLICY "Auth users can insert likes" ON public.wall_post_likes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes" ON public.wall_post_likes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Enable realtime for wall posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.wall_posts;