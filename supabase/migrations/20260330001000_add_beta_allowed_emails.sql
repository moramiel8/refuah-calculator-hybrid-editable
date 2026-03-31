CREATE TABLE IF NOT EXISTS public.beta_allowed_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles(user_id) ON DELETE SET NULL
);

ALTER TABLE public.beta_allowed_emails ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_beta_email_allowed(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.beta_allowed_emails
    WHERE lower(email) = lower(trim(coalesce(_email, '')))
  );
$$;

DROP POLICY IF EXISTS "Owners can view beta allowed emails" ON public.beta_allowed_emails;
CREATE POLICY "Owners can view beta allowed emails"
ON public.beta_allowed_emails FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = auth.uid()
      AND role = 'owner'
  )
);

DROP POLICY IF EXISTS "Owners can insert beta allowed emails" ON public.beta_allowed_emails;
CREATE POLICY "Owners can insert beta allowed emails"
ON public.beta_allowed_emails FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = auth.uid()
      AND role = 'owner'
  )
);

DROP POLICY IF EXISTS "Owners can delete beta allowed emails" ON public.beta_allowed_emails;
CREATE POLICY "Owners can delete beta allowed emails"
ON public.beta_allowed_emails FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = auth.uid()
      AND role = 'owner'
  )
);

INSERT INTO public.beta_allowed_emails (email)
VALUES
  ('morku8@gmail.com'),
  ('roeiduv@gmail.com'),
  ('yahelmor1@gmail.com'),
  ('ohadezra1031@gmail.com'),
  ('tamarber4@gmail.com')
ON CONFLICT (email) DO NOTHING;
