ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS primary_role text NOT NULL DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS badges text[] NOT NULL DEFAULT '{}'::text[];

UPDATE public.profiles
SET primary_role = CASE
  WHEN primary_role IN ('owner', 'admin', 'moderator', 'editor', 'user') THEN primary_role
  WHEN role IN ('owner', 'admin', 'moderator', 'editor', 'user') THEN role
  WHEN is_admin THEN 'admin'
  ELSE 'user'
END;

UPDATE public.profiles
SET badges = (
  SELECT COALESCE(array_agg(DISTINCT badge), '{}'::text[])
  FROM unnest(
    badges ||
    CASE
      WHEN role = 'supporter' THEN ARRAY['supporter']::text[]
      ELSE ARRAY[]::text[]
    END
  ) AS badge
  WHERE badge IN ('supporter')
);

UPDATE public.profiles
SET role = primary_role
WHERE role IS DISTINCT FROM primary_role;
