import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminId = session.user.id;

    // Total cars (sum of quantities)
    const { data: carsData } = await supabase
      .from("cars")
      .select("quantity")
      .eq("admin_id", adminId)
      .neq("admin_status", "Hidden");
    const totalCars = carsData?.reduce((sum, c) => sum + (c.quantity || 1), 0) || 0;

    // Active rentals (On Road)
    const { count: activeRentals } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("admin_id", adminId)
      .eq("status", "On Road");

    // Total unique customers
    const { data: bookingUsers } = await supabase
      .from("bookings")
      .select("user_id")
      .eq("admin_id", adminId);
    const uniqueCustomers = new Set(bookingUsers?.map(b => b.user_id) || []);
    const totalCustomers = uniqueCustomers.size;

    // Revenue
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Fetch all paid bookings for this admin
    const { data: paidBookings } = await supabase
      .from("bookings")
      .select("total_price, updated_at")
      .eq("admin_id", adminId)
      .eq("payment_status", "Paid");

    const revenueTotal = paidBookings?.reduce((sum, b) => sum + b.total_price, 0) || 0;
    
    const revenueToday = paidBookings?.filter(b => {
      const date = new Date(b.updated_at);
      return date >= todayStart && date <= todayEnd;
    }).reduce((sum, b) => sum + b.total_price, 0) || 0;

    // Recent bookings
    const { data: recentBookings } = await supabase
      .from("bookings")
      .select("*, users!bookings_user_id_fkey(name), cars(name, brand)")
      .eq("admin_id", adminId)
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({
      stats: {
        totalCars,
        activeRentals: activeRentals || 0,
        totalCustomers,
        revenueToday,
        revenueTotal,
      },
      recentBookings: recentBookings || [],
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
