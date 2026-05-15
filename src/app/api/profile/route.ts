import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, role, profile_photo_url, created_at")
      .eq("id", session.user.id)
      .single();

    if (error) throw error;

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const profilePhoto = formData.get("profilePhoto") as File;

    const updates: any = {};
    if (name) updates.name = name;

    if (profilePhoto) {
      const arrayBuffer = await profilePhoto.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileExt = profilePhoto.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}-profile.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("prime") // Reusing prime bucket for profile photos too, or create a users bucket. prime is fine.
        .upload(fileName, buffer, {
          contentType: profilePhoto.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("prime")
        .getPublicUrl(fileName);

      updates.profile_photo_url = publicUrlData.publicUrl;
    }

    if (Object.keys(updates).length > 0) {
      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", session.user.id)
        .select("id, name, email, role, profile_photo_url, created_at")
        .single();

      if (error) throw error;

      return NextResponse.json({ message: "Profile updated successfully", user: data }, { status: 200 });
    }

    return NextResponse.json({ message: "No updates provided" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
