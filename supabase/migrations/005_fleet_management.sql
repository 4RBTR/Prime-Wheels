-- Add quantity to cars table
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Add admin_status to cars table
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS admin_status TEXT DEFAULT 'Available' CHECK (admin_status IN ('Available', 'Maintenance', 'Hidden'));

-- Create a helper function to check car availability for a given date range
CREATE OR REPLACE FUNCTION check_car_availability(p_car_id UUID, p_start_date TIMESTAMP, p_end_date TIMESTAMP)
RETURNS INTEGER AS $$
DECLARE
    v_total_quantity INTEGER;
    v_booked_count INTEGER;
BEGIN
    -- Get total quantity of the car
    SELECT quantity INTO v_total_quantity FROM public.cars WHERE id = p_car_id;
    
    -- Count overlapping bookings that are not cancelled
    -- We consider a car booked if it's in any status except 'Cancelled' or 'Returned'
    -- (Actually, even if 'Returned', it might need time for cleaning, but let's stick to simple logic first)
    SELECT COUNT(*) INTO v_booked_count
    FROM public.bookings
    WHERE car_id = p_car_id
      AND status NOT IN ('Cancelled', 'Returned')
      AND (
        (start_date <= p_end_date AND end_date >= p_start_date)
      );
      
    RETURN v_total_quantity - v_booked_count;
END;
$$ LANGUAGE plpgsql;
