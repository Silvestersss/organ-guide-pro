
-- Step 1: Add tier column to user_memberships first
ALTER TABLE public.user_memberships
ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'basic';

-- Make level_id nullable
ALTER TABLE public.user_memberships ALTER COLUMN level_id DROP NOT NULL;
ALTER TABLE public.user_memberships ALTER COLUMN level_id SET DEFAULT NULL;

-- Fix unique constraint
ALTER TABLE public.user_memberships DROP CONSTRAINT IF EXISTS user_memberships_user_email_level_id_key;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_memberships_user_email_key') THEN
    ALTER TABLE public.user_memberships ADD CONSTRAINT user_memberships_user_email_key UNIQUE (user_email);
  END IF;
END $$;

-- Step 2: Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  system_id text NOT NULL,
  title text NOT NULL,
  url text,
  is_free boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Everyone can read videos
CREATE POLICY "Anyone can read videos"
ON public.videos FOR SELECT
USING (true);

-- Admin and premium can insert
CREATE POLICY "Admin and premium can insert videos"
ON public.videos FOR INSERT
WITH CHECK (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
  OR EXISTS (
    SELECT 1 FROM public.user_memberships
    WHERE user_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
    AND tier = 'premium' AND status = 'approved'
  )
);

-- Admin and premium can update
CREATE POLICY "Admin and premium can update videos"
ON public.videos FOR UPDATE
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
  OR EXISTS (
    SELECT 1 FROM public.user_memberships
    WHERE user_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
    AND tier = 'premium' AND status = 'approved'
  )
);

-- Admin and premium can delete
CREATE POLICY "Admin and premium can delete videos"
ON public.videos FOR DELETE
USING (
  (SELECT email FROM auth.users WHERE id = auth.uid())::text = ANY(ARRAY['leezhixing117@gmail.com', 'amypy117@gmail.com']::text[])
  OR EXISTS (
    SELECT 1 FROM public.user_memberships
    WHERE user_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
    AND tier = 'premium' AND status = 'approved'
  )
);

-- Seed videos
INSERT INTO public.videos (system_id, title, url, is_free, sort_order) VALUES
('respiratory', '肩周炎、肩袖損傷、Slap損傷到底是怎麼回事？', 'https://drive.google.com/drive/folders/18VjBffBCLCeB23dAoS1l3lDBYgG2CoCe', true, 0),
('respiratory', '過敏性鼻炎為什麼拖著拖著？', 'https://drive.google.com/drive/folders/18VjBffBCLCeB23dAoS1l3lDBYgG2CoCe', true, 1),
('circulatory', '90%的腰疼都不是腰突', 'https://drive.google.com/drive/folders/1wE5wp8Y8IKiYyZjxIb9RHLTxTEvzECZj', true, 0),
('digestive', '胃炎到底是哪裡出問題了？', 'https://drive.google.com/drive/folders/1CeKHYcTjdSrfphAThOwG7HoTqCBH1eT0', true, 0),
('nervous', '頭疼得想撞牆', 'https://drive.google.com/drive/folders/1hn7QMZWCMlCfk8k1MbcnG0j4flrnqOT0', true, 0),
('nervous', '女性下腹痛', 'https://drive.google.com/drive/folders/1hn7QMZWCMlCfk8k1MbcnG0j4flrnqOT0', true, 1);
