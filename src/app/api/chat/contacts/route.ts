import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (session.user as any).role;
    const city = (session.user as any).city;

    if (role === "USER") {
      // Find admin for user's city
      const { data: admin, error } = await supabase
        .from("users")
        .select("id, name, city, role, profile_photo_url")
        .eq("role", "ADMIN")
        .eq("city", city)
        .maybeSingle();
        
      if (error) throw error;
      return NextResponse.json({ contacts: admin ? [admin] : [] }, { status: 200 });
    } else {
      // Admin: Fetch all users in their city, AND all other admins
      const { data: contacts, error } = await supabase
        .from("users")
        .select("id, name, city, role, profile_photo_url")
        .neq("id", session.user.id)
        .or(`city.eq.${city},role.eq.ADMIN`);
        
      if (error) throw error;
      return NextResponse.json({ contacts: contacts || [] }, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
