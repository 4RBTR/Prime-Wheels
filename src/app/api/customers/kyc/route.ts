import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, role, kyc_status, ktp_url, selfie_url, created_at")
      .eq("role", "USER")
      .eq("kyc_status", "Pending")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ pendingUsers: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId, status } = await req.json();

    if (!userId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!['Approved', 'Rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { error } = await supabase
      .from("users")
      .update({ kyc_status: status })
      .eq("id", userId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: `KYC status updated to ${status}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
