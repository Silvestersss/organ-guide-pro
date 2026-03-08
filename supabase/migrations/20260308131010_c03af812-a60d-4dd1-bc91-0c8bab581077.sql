
-- Update custom_links RLS policies to allow both admin emails
DROP POLICY IF EXISTS "Admin can delete custom links" ON public.custom_links;
DROP POLICY IF EXISTS "Admin can insert custom links" ON public.custom_links;
DROP POLICY IF EXISTS "Admin can update custom links" ON public.custom_links;

CREATE POLICY "Admin can delete custom links" ON public.custom_links
  FOR DELETE TO authenticated
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN ('leezhixing117@gmail.com', 'amypy117@gmail.com')
  );

CREATE POLICY "Admin can insert custom links" ON public.custom_links
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN ('leezhixing117@gmail.com', 'amypy117@gmail.com')
  );

CREATE POLICY "Admin can update custom links" ON public.custom_links
  FOR UPDATE TO authenticated
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN ('leezhixing117@gmail.com', 'amypy117@gmail.com')
  );
