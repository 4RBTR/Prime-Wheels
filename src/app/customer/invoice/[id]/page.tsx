"use client";

import Link from "next/link";
import { use } from "react";

export default function DigitalInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  
  // Mock logic
  const isPaid = unwrappedParams.id === "B-1800" || unwrappedParams.id === "B-1502";
  
  return (
    <div className="py-8 min-h-screen">
      
      {/* Header Actions */}
      <div className="mb-8 flex justify-between items-center">
         <Link href="/customer/bookings" className="text-slate-500 hover:text-slate-900 font-bold text-sm inline-flex items-center transition-colors">
            &larr; Back to My Bookings
         </Link>
         <div className="flex gap-3">
            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-colors text-sm">
               Download PDF
            </button>
            <button className="bg-slate-900 border border-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 shadow-sm transition-colors text-sm flex items-center gap-2">
               <span>🖨️</span> Print
            </button>
         </div>
      </div>

      {/* The Printable Invoice Paper */}
      <div className="max-w-3xl mx-auto bg-white rounded-t-sm rounded-b-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 relative overflow-hidden">
         {/* Top Color Bar */}
         <div className="h-2 w-full bg-slate-900"></div>

         <div className="p-10 md:p-14">
            {/* Header: Logo & Title */}
            <div className="flex justify-between items-start mb-16">
               <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                     <span className="text-white font-black text-xl">R</span>
                  </div>
                  <div>
                     <h2 className="font-extrabold text-xl tracking-tight text-slate-900">Prime Wheels</h2>
                     <p className="text-xs text-slate-500 font-medium">Premium Mobility Solutions</p>
                  </div>
               </div>
               <div className="text-right">
                  <h1 className="text-3xl font-black text-slate-200 tracking-wider uppercase mb-2">INVOICE</h1>
                  <span className="text-sm font-bold text-slate-700 block">Ref No: <span className="text-slate-900">{unwrappedParams.id}</span></span>
               </div>
            </div>

            {/* Bill To & Info */}
            <div className="grid grid-cols-2 gap-8 mb-12">
               <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Billed To</h3>
                  <p className="font-bold text-slate-900 text-lg">Andi Wijaya</p>
                  <p className="text-sm text-slate-500 leading-relaxed mt-1">
                     andi.wijaya@example.com<br/>
                     +62 812-3344-5566<br/>
                     Jakarta, Indonesia
                  </p>
               </div>
               <div className="text-right">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Booking Information</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                     <span className="font-bold text-slate-900">Issue Date:</span> April 16, 2026<br/>
                     <span className="font-bold text-slate-900">Payment Due:</span> April 16, 2026<br/>
                     <span className="font-bold text-slate-900">Status:</span> 
                     <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {isPaid ? "PAID" : "PENDING"}
                     </span>
                  </p>
               </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden mb-10">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Description</th>
                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase text-center">Qty / Days</th>
                        <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase text-right">Amount</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     <tr>
                        <td className="py-5 px-6">
                           <span className="font-bold text-slate-900 block mb-1">Mercedes-Benz S450</span>
                           <span className="text-xs text-slate-500">Pick-up: Apr 16 | Return: Apr 19</span>
                        </td>
                        <td className="py-5 px-6 text-center font-medium text-slate-700">3</td>
                        <td className="py-5 px-6 text-right font-bold text-slate-900">Rp 10.500.000</td>
                     </tr>
                     <tr>
                        <td className="py-5 px-6">
                           <span className="font-bold text-slate-900 block mb-1">Refundable Security Deposit</span>
                           <span className="text-xs text-slate-500">Held until safe return of vehicle</span>
                        </td>
                        <td className="py-5 px-6 text-center font-medium text-slate-700">1</td>
                        <td className="py-5 px-6 text-right font-bold text-slate-900">Rp 5.000.000</td>
                     </tr>
                  </tbody>
               </table>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end mb-16">
               <div className="w-full md:w-1/2 space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium text-slate-500 px-4">
                     <span>Subtotal</span>
                     <span>Rp 15.500.000</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium text-slate-500 px-4 border-b border-slate-100 pb-3">
                     <span>Tax (11%)</span>
                     <span>Rp 1.155.000</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                     <span className="font-bold text-slate-900">Grand Total</span>
                     <span className="text-2xl font-black text-slate-900 tracking-tighter">Rp 16.655.000</span>
                  </div>
               </div>
            </div>

            {/* Footer / Thank you */}
            <div className="border-t border-slate-200 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
               <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Terms & Conditions</h4>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed">Deposit will be refunded 1x24h after vehicle inspection. Late returns are subject to a 15% daily penalty fee.</p>
               </div>
               <div className="text-xs font-bold text-slate-400">
                  Thank you for your business.
               </div>
            </div>

         </div>

         {/* Cutout Zig-Zag Mock Effect at bottom */}
         <div className="h-6 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iNSIgZmlsbD0iI2Y4ZmFmYyIvPjwvc3ZnPg==')] bg-repeat-x opacity-50 absolute bottom-0"></div>
      </div>
    </div>
  );
}
