
ALTER TABLE public.anonymous_applicants ADD COLUMN IF NOT EXISTS eligible_for_promotion boolean NOT NULL DEFAULT false;
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS eligible_for_promotion boolean NOT NULL DEFAULT false;
