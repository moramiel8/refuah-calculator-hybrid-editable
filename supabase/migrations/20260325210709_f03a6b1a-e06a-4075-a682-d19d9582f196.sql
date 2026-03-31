
CREATE TABLE public.anonymous_applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  psychometric integer,
  bagrut_average numeric,
  mor_score text,
  university_id uuid REFERENCES public.universities(id),
  path_id uuid REFERENCES public.paths(id),
  year integer NOT NULL DEFAULT EXTRACT(year FROM now()),
  acceptance_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, university_id, path_id, year)
);

ALTER TABLE public.anonymous_applicants ENABLE ROW LEVEL SECURITY;

-- Anyone can view (data is anonymous - no personal info exposed)
CREATE POLICY "Anyone can view anonymous applicants"
ON public.anonymous_applicants FOR SELECT
TO public
USING (true);

-- Auth users can insert their own
CREATE POLICY "Users can insert own applicant data"
ON public.anonymous_applicants FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own
CREATE POLICY "Users can update own applicant data"
ON public.anonymous_applicants FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own
CREATE POLICY "Users can delete own applicant data"
ON public.anonymous_applicants FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add consent column to candidates table
ALTER TABLE public.candidates ADD COLUMN IF NOT EXISTS share_data_consent boolean NOT NULL DEFAULT false;
