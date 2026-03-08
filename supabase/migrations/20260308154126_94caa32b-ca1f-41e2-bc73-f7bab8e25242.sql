
-- Fix user_memberships policies
DROP POLICY IF EXISTS "Users can read own memberships" ON public.user_memberships;
DROP POLICY IF EXISTS "Users can apply for membership" ON public.user_memberships;
DROP POLICY IF EXISTS "Admin can update memberships" ON public.user_memberships;
DROP POLICY IF EXISTS "Admin can delete memberships" ON public.user_memberships;

CREATE POLICY "Users can read own memberships"
ON public.user_memberships FOR SELECT
TO authenticated
USING (
  user_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  OR (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

CREATE POLICY "Users can apply for membership"
ON public.user_memberships FOR INSERT
TO authenticated
WITH CHECK (
  user_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  OR (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

CREATE POLICY "Admin can update memberships"
ON public.user_memberships FOR UPDATE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

CREATE POLICY "Admin can delete memberships"
ON public.user_memberships FOR DELETE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

-- Fix custom_links policies
DROP POLICY IF EXISTS "Anyone can view custom links" ON public.custom_links;
DROP POLICY IF EXISTS "Admin can insert custom links" ON public.custom_links;
DROP POLICY IF EXISTS "Admin can update custom links" ON public.custom_links;
DROP POLICY IF EXISTS "Admin can delete custom links" ON public.custom_links;

CREATE POLICY "Anyone can view custom links"
ON public.custom_links FOR SELECT
USING (true);

CREATE POLICY "Admin can insert custom links"
ON public.custom_links FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

CREATE POLICY "Admin can update custom links"
ON public.custom_links FOR UPDATE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

CREATE POLICY "Admin can delete custom links"
ON public.custom_links FOR DELETE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

-- Fix membership_levels policies
DROP POLICY IF EXISTS "Anyone can read membership levels" ON public.membership_levels;
DROP POLICY IF EXISTS "Admin can insert membership levels" ON public.membership_levels;
DROP POLICY IF EXISTS "Admin can update membership levels" ON public.membership_levels;
DROP POLICY IF EXISTS "Admin can delete membership levels" ON public.membership_levels;

CREATE POLICY "Anyone can read membership levels"
ON public.membership_levels FOR SELECT
USING (true);

CREATE POLICY "Admin can insert membership levels"
ON public.membership_levels FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

CREATE POLICY "Admin can update membership levels"
ON public.membership_levels FOR UPDATE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

CREATE POLICY "Admin can delete membership levels"
ON public.membership_levels FOR DELETE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);
