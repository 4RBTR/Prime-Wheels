import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get("adminId");
    const id = searchParams.get("id");

    if (id) {
      const { data: car, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return NextResponse.json({ car }, { status: 200 });
    }

    let query = supabase.from("cars").select("*").order("created_at", { ascending: false });

    if (adminId) {
      query = query.eq("admin_id", adminId);
    } else {
      query = query.eq("is_available", true); // For public catalog
    }

    const { data: cars, error } = await query;

    if (error) throw error;

    return NextResponse.json({ cars }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const type = formData.get("type") as string;
    const transmission = formData.get("transmission") as string;
    const seats = parseInt(formData.get("seats") as string);
    const price_per_day = parseInt(formData.get("price_per_day") as string);
    const imageFile = formData.get("image") as File;

    if (!name || !brand || !type || !transmission || !seats || !price_per_day) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    let imageUrl = null;

    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("cars")
        .upload(fileName, buffer, {
          contentType: imageFile.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("cars")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("cars")
      .insert([
        {
          admin_id: session.user.id,
          name,
          brand,
          type,
          transmission,
          seats,
          price_per_day,
          image_url: imageUrl,
          is_available: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: "Car added successfully", car: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
