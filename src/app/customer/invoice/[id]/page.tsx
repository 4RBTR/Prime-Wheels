/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function DigitalInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const bookingId = unwrappedParams.id;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookingInvoice() {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*, users!bookings_user_id_fkey(name, email), cars(*)")
          .eq("id", bookingId)
          .single();

        if (error) throw error;
        setBooking(data);
      } catch (err) {
        console.error("Error fetching invoice:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookingInvoice();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-4xl max-w-3xl mx-auto my-10 px-4">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Invoice Not Found</h2>
        <p className="text-slate-500 mb-8">We couldn't find the invoice record you requested.</p>
        <Link href="/customer/bookings" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors text-sm">
          Back to Bookings
        </Link>
      </div>
    );
  }

  const getDaysCount = (start: string, end: string) => {
    const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = getDaysCount(booking.start_date, booking.end_date);
  const isPaid = booking.payment_status === "Paid";

  // Reverse calculate subtotal
  const deposit = 5000000;
  const subtotal = booking.total_price - deposit;

  return (
    <div className="py-8 min-h-screen px-4">
      
      {/* Header Actions */}
      <div className="mb-8 flex justify-between items-center max-w-3xl mx-auto">
         <Link href="/customer/bookings" className="text-slate-500 hover:text-slate-900 font-bold text-xs md:text-sm inline-flex items-center transition-colors">
            &larr; Back to My Bookings
         </Link>
         <div className="flex gap-3">
            <button 
               onClick={() => window.print()} 
               className="bg-slate-900 border border-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 shadow-md transition-colors text-xs flex items-center gap-2 hover:scale-105 duration-200"
            >
               <span>🖨️</span> Print Invoice
            </button>
         </div>
      </div>

      {/* The Printable Invoice Paper */}
      <div className="max-w-3xl mx-auto bg-white rounded-t-sm rounded-b-3xl shadow-2xl border border-slate-200 relative overflow-hidden">
         {/* Top Color Bar */}
         <div className="h-2 w-full bg-slate-900"></div>

         <div className="p-6 md:p-12">
            {/* Header: Logo & Title */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-12 border-b border-slate-100 pb-8">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                     <span className="text-white font-black text-xl">R</span>
                  </div>
                  <div>
                     <h2 className="font-extrabold text-xl tracking-tight text-slate-900 leading-tight">Prime Wheels</h2>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Premium Mobility Platform</p>
                  </div>
               </div>
               <div className="text-left md:text-right">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-200 tracking-wider uppercase mb-1">INVOICE</h1>
                  <span className="text-sm font-bold text-slate-700 block">Code: <span className="text-slate-900 font-black">{booking.booking_code}</span></span>
               </div>
            </div>

            {/* Bill To & Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Billed To</h3>
                  <p className="font-black text-slate-900 text-lg">{booking.users?.name}</p>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                     {booking.users?.email}
                  </p>
               </div>
               <div className="text-left md:text-right">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Rental Information</h3>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                     <span className="font-bold text-slate-900">Issue Date:</span> {new Date(booking.created_at).toLocaleDateString("id-ID", {day: "2-digit", month: "long", year: "numeric"})}<br/>
                     <span className="font-bold text-slate-900">Status:</span> 
                     <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider inline-block border ${isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {booking.payment_status.toUpperCase()}
                     </span>
                  </p>
               </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden mb-10 shadow-sm">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                        <th className="py-3 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</th>
                        <th className="py-3 px-6 text-[10px] font-bold text-slate-500 uppercase text-center tracking-widest">Duration</th>
                        <th className="py-3 px-6 text-[10px] font-bold text-slate-500 uppercase text-right tracking-widest">Amount</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     <tr>
                        <td className="py-5 px-6">
                           <span className="font-bold text-slate-900 block mb-1">{booking.cars?.brand} {booking.cars?.name}</span>
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                             {new Date(booking.start_date).toLocaleDateString("id-ID")} &mdash; {new Date(booking.end_date).toLocaleDateString("id-ID")}
                           </span>
                        </td>
                        <td className="py-5 px-6 text-center font-bold text-slate-700">{days} {days === 1 ? 'Day' : 'Days'}</td>
                        <td className="py-5 px-6 text-right font-bold text-slate-900">Rp {subtotal > 0 ? subtotal.toLocaleString("id-ID") : booking.total_price.toLocaleString("id-ID")}</td>
                     </tr>
                     {subtotal > 0 && (
                       <tr>
                          <td className="py-5 px-6">
                             <span className="font-bold text-slate-900 block mb-1">Refundable Security Deposit</span>
                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Refunded post safe return</span>
                          </td>
                          <td className="py-5 px-6 text-center font-bold text-slate-700">Flat</td>
                          <td className="py-5 px-6 text-right font-bold text-slate-900">Rp {deposit.toLocaleString("id-ID")}</td>
                       </tr>
                     )}
                  </tbody>
               </table>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end mb-16">
               <div className="w-full md:w-1/2">
                  <div className="flex justify-between items-center bg-slate-950 p-5 rounded-2xl text-white shadow-xl shadow-slate-900/20">
                     <span className="font-bold text-sm text-slate-400">Grand Total</span>
                     <span className="text-2xl font-black tracking-tighter">Rp {booking.total_price.toLocaleString("id-ID")}</span>
                  </div>
               </div>
            </div>

            {/* Footer / Thank you */}
            <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
               <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">Corporate Terms</h4>
                  <p className="text-[10px] text-slate-500 font-medium max-w-sm leading-relaxed">Refund deposits clear within 24 hours post-vehicle safety checks. Unregistered drivers violate insurance coverage.</p>
               </div>
               <div className="text-xs font-bold text-slate-400">
                  Thank you for choosing Prime Wheels.
               </div>
            </div>

         </div>

         {/* Cutout Zig-Zag Border pattern mockup at bottom */}
         <div className="h-6 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iNSIgZmlsbD0iI2Y4ZmFmYyIvPjwvc3ZnPg==')] bg-repeat-x opacity-50 absolute bottom-0"></div>
      </div>
    </div>
  );
}
