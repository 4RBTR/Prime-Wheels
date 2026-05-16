-- Update users table with kyc_status
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'Pending' CHECK (kyc_status IN ('Pending', 'Approved', 'Rejected'));

-- Update bookings table with new columns and constraints
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS dp_amount INTEGER DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_dp_url TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_full_url TEXT;

-- We need to drop the old check constraint on payment_status and add a new one.
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_payment_status_check CHECK (payment_status IN ('Pending', 'Awaiting DP Verification', 'DP Paid', 'Awaiting Full Payment Verification', 'Paid', 'Refunded', 'Cancelled'));

-- We also need to update the status check constraint.
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check CHECK (status IN ('Awaiting Payment', 'Awaiting Approval', 'Ready for Pickup', 'On Road', 'Returned', 'Cancelled'));

-- Create payments bucket for payment proofs
INSERT INTO storage.buckets (id, name, public) VALUES ('payments', 'payments', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for payments bucket
CREATE POLICY "Public Access payments" ON storage.objects FOR SELECT USING (bucket_id = 'payments');
CREATE POLICY "Public Upload payments" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payments');
CREATE POLICY "Public Update payments" ON storage.objects FOR UPDATE USING (bucket_id = 'payments');
