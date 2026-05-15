-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'USER')),
  ktp_url TEXT,
  selfie_url TEXT,
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Setup RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow all read access for now (or strictly authenticate via NextAuth)
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update users" ON public.users FOR UPDATE USING (true);

-- Create prime bucket for e-KYC
INSERT INTO storage.buckets (id, name, public) VALUES ('prime', 'prime', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for prime bucket
-- Anyone can read from the prime bucket
CREATE POLICY "Public Access prime" ON storage.objects FOR SELECT USING (bucket_id = 'prime');
-- Anyone can upload to the prime bucket (since we'll upload via Next.js server/API)
CREATE POLICY "Public Upload prime" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'prime');
CREATE POLICY "Public Update prime" ON storage.objects FOR UPDATE USING (bucket_id = 'prime');
