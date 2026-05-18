/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    if (session?.user && !selectedCity) {
      setSelectedCity((session.user as any).city || "Surabaya");
    }
  }, [session, selectedCity]);

  useEffect(() => {
    async function fetchCars() {
      if (!selectedCity) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/cars?city=${selectedCity}`);
        const data = await res.json();
        if (res.ok && data.cars) {
          setCars(data.cars);
          
          // Derive unique categories dynamically
          const uniqueTypes = new Set<string>();
          data.cars.forEach((car: any) => {
            if (car.type) uniqueTypes.add(car.type);
          });
          setCategories(["All", ...Array.from(uniqueTypes)]);
        }
      } catch (err) {
        console.error("Failed to load catalog cars:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, [selectedCity]);

  const filteredCars = activeFilter === "All" 
    ? cars 
    : cars.filter(car => car.type === activeFilter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 text-center md:text-left relative flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="absolute top-[-30px] left-[-40px] w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4 relative z-10">
            Find Your Perfect Drive
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl relative z-10">
            Explore our premium collection of luxury vehicles in your selected city.
          </p>
        </div>
        
        {/* City Selector */}
        <div className="mt-6 md:mt-0 relative z-10 flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">
          <MapPin className="w-5 h-5 text-blue-600 mr-3" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lokasi Sewa</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer"
            >
              <option value="Surabaya">Surabaya</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Bandung">Bandung</option>
              <option value="Semarang">Semarang</option>
              <option value="Yogyakarta">Yogyakarta</option>
              <option value="Bali">Bali</option>
              <option value="Medan">Medan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      {categories.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-3 justify-center md:justify-start">
          {categories.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm
                ${activeFilter === filter 
                  ? "bg-slate-900 text-white ring-2 ring-slate-900 ring-offset-2" 
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {filteredCars.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
           <p className="text-slate-400 font-medium">No cars currently available in this category.</p>
        </div>
      ) : (
        /* Catalog Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map(car => (
            <div key={car.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 flex flex-col transform hover:-translate-y-1 relative group">
              {/* Image Container */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100 p-2 block">
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent z-10 opacity-70"></div>
                {car.image_url ? (
                  <img
                    src={car.image_url}
                    alt={`${car.brand} ${car.name}`}
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 rounded-2xl text-4xl">🚘</div>
                )}
                <div className="absolute top-4 left-4 z-20">
                   <div className="bg-white/90 backdrop-blur text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                      {car.type}
                   </div>
                </div>
                {!car.is_available && (
                  <div className="absolute top-4 right-4 z-20 bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase shadow-sm">
                    Rented
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col bg-white z-20 rounded-t-3xl -mt-6">
                <div className="flex-1">
                   <div className="flex justify-between items-start mb-2">
                      <div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{car.brand}</span>
                          <h3 className="text-xl font-extrabold text-slate-900 leading-tight inline-block">{car.name}</h3>
                      </div>
                   </div>

                   {/* Specs Iconic Row */}
                   <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-slate-500 flex-1 justify-center" title="Transmission">
                         <span className="text-[10px] font-bold uppercase tracking-wider">{car.transmission || "Auto"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-slate-500 flex-1 justify-center" title="Seats">
                         <span className="text-[10px] font-bold uppercase tracking-wider">{car.seats || 4} Seats</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-slate-500 flex-1 justify-center" title="Verified">
                         <span className="text-[10px] font-bold uppercase tracking-wider">Premium</span>
                      </div>
                   </div>
                </div>
                
                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                     <span className="text-xl font-black text-slate-900">
                       Rp {car.price_per_day >= 1000000 
                         ? `${(car.price_per_day / 1000000).toFixed(1)}M` 
                         : car.price_per_day.toLocaleString("id-ID")}
                     </span>
                     <span className="text-slate-400 text-[10px] uppercase font-bold block mt-0.5 tracking-wider">Per Day</span>
                  </div>
                  
                  {car.is_available ? (
                     <Link href={`/customer/checkout?carId=${car.id}`} className="px-6 py-3 rounded-2xl font-bold transition-all shadow-md bg-slate-900 hover:bg-slate-800 text-white inline-block hover:scale-[1.02] active:scale-95 duration-200">
                        Rent Now
                     </Link>
                  ) : (
                     <button disabled className="px-6 py-3 rounded-2xl font-bold bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200">
                        Booked
                     </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
