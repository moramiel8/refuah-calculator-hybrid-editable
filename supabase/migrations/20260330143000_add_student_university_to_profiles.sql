ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS student_university_id uuid REFERENCES public.universities(id) ON DELETE SET NULL;
