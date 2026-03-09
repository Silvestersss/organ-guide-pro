
-- Update all RLS policies to include worksmartstyle@gmail.com as admin

-- custom_links
DROP POLICY IF EXISTS "Admin can insert custom links" ON public.custom_links;
CREATE POLICY "Admin can insert custom links" ON public.custom_links FOR INSERT TO authenticated
WITH CHECK (current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com']));

DROP POLICY IF EXISTS "Admin can update custom links" ON public.custom_links;
CREATE POLICY "Admin can update custom links" ON public.custom_links FOR UPDATE TO authenticated
USING (current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com']))
WITH CHECK (current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com']));

DROP POLICY IF EXISTS "Admin can delete custom links" ON public.custom_links;
CREATE POLICY "Admin can delete custom links" ON public.custom_links FOR DELETE TO authenticated
USING (current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com']));

-- membership_levels
DROP POLICY IF EXISTS "Admin can insert membership levels" ON public.membership_levels;
CREATE POLICY "Admin can insert membership levels" ON public.membership_levels FOR INSERT TO authenticated
WITH CHECK (current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com']));

DROP POLICY IF EXISTS "Admin can update membership levels" ON public.membership_levels;
CREATE POLICY "Admin can update membership levels" ON public.membership_levels FOR UPDATE TO authenticated
USING (current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com']))
WITH CHECK (current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com']));

DROP POLICY IF EXISTS "Admin can delete membership levels" ON public.membership_levels;
CREATE POLICY "Admin can delete membership levels" ON public.membership_levels FOR DELETE TO authenticated
USING (current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com']));

-- user_memberships
DROP POLICY IF EXISTS "Users can read own memberships" ON public.user_memberships;
CREATE POLICY "Users can read own memberships" ON public.user_memberships FOR SELECT TO authenticated
USING (user_email = current_user_email() OR current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com']));

DROP POLICY IF EXISTS "Users can apply for membership" ON public.user_memberships;
CREATE POLICY "Users can apply for membership" ON public.user_memberships FOR INSERT TO authenticated
WITH CHECK (user_email = current_user_email() OR current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com']));

DROP POLICY IF EXISTS "Admin can update memberships" ON public.user_memberships;
CREATE POLICY "Admin can update memberships" ON public.user_memberships FOR UPDATE TO authenticated
USING (current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com']))
WITH CHECK (current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com']));

DROP POLICY IF EXISTS "Admin can delete memberships" ON public.user_memberships;
CREATE POLICY "Admin can delete memberships" ON public.user_memberships FOR DELETE TO authenticated
USING (current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com']));

-- videos
DROP POLICY IF EXISTS "Admin and premium can insert videos" ON public.videos;
CREATE POLICY "Admin and premium can insert videos" ON public.videos FOR INSERT TO authenticated
WITH CHECK (
  current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com'])
  OR EXISTS (SELECT 1 FROM user_memberships um WHERE um.user_email = current_user_email() AND um.tier = 'premium' AND um.status = 'approved')
);

DROP POLICY IF EXISTS "Admin and premium can update videos" ON public.videos;
CREATE POLICY "Admin and premium can update videos" ON public.videos FOR UPDATE TO authenticated
USING (
  current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com'])
  OR EXISTS (SELECT 1 FROM user_memberships um WHERE um.user_email = current_user_email() AND um.tier = 'premium' AND um.status = 'approved')
)
WITH CHECK (
  current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com'])
  OR EXISTS (SELECT 1 FROM user_memberships um WHERE um.user_email = current_user_email() AND um.tier = 'premium' AND um.status = 'approved')
);

DROP POLICY IF EXISTS "Admin and premium can delete videos" ON public.videos;
CREATE POLICY "Admin and premium can delete videos" ON public.videos FOR DELETE TO authenticated
USING (
  current_user_email() = ANY (ARRAY['leezhixing117@gmail.com','amypy117@gmail.com','worksmartstyle@gmail.com'])
  OR EXISTS (SELECT 1 FROM user_memberships um WHERE um.user_email = current_user_email() AND um.tier = 'premium' AND um.status = 'approved')
);
