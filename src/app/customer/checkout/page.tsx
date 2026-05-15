/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState } from "react";

export default function CustomerCheckoutPage() {
   const [step, setStep] = useState<1 | 2>(1);
   const [pickUpDate, setPickUpDate] = useState<number | null>(16);
   const [returnDate, setReturnDate] = useState<number | null>(19);
   const [paymentMethod, setPaymentMethod] = useState<"Transfer" | "Credit Card" | "QRIS">("Transfer");

   // Math logic
   const dailyRate = 3500000;
   const days = (pickUpDate && returnDate && returnDate > pickUpDate) ? (returnDate - pickUpDate) : 0;
   const rentFee = days * dailyRate;
   const deposit = 5000000; // Flat luxury deposit
   const tax = rentFee * 0.11;
   const grandTotal = rentFee + deposit + tax;

   // Calendar Simulation Array (April 2026)
   const aprilDays = Array.from({ length: 30 }, (_, i) => i + 1);
   const startDayOffset = 3; // Wednesday start

   const isSelected = (day: number) => {
      if (pickUpDate === day || returnDate === day) return true;
      if (pickUpDate && returnDate && day > pickUpDate && day < returnDate) return true;
      return false;
   };

   const handleDateClick = (day: number) => {
      if (!pickUpDate || (pickUpDate && returnDate)) {
         setPickUpDate(day);
         setReturnDate(null);
      } else if (day > pickUpDate) {
         setReturnDate(day);
      } else {
         setPickUpDate(day);
      }
   };

   return (
      <div className="bg-[#F7F7F9] min-h-screen pt-24 pb-20 font-sans text-slate-900">
         <div className="max-w-6xl mx-auto px-4 md:px-8">

            {/* Header */}
            <div className="mb-10">
               <Link href="/customer/dashboard" className="text-slate-500 hover:text-slate-900 font-bold text-sm mb-4 inline-flex items-center transition-colors">
                  &larr; Back to Catalog
               </Link>
               <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-extrabold tracking-tight">Checkout</h1>
                  <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-md font-bold text-sm">Step {step} of 2</span>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

               {/* Main Content Pane */}
               <div className="lg:col-span-8 space-y-8">

                  {step === 1 && (
                     <div className="animate-fade-in">
                        {/* Vehicle Selection Mock */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between gap-6 shadow-sm mb-8">
                           <div className="flex items-center gap-6">
                              <div className="w-24 h-24 bg-slate-100 rounded-2xl p-2 flex items-center justify-center">
                                 {/* Placeholder for Car Img */}
                                 <span className="text-4xl">🚘</span>
                              </div>
                              <div>
                                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Premium Sedan</span>
                                 <h2 className="text-2xl font-bold text-slate-900">Mercedes-Benz S450</h2>
                                 <p className="text-emerald-600 font-medium text-sm mt-1">Available for selected dates</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <span className="text-slate-500 font-medium block">Daily Rate</span>
                              <span className="text-2xl font-black">Rp 3.5M</span>
                           </div>
                        </div>

                        {/* The Interactive Schedule Calendar Widget */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                           <h3 className="text-xl font-bold mb-6">Select Rental Dates</h3>

                           <div className="flex gap-8 mb-8">
                              <div className="flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50">
                                 <span className="block text-sm font-bold text-slate-500 mb-1">Pick-up Date</span>
                                 <span className="text-xl font-bold">{pickUpDate ? `${pickUpDate} April 2026` : 'Select date'}</span>
                              </div>
                              <div className="flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50">
                                 <span className="block text-sm font-bold text-slate-500 mb-1">Return Date</span>
                                 <span className="text-xl font-bold">{returnDate ? `${returnDate} April 2026` : 'Select date'}</span>
                              </div>
                           </div>

                           {/* Custom Calendar Grid */}
                           <div className="w-full max-w-md mx-auto">
                              <div className="flex justify-between items-center mb-6">
                                 <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">&larr;</button>
                                 <h4 className="font-bold text-lg">April 2026</h4>
                                 <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">&rarr;</button>
                              </div>
                              <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center mb-4">
                                 {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d} className="text-xs font-bold text-slate-400">{d}</span>)}
                                 {/* Empty offsets */}
                                 {Array.from({ length: startDayOffset }).map((_, i) => <div key={`empty-${i}`} />)}
                                 {/* Days */}
                                 {aprilDays.map(day => {
                                    const selected = isSelected(day);
                                    const isEndpoint = pickUpDate === day || returnDate === day;
                                    const isPast = day < 15; // Assume today is 15th

                                    return (
                                       <button
                                          key={day}
                                          onClick={() => !isPast && handleDateClick(day)}
                                          disabled={isPast}
                                          className={`w-10 h-10 mx-auto rounded-full font-bold text-sm flex items-center justify-center transition-all
                                     ${isPast ? 'text-slate-300 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100'}
                                     ${selected && !isEndpoint ? 'bg-amber-100 text-amber-800 rounded-none w-full' : ''}
                                     ${isEndpoint ? 'bg-amber-500 text-slate-900 shadow-md transform scale-110' : ''}
                                  `}
                                       >
                                          {day}
                                       </button>
                                    )
                                 })}
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {step === 2 && (
                     <div className="animate-fade-in bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                        <h3 className="text-xl font-bold border-b border-slate-100 pb-4">Secure Payment Options</h3>

                        {/* Payment Methods Selector */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {['Transfer', 'Credit Card', 'QRIS'].map((method) => (
                              <button
                                 key={method}
                                 onClick={() => setPaymentMethod(method as any)}
                                 className={`p-4 rounded-xl border-2 font-bold transition-all text-sm
                           ${paymentMethod === method
                                       ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                                       : 'border-slate-200 text-slate-500 hover:border-slate-400 hover:bg-slate-50'}
                         `}
                              >
                                 {method === 'Transfer' && <span className="block text-2xl mb-2">🏦</span>}
                                 {method === 'Credit Card' && <span className="block text-2xl mb-2">💳</span>}
                                 {method === 'QRIS' && <span className="block text-2xl mb-2">📱</span>}
                                 {method}
                              </button>
                           ))}
                        </div>

                        {/* Dynamic Payment Body */}
                        {paymentMethod === 'Transfer' && (
                           <div className="animate-fade-in space-y-6">
                              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm font-medium">
                                 Please transfer the exact Grand Total to secure your booking. Booking will be cancelled if not paid within 2 hours.
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold text-slate-500 mb-3">Official Bank Account</h4>
                                 <div className="flex gap-4 items-center p-4 border border-slate-200 rounded-xl bg-slate-50">
                                    <div className="w-16 h-16 bg-blue-900 rounded-lg flex items-center justify-center text-white font-black italic">BCA</div>
                                    <div>
                                       <span className="font-extrabold text-2xl tracking-tighter block mb-1">8899-2233-1100</span>
                                       <span className="text-sm font-bold text-slate-600">PT. Prime Wheels Premium Indonesia</span>
                                    </div>
                                 </div>
                              </div>
                              <div>
                                 <h4 className="text-sm font-bold text-slate-500 mb-3">Upload Transfer Proof</h4>
                                 <label className="border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <span className="text-5xl block mb-4 group-hover:scale-110 transition-transform">🧾</span>
                                    <span className="block font-bold text-slate-700">Click to upload receipt photo</span>
                                    <span className="block text-xs font-medium text-slate-400 mt-2">Format: JPG, PNG. Max 5MB.</span>
                                    <input type="file" className="hidden" />
                                 </label>
                              </div>
                           </div>
                        )}

                        {paymentMethod === 'Credit Card' && (
                           <div className="animate-fade-in space-y-4">
                              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200 rounded-full blur-2xl opacity-50 z-0"></div>
                                 <div className="relative z-10">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Card Number</label>
                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-white border border-slate-200 rounded-xl p-4 font-mono text-lg outline-none focus:ring-2 focus:ring-slate-900 shadow-sm" />
                                 </div>
                                 <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <div>
                                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expiry Date</label>
                                       <input type="text" placeholder="MM/YY" className="w-full bg-white border border-slate-200 rounded-xl p-4 font-mono text-lg outline-none focus:ring-2 focus:ring-slate-900 shadow-sm" />
                                    </div>
                                    <div>
                                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CVV</label>
                                       <input type="password" placeholder="123" maxLength={3} className="w-full bg-white border border-slate-200 rounded-xl p-4 font-mono text-lg outline-none focus:ring-2 focus:ring-slate-900 shadow-sm" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}

                        {paymentMethod === 'QRIS' && (
                           <div className="animate-fade-in text-center p-8 bg-slate-50 border border-slate-200 rounded-2xl">
                              <div className="w-48 h-48 mx-auto bg-white border-4 border-slate-900 p-2 rounded-2xl shadow-sm mb-4">
                                 {/* Mock QR Code Pattern */}
                                 <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover bg-center opacity-80"></div>
                              </div>
                              <h4 className="font-bold text-slate-900 text-lg">Scan to Pay via QRIS</h4>
                              <p className="text-slate-500 text-sm mt-1">Open your GoPay, OVO, or Mobile Banking app to scan.</p>
                           </div>
                        )}

                        <button
                           onClick={() => window.location.href = '/customer/bookings'}
                           className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl shadow-md transition-all text-lg mt-6"
                        >
                           Confirm & Complete Order
                        </button>
                     </div>
                  )}
               </div>

               {/* Sticky Summary Sidebar */}
               <div className="lg:col-span-4 relative">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
                     <h3 className="font-bold text-lg mb-6 tracking-tight">Order Summary</h3>

                     <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-500 font-medium">Rental Duration</span>
                           <span className="font-bold">{days} Days</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-slate-500 font-medium">Rental Fee</span>
                           <span className="font-bold">Rp {rentFee.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-4">
                           <span className="text-slate-500 font-medium">Added Tax (11%)</span>
                           <span className="font-bold">Rp {tax.toLocaleString('id-ID')}</span>
                        </div>

                        {/* Security Deposit callout */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                           <div className="flex justify-between items-center text-sm mb-2">
                              <span className="text-slate-900 font-bold">Security Deposit</span>
                              <span className="font-bold border border-slate-200 px-2 rounded bg-white">Rp {deposit.toLocaleString('id-ID')}</span>
                           </div>
                           <p className="text-[10px] text-slate-500 leading-tight">Fully refundable after the vehicle is returned in good physical and mechanical condition.</p>
                        </div>
                     </div>

                     <div className="flex justify-between items-end border-t border-slate-200 pt-6 mb-8">
                        <span className="text-slate-500 font-bold">Grand Total</span>
                        <span className="text-3xl font-black tracking-tighter">Rp {grandTotal.toLocaleString('id-ID')}</span>
                     </div>

                     {step === 1 && (
                        <button
                           onClick={() => days > 0 ? setStep(2) : alert("Please select return date!")}
                           disabled={days === 0}
                           className={`w-full font-black py-4 rounded-xl transition-all shadow-md text-lg
                       ${days > 0 ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                     `}
                        >
                           Proceed to Payment
                        </button>
                     )}
                  </div>
               </div>

            </div>
         </div>
      </div>
   );
}
