
-- Fix videos RLS policies: change from RESTRICTIVE to PERMISSIVE

DROP POLICY IF EXISTS "Anyone can read videos" ON public.videos;
DROP POLICY IF EXISTS "Admin and premium can insert videos" ON public.videos;
DROP POLICY IF EXISTS "Admin and premium can update videos" ON public.videos;
DROP POLICY IF EXISTS "Admin and premium can delete videos" ON public.videos;

CREATE POLICY "Anyone can read videos"
ON public.videos FOR SELECT
USING (true);

CREATE POLICY "Admin and premium can insert videos"
ON public.videos FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
  OR EXISTS (
    SELECT 1 FROM user_memberships
    WHERE user_memberships.user_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
    AND user_memberships.tier = 'premium'
    AND user_memberships.status = 'approved'
  )
);

CREATE POLICY "Admin and premium can update videos"
ON public.videos FOR UPDATE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
  OR EXISTS (
    SELECT 1 FROM user_memberships
    WHERE user_memberships.user_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
    AND user_memberships.tier = 'premium'
    AND user_memberships.status = 'approved'
  )
);

CREATE POLICY "Admin and premium can delete videos"
ON public.videos FOR DELETE
TO authenticated
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
  OR EXISTS (
    SELECT 1 FROM user_memberships
    WHERE user_memberships.user_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
    AND user_memberships.tier = 'premium'
    AND user_memberships.status = 'approved'
  )
);
