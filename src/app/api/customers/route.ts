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

    // Get all users with role USER
    const { data: customers, error } = await supabase
      .from("users")
      .select("id, name, email, role, ktp_url, selfie_url, profile_photo_url, created_at, kyc_status")
      .eq("role", "USER")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ customers: customers || [] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
