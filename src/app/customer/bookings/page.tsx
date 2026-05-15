"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState("Active");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  useEffect(() => {
    async function fetchMyBookings() {
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
    fetchMyBookings();
  }, []);

  // Logic for active vs past history
  // Active: status is 'Awaiting Payment', 'Ready for Pickup', 'On Road'
  // History: status is 'Returned', 'Cancelled'
  const filteredBookings = bookings.filter((b) => {
    const isHistorical = b.status === "Returned" || b.status === "Cancelled";
    return activeTab === "Active" ? !isHistorical : isHistorical;
  });

  const getDaysCount = (start: string, end: string) => {
    const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const isPaid = (b: any) => b.payment_status === "Paid";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div className="py-8 relative">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
        <p className="text-slate-500 mt-2 font-medium">Track your active rentals and past trips history.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8 gap-8">
        <button
          onClick={() => setActiveTab("Active")}
          className={`pb-4 text-sm font-bold transition-all relative ${
            activeTab === "Active" ? "text-slate-900" : "text-slate-400 hover:text-slate-700"
          }`}
        >
          Active Trips
          {activeTab === "Active" && (
            <div className="absolute -bottom-px left-0 w-full h-0.5 bg-slate-900 rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("History")}
          className={`pb-4 text-sm font-bold transition-all relative ${
            activeTab === "History" ? "text-slate-900" : "text-slate-400 hover:text-slate-700"
          }`}
        >
          Past History
          {activeTab === "History" && (
            <div className="absolute -bottom-px left-0 w-full h-0.5 bg-slate-900 rounded-t-full"></div>
          )}
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {filteredBookings.map((booking) => {
          const days = getDaysCount(booking.start_date, booking.end_date);
          return (
            <div
              key={booking.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:shadow-md transition-all"
            >
              {/* Left: Car & Ref */}
              <div className="flex gap-6 items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                  {booking.cars?.image_url ? (
                    <img src={booking.cars.image_url} alt="Car" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🚘</span>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Ref: {booking.booking_code}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {booking.cars?.brand} {booking.cars?.name}
                  </h3>
                  <span className="mt-1 text-sm text-slate-500 font-medium block">
                    {new Date(booking.start_date).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    &bull; {days} {days === 1 ? "Day" : "Days"}
                  </span>
                </div>
              </div>

              {/* Middle: Money & Status */}
              <div className="text-left md:text-right w-full md:w-auto">
                <span className="text-2xl font-black text-slate-900 tracking-tighter block mb-2">
                  Rp {booking.total_price.toLocaleString("id-ID")}
                </span>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold inline-block border
                      ${booking.status === "Returned" ? "bg-slate-50 text-slate-500 border-slate-200" : ""}
                      ${booking.status === "Ready for Pickup" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}
                      ${booking.status === "On Road" ? "bg-sky-50 text-sky-700 border-sky-200" : ""}
                      ${
                        booking.status === "Awaiting Payment"
                          ? "bg-amber-50 text-amber-700 border-amber-300 animate-pulse"
                          : ""
                      }
                      ${booking.status === "Cancelled" ? "bg-rose-50 text-rose-700 border-rose-200" : ""}
                   `}
                >
                  {booking.status}
                </span>
              </div>

              {/* Right: Actions */}
              <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col gap-3">
                <button
                  onClick={() => setSelectedInvoice(booking)}
                  className="bg-slate-900 text-white text-center font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                >
                  View Invoice
                </button>
                {booking.status === "Awaiting Payment" && (
                  <button className="text-xs font-bold text-amber-600 hover:text-amber-700 animate-pulse">
                    Pending Approval
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredBookings.length === 0 && (
          <div className="text-center py-20 bg-slate-50 border border-slate-200 border-dashed rounded-3xl">
            <p className="text-slate-500 font-medium">No {activeTab.toLowerCase()} bookings found.</p>
            {activeTab === "Active" && (
              <Link href="/customer/dashboard" className="text-slate-900 font-bold mt-2 inline-block underline">
                Rent a car now
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Pop-up Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedInvoice(null)}
          ></div>

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-2xl rounded-t-sm rounded-b-2xl shadow-2xl my-auto transform transition-all animate-fade-in">
            <div className="bg-white rounded-t-sm rounded-b-2xl border border-slate-200 relative overflow-hidden">
              {/* Top Color Bar */}
              <div className="h-2 w-full bg-slate-900 relative">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="absolute top-4 right-4 bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors z-50 focus:outline-none"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 md:p-8 pt-8 md:pt-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white font-black text-lg">R</span>
                    </div>
                    <div>
                      <h2 className="font-extrabold text-lg tracking-tight text-slate-900">Prime Wheels</h2>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Premium Mobility</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h1 className="text-2xl font-black text-slate-200 tracking-wider uppercase mb-1">INVOICE</h1>
                    <span className="text-xs font-bold text-slate-700 block">
                      Ref: <span className="text-slate-900">{selectedInvoice.booking_code}</span>
                    </span>
                  </div>
                </div>

                {/* Bill To & Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</h3>
                    <p className="font-bold text-slate-900 text-lg">{selectedInvoice.users?.name}</p>
                    <p className="text-sm text-slate-500 leading-relaxed mt-1">{selectedInvoice.users?.email}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Rental Period
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900">From:</span>{" "}
                      {new Date(selectedInvoice.start_date).toLocaleDateString("id-ID")}<br />
                      <span className="font-bold text-slate-900">To:</span>{" "}
                      {new Date(selectedInvoice.end_date).toLocaleDateString("id-ID")}<br />
                      <span className="font-bold text-slate-900">Status:</span>
                      <span
                        className={`ml-2 px-2 py-0.5 rounded text-xs font-bold inline-block uppercase ${
                          isPaid(selectedInvoice) ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {selectedInvoice.payment_status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase">Description</th>
                        <th className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase text-center">
                          Days
                        </th>
                        <th className="py-2 px-4 text-[10px] font-bold text-slate-500 uppercase text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 px-4">
                          <span className="font-bold text-sm text-slate-900 block mb-0.5">
                            {selectedInvoice.cars?.brand} {selectedInvoice.cars?.name}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                            {selectedInvoice.cars?.type || "Premium Fleet"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-sm font-medium text-slate-700">
                          {getDaysCount(selectedInvoice.start_date, selectedInvoice.end_date)}
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-bold text-slate-900">
                          Rp {selectedInvoice.total_price.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 pt-5 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs mb-1">Support Contact</h4>
                    <p className="text-[10px] text-slate-500 max-w-sm leading-relaxed">
                      For inquiries, please email support@primewheels.co
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => window.print()}
                      className="bg-slate-900 text-white px-5 py-2 rounded-lg font-bold hover:bg-slate-800 shadow-sm transition-colors text-xs flex items-center gap-2"
                    >
                      Print Document
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
