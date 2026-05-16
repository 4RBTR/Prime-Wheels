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
    const { action } = body; // action can be 'APPROVE_DP', 'REJECT_DP', 'APPROVE_FULL', 'REJECT_FULL'

    if (!action) {
      return NextResponse.json({ message: "Action is required" }, { status: 400 });
    }

    const { data: booking, error: fetchErr } = await supabase
      .from("bookings")
      .select("payment_status, status")
      .eq("id", id)
      .single();

    if (fetchErr || !booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    let updateData = {};

    switch (action) {
      case 'APPROVE_DP':
        if (booking.payment_status !== 'Awaiting DP Verification') throw new Error("Invalid status for DP Approval");
        updateData = { payment_status: 'DP Paid', status: 'Ready for Pickup' }; // At this point car is booked
        break;
      case 'REJECT_DP':
        if (booking.payment_status !== 'Awaiting DP Verification') throw new Error("Invalid status for DP Rejection");
        updateData = { payment_status: 'Pending', status: 'Awaiting Payment' }; // They need to reupload
        break;
      case 'APPROVE_FULL':
        if (booking.payment_status !== 'Awaiting Full Payment Verification') throw new Error("Invalid status for Full Payment Approval");
        updateData = { payment_status: 'Paid' };
        break;
      case 'REJECT_FULL':
        if (booking.payment_status !== 'Awaiting Full Payment Verification') throw new Error("Invalid status for Full Payment Rejection");
        updateData = { payment_status: 'DP Paid' }; // They need to reupload full payment
        break;
      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    const { error: updateErr } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", id);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, message: "Payment verified successfully" });
  } catch (error: any) {
    console.error("Approve payment error:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}
