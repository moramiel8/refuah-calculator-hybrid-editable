
-- Create universities table
CREATE TABLE public.universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  color text NOT NULL DEFAULT '#3AAFA9',
  path_id uuid REFERENCES public.paths(id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Anyone can view universities" ON public.universities FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert universities" ON public.universities FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update universities" ON public.universities FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete universities" ON public.universities FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- Add university_id column to steps table
ALTER TABLE public.steps ADD COLUMN university_id uuid REFERENCES public.universities(id) ON DELETE SET NULL;
