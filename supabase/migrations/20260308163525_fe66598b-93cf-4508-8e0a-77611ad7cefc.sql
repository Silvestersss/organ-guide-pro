-- Fix RLS policies that incorrectly query auth.users (causing permission denied for table users)
-- and standardize admin email checks via JWT email claim.

CREATE OR REPLACE FUNCTION public.current_user_email()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(auth.jwt() ->> 'email', '')::text;
$$;

-- custom_links
DROP POLICY IF EXISTS "Admin can insert custom links" ON public.custom_links;
DROP POLICY IF EXISTS "Admin can update custom links" ON public.custom_links;
DROP POLICY IF EXISTS "Admin can delete custom links" ON public.custom_links;

CREATE POLICY "Admin can insert custom links"
ON public.custom_links
FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
);

CREATE POLICY "Admin can update custom links"
ON public.custom_links
FOR UPDATE
TO authenticated
USING (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
)
WITH CHECK (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
);

CREATE POLICY "Admin can delete custom links"
ON public.custom_links
FOR DELETE
TO authenticated
USING (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
);

-- membership_levels
DROP POLICY IF EXISTS "Admin can insert membership levels" ON public.membership_levels;
DROP POLICY IF EXISTS "Admin can update membership levels" ON public.membership_levels;
DROP POLICY IF EXISTS "Admin can delete membership levels" ON public.membership_levels;

CREATE POLICY "Admin can insert membership levels"
ON public.membership_levels
FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
);

CREATE POLICY "Admin can update membership levels"
ON public.membership_levels
FOR UPDATE
TO authenticated
USING (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
)
WITH CHECK (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
);

CREATE POLICY "Admin can delete membership levels"
ON public.membership_levels
FOR DELETE
TO authenticated
USING (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
);

-- user_memberships
DROP POLICY IF EXISTS "Users can read own memberships" ON public.user_memberships;
DROP POLICY IF EXISTS "Users can apply for membership" ON public.user_memberships;
DROP POLICY IF EXISTS "Admin can update memberships" ON public.user_memberships;
DROP POLICY IF EXISTS "Admin can delete memberships" ON public.user_memberships;

CREATE POLICY "Users can read own memberships"
ON public.user_memberships
FOR SELECT
TO authenticated
USING (
  user_email = public.current_user_email()
  OR public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
);

CREATE POLICY "Users can apply for membership"
ON public.user_memberships
FOR INSERT
TO authenticated
WITH CHECK (
  user_email = public.current_user_email()
  OR public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
);

CREATE POLICY "Admin can update memberships"
ON public.user_memberships
FOR UPDATE
TO authenticated
USING (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
)
WITH CHECK (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
);

CREATE POLICY "Admin can delete memberships"
ON public.user_memberships
FOR DELETE
TO authenticated
USING (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
);

-- videos
DROP POLICY IF EXISTS "Admin and premium can insert videos" ON public.videos;
DROP POLICY IF EXISTS "Admin and premium can update videos" ON public.videos;
DROP POLICY IF EXISTS "Admin and premium can delete videos" ON public.videos;

CREATE POLICY "Admin and premium can insert videos"
ON public.videos
FOR INSERT
TO authenticated
WITH CHECK (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
  OR EXISTS (
    SELECT 1
    FROM public.user_memberships um
    WHERE um.user_email = public.current_user_email()
      AND um.tier = 'premium'
      AND um.status = 'approved'
  )
);

CREATE POLICY "Admin and premium can update videos"
ON public.videos
FOR UPDATE
TO authenticated
USING (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
  OR EXISTS (
    SELECT 1
    FROM public.user_memberships um
    WHERE um.user_email = public.current_user_email()
      AND um.tier = 'premium'
      AND um.status = 'approved'
  )
)
WITH CHECK (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
  OR EXISTS (
    SELECT 1
    FROM public.user_memberships um
    WHERE um.user_email = public.current_user_email()
      AND um.tier = 'premium'
      AND um.status = 'approved'
  )
);

CREATE POLICY "Admin and premium can delete videos"
ON public.videos
FOR DELETE
TO authenticated
USING (
  public.current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com'])
  OR EXISTS (
    SELECT 1
    FROM public.user_memberships um
    WHERE um.user_email = public.current_user_email()
      AND um.tier = 'premium'
      AND um.status = 'approved'
  )
);