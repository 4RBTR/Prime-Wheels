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

    // Total cars owned by this admin
    const { count: totalCars } = await supabase
      .from("cars")
      .select("*", { count: "exact", head: true })
      .eq("admin_id", adminId);

    // Active rentals (On Road)
    const { count: activeRentals } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("admin_id", adminId)
      .eq("status", "On Road");

    // Total customers who booked from this admin
    const { data: bookingUsers } = await supabase
      .from("bookings")
      .select("user_id")
      .eq("admin_id", adminId);
    const uniqueCustomers = new Set(bookingUsers?.map(b => b.user_id) || []);
    const totalCustomers = uniqueCustomers.size;

    // Revenue today
    const today = new Date().toISOString().split("T")[0];
    const { data: todayTransactions } = await supabase
      .from("transactions")
      .select("amount")
      .eq("admin_id", adminId)
      .eq("status", "Verified")
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`);
    const revenueToday = todayTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0;

    // Recent bookings
    const { data: recentBookings } = await supabase
      .from("bookings")
      .select("*, users!bookings_user_id_fkey(name), cars(name, brand)")
      .eq("admin_id", adminId)
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({
      stats: {
        totalCars: totalCars || 0,
        activeRentals: activeRentals || 0,
        totalCustomers,
        revenueToday,
      },
      recentBookings: recentBookings || [],
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
