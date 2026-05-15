/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, ShieldCheck, Zap, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LandingHomePage() {
  const [cars, setCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('is_available', true)
          .limit(4)
          .order('created_at', { ascending: false });

        if (data && !error) {
          setCars(data);
        }
      } catch (err) {
        console.error("Error loading landing cars:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedCars();
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `Rp ${(price / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="space-y-24 animate-fade-in pb-10">
      
      {/* Hero Section - Clean Split-Screen Visual */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[65vh] py-4">
        <div className="lg:col-span-6 relative">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-slate-200 backdrop-blur-md rounded-full shadow-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Now Open for Executive Rentals</span>
          </div>
          
          <h1 className="text-5xl lg:text-[4.5rem] font-black tracking-tight leading-[1.05] text-slate-950 mb-6">
            Experience <br />
            <span className="bg-linear-to-r from-slate-900 via-slate-800 to-amber-600 bg-clip-text text-transparent">Uncompromising</span> Luxury.
          </h1>
          <p className="text-slate-500 font-medium text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
            Book immaculate high-end vehicles with instant identity validation and trusted security. Your mobility, refined.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/catalog" className="w-full sm:w-auto text-center bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-extrabold shadow-lg shadow-slate-900/10 transition-all active:scale-95 text-base flex items-center justify-center gap-3">
              Explore Fleet Catalog <ArrowRight size={20} />
            </Link>
            <Link href="/register" className="w-full sm:w-auto text-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-2xl font-bold transition-all shadow-sm text-base">
              Create Account
            </Link>
          </div>
        </div>

        {/* Visual Display Right Card */}
        <div className="lg:col-span-6 rounded-4xl bg-slate-200 overflow-hidden aspect-4/3 relative shadow-2xl shadow-slate-900/10 border-4 border-white select-none group">
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1600&auto=format&fit=crop"
            alt="Premium Vehicle Spotlight"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl">
            <div className="w-10 h-10 bg-amber-500 text-slate-900 rounded-full flex items-center justify-center font-black text-lg shadow-md">★</div>
            <div>
              <div className="text-xs font-black text-slate-200 tracking-wider uppercase mb-0.5">User Rated</div>
              <div className="text-white font-bold text-sm">4.9 / 5 Executive Comfort</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Feature Grid (Why Prime Wheels) */}
      <section className="bg-white rounded-4xl border border-slate-200 p-8 md:p-16 shadow-sm">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block mb-2">Why Choose Us</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Engineered for Discerning Travelers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Item 1 */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">Instant E-KYC</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Skip long counter lines. Perform instantaneous ID and verification checks through our highly secure portal.
            </p>
          </div>

          {/* Item 2 */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">Escrow Deposit</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Your security deposit stays absolutely safe. Backed by automated reconciliation post inspection.
            </p>
          </div>

          {/* Item 3 */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">
              <Calendar size={28} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">Flexible Booking</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Book entirely online. Review itemized digital invoices instantly from any desktop or mobile browser.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Cars Sub-Catalog (Recommended Spotlight) */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Featured Vehicles</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">The Featured Fleet</h2>
          </div>
          <Link href="/catalog" className="text-slate-900 hover:text-slate-600 font-extrabold text-sm flex items-center gap-1 group transition-colors border-b border-slate-900 pb-0.5">
            View Full Catalog <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="animate-spin w-8 h-8 text-slate-900" />
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <p className="text-slate-400 font-bold">No vehicles featured at the moment.</p>
            <p className="text-slate-400/60 text-sm mt-1">Cars registered by Admin appear here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.map(car => (
              <div key={car.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {car.image_url ? (
                    <img src={car.image_url} alt={car.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🚘</div>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">{car.brand}</span>
                  <h3 className="text-lg font-black text-slate-900 mb-3 leading-tight">{car.name}</h3>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[8px] font-black uppercase tracking-wider block mb-0.5">Price / Day</span>
                      <span className="text-lg font-black text-slate-900 tracking-tight">{formatPrice(car.price_per_day)}</span>
                    </div>
                    <Link href={`/checkout?carId=${car.id}`} className="w-9 h-9 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center transition-colors shadow-md">
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
