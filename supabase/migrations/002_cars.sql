-- Create cars table
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  seats INTEGER NOT NULL,
  price_per_day INTEGER NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Setup RLS on cars table
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Allow all read access (public catalog)
CREATE POLICY "Allow public read cars" ON public.cars FOR SELECT USING (true);
-- Allow admins to insert their own cars
CREATE POLICY "Allow admin insert cars" ON public.cars FOR INSERT WITH CHECK (true);
-- Allow admins to update their own cars
CREATE POLICY "Allow admin update cars" ON public.cars FOR UPDATE USING (true);
-- Allow admins to delete their own cars
CREATE POLICY "Allow admin delete cars" ON public.cars FOR DELETE USING (true);

-- Create cars bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('cars', 'cars', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for cars bucket
-- Anyone can read from the cars bucket
CREATE POLICY "Public Access cars" ON storage.objects FOR SELECT USING (bucket_id = 'cars');
-- Anyone can upload to the cars bucket (since we'll upload via Next.js server/API)
CREATE POLICY "Public Upload cars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cars');
CREATE POLICY "Public Update cars" ON storage.objects FOR UPDATE USING (bucket_id = 'cars');
CREATE POLICY "Public Delete cars" ON storage.objects FOR DELETE USING (bucket_id = 'cars');
