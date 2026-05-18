"use client";

import { useState, useEffect } from "react";
import { 
  Loader2, Search, ChevronDown, ChevronUp, 
  X, Eye, Calendar, Mail, FileText, 
  UserCheck, UserX, ArrowUpRight, DollarSign, RefreshCw 
} from "lucide-react";
import Swal from "sweetalert2";

export interface CustomerType {
  id: string;
  name: string;
  email: string;
  ktp_url: string | null;
  selfie_url: string | null;
  kyc_status: string;
  created_at: string;
}

export interface BookingType {
  id: string;
  user_id: string;
  booking_code: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  payment_status: string;
  cars?: {
    name: string;
    brand: string;
    type: string;
    image_url: string;
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Search and Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, Approved, Pending, Rejected, None
  
  // Expanded Customer ID list
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);

  // Modal State
  const [modalImage, setModalImage] = useState<{ url: string; title: string } | null>(null);

  const fetchData = async () => {
    try {
      const [resCustomers, resBookings] = await Promise.all([
        fetch("/api/customers"),
        fetch("/api/bookings")
      ]);
      
      const dataCustomers = await resCustomers.json();
      const dataBookings = await resBookings.json();

      if (resCustomers.ok) {
        setCustomers(dataCustomers.customers || []);
      }
      if (resBookings.ok) {
        setBookings(dataBookings.bookings || []);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleKycStatus = async (userId: string, status: "Approved" | "Rejected") => {
    const actionText = status === "Approved" ? "menyetujui" : "menolak";
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: `Anda akan ${actionText} verifikasi e-KYC pengguna ini.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: status === "Approved" ? "#10b981" : "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: status === "Approved" ? "Ya, Setujui" : "Ya, Tolak",
      cancelButtonText: "Batal"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch("/api/customers/kyc", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, status })
        });
        if (res.ok) {
          Swal.fire("Sukses!", `e-KYC berhasil di${status === "Approved" ? "setujui" : "tolak"}.`, "success");
          fetchData();
        } else {
          const error = await res.json();
          Swal.fire("Gagal!", error.error || "Gagal mengubah status.", "error");
        }
      } catch (err: unknown) {
        Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan server.", "error");
      }
    }
  };

  const getKycStatusText = (c: CustomerType) => {
    return c.kyc_status || "Pending";
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const kycStatus = getKycStatusText(c);
    
    if (statusFilter === "ALL") return matchesSearch;
    if (statusFilter === "Approved") return matchesSearch && kycStatus === "Approved";
    if (statusFilter === "Pending") return matchesSearch && kycStatus === "Pending";
    if (statusFilter === "Rejected") return matchesSearch && kycStatus === "Rejected";
    return matchesSearch;
  });

  const pendingCount = customers.filter(c => getKycStatusText(c) === "Pending").length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-slate-500 font-semibold text-sm">Memuat data penyewa...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Daftar Pelanggan & e-KYC</h1>
          <p className="text-slate-500 text-sm font-semibold mt-1">
            Total Pelanggan: {customers.length} | Menunggu Verifikasi: {pendingCount}
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-black transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 shrink-0 overflow-x-auto pb-2 md:pb-0">
          {[
            { value: "ALL", label: "Semua" },
            { value: "Pending", label: "Menunggu Review" },
            { value: "Approved", label: "Terverifikasi" },
            { value: "Rejected", label: "Ditolak" }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 border ${
                statusFilter === tab.value
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {tab.label}
              {tab.value === "Pending" && pendingCount > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <FileText size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="font-semibold">Tidak ada pelanggan yang ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCustomers.map((customer) => {
            const isExpanded = expandedCustomerId === customer.id;
            const customerBookings = bookings.filter(b => b.user_id === customer.id);
            const totalSpent = customerBookings
              .filter(b => b.payment_status === "Paid" || b.payment_status === "DP Paid")
              .reduce((sum, b) => sum + b.total_price, 0);

            const kycStatus = getKycStatusText(customer);

            return (
              <div 
                key={customer.id} 
                className={`bg-white border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 ${
                  isExpanded ? "border-slate-300 ring-4 ring-slate-100/50" : "border-slate-200"
                }`}
              >
                {/* Collapsed view card */}
                <div 
                  className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer"
                  onClick={() => setExpandedCustomerId(isExpanded ? null : customer.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg shadow-inner shrink-0">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-slate-900 text-base leading-tight truncate">{customer.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-slate-500 text-xs font-semibold mt-1">
                        <span className="flex items-center gap-1"><Mail size={12} /> {customer.email}</span>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> Gabung: {new Date(customer.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 justify-between lg:justify-end shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        kycStatus === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        kycStatus === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse" :
                        "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {kycStatus === "Approved" ? "Terverifikasi" :
                         kycStatus === "Pending" ? "Review KYC" :
                         "Ditolak"}
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-black px-2.5 py-1.5 rounded-full border border-slate-200">
                        {customerBookings.length} Sewa
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCustomerId(isExpanded ? null : customer.id);
                        }}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details section */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-slate-100 bg-slate-50/50 animate-fade-in">
                    
                    {/* KYC Document Section (Direct Action) */}
                    <div className="mt-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                      <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
                        <FileText size={16} className="text-blue-600" /> Verifikasi Dokumen & e-KYC
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        {/* KTP Document Card */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identitas Diri</p>
                            <p className="text-sm font-black text-slate-800 mt-0.5">Foto KTP Pengguna</p>
                          </div>
                          {customer.ktp_url ? (
                            <button
                              onClick={() => setModalImage({ url: customer.ktp_url!, title: `KTP: ${customer.name}` })}
                              className="flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 px-4 py-2.5 rounded-xl text-xs font-black transition-colors w-full sm:w-auto"
                            >
                              <Eye size={14} /> Lihat Dokumen
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 font-semibold italic">Belum Diunggah</span>
                          )}
                        </div>

                        {/* Selfie Card */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Foto Verifikasi</p>
                            <p className="text-sm font-black text-slate-800 mt-0.5">Selfie + KTP</p>
                          </div>
                          {customer.selfie_url ? (
                            <button
                              onClick={() => setModalImage({ url: customer.selfie_url!, title: `Selfie: ${customer.name}` })}
                              className="flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 px-4 py-2.5 rounded-xl text-xs font-black transition-colors w-full sm:w-auto"
                            >
                              <Eye size={14} /> Lihat Dokumen
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 font-semibold italic">Belum Diunggah</span>
                          )}
                        </div>
                      </div>

                      {/* KYC Actions */}
                      {kycStatus === "Pending" && (customer.ktp_url || customer.selfie_url) ? (
                        <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <p className="text-sm font-bold text-amber-800">
                            Pengguna ini telah melengkapi dokumen e-KYC. Tentukan keputusan verifikasi:
                          </p>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleKycStatus(customer.id, "Rejected")}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all"
                            >
                              <UserX size={14} /> Tolak KYC
                            </button>
                            <button
                              onClick={() => handleKycStatus(customer.id, "Approved")}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-600/25"
                            >
                              <UserCheck size={14} /> Setujui KYC
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <p className="text-xs font-bold text-slate-500">
                            Status e-KYC saat ini: <span className="uppercase text-slate-700 font-black">{kycStatus === "Approved" ? "Terverifikasi" : kycStatus}</span>
                          </p>
                          {kycStatus === "Approved" && (
                            <button
                              onClick={() => handleKycStatus(customer.id, "Rejected")}
                              className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-xl text-xs font-black transition-colors"
                            >
                              Revoke / Batalkan Verifikasi
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Stats Dashboard per Customer */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <ArrowUpRight size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Booking</p>
                          <p className="text-xl font-black text-slate-900 mt-0.5">{customerBookings.length} Sewa</p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <DollarSign size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengeluaran</p>
                          <p className="text-xl font-black text-slate-900 mt-0.5">{formatCurrency(totalSpent)}</p>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sewa Terakhir</p>
                          <p className="text-sm font-black text-slate-900 mt-0.5 truncate">
                            {customerBookings.length > 0 
                              ? new Date(customerBookings[0].start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                              : "Belum pernah sewa"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Booking History Table */}
                    <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Riwayat Sewa Kendaraan</h4>
                        <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded-md">
                          {customerBookings.length} Transaksi
                        </span>
                      </div>
                      
                      {customerBookings.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm font-medium">
                          Pelanggan belum memiliki riwayat transaksi penyewaan.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                <th className="p-4">Kode Booking</th>
                                <th className="p-4">Mobil</th>
                                <th className="p-4">Durasi</th>
                                <th className="p-4 text-right">Total Biaya</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Pembayaran</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {customerBookings.map((booking) => (
                                <tr key={booking.id} className="text-xs hover:bg-slate-50/50 transition-colors">
                                  <td className="p-4 font-black text-blue-600">{booking.booking_code}</td>
                                  <td className="p-4">
                                    <div className="font-bold text-slate-800">
                                      {booking.cars ? `${booking.cars.brand} ${booking.cars.name}` : "Mobil"}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-semibold">{booking.cars?.type}</div>
                                  </td>
                                  <td className="p-4 font-semibold text-slate-600">
                                    {new Date(booking.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - {new Date(booking.end_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                  </td>
                                  <td className="p-4 text-right font-black text-slate-850">
                                    {formatCurrency(booking.total_price)}
                                  </td>
                                  <td className="p-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                      booking.status === "On Road" ? "bg-amber-100 text-amber-700" :
                                      booking.status === "Returned" ? "bg-emerald-100 text-emerald-700" :
                                      booking.status === "Cancelled" ? "bg-rose-100 text-rose-700" :
                                      "bg-sky-100 text-sky-700"
                                    }`}>
                                      {booking.status}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                      booking.payment_status === "Paid" ? "bg-emerald-100 text-emerald-700" :
                                      booking.payment_status === "DP Paid" ? "bg-blue-100 text-blue-700" :
                                      booking.payment_status === "Pending" ? "bg-slate-100 text-slate-500" :
                                      "bg-amber-100 text-amber-700"
                                    }`}>
                                      {booking.payment_status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Elegant & Fully Responsive Image Modal (Popup) */}
      {modalImage && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setModalImage(null)}
        >
          <div 
            className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col relative border border-slate-200 transform scale-100 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-900 text-base uppercase tracking-wider">{modalImage.title}</h3>
              <button 
                onClick={() => setModalImage(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Modal Body (Responsive Scrollable Image Area) */}
            <div className="p-6 bg-slate-100 flex items-center justify-center overflow-auto max-h-[60vh]">
              <img 
                src={modalImage.url} 
                alt={modalImage.title} 
                className="max-w-full max-h-full object-contain rounded-2xl shadow-sm border border-slate-200/50" 
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button
                onClick={() => setModalImage(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-colors"
              >
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
