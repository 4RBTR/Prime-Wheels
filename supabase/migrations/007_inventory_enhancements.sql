-- Add maintenance_quantity to cars table to track how many units are broken
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS maintenance_quantity INTEGER DEFAULT 0;

-- Add quantity to bookings table to support renting multiple units
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;

-- Update the check_car_availability RPC to account for maintenance and booking quantity
CREATE OR REPLACE FUNCTION check_car_availability(p_car_id UUID, p_start_date TIMESTAMP, p_end_date TIMESTAMP)
RETURNS INTEGER AS $$
DECLARE
    v_total_quantity INTEGER;
    v_maintenance_quantity INTEGER;
    v_booked_count INTEGER;
BEGIN
    -- Get total quantity and maintenance quantity of the car
    SELECT quantity, COALESCE(maintenance_quantity, 0) 
    INTO v_total_quantity, v_maintenance_quantity 
    FROM public.cars 
    WHERE id = p_car_id;
    
    -- Sum up the quantity of overlapping active bookings
    SELECT COALESCE(SUM(quantity), 0) INTO v_booked_count
    FROM public.bookings
    WHERE car_id = p_car_id
      AND status NOT IN ('Cancelled', 'Returned')
      AND (
        (start_date <= p_end_date AND end_date >= p_start_date)
      );
      
    -- Return available units
    RETURN v_total_quantity - v_maintenance_quantity - v_booked_count;
END;
$$ LANGUAGE plpgsql;
