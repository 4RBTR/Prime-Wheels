"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import CardCar from "./card-car";

export default function CarsPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const fetchCars = async () => {
    try {
      // In a real app we might pass the admin ID, but if our API uses session, we don't need to.
      // Wait, our API GET /api/cars does NOT check session, it just accepts adminId as a query param.
      // Actually, let's fetch the session first or just let the user see all cars in this admin view, or we should fetch session.
      // For now, let's just fetch all public cars or ideally only the admin's cars.
      const resSession = await fetch("/api/auth/session");
      const session = await resSession.json();
      
      const adminId = session?.user?.id;
      const url = adminId ? `/api/cars?adminId=${adminId}` : "/api/cars";

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setCars(data.cars || []);
      }
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Extract unique categories from cars (type)
  const filters = ["All", ...Array.from(new Set(cars.map(car => car.type)))];

  const filteredCars = activeFilter === "All" 
    ? cars 
    : cars.filter(car => car.type === activeFilter);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-slate-200 gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Current Fleet ({cars.length})</h2>
           <p className="text-sm text-slate-500">Manage cars and categories.</p>
        </div>
        <Link 
          href="/admin/cars/add"
          className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-2 rounded-xl font-bold transition-colors shadow-sm whitespace-nowrap"
        >
          + Add New Car
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {/* Filter Section */}
          <div className="mb-8 flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all shadow-sm
                  ${activeFilter === filter 
                    ? "bg-white text-amber-500 ring-2 ring-slate-900 ring-offset-1" 
                    : "bg-slate-50 text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCars.length > 0 ? (
              filteredCars.map(car => (
                <CardCar key={car.id} car={car} />
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                No cars found in this category.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
