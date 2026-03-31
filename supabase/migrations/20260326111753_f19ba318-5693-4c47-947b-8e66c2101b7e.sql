
CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  method text NOT NULL DEFAULT 'other',
  status text NOT NULL DEFAULT 'pending',
  notes text,
  reported_by uuid NOT NULL,
  approved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view approved donations (for badge display)
CREATE POLICY "Anyone can view approved donations" ON public.donations
  FOR SELECT TO public
  USING (status = 'approved');

-- Admins can view all donations
CREATE POLICY "Admins can view all donations" ON public.donations
  FOR SELECT TO authenticated
  USING (is_admin(auth.uid()));

-- Users can view own donations
CREATE POLICY "Users can view own donations" ON public.donations
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Auth users can insert donations (self-report)
CREATE POLICY "Auth users can insert donations" ON public.donations
  FOR INSERT TO authenticated
  WITH CHECK (reported_by = auth.uid());

-- Owner can update donations (approve/reject)
CREATE POLICY "Owner can update donations" ON public.donations
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'owner'));

-- Owner can delete donations
CREATE POLICY "Owner can delete donations" ON public.donations
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'owner'));
