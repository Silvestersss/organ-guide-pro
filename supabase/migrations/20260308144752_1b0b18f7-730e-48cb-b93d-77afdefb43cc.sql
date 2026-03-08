
-- Create membership levels table
CREATE TABLE public.membership_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  allowed_systems text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user memberships table
CREATE TABLE public.user_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  level_id uuid REFERENCES public.membership_levels(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_email, level_id)
);

-- Enable RLS
ALTER TABLE public.membership_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;

-- RLS for membership_levels: everyone can read
CREATE POLICY "Anyone can read membership levels"
ON public.membership_levels FOR SELECT
USING (true);

-- Admin can manage membership levels
CREATE POLICY "Admin can insert membership levels"
ON public.membership_levels FOR INSERT
WITH CHECK (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

CREATE POLICY "Admin can update membership levels"
ON public.membership_levels FOR UPDATE
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

CREATE POLICY "Admin can delete membership levels"
ON public.membership_levels FOR DELETE
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

-- RLS for user_memberships: users can read their own, admin can read all
CREATE POLICY "Users can read own memberships"
ON public.user_memberships FOR SELECT
USING (
  user_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  OR (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

-- Users can apply (insert) for themselves
CREATE POLICY "Users can apply for membership"
ON public.user_memberships FOR INSERT
WITH CHECK (
  user_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  OR (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

-- Admin can update memberships (approve/reject/change level)
CREATE POLICY "Admin can update memberships"
ON public.user_memberships FOR UPDATE
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);

-- Admin can delete memberships
CREATE POLICY "Admin can delete memberships"
ON public.user_memberships FOR DELETE
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
);
