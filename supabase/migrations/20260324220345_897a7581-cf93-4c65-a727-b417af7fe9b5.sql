
ALTER TABLE public.score_thresholds ADD COLUMN IF NOT EXISTS path_id uuid REFERENCES public.paths(id) ON DELETE SET NULL;
