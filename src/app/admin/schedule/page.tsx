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
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

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
      const activeStatuses = ["Awaiting Payment", "Confirmed", "On Road"];
      return start <= monthEnd && end >= monthStart && activeStatuses.includes(b.status);
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
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-x-auto hide-scrollbar">
          <div className="min-w-max">
            {/* Header */}
            <div className="flex border-b border-slate-100 bg-slate-50 relative">
              <div className="w-64 shrink-0 p-4 border-r border-slate-100 font-bold text-slate-800 flex items-center sticky left-0 z-20 bg-slate-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                 Vehicle Name
              </div>
              <div className="flex-1 flex">
                 {daysArray.map(day => (
                   <div key={day} className={`w-12 shrink-0 border-r border-slate-100 text-center py-4 flex flex-col justify-center ${day === todayDay ? 'bg-amber-50' : ''}`}>
                      <span className="text-xs font-bold text-slate-400 block mb-1">{shortMonth}</span>
                      <span className={`text-sm font-bold ${day === todayDay ? 'text-amber-600' : 'text-slate-800'}`}>{day}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Body */}
            <div className="relative">
              {cars.map((car, i) => {
                const carBookings = getBookingsForCar(car.id);
                return (
                  <div key={car.id} className={`flex border-b border-slate-100 hover:bg-slate-50/50 transition-colors relative ${i === cars.length - 1 ? 'border-b-0' : ''}`}>
                    {/* Fixed Car Column */}
                    <div className="w-64 shrink-0 p-4 border-r border-slate-100 bg-white sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] group-hover:bg-slate-50">
                      <span className="font-bold text-slate-900 block truncate">{car.brand} {car.name}</span>
                      <span className="text-xs font-medium text-slate-400 border border-slate-200 px-2 py-0.5 rounded mt-1 inline-block">{car.type}</span>
                    </div>

                    {/* Timeline Days */}
                    <div className="flex-1 flex relative h-full min-h-[80px]">
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
                          onClick={() => setSelectedBooking(booking)}
                          className={`absolute top-1/2 -translate-y-1/2 h-12 rounded-xl px-2 flex flex-col justify-center shadow-md border border-white/20 overflow-hidden cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-blue-500 transition-all ${bgColor}`}
                          style={{
                            left: `${startOffset}rem`,
                            width: `calc(${duration}rem - 4px)`,
                            marginLeft: '2px',
                          }}
                          title={`${booking.booking_code} | Klik untuk detail`}
                        >
                          {duration > 3 ? (
                            <>
                              <span className="text-[10px] font-black uppercase truncate opacity-80 leading-none mb-1">{booking.booking_code} (x{booking.quantity || 1})</span>
                              <span className="text-xs font-bold truncate leading-none">{booking.users?.name}</span>
                            </>
                          ) : (
                            <span className="text-xs font-bold truncate text-center w-full">{booking.users?.name?.charAt(0)} (x{booking.quantity || 1})</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-extrabold text-xl text-slate-900">Detail Booking</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-700 bg-white border border-slate-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Kode Booking</span>
                  <span className="font-black text-lg text-slate-900">{selectedBooking.booking_code}</span>
                </div>
                <div className="text-right">
                   <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                     selectedBooking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                     selectedBooking.status === 'Awaiting Payment' ? 'bg-amber-100 text-amber-700' :
                     selectedBooking.status === 'On Road' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-700'
                   }`}>
                     {selectedBooking.status}
                   </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    {selectedBooking.users?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{selectedBooking.users?.name}</span>
                    <span className="text-sm text-slate-500">{selectedBooking.users?.email}</span>
                  </div>
                </div>
                <div className="h-px bg-slate-200 my-2"></div>
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">Kendaraan</span>
                  <span className="font-bold text-slate-900">{selectedBooking.cars?.brand} {selectedBooking.cars?.name}</span>
                  <span className="text-xs text-slate-500 ml-2">({selectedBooking.cars?.type})</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm">
                  <span className="text-xs font-bold text-slate-400 block mb-1">Tanggal Mulai</span>
                  <span className="font-bold text-slate-800">
                    {new Date(selectedBooking.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm">
                  <span className="text-xs font-bold text-slate-400 block mb-1">Tanggal Selesai</span>
                  <span className="font-bold text-slate-800">
                    {new Date(selectedBooking.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-slate-500">Total Biaya</span>
                <span className="font-black text-xl text-blue-600">
                  Rp {selectedBooking.total_price?.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Link href="/admin/bookings" className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors">
                Kelola di Bookings &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
