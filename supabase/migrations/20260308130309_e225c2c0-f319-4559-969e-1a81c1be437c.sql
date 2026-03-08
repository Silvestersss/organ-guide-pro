
CREATE TABLE public.system_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_id TEXT NOT NULL UNIQUE,
  note TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.system_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read system notes"
  ON public.system_notes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert system notes"
  ON public.system_notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update system notes"
  ON public.system_notes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
