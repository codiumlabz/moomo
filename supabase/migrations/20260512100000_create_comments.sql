-- Create product comments/reviews table
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "Comments are viewable by everyone" ON public.comments
  FOR SELECT USING (true);

-- Only authenticated users can insert their own comment
CREATE POLICY "Users can insert their own comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);
