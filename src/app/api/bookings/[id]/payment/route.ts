import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const formData = await req.formData();
    const fullProof = formData.get("fullProof") as File;

    if (!fullProof) {
      return NextResponse.json({ message: "Bukti pelunasan tidak ditemukan." }, { status: 400 });
    }

    // Verify booking
    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .select("id, user_id, payment_status")
      .eq("id", id)
      .single();

    if (bookingErr || !booking) {
      return NextResponse.json({ message: "Booking tidak ditemukan." }, { status: 404 });
    }

    if (booking.user_id !== session.user.id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    if (booking.payment_status !== "DP Paid") {
      return NextResponse.json({ message: "Status pembayaran tidak valid untuk pelunasan." }, { status: 400 });
    }

    // Upload Full Payment Proof
    const fileExt = fullProof.name.split('.').pop();
    const fileName = `full_${booking.id}_${Date.now()}.${fileExt}`;
    const { error: uploadErr } = await supabase.storage
      .from('payments')
      .upload(fileName, fullProof);

    if (uploadErr) {
      throw new Error("Gagal mengunggah bukti pelunasan");
    }

    const { data: publicUrlData } = supabase.storage
      .from('payments')
      .getPublicUrl(fileName);

    const { error: updateErr } = await supabase
      .from("bookings")
      .update({
        payment_full_url: publicUrlData.publicUrl,
        payment_status: "Awaiting Full Payment Verification"
      })
      .eq("id", booking.id);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true, message: "Bukti pelunasan berhasil diunggah." });
  } catch (error: any) {
    console.error("Upload Full Payment Error:", error);
    return NextResponse.json({ message: error.message || "Terjadi kesalahan server" }, { status: 500 });
  }
}
