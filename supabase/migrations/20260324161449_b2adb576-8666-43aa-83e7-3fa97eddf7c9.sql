
CREATE TABLE public.admission_thresholds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  path_id uuid NOT NULL REFERENCES public.paths(id) ON DELETE CASCADE,
  year integer NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  min_psychometric integer,
  min_bagrut numeric(5,2),
  min_combined numeric(6,2),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(university_id, path_id, year)
);

ALTER TABLE public.admission_thresholds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view thresholds" ON public.admission_thresholds FOR SELECT USING (true);
CREATE POLICY "Admins can insert thresholds" ON public.admission_thresholds FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update thresholds" ON public.admission_thresholds FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete thresholds" ON public.admission_thresholds FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_admission_thresholds_updated_at BEFORE UPDATE ON public.admission_thresholds
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
