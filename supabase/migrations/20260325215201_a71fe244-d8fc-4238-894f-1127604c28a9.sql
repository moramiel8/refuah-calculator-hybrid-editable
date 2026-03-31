-- Add last_seen_at to profiles for tracking online status
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_seen_at timestamp with time zone DEFAULT NULL;
-- Add hide_last_seen privacy setting
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hide_last_seen boolean NOT NULL DEFAULT false;
