/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Settings, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PublicCatalogPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);
  const [cars, setCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('is_available', true)
          .order('created_at', { ascending: false });

        if (data && !error) {
          setCars(data);
          const uniqueCategories = new Set<string>();
          data.forEach((car: any) => {
            if (car.type) uniqueCategories.add(car.type);
          });
          setCategories(['All', ...Array.from(uniqueCategories)]);
        }
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
  }, []);

  const filteredCars = activeTab === 'All' 
    ? cars 
    : cars.filter(c => c.type === activeTab);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `Rp ${(price / 1000000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto relative">
        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 relative z-10">
          Premium Rental Fleet
        </h1>
        <p className="text-slate-500 font-medium text-lg leading-relaxed relative z-10">
          Select from our handpicked elite collection of luxury vehicles, fully detailed and ready for your executive journey.
        </p>
      </div>

      {/* Dynamic Filter Tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm tracking-wide
                ${activeTab === cat 
                  ? "bg-slate-900 text-white ring-2 ring-slate-900 ring-offset-2" 
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }
              `}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Car Grid Catalog */}
      {filteredCars.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-4xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
           <p className="text-slate-400 font-bold text-lg mb-2">No Luxury Vehicles Posted Yet</p>
           <p className="text-slate-400/70 text-sm font-medium">Please log in to the Admin dashboard to register and showcase vehicles!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map(car => (
            <div key={car.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 flex flex-col transform hover:-translate-y-1.5 group relative">
              
              {/* Image Container */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-100 p-2">
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent z-10 opacity-60"></div>
                {car.image_url ? (
                  <img 
                    src={car.image_url} 
                    alt={`${car.brand} ${car.name}`} 
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-1000 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 rounded-2xl text-4xl text-slate-400 font-black">🚘</div>
                )}
                <span className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border border-slate-100/30">
                  {car.type || "Fleet"}
                </span>
              </div>
              
              {/* Vehicle Details Wrapper */}
              <div className="p-6 flex-1 flex flex-col bg-white z-20 rounded-t-3xl -mt-6 relative">
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{car.brand}</span>
                  <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{car.name}</h3>
                  
                  <div className="flex items-center gap-2.5 mt-4">
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-slate-500 text-xs font-bold">
                      <Users size={14} className="text-slate-400" />
                      <span>{car.seats || 4} Seats</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-slate-500 text-xs font-bold">
                      <Settings size={14} className="text-slate-400" />
                      <span>{car.transmission || "Auto"}</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Rent Footer */}
                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[9px] uppercase font-black tracking-widest block mb-0.5">Daily Rate</span>
                    <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">
                      {formatPrice(car.price_per_day)}
                    </span>
                  </div>
                  
                  <Link 
                    href={`/checkout?carId=${car.id}`}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl font-extrabold shadow-md text-sm transition-all hover:scale-105 active:scale-95 duration-200 flex items-center gap-2 group"
                  >
                    Rent Now
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
