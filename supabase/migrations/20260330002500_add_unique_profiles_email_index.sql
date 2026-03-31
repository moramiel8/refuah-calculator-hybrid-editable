UPDATE public.profiles
SET email = lower(btrim(email))
WHERE email IS NOT NULL
  AND email <> lower(btrim(email));

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email_unique
ON public.profiles (lower(email))
WHERE btrim(email) <> '';
