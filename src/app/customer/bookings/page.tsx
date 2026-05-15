"use client";

import Link from "next/link";
import { useState } from "react";

// Mock Data for User Bookings
const myBookings = [
   { id: "B-2104", car: "Mercedes-Benz S450", date: "April 16, 2026", duration: "3 Days", total: 10500000, status: "Awaiting Admin Verification" },
   { id: "B-1800", car: "BMW 740Li", date: "March 10, 2026", duration: "2 Days", total: 9000000, status: "Completed" },
   { id: "B-1502", car: "Hyundai Palisade", date: "January 04, 2026", duration: "1 Day", total: 1800000, status: "Deposit Refunded" },
];

export default function MyBookingsPage() {
   const [activeTab, setActiveTab] = useState("Active");
   const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

   const isPaid = selectedInvoice === "B-1800" || selectedInvoice === "B-1502";

   return (
      <div className="py-8 relative">
         {/* Header */}
         <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
            <p className="text-slate-500 mt-2 font-medium">Track your active rentals and past trips history.</p>
         </div>

         {/* Tabs */}
         <div className="flex border-b border-slate-200 mb-8 gap-8">
            <button
               onClick={() => setActiveTab("Active")}
               className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'Active' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
            >
               Active Trips
               {activeTab === 'Active' && <div className="absolute -bottom-px left-0 w-full h-0.5 bg-slate-900 rounded-t-full"></div>}
            </button>
            <button
               onClick={() => setActiveTab("History")}
               className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'History' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
            >
               Past History
               {activeTab === 'History' && <div className="absolute -bottom-px left-0 w-full h-0.5 bg-slate-900 rounded-t-full"></div>}
            </button>
         </div>

         <div className="space-y-6 flex-1">
            {myBookings.filter(b => activeTab === "Active" ? b.status.includes("Awaiting") : !b.status.includes("Awaiting")).map(booking => (
               <div key={booking.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-all">

                  {/* Left: Car & Ref */}
                  <div className="flex gap-6 items-center">
                     <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl">
                        🚘
                     </div>
                     <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Ref: {booking.id}</span>
                        <h3 className="text-xl font-bold text-slate-900">{booking.car}</h3>
                        <span className="mt-1 text-sm text-slate-500 font-medium block">
                           {booking.date} &bull; {booking.duration}
                        </span>
                     </div>
                  </div>

                  {/* Middle: Money & Status */}
                  <div className="text-left md:text-right w-full md:w-auto">
                     <span className="text-2xl font-black text-slate-900 tracking-tighter block mb-2">Rp {booking.total.toLocaleString("id-ID")}</span>
                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold inline-block border
                     ${booking.status === 'Completed' ? 'bg-slate-50 text-slate-500 border-slate-200' : ''}
                     ${booking.status === 'Deposit Refunded' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                     ${booking.status === 'Awaiting Admin Verification' ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse' : ''}
                  `}>
                        {booking.status}
                     </span>
                  </div>

                  {/* Right: Actions */}
                  {(activeTab === "Active" || activeTab === "History") && (
                     <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col gap-3">
                        <button
                           onClick={() => setSelectedInvoice(booking.id)}
                           className="bg-white border border-slate-200 hover:border-slate-400 text-slate-700 text-center font-bold text-sm px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                        >
                           View Invoice
                        </button>
                        {activeTab === "Active" && (
                           <button className="text-xs font-bold text-amber-600 hover:text-amber-700">
                              Contact Support
                           </button>
                        )}
                     </div>
                  )}
               </div>
            ))}

            {myBookings.filter(b => activeTab === "Active" ? b.status.includes("Awaiting") : !b.status.includes("Awaiting")).length === 0 && (
               <div className="text-center py-20 bg-slate-50 border border-slate-200 border-dashed rounded-3xl">
                  <p className="text-slate-500 font-medium">No {activeTab.toLowerCase()} bookings found.</p>
                  {activeTab === "Active" && <Link href="/customer/dashboard" className="text-amber-600 font-bold mt-2 inline-block">Rent a car now</Link>}
               </div>
            )}
         </div>

         {/* Pop-up Invoice Modal Overlay */}
         {selectedInvoice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               {/* Backdrop */}
               <div
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                  onClick={() => setSelectedInvoice(null)}
               ></div>

               {/* Modal Content */}
               <div className="relative z-10 w-full max-w-2xl rounded-t-sm rounded-b-2xl animate-fade-in shadow-2xl my-auto scale-95 origin-center">

                  <div className="bg-white rounded-t-sm rounded-b-2xl border border-slate-200 relative overflow-hidden">
                     {/* Top Color Bar */}
                     <div className="h-2 w-full bg-slate-900 relative">
                        <button
                           onClick={() => setSelectedInvoice(null)}
                           className="absolute top-4 right-4 bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors z-50 focus:outline-none"
                        >
                           ✕
                        </button>
                     </div>

                     <div className="p-6 md:p-8 pt-8 md:pt-10">
                        {/* Header: Logo & Title */}
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                                 <span className="text-white font-black text-lg">R</span>
                              </div>
                              <div>
                                 <h2 className="font-extrabold text-lg tracking-tight text-slate-900">Prime Wheels</h2>
                                 <p className="text-[10px] text-slate-500 font-medium">Premium Mobility Solutions</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <h1 className="text-2xl font-black text-slate-200 tracking-wider uppercase mb-1">INVOICE</h1>
                              <span className="text-xs font-bold text-slate-700 block">Ref No: <span className="text-slate-900">{selectedInvoice}</span></span>
                           </div>
                        </div>

                        {/* Bill To & Info */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                           <div>
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Billed To</h3>
                              <p className="font-bold text-slate-900 text-lg">Andi Wijaya</p>
                              <p className="text-sm text-slate-500 leading-relaxed mt-1">
                                 andi.wijaya@example.com<br />
                                 +62 812-3344-5566<br />
                                 Jakarta, Indonesia
                              </p>
                           </div>
                           <div className="text-right">
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Booking Information</h3>
                              <p className="text-sm text-slate-700 leading-relaxed">
                                 <span className="font-bold text-slate-900">Issue Date:</span> April 16, 2026<br />
                                 <span className="font-bold text-slate-900">Payment Due:</span> April 16, 2026<br />
                                 <span className="font-bold text-slate-900">Status:</span>
                                 <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {isPaid ? "PAID" : "PENDING"}
                                 </span>
                              </p>
                           </div>
                        </div>

                        {/* Itemized Table */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                           <table className="w-full text-left">
                              <thead className="bg-slate-50 border-b border-slate-200">
                                 <tr>
                                    <th className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase">Description</th>
                                    <th className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase text-center">Qty / Days</th>
                                    <th className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase text-right">Amount</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                 <tr>
                                    <td className="py-3 px-4">
                                       <span className="font-bold text-sm text-slate-900 block mb-0.5">Mercedes-Benz S450</span>
                                       <span className="text-[10px] text-slate-500">Pick-up: Apr 16 | Return: Apr 19</span>
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm font-medium text-slate-700">3</td>
                                    <td className="py-3 px-4 text-right text-sm font-bold text-slate-900">Rp 10.500.000</td>
                                 </tr>
                                 <tr>
                                    <td className="py-3 px-4">
                                       <span className="font-bold text-sm text-slate-900 block mb-0.5">Refundable Security Deposit</span>
                                       <span className="text-[10px] text-slate-500">Held until safe return of vehicle</span>
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm font-medium text-slate-700">1</td>
                                    <td className="py-3 px-4 text-right text-sm font-bold text-slate-900">Rp 5.000.000</td>
                                 </tr>
                              </tbody>
                           </table>
                        </div>

                        {/* Totals Section */}
                        <div className="flex justify-end mb-8">
                           <div className="w-full md:w-1/2 space-y-2">
                              <div className="flex justify-between items-center text-sm font-medium text-slate-500 px-4">
                                 <span>Subtotal</span>
                                 <span>Rp 15.500.000</span>
                              </div>
                              <div className="flex justify-between items-center text-sm font-medium text-slate-500 px-4 border-b border-slate-100 pb-3">
                                 <span>Tax (11%)</span>
                                 <span>Rp 1.155.000</span>
                              </div>
                              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                                 <span className="font-bold text-sm text-slate-900">Grand Total</span>
                                 <span className="text-xl font-black text-slate-900 tracking-tighter">Rp 16.655.000</span>
                              </div>
                           </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="border-t border-slate-200 pt-5 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                           <div>
                              <h4 className="font-bold text-slate-900 text-xs mb-1">Terms & Conditions</h4>
                              <p className="text-[10px] text-slate-500 max-w-sm leading-relaxed">Deposit will be refunded 1x24h after vehicle inspection.</p>
                           </div>
                           <div className="flex gap-3">
                              <button
                                 onClick={() => alert("Downloading PDF...")}
                                 className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-colors text-xs"
                              >
                                 Download PDF
                              </button>
                              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 shadow-sm transition-colors text-xs flex items-center gap-2">
                                 <span>🖨️</span> Print
                              </button>
                           </div>
                        </div>

                     </div>

                     {/* Cutout Zig-Zag Mock Effect at bottom */}
                     <div className="h-6 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iNSIgZmlsbD0iI2Y4ZmFmYyIvPjwvc3ZnPg==')] bg-repeat-x opacity-50 absolute bottom-0"></div>
                  </div>
               </div>
            </div>
         )}

      </div>
   );
}
