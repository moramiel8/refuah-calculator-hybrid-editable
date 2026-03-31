
-- Create new thresholds table with the structure matching the spreadsheet
CREATE TABLE public.score_thresholds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university text NOT NULL,
  year integer NOT NULL DEFAULT EXTRACT(year FROM now()),
  type text NOT NULL DEFAULT 'initial',
  category text NOT NULL DEFAULT 'acceptance',
  score numeric,
  score_date date,
  round text NOT NULL DEFAULT 'first',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT score_thresholds_type_check CHECK (type IN ('initial', 'final')),
  CONSTRAINT score_thresholds_category_check CHECK (category IN ('acceptance', 'rejection')),
  CONSTRAINT score_thresholds_round_check CHECK (round IN ('first', 'second', 'current', 'final'))
);

-- Enable RLS
ALTER TABLE public.score_thresholds ENABLE ROW LEVEL SECURITY;

-- Anyone can view
CREATE POLICY "Anyone can view score_thresholds" ON public.score_thresholds FOR SELECT TO public USING (true);

-- Admins can manage
CREATE POLICY "Admins can insert score_thresholds" ON public.score_thresholds FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can update score_thresholds" ON public.score_thresholds FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete score_thresholds" ON public.score_thresholds FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_score_thresholds_updated_at
  BEFORE UPDATE ON public.score_thresholds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
