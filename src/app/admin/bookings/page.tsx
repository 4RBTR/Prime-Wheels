"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (res.ok) setBookings(data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Awaiting Payment": return <span className="bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-1 rounded-full text-xs">Awaiting Payment</span>;
      case "Ready for Pickup": return <span className="bg-amber-100 text-amber-700 border border-amber-200 font-bold px-3 py-1 rounded-full text-xs animate-pulse">Ready for Pickup</span>;
      case "On Road": return <span className="bg-sky-100 text-sky-700 border border-sky-200 font-bold px-3 py-1 rounded-full text-xs">🚗 On Road</span>;
      case "Returned": return <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-3 py-1 rounded-full text-xs">Returned</span>;
      case "Cancelled": return <span className="bg-slate-100 text-slate-500 border border-slate-200 font-bold px-3 py-1 rounded-full text-xs">Cancelled</span>;
      default: return <span className="bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  const filteredBookings = filter === "All" 
    ? bookings 
    : filter === "Pending" 
      ? bookings.filter(b => b.status === "Awaiting Payment")
      : bookings.filter(b => b.status === "On Road" || b.status === "Ready for Pickup");

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-200 pb-6 gap-4">
        <div>
           <h2 className="text-2xl font-extrabold text-slate-800">Active Rentals ({bookings.length})</h2>
        </div>
        <div className="flex bg-slate-50 p-1 rounded-xl">
           {["All", "Pending", "Active"].map(f => (
             <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg font-bold text-sm ${filter === f ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>
               {f}
             </button>
           ))}
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">
          Belum ada booking yang tercatat.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold text-sm border-b border-slate-200">
                <th className="p-4">Booking Code</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Period</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredBookings.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono text-sm font-bold text-slate-600">{booking.booking_code}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{booking.users?.name || '-'}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-600">{booking.cars?.brand} {booking.cars?.name}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-500 font-medium">
                    {formatDate(booking.start_date)} &rarr; {formatDate(booking.end_date)}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="p-4 text-right">
                    <span className="inline-block bg-white hover:bg-slate-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md">
                      Manage
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
