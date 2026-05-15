/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function FleetSchedulePage() {
  const [cars, setCars] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const today = new Date();
  const todayDay = today.getFullYear() === year && today.getMonth() === month ? today.getDate() : -1;
  const monthName = currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const shortMonth = currentDate.toLocaleDateString("id-ID", { month: "short" });

  useEffect(() => {
    async function fetchData() {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const adminId = session?.user?.id;
        if (!adminId) return;

        const [carsRes, bookingsRes] = await Promise.all([
          fetch(`/api/cars?adminId=${adminId}`),
          fetch("/api/bookings"),
        ]);

        const carsData = await carsRes.json();
        const bookingsData = await bookingsRes.json();

        setCars(carsData.cars || []);
        setBookings(bookingsData.bookings || []);
      } catch (err) {
        console.error("Failed to fetch schedule data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getBookingsForCar = (carId: string) => {
    return bookings.filter(b => b.car_id === carId).map(b => {
      const start = new Date(b.start_date);
      const end = new Date(b.end_date);
      const startDay = start.getFullYear() === year && start.getMonth() === month ? start.getDate() : 1;
      const endDay = end.getFullYear() === year && end.getMonth() === month ? end.getDate() : daysInMonth;
      return { ...b, startDay, endDay };
    }).filter(b => {
      const start = new Date(b.start_date);
      const end = new Date(b.end_date);
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      return start <= monthEnd && end >= monthStart;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="py-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fleet Schedule</h1>
            <p className="text-slate-500 mt-2 font-medium">Visual timeline to track car availability and prevent double bookings.</p>
         </div>
         <div className="flex gap-3">
            <button onClick={prevMonth} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 flex gap-2 items-center rounded-xl font-bold hover:bg-slate-50 shadow-sm transition-colors">
               &larr; Prev Month
            </button>
            <span className="bg-slate-900 text-white px-6 py-2 flex items-center rounded-xl font-bold shadow-sm capitalize">
               {monthName}
            </span>
            <button onClick={nextMonth} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 flex gap-2 items-center rounded-xl font-bold hover:bg-slate-50 shadow-sm transition-colors">
               Next Month &rarr;
            </button>
         </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap gap-6 mb-8 shadow-sm">
         <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500"></div>
            <span className="text-sm font-bold text-slate-700">Confirmed Booking</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-400"></div>
            <span className="text-sm font-bold text-slate-700">Awaiting Payment</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-sky-500"></div>
            <span className="text-sm font-bold text-slate-700">On Road</span>
         </div>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">
          Belum ada kendaraan di armada Anda. <Link href="/admin/cars/add" className="text-blue-600 font-bold hover:underline">Tambahkan mobil</Link>.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-100 bg-slate-50">
            <div className="w-64 shrink-0 p-4 border-r border-slate-100 font-bold text-slate-800 flex items-center">
               Vehicle Name
            </div>
            <div className="flex-1 flex overflow-x-auto">
               {daysArray.map(day => (
                 <div key={day} className={`w-12 shrink-0 border-r border-slate-100 text-center py-4 flex flex-col justify-center ${day === todayDay ? 'bg-amber-50' : ''}`}>
                    <span className="text-xs font-bold text-slate-400 block mb-1">{shortMonth}</span>
                    <span className={`text-sm font-bold ${day === todayDay ? 'text-amber-600' : 'text-slate-800'}`}>{day}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="relative">
            {cars.map((car, i) => {
              const carBookings = getBookingsForCar(car.id);
              return (
                <div key={car.id} className={`flex border-b border-slate-100 hover:bg-slate-50/50 transition-colors relative ${i === cars.length - 1 ? 'border-b-0' : ''}`}>
                  <div className="w-64 shrink-0 p-4 border-r border-slate-100 bg-white">
                    <span className="font-bold text-slate-900 block truncate">{car.brand} {car.name}</span>
                    <span className="text-xs font-medium text-slate-400 border border-slate-200 px-2 py-0.5 rounded mt-1 inline-block">{car.type}</span>
                  </div>

                  <div className="flex-1 flex relative h-full min-h-20">
                    {daysArray.map(day => (
                      <div key={day} className="w-12 shrink-0 border-r border-slate-100/50 h-full"></div>
                    ))}

                    {carBookings.map(booking => {
                      const startOffset = (booking.startDay - 1) * 3;
                      const duration = (booking.endDay - booking.startDay + 1) * 3;

                      let bgColor = "bg-emerald-500 text-white";
                      if (booking.status === "Awaiting Payment") bgColor = "bg-amber-400 text-amber-950";
                      else if (booking.status === "On Road") bgColor = "bg-sky-500 text-white";

                      return (
                        <div
                          key={booking.id}
                          className={`absolute top-1/2 -translate-y-1/2 h-10 rounded-xl px-3 flex flex-col justify-center shadow-md ${bgColor}`}
                          style={{
                            left: `${startOffset}rem`,
                            width: `calc(${duration}rem - 4px)`,
                          }}
                          title={`${booking.booking_code} | ${booking.users?.name}`}
                        >
                          <span className="text-[10px] font-black uppercase truncate opacity-80 leading-none mb-0.5">{booking.booking_code}</span>
                          <span className="text-xs font-bold truncate leading-none">{booking.users?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
