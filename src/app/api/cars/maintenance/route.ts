import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { carId, action } = body;

    if (!carId || action !== 'RECOVER') {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    // Get current maintenance quantity
    const { data: carData } = await supabase.from("cars").select("maintenance_quantity").eq("id", carId).single();
    const currentMaintenance = carData?.maintenance_quantity || 0;
    
    if (currentMaintenance <= 0) {
      return NextResponse.json({ message: "No units in maintenance" }, { status: 400 });
    }
    
    const { error: carErr } = await supabase
      .from("cars")
      .update({ maintenance_quantity: currentMaintenance - 1 })
      .eq("id", carId)
      .eq("admin_id", session.user.id);
      
    if (carErr) throw carErr;

    return NextResponse.json({ success: true, message: "Unit recovered from maintenance" });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Recover maintenance error:", err);
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
