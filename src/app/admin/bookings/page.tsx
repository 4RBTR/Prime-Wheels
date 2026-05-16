"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Swal from "sweetalert2";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [manageBooking, setManageBooking] = useState<any>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (res.ok) setBookings(data.bookings || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusBadge = (status: string, paymentStatus: string) => {
    if (paymentStatus === 'Awaiting DP Verification' || paymentStatus === 'Awaiting Full Payment Verification') {
      return <span className="bg-amber-100 text-amber-700 border border-amber-200 font-bold px-3 py-1 rounded-full text-xs animate-pulse">Menunggu Verifikasi Pembayaran</span>;
    }
    switch(status) {
      case "Awaiting Payment": return <span className="bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-1 rounded-full text-xs">Awaiting Payment</span>;
      case "Ready for Pickup": return <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-3 py-1 rounded-full text-xs">Ready for Pickup</span>;
      case "On Road": return <span className="bg-sky-100 text-sky-700 border border-sky-200 font-bold px-3 py-1 rounded-full text-xs">🚗 On Road</span>;
      case "Returned": return <span className="bg-slate-100 text-slate-500 border border-slate-200 font-bold px-3 py-1 rounded-full text-xs">Returned</span>;
      case "Cancelled": return <span className="bg-slate-100 text-slate-500 border border-slate-200 font-bold px-3 py-1 rounded-full text-xs">Cancelled</span>;
      default: return <span className="bg-slate-100 text-slate-500 font-bold px-3 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  const filteredBookings = filter === "All" 
    ? bookings 
    : filter === "Pending" 
      ? bookings.filter(b => b.status === "Awaiting Payment" || b.status === "Awaiting Approval")
      : bookings.filter(b => b.status === "On Road" || b.status === "Ready for Pickup");

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const handlePaymentApproval = async (id: string, action: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/approve-payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Sukses", "Status pembayaran berhasil diperbarui", "success");
        setManageBooking(null);
        fetchBookings();
      } else {
        Swal.fire("Gagal", data.message || "Gagal memperbarui", "error");
      }
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string, carId?: string, setMaintenance?: boolean) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, carId, setMaintenance })
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Sukses", `Status berhasil diubah menjadi ${newStatus}`, "success");
        setManageBooking(null);
        fetchBookings();
      } else {
        Swal.fire("Gagal", data.message || "Gagal memperbarui", "error");
      }
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    }
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
                    {getStatusBadge(booking.status, booking.payment_status)}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setManageBooking(booking)}
                      className="inline-block bg-white hover:bg-slate-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md border border-slate-200"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Manage Booking Modal */}
      {manageBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setManageBooking(null)}></div>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Kelola Pembayaran & Booking</h2>
              <button onClick={() => setManageBooking(null)} className="text-slate-400 hover:text-rose-500">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-slate-500 mb-1">Booking Code</span>
                  <span className="font-bold text-slate-900">{manageBooking.booking_code}</span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">Customer</span>
                  <span className="font-bold text-slate-900">{manageBooking.users?.name}</span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">Total Biaya</span>
                  <span className="font-bold text-slate-900">Rp {manageBooking.total_price.toLocaleString('id-ID')}</span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-1">Status Pembayaran</span>
                  <span className="font-bold text-slate-900">{manageBooking.payment_status}</span>
                </div>
              </div>

              {/* DP Verification Section */}
              {manageBooking.payment_status === 'Awaiting DP Verification' && manageBooking.payment_dp_url && (
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
                  <h3 className="font-bold text-amber-900 mb-4">Verifikasi Pembayaran DP (30%)</h3>
                  <div className="mb-4">
                    <span className="block text-amber-800 text-sm mb-2">Bukti Transfer DP:</span>
                    <a href={manageBooking.payment_dp_url} target="_blank" rel="noreferrer">
                      <img src={manageBooking.payment_dp_url} alt="Bukti DP" className="max-w-xs rounded-xl border border-amber-200 shadow-sm hover:opacity-90 transition-opacity" />
                    </a>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handlePaymentApproval(manageBooking.id, 'APPROVE_DP')} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-sm">
                      <CheckCircle size={16} /> Setujui DP
                    </button>
                    <button onClick={() => handlePaymentApproval(manageBooking.id, 'REJECT_DP')} className="flex items-center gap-2 bg-rose-100 hover:bg-rose-200 text-rose-700 px-4 py-2 rounded-xl font-bold text-sm">
                      <XCircle size={16} /> Tolak DP
                    </button>
                  </div>
                </div>
              )}

              {/* Full Payment Verification Section */}
              {manageBooking.payment_status === 'Awaiting Full Payment Verification' && manageBooking.payment_full_url && (
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
                  <h3 className="font-bold text-blue-900 mb-4">Verifikasi Pelunasan</h3>
                  <div className="mb-4">
                    <span className="block text-blue-800 text-sm mb-2">Bukti Transfer Pelunasan:</span>
                    <a href={manageBooking.payment_full_url} target="_blank" rel="noreferrer">
                      <img src={manageBooking.payment_full_url} alt="Bukti Pelunasan" className="max-w-xs rounded-xl border border-blue-200 shadow-sm hover:opacity-90 transition-opacity" />
                    </a>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handlePaymentApproval(manageBooking.id, 'APPROVE_FULL')} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-sm">
                      <CheckCircle size={16} /> Setujui Pelunasan
                    </button>
                    <button onClick={() => handlePaymentApproval(manageBooking.id, 'REJECT_FULL')} className="flex items-center gap-2 bg-rose-100 hover:bg-rose-200 text-rose-700 px-4 py-2 rounded-xl font-bold text-sm">
                      <XCircle size={16} /> Tolak Pelunasan
                    </button>
                  </div>
                </div>
              )}

              {/* Operational Status Controls */}
              {manageBooking.payment_status !== 'Awaiting DP Verification' && manageBooking.payment_status !== 'Awaiting Full Payment Verification' && (
                <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Manajemen Operasional</h3>
                  
                  {manageBooking.status === "Ready for Pickup" && (
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-sm">
                       <p className="font-bold text-amber-800 mb-2">Kendaraan siap diambil pelanggan.</p>
                       <button 
                         onClick={() => handleStatusChange(manageBooking.id, "On Road")}
                         className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl transition-colors w-full sm:w-auto"
                       >
                         Serahkan Kunci (Set On Road)
                       </button>
                    </div>
                  )}

                  {manageBooking.status === "On Road" && (
                    <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 text-sm space-y-4">
                       <p className="font-bold text-sky-800">Kendaraan sedang disewa.</p>
                       <div className="flex flex-col sm:flex-row gap-3">
                         <button 
                           onClick={() => handleStatusChange(manageBooking.id, "Returned", manageBooking.car_id, false)}
                           className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl transition-colors flex-1"
                         >
                           Konfirmasi Pengembalian
                         </button>
                         <button 
                           onClick={() => handleStatusChange(manageBooking.id, "Returned", manageBooking.car_id, true)}
                           className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl transition-colors flex-1 flex flex-col items-center justify-center"
                         >
                           <span>Kembalikan & Hold</span>
                           <span className="text-[10px] font-normal opacity-70">(Masuk Maintenance)</span>
                         </button>
                       </div>
                    </div>
                  )}

                  {manageBooking.status === "Returned" && (
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-sm text-center">
                       <p className="font-bold text-emerald-800">Sewa Selesai. Kendaraan telah dikembalikan.</p>
                    </div>
                  )}

                  {manageBooking.status === "Cancelled" && (
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 text-sm text-center">
                       <p className="font-bold text-rose-800">Pesanan telah dibatalkan.</p>
                    </div>
                  )}

                  {manageBooking.status === "Awaiting Payment" && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-center">
                       <p className="font-bold text-slate-500">Menunggu pelanggan melakukan pembayaran.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
