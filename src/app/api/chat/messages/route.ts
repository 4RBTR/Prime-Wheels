import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("userId");
    
    if (!otherUserId) return NextResponse.json({ error: "userId required" }, { status: 400 });

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${session.user.id})`)
      .order("created_at", { ascending: true });

    if (error) throw error;
    
    // Mark as read asynchronously
    supabase
      .from("chat_messages")
      .update({ is_read: true })
      .eq("receiver_id", session.user.id)
      .eq("sender_id", otherUserId)
      .eq("is_read", false)
      .then();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const receiverId = formData.get("receiver_id") as string;
    const content = formData.get("content") as string;
    const attachment = formData.get("attachment") as File | null;

    if (!receiverId) return NextResponse.json({ error: "receiver_id required" }, { status: 400 });
    if (!content && !attachment) return NextResponse.json({ error: "content or attachment required" }, { status: 400 });

    let attachmentUrl = null;
    let attachmentType = null;

    if (attachment && typeof attachment !== 'string') {
      const arrayBuffer = await attachment.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const ext = attachment.name.split('.').pop();
      const fileName = `chat/${uuidv4()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('prime')
        .upload(fileName, buffer, {
          contentType: attachment.type,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('prime').getPublicUrl(fileName);
      attachmentUrl = publicUrlData.publicUrl;
      attachmentType = attachment.type;
    }

    const { data: message, error } = await supabase
      .from("chat_messages")
      .insert([
        {
          sender_id: session.user.id,
          receiver_id: receiverId,
          content: content || "",
          attachment_url: attachmentUrl,
          attachment_type: attachmentType,
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
