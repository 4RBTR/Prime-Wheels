"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface CarProps {
  id: string;
  brand: string;
  model: string;
  price: number;
  plate: string;
  available: boolean;
  image: string;
  category: "Premium Sedan" | "Luxury SUV" | "Electric";
  specs: {
    transmission: string;
    seats: number;
    fuel: string;
  };
}

const dummyCars: CarProps[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "Alphard 2.5 G",
    price: 2500000,
    plate: "B 1234 XYZ",
    available: true,
    image: "https://images.unsplash.com/photo-1623910271790-a54816cb11bf?q=80&w=600&auto=format&fit=crop",
    category: "Luxury SUV",
    specs: { transmission: "Auto", seats: 7, fuel: "Petrol" }
  },
  {
    id: "2",
    brand: "Mercedes-Benz",
    model: "S-Class S450",
    price: 5000000,
    plate: "B 777 LXR",
    available: false,
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=600&auto=format&fit=crop",
    category: "Premium Sedan",
    specs: { transmission: "Auto", seats: 4, fuel: "Petrol" }
  },
  {
    id: "3",
    brand: "BMW",
    model: "7 Series 740i",
    price: 4500000,
    plate: "B 888 LUX",
    available: true,
    image: "https://images.unsplash.com/photo-1555353540-64210e34c9cb?q=80&w=600&auto=format&fit=crop",
    category: "Premium Sedan",
    specs: { transmission: "Auto", seats: 4, fuel: "Hybrid" }
  },
  {
    id: "4",
    brand: "Hyundai",
    model: "Palisade Signature",
    price: 1800000,
    plate: "B 9002 OKE",
    available: true,
    image: "https://images.unsplash.com/photo-1647416391485-6126caab3f34?q=80&w=600&auto=format&fit=crop",
    category: "Luxury SUV",
    specs: { transmission: "Auto", seats: 7, fuel: "Diesel" }
  },
  {
    id: "5",
    brand: "Tesla",
    model: "Model S Plaid",
    price: 4000000,
    plate: "B 100 EV",
    available: true,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=600&auto=format&fit=crop",
    category: "Electric",
    specs: { transmission: "Auto", seats: 5, fuel: "Electric" }
  }
];

export default function CustomerDashboard() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filters = ["All", "Premium Sedan", "Luxury SUV", "Electric"];

  const filteredCars = activeFilter === "All" 
    ? dummyCars 
    : dummyCars.filter(car => car.category === activeFilter);

  return (
    <div>
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Find Your Perfect Drive</h1>
        <p className="text-lg text-slate-500 max-w-2xl">Explore our premium collection of luxury vehicles. Ready for your business trip or weekend getaway.</p>
      </div>

      {/* Filter Section */}
      <div className="mb-8 flex flex-wrap gap-3 justify-center md:justify-start">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all shadow-sm
              ${activeFilter === filter 
                ? "bg-slate-900 text-amber-500 ring-2 ring-slate-900 ring-offset-2" 
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }
            `}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCars.map(car => (
          <div key={car.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 flex flex-col transform hover:-translate-y-1 relative group">
            {/* Image Container wrapped in Link */}
            <Link href={`/customer/car/${car.id}`} className="relative h-60 w-full overflow-hidden bg-slate-100 p-2 block cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10 opacity-70"></div>
              <img 
                src={car.image} 
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover rounded-2xl transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 z-20">
                 <div className="bg-white/90 backdrop-blur text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    {car.category}
                 </div>
              </div>
              {!car.available && (
                <div className="absolute top-4 right-4 z-20 bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase shadow-sm">
                  Rented
                </div>
              )}
            </Link>
            
            <div className="p-6 flex-1 flex flex-col bg-white z-20 rounded-t-3xl -mt-6 pointer-events-none">
              <div className="flex-1 pointer-events-auto">
                 <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{car.brand}</span>
                        <Link href={`/customer/car/${car.id}`} className="hover:text-amber-500 transition-colors">
                            <h3 className="text-xl font-extrabold text-slate-900 leading-tight inline-block">{car.model}</h3>
                        </Link>
                    </div>
                 </div>

                 {/* New Key Specs Iconic Row */}
                 <div className="flex items-center gap-3 mt-4">
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-slate-500 flex-1 justify-center relative group/tooltip">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                       <span className="text-[10px] font-bold uppercase tracking-wider">{car.specs.transmission}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-slate-500 flex-1 justify-center relative group/tooltip">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                       <span className="text-[10px] font-bold uppercase tracking-wider">{car.specs.seats}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-slate-500 flex-1 justify-center relative group/tooltip">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="4" y1="9" x2="20" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>
                       <span className="text-[10px] font-bold uppercase tracking-wider">{car.specs.fuel}</span>
                    </div>
                 </div>
              </div>
              
              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between pointer-events-auto">
                <div>
                   <span className="text-2xl font-black text-slate-900">Rp {(car.price / 1000000).toFixed(1)}<span className="text-sm font-bold text-slate-400 ml-1">M</span></span>
                   <span className="text-slate-400 text-[10px] uppercase font-bold block mt-0.5 tracking-wider">Per Day</span>
                </div>
                
                {car.available ? (
                   <Link href={`/customer/checkout?car=${car.id}`} className="px-6 py-3 rounded-2xl font-bold transition-all shadow-md bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20 inline-block hover:scale-[1.02] active:scale-95 duration-200">
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

    </div>
  );
}
