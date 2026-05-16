import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, carId, setMaintenance } = body;

    if (!status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 });
    }

    // 1. Update Booking Status
    const { error: updateErr } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);

    if (updateErr) throw updateErr;

    // 2. If 'Returned' and setMaintenance is true, hold the car
    if (status === 'Returned' && setMaintenance && carId) {
      const { error: carErr } = await supabase
        .from("cars")
        .update({ admin_status: 'Maintenance' })
        .eq("id", carId);
        
      if (carErr) throw carErr;
    }

    return NextResponse.json({ success: true, message: `Status updated to ${status}` });
  } catch (error: any) {
    console.error("Update status error:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}
