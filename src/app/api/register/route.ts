import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const roleParam = formData.get("role") as string;
    
    // e-KYC files
    const ktpFile = formData.get("ktp") as File | null;
    const selfieFile = formData.get("selfie") as File | null;

    if (!name || !email || !password || !roleParam) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const role = roleParam.toUpperCase();
    if (role !== "ADMIN" && role !== "USER") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);
    let ktp_url = null;
    let selfie_url = null;

    // Helper to upload file to prime bucket
    const uploadFile = async (file: File, folder: string) => {
      const buffer = await file.arrayBuffer();
      const ext = file.name.split('.').pop();
      const fileName = `${folder}/${uuidv4()}.${ext}`;
      
      const { data, error } = await supabase.storage
        .from('prime')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false
        });
        
      if (error) throw error;
      
      const { data: publicUrlData } = supabase.storage
        .from('prime')
        .getPublicUrl(fileName);
        
      return publicUrlData.publicUrl;
    };

    if (ktpFile) {
      ktp_url = await uploadFile(ktpFile, 'ktp');
    }
    
    if (selfieFile) {
      selfie_url = await uploadFile(selfieFile, 'selfie');
    }

    const { error: insertError } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          password_hash,
          role,
          ktp_url,
          selfie_url,
        }
      ]);

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
