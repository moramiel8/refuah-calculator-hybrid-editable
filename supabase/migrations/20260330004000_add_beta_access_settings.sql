CREATE TABLE IF NOT EXISTS public.beta_access_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.beta_access_settings (id, enabled)
VALUES (1, true)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.beta_access_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owners can view beta access settings" ON public.beta_access_settings;
CREATE POLICY "Owners can view beta access settings"
ON public.beta_access_settings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = auth.uid()
      AND role = 'owner'
  )
);

DROP POLICY IF EXISTS "Owners can update beta access settings" ON public.beta_access_settings;
CREATE POLICY "Owners can update beta access settings"
ON public.beta_access_settings FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = auth.uid()
      AND role = 'owner'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = auth.uid()
      AND role = 'owner'
  )
);

CREATE OR REPLACE FUNCTION public.update_beta_access_settings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_beta_access_settings_updated_at ON public.beta_access_settings;
CREATE TRIGGER update_beta_access_settings_updated_at
BEFORE UPDATE ON public.beta_access_settings
FOR EACH ROW EXECUTE FUNCTION public.update_beta_access_settings_updated_at();
