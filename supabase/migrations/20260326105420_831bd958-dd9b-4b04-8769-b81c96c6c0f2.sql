
CREATE TABLE public.donation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal numeric NOT NULL DEFAULT 5000,
  raised numeric NOT NULL DEFAULT 0,
  contributors integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.donation_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view
CREATE POLICY "Anyone can view donation settings" ON public.donation_settings
  FOR SELECT TO public USING (true);

-- Only owner can update
CREATE POLICY "Owner can update donation settings" ON public.donation_settings
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'owner'));

-- Only owner can insert
CREATE POLICY "Owner can insert donation settings" ON public.donation_settings
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'owner'));

-- Insert default row
INSERT INTO public.donation_settings (goal, raised, contributors) VALUES (5000, 850, 12);
