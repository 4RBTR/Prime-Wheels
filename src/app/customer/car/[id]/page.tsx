"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";

// Extended mock data specific to the detail page (simulate fetching DB)
const detailCars = [
  {
    id: "1", brand: "Toyota", model: "Alphard 2.5 G", price: 2500000, plate: "B 1234 XYZ", available: true,
    image: "https://images.unsplash.com/photo-1623910271790-a54816cb11bf?q=80&w=1200&auto=format&fit=crop",
    category: "Luxury SUV", specs: { transmission: "Auto", seats: 7, fuel: "Petrol" },
    hp: "180", acceleration: "11.3s", engine: "2.5L 4-Cylinder", 
    description: "Nikmati perjalanan bisnis atau keluarga dengan Toyota Alphard. Ruang kabin ekstra luas dengan kursi kapten (captain seats), suspensi super empuk, dan kesenyapan kabin level premium menjadikannya standar emas untuk kendaraan VIP di Indonesia."
  },
  {
    id: "2", brand: "Mercedes-Benz", model: "S-Class S450", price: 5000000, plate: "B 777 LXR", available: false,
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1200&auto=format&fit=crop",
    category: "Premium Sedan", specs: { transmission: "Auto", seats: 4, fuel: "Petrol" },
    hp: "362", acceleration: "4.8s", engine: "3.0L Biturbo V6",
    description: "Simbol status supremasi eksekutif. S450 ditenagai mesin 3.0L Biturbo V6 berkekuatan 362 Horsepower. Dilengkapi dengan suspensi AIRMATIC mutakhir, kursi pemijat berventilasi, layar sentuh COMAND resolusi tinggi, dan Audio Burmester Surround. Kenyamanan paripurna tanpa kompromi."
  },
  {
    id: "3", brand: "BMW", model: "7 Series 740i", price: 4500000, plate: "B 888 LUX", available: true,
    image: "https://images.unsplash.com/photo-1555353540-64210e34c9cb?q=80&w=1200&auto=format&fit=crop",
    category: "Premium Sedan", specs: { transmission: "Auto", seats: 4, fuel: "Hybrid" },
    hp: "375", acceleration: "5.2s", engine: "3.0L Turbo Inline-6",
    description: "Keseimbangan sempurna antara sensasi mengemudi yang tajam dan kemewahan bangku belakang. Menampilkan BMW Curved Display yang ikonik, sistem hiburan belakang kelas satu, dan material Merino Leather terbaik."
  },
  {
    id: "4", brand: "Hyundai", model: "Palisade Signature", price: 1800000, plate: "B 9002 OKE", available: true,
    image: "https://images.unsplash.com/photo-1647416391485-6126caab3f34?q=80&w=1200&auto=format&fit=crop",
    category: "Luxury SUV", specs: { transmission: "Auto", seats: 7, fuel: "Diesel" },
    hp: "200", acceleration: "9.5s", engine: "2.2L CRDi Diesel",
    description: "SUV gagah yang mendefinisikan ulang kemewahan keluarga. Kapasitas 7 penumpang dengan fitur pemanas kursi, atap dual-sunroof, dan torsi badak dari mesin diesel modern. Siap menguasai seluruh medan tanpa mengurangi kenyamanan."
  },
  {
    id: "5", brand: "Tesla", model: "Model S Plaid", price: 4000000, plate: "B 100 EV", available: true,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop",
    category: "Electric", specs: { transmission: "Auto", seats: 5, fuel: "Electric" },
    hp: "1020", acceleration: "1.99s", engine: "Tri-Motor AWD",
    description: "Melampaui kata 'cepat'. Model S Plaid adalah hypercar masa depan berkekuatan mutlak 1,020 tenaga kuda dengan waktu tempuh 0-60mph tembus di bawah 2 detik! Dibekali sistem Audio 22-speaker, sistem kendali Yoke yang futuristis, dan jaringan Supercharger."
  }
];

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const car = detailCars.find(c => c.id === unwrappedParams.id) || detailCars[0];

  return (
    <div className="animate-fade-in pb-20">
      
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-500">
         <Link href="/customer/dashboard" className="hover:text-slate-900 transition-colors">Fleet Catalog</Link>
         <span>/</span>
         <span className="text-slate-400">{car.category}</span>
         <span>/</span>
         <span className="text-slate-900">{car.brand} {car.model}</span>
      </div>

      {/* Hero Image Section */}
      <div className="relative w-full h-[40vh] md:h-[60vh] rounded-[2rem] overflow-hidden bg-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 mb-10">
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent z-10"></div>
         <img 
            src={car.image} 
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover"
         />
         
         <div className="absolute bottom-10 left-10 z-20">
            <span className="bg-white text-slate-900 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm border border-slate-100/50 block w-max mb-4">
              {car.category}
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-2 drop-shadow-lg">
               {car.brand} <span className="font-light">{car.model}</span>
            </h1>
            <div className="flex items-center gap-3 text-slate-200 font-bold text-sm mt-3">
               <span className="bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded border border-slate-600 font-mono tracking-widest shadow text-xs">Plat Tertutup ({car.plate.substring(0,4)}...)</span>
               <span className="flex items-center gap-1 text-amber-400 bg-slate-900/50 backdrop-blur px-3 py-1.5 rounded border border-slate-600 shadow text-xs">★ 4.9 <span className="text-slate-300 font-normal ml-1">(128 Reviews)</span></span>
            </div>
         </div>
         
         {/* Share / Save buttons */}
         <div className="absolute top-6 right-6 z-20 flex gap-3">
             <button className="w-12 h-12 bg-white/10 backdrop-blur hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors border border-white/20">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
             </button>
             <button className="w-12 h-12 bg-white/10 backdrop-blur hover:bg-rose-500/80 text-white rounded-full flex items-center justify-center transition-colors border border-white/20 hover:border-transparent">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative items-start">
         
         {/* Left Column: Details & Specs */}
         <div className="lg:col-span-2 space-y-12">
            
            {/* Short Specs Icons */}
            <div className="flex flex-wrap gap-4 border-b border-slate-200 pb-10">
               <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex-1 min-w-[120px] flex gap-4 items-center ring-1 ring-slate-900/5 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-sm">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                  </div>
                  <div>
                     <span className="text-xs font-bold text-slate-400 block mb-0.5 uppercase tracking-widest">Transmission</span>
                     <span className="font-black text-slate-900 text-lg tracking-tight">{car.specs.transmission}</span>
                  </div>
               </div>
               
               <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex-1 min-w-[120px] flex gap-4 items-center ring-1 ring-slate-900/5 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-slate-900 text-amber-500 rounded-xl flex items-center justify-center shadow-sm">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                     <span className="text-xs font-bold text-slate-400 block mb-0.5 uppercase tracking-widest">Capacity</span>
                     <span className="font-black text-slate-900 text-lg tracking-tight">{car.specs.seats} Seats</span>
                  </div>
               </div>

               <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex-1 min-w-[120px] flex gap-4 items-center ring-1 ring-slate-900/5 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-slate-900 text-emerald-400 rounded-xl flex items-center justify-center shadow-sm">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="4" y1="9" x2="20" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>
                  </div>
                  <div>
                     <span className="text-xs font-bold text-slate-400 block mb-0.5 uppercase tracking-widest">Fuel Type</span>
                     <span className="font-black text-slate-900 text-lg tracking-tight">{car.specs.fuel}</span>
                  </div>
               </div>
            </div>

            {/* Premium Badges */}
            <div className="flex gap-4">
               <div className="px-4 py-2 rounded-full border border-slate-200 bg-white font-bold text-xs text-slate-700 flex items-center gap-2 shadow-sm">
                  <span className="text-base text-slate-500">🧑‍✈️</span> Chauffeur / Driver Ready
               </div>
               <div className="px-4 py-2 rounded-full border border-slate-200 bg-white font-bold text-xs text-slate-700 flex items-center gap-2 shadow-sm">
                  <span className="text-base text-slate-500">✨</span> Deep Cleaned & Sanitized
               </div>
               <div className="px-4 py-2 rounded-full border border-slate-200 bg-white font-bold text-xs text-slate-700 flex items-center gap-2 shadow-sm">
                  <span className="text-base text-slate-500">🛣️</span> Unlimited Mileage Options
               </div>
            </div>

            {/* Description Paragraph */}
            <div>
               <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">About This Vehicle</h2>
               <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
                 {car.description}
               </p>
            </div>

            {/* Engine & Performance Blocks */}
            <div>
               <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Engine & Performance</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 shadow-sm shadow-slate-100">
                     <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Power Output</span>
                     <span className="block text-3xl font-black text-slate-900">{car.hp} <span className="text-base text-slate-400">hp</span></span>
                  </div>
                  <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 shadow-sm shadow-slate-100">
                     <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">0-100 km/h</span>
                     <span className="block text-3xl font-black text-slate-900">{car.acceleration}</span>
                  </div>
                  <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 shadow-sm shadow-slate-100">
                     <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Engine Unit</span>
                     <span className="block text-lg mt-2 font-black text-slate-900 leading-tight">{car.engine}</span>
                  </div>
               </div>
            </div>
            
            <div className="border-t border-slate-200 pt-10">
               <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Included in your rental</h2>
               <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600 font-medium">
                 <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span> Full Insurance Coverage</li>
                 <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span> 24/7 Roadside Assistance</li>
                 <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span> Free Cancellation (Up to 48h)</li>
                 <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</span> Dedicated Customer Handler</li>
               </ul>
            </div>

         </div>

         {/* Right Column: Sticky Booking Widget */}
         <div className="lg:sticky top-[100px] bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[2rem] p-8">
            <div className="flex justify-between items-end mb-8 border-b border-slate-100 pb-6">
               <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Daily Rate</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">Rp {(car.price / 1000000).toFixed(1)}<span className="text-xl">M</span></span>
               </div>
            </div>

            <div className="space-y-4 mb-8">
               <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center group hover:border-slate-300 transition-colors cursor-pointer">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pick-up Date</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Select Date</span>
                  </div>
                  <div className="text-slate-400 group-hover:text-amber-500">🗓️</div>
               </div>
               
               <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center group hover:border-slate-300 transition-colors cursor-pointer">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Return Date</span>
                    <span className="font-bold text-slate-900 block mt-0.5">Select Date</span>
                  </div>
                  <div className="text-slate-400 group-hover:text-amber-500">🗓️</div>
               </div>
            </div>

            <div className="space-y-3 mb-8">
               <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span className="underline decoration-slate-300 decoration-dotted underline-offset-4 cursor-pointer hover:text-slate-900">Security Deposit</span>
                  <span>Rp 5.000.000</span>
               </div>
               <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span className="underline decoration-slate-300 decoration-dotted underline-offset-4 cursor-pointer hover:text-slate-900">Tax & Platform Fee</span>
                  <span>Calculated at checkout</span>
               </div>
            </div>

            {car.available ? (
               <Link href={`/customer/checkout?car=${car.id}`} className="w-full block text-center px-6 py-4 rounded-2xl font-black transition-all shadow-lg bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20 hover:shadow-slate-900/30 hover:scale-[1.02] active:scale-95 duration-200">
                  Proceed to Checkout
               </Link>
            ) : (
               <button disabled className="w-full px-6 py-4 rounded-2xl font-black bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 border-dashed">
                  Currently Rented
               </button>
            )}

            <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">You won't be charged yet</p>
         </div>

      </div>

    </div>
  );
}
