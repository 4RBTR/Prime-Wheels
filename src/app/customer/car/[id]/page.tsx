/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const carId = unwrappedParams.id;

  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCarDetail() {
      try {
        const res = await fetch(`/api/cars?id=${carId}`);
        const data = await res.json();
        if (res.ok && data.car) {
          setCar(data.car);
        }
      } catch (err) {
        console.error("Failed to fetch car details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCarDetail();
  }, [carId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-4xl">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Vehicle Not Found</h2>
        <p className="text-slate-500 mb-8">The car you are looking for might have been removed or is currently unavailable.</p>
        <Link href="/customer/dashboard" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
          Back to Catalog
        </Link>
      </div>
    );
  }

  // Fallback mock specifications since the DB model is lightweight
  const defaultHp = car.type === "Electric" ? "500+" : "250+";
  const defaultAccel = car.type === "Electric" ? "3.5s" : "6.8s";
  const defaultEngine = car.type === "Electric" ? "Dual-Motor AWD" : "2.0L Turbocharged";
  const defaultDescription = `Experience the exceptional design and performance of the ${car.brand} ${car.name}. Merging executive comfort with advanced road dynamics, it defines high-end travel safety and opulence. Professionally sanitized and prepared prior to each unique booking.`;

  return (
    <div className="animate-fade-in pb-20 px-4">
      
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-xs md:text-sm font-bold text-slate-500">
         <Link href="/customer/dashboard" className="hover:text-slate-900 transition-colors">Fleet Catalog</Link>
         <span>/</span>
         <span className="text-slate-400">{car.type || "Premium"}</span>
         <span>/</span>
         <span className="text-slate-900">{car.brand} {car.name}</span>
      </div>

      {/* Hero Image Section */}
      <div className="relative w-full h-[40vh] md:h-[60vh] rounded-4xl overflow-hidden bg-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 mb-10">
         <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/10 to-transparent z-10"></div>
         {car.image_url ? (
           <img 
              src={car.image_url} 
              alt={`${car.brand} ${car.name}`}
              className="w-full h-full object-cover"
           />
         ) : (
           <div className="w-full h-full flex items-center justify-center bg-slate-200 text-6xl">🚘</div>
         )}
         
         <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 pr-4">
            <span className="bg-white text-slate-900 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm border border-slate-100/50 block w-max mb-4">
              {car.type || "Premium Fleet"}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-2 drop-shadow-lg">
               {car.brand} <span className="font-light">{car.name}</span>
            </h1>
            <div className="flex items-center gap-3 text-slate-200 font-bold text-sm mt-3 flex-wrap">
               <span className="bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded border border-slate-600 font-mono tracking-widest shadow text-[10px] md:text-xs">Plate Shielded</span>
               <span className="flex items-center gap-1 text-amber-400 bg-slate-900/50 backdrop-blur px-3 py-1.5 rounded border border-slate-600 shadow text-[10px] md:text-xs">★ 4.9 <span className="text-slate-300 font-normal ml-1">(User Rated)</span></span>
            </div>
         </div>
         
         {/* Actions */}
         <div className="absolute top-6 right-6 z-20 flex gap-3">
             <button className="w-12 h-12 bg-white/10 backdrop-blur hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors border border-white/20">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative items-start">
         
         {/* Left Column: Details & Specs */}
         <div className="lg:col-span-2 space-y-12">
            
            {/* Short Specs Icons */}
            <div className="flex flex-wrap gap-4 border-b border-slate-200 pb-10">
               <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex-1 min-w-[140px] flex gap-4 items-center ring-1 ring-slate-900/5 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-sm">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                  </div>
                  <div>
                     <span className="text-[10px] font-bold text-slate-400 block mb-0.5 uppercase tracking-widest">Transmission</span>
                     <span className="font-black text-slate-900 text-base md:text-lg tracking-tight">{car.transmission || "Automatic"}</span>
                  </div>
               </div>
               
               <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex-1 min-w-[140px] flex gap-4 items-center ring-1 ring-slate-900/5 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-slate-900 text-amber-500 rounded-xl flex items-center justify-center shadow-sm">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                     <span className="text-[10px] font-bold text-slate-400 block mb-0.5 uppercase tracking-widest">Capacity</span>
                     <span className="font-black text-slate-900 text-base md:text-lg tracking-tight">{car.seats || 4} Seats</span>
                  </div>
               </div>

               <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex-1 min-w-[140px] flex gap-4 items-center ring-1 ring-slate-900/5 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-slate-900 text-emerald-400 rounded-xl flex items-center justify-center shadow-sm">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-7"/><path d="M9 22v-10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10"/></svg>
                  </div>
                  <div>
                     <span className="text-[10px] font-bold text-slate-400 block mb-0.5 uppercase tracking-widest">Drive Grade</span>
                     <span className="font-black text-slate-900 text-base md:text-lg tracking-tight">Premium</span>
                  </div>
               </div>
            </div>

            {/* Premium Badges */}
            <div className="flex flex-wrap gap-3">
               <div className="px-4 py-2 rounded-full border border-slate-200 bg-white font-bold text-xs text-slate-700 flex items-center gap-2 shadow-sm">
                  <span>🧑‍✈️</span> Chauffeur Ready
               </div>
               <div className="px-4 py-2 rounded-full border border-slate-200 bg-white font-bold text-xs text-slate-700 flex items-center gap-2 shadow-sm">
                  <span>✨</span> Sanitized
               </div>
               <div className="px-4 py-2 rounded-full border border-slate-200 bg-white font-bold text-xs text-slate-700 flex items-center gap-2 shadow-sm">
                  <span>🛣️</span> Unlimited Miles Option
               </div>
            </div>

            {/* Description Paragraph */}
            <div>
               <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">About This Vehicle</h2>
               <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
                 {defaultDescription}
               </p>
            </div>

            {/* Engine & Performance Blocks */}
            <div>
               <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Engine & Performance</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 shadow-sm">
                     <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Avg Output</span>
                     <span className="block text-3xl font-black text-slate-900">{defaultHp} <span className="text-base text-slate-400 font-bold">hp</span></span>
                  </div>
                  <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 shadow-sm">
                     <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Est. Accel (0-100)</span>
                     <span className="block text-3xl font-black text-slate-900">{defaultAccel}</span>
                  </div>
                  <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
                     <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Drive Unit</span>
                     <span className="block text-lg font-black text-slate-900 leading-tight mt-1">{defaultEngine}</span>
                  </div>
               </div>
            </div>
            
            <div className="border-t border-slate-200 pt-10">
               <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Included in your rental</h2>
               <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600 font-medium">
                 <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span> Premium Insurance Coverage</li>
                 <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span> 24/7 Roadside Assistance</li>
                 <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span> Concierge Support Handler</li>
               </ul>
            </div>

         </div>

         {/* Right Column: Sticky Booking Widget */}
         <div className="lg:sticky top-[100px] bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-4xl p-6 md:p-8">
            <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-6">
               <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Daily Rate</span>
                  <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">
                     Rp {car.price_per_day >= 1000000 
                       ? `${(car.price_per_day / 1000000).toFixed(1)}M` 
                       : car.price_per_day.toLocaleString("id-ID")}
                  </span>
               </div>
            </div>

            <div className="space-y-4 mb-8">
               <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pick-up & Return</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Select dates at checkout</span>
                  </div>
               </div>
            </div>

            <div className="space-y-3 mb-8">
               <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Security Deposit</span>
                  <span className="font-bold text-slate-900">Rp 5.000.000</span>
               </div>
            </div>

            {car.is_available ? (
               <Link href={`/checkout?carId=${car.id}`} className="w-full block text-center px-6 py-4 rounded-2xl font-black transition-all shadow-lg bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.02] active:scale-95 duration-200 text-sm">
                  Proceed to Rent
               </Link>
            ) : (
               <button disabled className="w-full px-6 py-4 rounded-2xl font-black bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 border-dashed text-sm">
                  Currently Booked
               </button>
            )}

            <p className="text-center text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-widest">Select schedule periods during step 1 of checkout</p>
         </div>

      </div>

    </div>
  );
}
