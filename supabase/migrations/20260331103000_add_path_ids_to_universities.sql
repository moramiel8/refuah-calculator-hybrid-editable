-- Support multiple paths per university
ALTER TABLE public.universities
ADD COLUMN IF NOT EXISTS path_ids uuid[] NULL;

-- Backfill: if university has a single path_id, mirror it into path_ids
UPDATE public.universities
SET path_ids = ARRAY[path_id]
WHERE path_id IS NOT NULL
  AND (path_ids IS NULL OR array_length(path_ids, 1) IS NULL);
