
-- Profile visits table
CREATE TABLE public.profile_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id UUID NOT NULL,
  profile_owner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_profile_visits_owner ON public.profile_visits(profile_owner_id, created_at DESC);
CREATE INDEX idx_profile_visits_dedup ON public.profile_visits(visitor_id, profile_owner_id, created_at DESC);

-- RLS
ALTER TABLE public.profile_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view visits to their own profile"
  ON public.profile_visits FOR SELECT
  TO authenticated
  USING (profile_owner_id = auth.uid());

CREATE POLICY "Auth users can insert visits"
  ON public.profile_visits FOR INSERT
  TO authenticated
  WITH CHECK (visitor_id = auth.uid());

-- Universal favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entity_type TEXT NOT NULL DEFAULT 'question',
  entity_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, entity_type, entity_id)
);

CREATE INDEX idx_favorites_user ON public.favorites(user_id, entity_type);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own favorites"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Enable realtime for profile_visits
ALTER PUBLICATION supabase_realtime ADD TABLE public.profile_visits;
