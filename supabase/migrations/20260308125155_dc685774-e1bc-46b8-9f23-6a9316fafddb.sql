-- Create custom_links table for editable content per organ system
CREATE TABLE public.custom_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_links ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Anyone can view custom links"
ON public.custom_links FOR SELECT
USING (true);

-- Only admin (specific email) can insert/update/delete
CREATE POLICY "Admin can insert custom links"
ON public.custom_links FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'leezhixing117@gmail.com'
);

CREATE POLICY "Admin can update custom links"
ON public.custom_links FOR UPDATE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'leezhixing117@gmail.com'
);

CREATE POLICY "Admin can delete custom links"
ON public.custom_links FOR DELETE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid()) = 'leezhixing117@gmail.com'
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_custom_links_updated_at
  BEFORE UPDATE ON public.custom_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();