ALTER TABLE public.score_thresholds
  DROP CONSTRAINT IF EXISTS score_thresholds_type_check;

ALTER TABLE public.score_thresholds
  ADD CONSTRAINT score_thresholds_type_check
  CHECK (type IN ('initial', 'final', 'mor'));
