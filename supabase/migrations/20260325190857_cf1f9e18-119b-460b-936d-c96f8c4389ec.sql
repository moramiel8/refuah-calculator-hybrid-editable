
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS banned_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS banned_by uuid DEFAULT NULL;
