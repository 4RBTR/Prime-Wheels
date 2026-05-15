/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";
// @ts-expect-error Untyped legacy JS library
import midtransClient from "midtrans-client";

export async function POST(req: Request) {
  try {
    // 1. Verify User Session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Silakan masuk (Login) terlebih dahulu sebelum menyewa kendaraan." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { carId, price, startDate, endDate } = body;

    if (!carId || !price || !startDate || !endDate) {
      return NextResponse.json(
        { message: "Data pemesanan tidak lengkap. Mohon cek kembali inputan Anda." },
        { status: 400 }
      );
    }

    // 2. Fetch Car Details to identify the Admin/Owner and verify existance
    const { data: car, error: carErr } = await supabase
      .from("cars")
      .select("admin_id, name, brand")
      .eq("id", carId)
      .single();

    if (carErr || !car) {
      return NextResponse.json(
        { message: "Kendaraan tidak ditemukan atau data korup." },
        { status: 404 }
      );
    }

    // 3. Construct Unique Booking Code
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(Math.random() * 1000);
    const bookingCode = `RNT-${new Date().getFullYear()}-${timestamp}${random}`;

    // 4. Insert Booking Record in Database
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
          total_price: price,
          status: "Awaiting Payment",
          payment_status: "Pending",
        },
      ])
      .select()
      .single();

    if (bookingErr || !booking) {
      throw new Error(`Gagal menyimpan reservasi ke database: ${bookingErr?.message}`);
    }

    // 5. Midtrans Integration with Graceful Fallback / Mock bypass
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    if (!serverKey || !clientKey || serverKey === "your-server-key") {
      // No API Key provided -> Bypass gracefully by simulating Midtrans for immediate user review!
      // Update booking status to mock-paid to enable immediate testing across dashboards
      await supabase
        .from("bookings")
        .update({ 
          payment_status: "Paid", 
          status: "Ongoing" 
        })
        .eq("id", booking.id);

      return NextResponse.json({ 
        isMock: true, 
        bookingId: booking.id 
      });
    }

    // 6. Real Midtrans Snap Transaction Generation
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: serverKey,
      clientKey: clientKey
    });

    const parameter = {
      transaction_details: {
        order_id: bookingCode,
        gross_amount: Math.floor(price)
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: session.user.name || "Customer",
        email: session.user.email || "customer@primewheels.com",
      },
      item_details: [{
        id: carId,
        price: Math.floor(price),
        quantity: 1,
        name: `${car.brand} ${car.name}`.slice(0, 50)
      }]
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({ 
      token: transaction.token, 
      redirect_url: transaction.redirect_url 
    });

  } catch (error: any) {
    console.error("CRITICAL API ERROR IN CHECKOUT:", error);
    return NextResponse.json(
      { message: error.message || "Terjadi kegagalan internal server dalam memproses checkout." },
      { status: 500 }
    );
  }
}
