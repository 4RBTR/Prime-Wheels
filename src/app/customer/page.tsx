/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CustomerLandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className={`transition-opacity duration-1000 pb-10 overflow-hidden ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Inline styles for custom animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-250px * 5)); }
        }
        .marquee-container {
          display: flex;
          width: calc(250px * 10);
          animation: scroll 30s linear infinite;
        }
      `}} />

      {/* 1. Avant-Garde Hero Banner */}
      <section className="relative w-full h-[75vh] md:h-[85vh] rounded-[3rem] overflow-hidden bg-slate-950 mb-16 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-800 flex items-center justify-center text-center mx-auto mt-2 group perspective-1000">
         {/* Abstract Glow Background */}
         <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/20 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>
         <div className="absolute bottom-1/4 -right-32 w-120 h-120 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
         
         <div className="absolute inset-0 bg-linear-to-b from-slate-950/40 via-slate-950/20 to-slate-950/90 z-10 transition-opacity duration-700 group-hover:opacity-80"></div>
         
         <img 
            src="https://images.unsplash.com/photo-1620882813844-3ceb1ee28e67?q=80&w=2070&auto=format&fit=crop" 
            alt="Luxury Car Showcase"
            className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-[10s] group-hover:scale-110 ease-out"
         />
         
         {/* Floating Trust Badge */}
         <div className="absolute top-12 md:top-16 left-1/2 -translate-x-1/2 z-30 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-5 py-2 rounded-full shadow-2xl flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default transform hover:-translate-y-1">
            <span className="text-amber-400 text-sm">★</span> 4.9/5 Excellent by 500+ Executives
         </div>

         <div className="relative z-20 px-6 max-w-5xl mx-auto flex flex-col items-center mt-12">
            <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tighter mb-6 leading-[1.1] drop-shadow-2xl text-transparent bg-clip-text bg-linear-to-r from-white via-slate-200 to-slate-400">
               Master the Art of <br className="hidden md:block" />
               <span className="bg-clip-text text-transparent bg-linear-to-r from-amber-200 to-amber-500 relative">
                 Movement.
                 <div className="absolute -bottom-2 left-0 w-full h-1 bg-linear-to-r from-amber-400/0 via-amber-400 to-amber-400/0 rounded-full blur-sm"></div>
               </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl text-center font-medium drop-shadow-md">
               Elevate your journey with uncompromising luxury. Our handpicked fleet awaits your command.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto items-center">
               <Link href="/customer/dashboard" className="w-full sm:w-auto px-10 py-4 md:py-5 bg-white text-slate-900 font-black rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_rgba(245,158,11,0.5)] hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center gap-3">
                  Unlock the Fleet <span className="text-xl">→</span>
               </Link>
               <Link href="#bento-grid" className="w-full sm:w-auto px-10 py-4 md:py-5 bg-slate-900/40 backdrop-blur-lg border border-white/20 text-white font-bold rounded-2xl hover:bg-slate-800/60 hover:border-white/40 transition-all text-lg flex items-center justify-center">
                  Discover More
               </Link>
            </div>
         </div>
      </section>

      {/* Infinite Brand Marquee (Instant Premium Feel) */}
      <section className="mb-24 overflow-hidden border-y border-slate-200 py-10 bg-white relative">
         <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-[#F7F7F9] to-transparent z-10 pointer-events-none"></div>
         <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-[#F7F7F9] to-transparent z-10 pointer-events-none"></div>
         
         <div className="text-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Curating the World's Finest Engineering</span>
         </div>
         
         <div className="w-full overflow-hidden">
            <div className="marquee-container flex items-center text-4xl md:text-5xl font-black text-slate-300 uppercase tracking-tighter gap-0">
               {/* 5 Items */}
               <div className="w-[250px] text-center shrink-0 hover:text-slate-900 transition-colors cursor-default">Mercedes</div>
               <div className="w-[250px] text-center shrink-0 hover:text-slate-900 transition-colors cursor-default">BMW</div>
               <div className="w-[250px] text-center shrink-0 hover:text-slate-900 transition-colors cursor-default">Porsche</div>
               <div className="w-[250px] text-center shrink-0 hover:text-slate-900 transition-colors cursor-default">Lexus</div>
               <div className="w-[250px] text-center shrink-0 hover:text-slate-900 transition-colors cursor-default">Tesla</div>
               {/* Duplicated 5 Items for infinite loop illusion */}
               <div className="w-[250px] text-center shrink-0 hover:text-slate-900 transition-colors cursor-default">Mercedes</div>
               <div className="w-[250px] text-center shrink-0 hover:text-slate-900 transition-colors cursor-default">BMW</div>
               <div className="w-[250px] text-center shrink-0 hover:text-slate-900 transition-colors cursor-default">Porsche</div>
               <div className="w-[250px] text-center shrink-0 hover:text-slate-900 transition-colors cursor-default">Lexus</div>
               <div className="w-[250px] text-center shrink-0 hover:text-slate-900 transition-colors cursor-default">Tesla</div>
            </div>
         </div>
      </section>

      {/* 2. Bento Box Asymmetrical Grid (Why Us) */}
      <section id="bento-grid" className="mb-32 scroll-mt-24 px-2">
         <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Beyond <br/> Expectations.
               </h2>
            </div>
            <p className="text-slate-500 font-medium text-lg max-w-md">
               We throw out the traditional rulebook. No waiting lines, no hidden fees, just immaculate vehicles delivered on your terms.
            </p>
         </div>

         {/* The Bento Layout */}
         <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[500px]">
            
            {/* Box 1 (Large Image Block) - Spans 2 cols, 2 rows */}
            <div className="md:col-span-2 md:row-span-2 bg-slate-900 rounded-4xl p-8 md:p-12 relative overflow-hidden group shadow-lg flex flex-col justify-end min-h-[300px]">
               <img src="https://images.unsplash.com/photo-1549317661-bc32c582cece?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000 group-hover:opacity-60 mix-blend-overlay" alt="Delivery" />
               <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
               
               <div className="relative z-10">
                  <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-amber-500/30 transform -rotate-6 group-hover:rotate-0 transition-transform">
                     📍
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3 tracking-tight">VIP Doorstep Delivery</h3>
                  <p className="text-slate-300 font-medium max-w-md leading-relaxed">
                     Your time is too valuable for rental counters. We drop off your freshly detailed vehicle directly at your home, hotel, or private terminal.
                  </p>
               </div>
            </div>

            {/* Box 2 (Top Right Text Block) */}
            <div className="bg-white border border-slate-200 rounded-4xl p-8 group hover:-translate-y-1 transition-transform shadow-sm flex flex-col justify-center">
               <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 text-xl mb-6 group-hover:scale-110 transition-transform">
                  ✦
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">Immaculate Detail</h3>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Every car undergoes a 30-point mechanical inspection and aerospace-grade sanitization before handover.
               </p>
            </div>

            {/* Box 3 (Bottom Right Text Block) */}
            <div className="bg-slate-50 border border-slate-200 rounded-4xl p-8 group hover:-translate-y-1 transition-transform shadow-sm flex flex-col justify-center">
               <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-xl mb-6 group-hover:scale-110 transition-transform">
                  ⏱️
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-2">Zero Friction</h3>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Pre-verify your identity globally via our portal. Once approved, the keys are handed over in under 60 seconds.
               </p>
            </div>

         </div>
      </section>

      {/* 3. Immersive Collection Grid */}
      <section className="mb-20">
         <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-2 block">Our Masterpieces</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">The Garage</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card Left */}
            <Link href="/customer/dashboard" className="group rounded-[2.5rem] overflow-hidden bg-slate-900 relative h-[400px] hover:shadow-2xl transition-shadow flex items-end p-8 border border-slate-200/50">
               <div className="absolute inset-0 bg-slate-800">
                  <img src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s] opacity-70 group-hover:opacity-90" alt="S-Class"/>
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
               </div>
               <div className="relative z-10 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex justify-between items-end">
                     <div>
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest block w-max mb-3">Premium Sedan</span>
                        <h3 className="text-3xl font-black text-white">Mercedes S450</h3>
                     </div>
                     <span className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 transform group-hover:rotate-45 transition-transform duration-300">
                        ↗
                     </span>
                  </div>
               </div>
            </Link>

            {/* Card Right */}
            <Link href="/customer/dashboard" className="group rounded-[2.5rem] overflow-hidden bg-slate-900 relative h-[400px] hover:shadow-2xl transition-shadow flex items-end p-8 border border-slate-200/50">
               <div className="absolute inset-0 bg-slate-800">
                  <img src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s] opacity-70 group-hover:opacity-90" alt="Tesla"/>
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
               </div>
               <div className="relative z-10 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex justify-between items-end">
                     <div>
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest block w-max mb-3">Electric Hypercar</span>
                        <h3 className="text-3xl font-black text-white">Tesla Plaid</h3>
                     </div>
                     <span className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 transform group-hover:rotate-45 transition-transform duration-300">
                        ↗
                     </span>
                  </div>
               </div>
            </Link>

         </div>
         
         <div className="text-center mt-12">
            <Link href="/customer/dashboard" className="inline-flex items-center gap-3 text-slate-900 font-black hover:text-amber-500 transition-colors uppercase tracking-widest text-sm border-b-2 border-slate-900 hover:border-amber-500 pb-1">
               Enter Full Catalog
            </Link>
         </div>
      </section>

    </div>
  );
}
