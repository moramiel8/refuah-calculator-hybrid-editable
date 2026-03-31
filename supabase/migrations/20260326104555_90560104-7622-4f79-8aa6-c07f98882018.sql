CREATE TABLE public.role_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL UNIQUE,
  badge_color text NOT NULL DEFAULT '#3b82f6',
  name_color text NOT NULL DEFAULT '#3b82f6',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.role_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view role settings" ON public.role_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "Owner can update role settings" ON public.role_settings
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'owner')
  );

CREATE POLICY "Owner can insert role settings" ON public.role_settings
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'owner')
  );

-- Seed default role colors
INSERT INTO public.role_settings (role, badge_color, name_color) VALUES
  ('owner', '#d97706', '#d97706'),
  ('admin', '#3b82f6', '#3b82f6'),
  ('moderator', '#10b981', '#10b981'),
  ('editor', '#8b5cf6', '#8b5cf6'),
  ('supporter', '#ec4899', '#ec4899');