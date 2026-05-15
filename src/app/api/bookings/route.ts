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

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*, users!bookings_user_id_fkey(name, email), cars(name, brand)")
      .eq("admin_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ bookings: bookings || [] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { car_id, admin_id, start_date, end_date, total_price } = body;

    const bookingCode = `RNT-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

    const { data, error } = await supabase
      .from("bookings")
      .insert([{
        booking_code: bookingCode,
        user_id: session.user.id,
        car_id,
        admin_id,
        start_date,
        end_date,
        total_price,
        status: "Awaiting Payment",
        payment_status: "Pending",
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: "Booking created", booking: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
