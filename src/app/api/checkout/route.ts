import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Silakan masuk (Login) terlebih dahulu." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const carId = formData.get("carId") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const dpProof = formData.get("dpProof") as File;
    const quantityParam = formData.get("quantity") as string;
    const quantity = quantityParam ? parseInt(quantityParam) : 1;

    if (!carId || !startDate || !endDate || !dpProof) {
      return NextResponse.json(
        { message: "Data tidak lengkap. Pastikan bukti DP sudah diunggah." },
        { status: 400 }
      );
    }

    // Check KYC Status
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("kyc_status")
      .eq("id", session.user.id)
      .single();

    if (userErr || user?.kyc_status !== 'Approved') {
      return NextResponse.json(
        { message: "Akun Anda belum disetujui (e-KYC Pending/Rejected). Silakan tunggu verifikasi admin." },
        { status: 403 }
      );
    }

    const { data: car, error: carErr } = await supabase
      .from("cars")
      .select("admin_id, name, brand, price_per_day, admin_status, quantity")
      .eq("id", carId)
      .single();

    if (carErr || !car) {
      return NextResponse.json({ message: "Kendaraan tidak ditemukan." }, { status: 404 });
    }

    if (car.admin_status !== 'Available') {
       return NextResponse.json({ message: "Maaf, kendaraan ini sedang dalam masa perbaikan atau tidak tersedia untuk disewa." }, { status: 403 });
    }

    // Check availability using the RPC function we created
    const { data: availability, error: availErr } = await supabase.rpc('check_car_availability', {
       p_car_id: carId,
       p_start_date: startDate,
       p_end_date: endDate
    });

    if (availErr) {
       console.error("AVAILABILITY ERROR:", availErr);
       // Fallback if RPC fails for some reason
    } else if (availability < quantity) {
       return NextResponse.json({ message: `Maaf, unit yang tersedia untuk tanggal tersebut hanya ${Math.max(0, availability)} unit.` }, { status: 403 });
    }

    // Calculate duration & price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    
    const rentTotal = car.price_per_day * days * quantity;
    const tax = rentTotal * 0.11;
    const escrow = 100000 * quantity; // Escrow is per car
    const grandTotal = rentTotal + tax + escrow;
    const dpAmount = Math.floor(grandTotal * 0.3);

    // Upload DP Proof
    const fileExt = dpProof.name.split('.').pop();
    const fileName = `dp_${session.user.id}_${Date.now()}.${fileExt}`;
    const { error: uploadErr } = await supabase.storage
      .from('payments')
      .upload(fileName, dpProof);

    if (uploadErr) {
      throw new Error("Gagal mengunggah bukti pembayaran DP");
    }

    const { data: publicUrlData } = supabase.storage
      .from('payments')
      .getPublicUrl(fileName);

    const bookingCode = `RNT-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 1000)}`;

    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .insert([
        {
          booking_code: bookingCode,
          user_id: session.user.id,
          car_id: carId,
          admin_id: car.admin_id,
          start_date: startDate,
          end_date: endDate,
          quantity: quantity,
          total_price: grandTotal,
          dp_amount: dpAmount,
          payment_dp_url: publicUrlData.publicUrl,
          status: "Awaiting Approval",
          payment_status: "Awaiting DP Verification",
        },
      ])
      .select()
      .single();

    if (bookingErr || !booking) {
      throw new Error(`Gagal menyimpan reservasi: ${bookingErr?.message}`);
    }

    return NextResponse.json({ success: true, bookingId: booking.id });

  } catch (error: any) {
    console.error("API ERROR IN CHECKOUT:", error);
    return NextResponse.json(
      { message: error.message || "Terjadi kegagalan server." },
      { status: 500 }
    );
  }
}
