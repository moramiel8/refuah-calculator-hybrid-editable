-- Add explicit entry tracks for six-year admissions flows
ALTER TABLE public.steps
ADD COLUMN IF NOT EXISTS entry_tracks text[] NULL;

