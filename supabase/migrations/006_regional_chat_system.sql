-- Add city to users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Surabaya';

-- Enforce exactly one Admin per city
CREATE UNIQUE INDEX IF NOT EXISTS unique_admin_per_city ON public.users (city) WHERE role = 'ADMIN';

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT,
  attachment_url TEXT,
  attachment_type TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Since we use NextAuth, RLS is handled at the Next.js API layer
CREATE POLICY "Allow public read chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update chat_messages" ON public.chat_messages FOR UPDATE USING (true);
CREATE POLICY "Allow public delete chat_messages" ON public.chat_messages FOR DELETE USING (true);

-- Enable Realtime on chat_messages
-- Check if publication exists, if not create it (Supabase usually has supabase_realtime)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END
$$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
