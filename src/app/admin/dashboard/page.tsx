"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Swal from "sweetalert2";

const StatCard = ({ title, value, subtitle }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <h3 className="text-slate-500 font-medium text-sm mb-1">{title}</h3>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold text-slate-900">{value}</span>
    </div>
    <p className="text-slate-500 text-xs mt-2">{subtitle}</p>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [resDash, resKyc] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/customers/kyc")
      ]);
      const dataDash = await resDash.json();
      const dataKyc = await resKyc.json();
      
      if (resDash.ok) {
        setStats(dataDash.stats);
        setRecentBookings(dataDash.recentBookings || []);
      }
      if (resKyc.ok) {
        setPendingUsers(dataKyc.pendingUsers || []);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleKycStatus = async (userId: string, status: 'Approved' | 'Rejected') => {
    try {
      const res = await fetch("/api/customers/kyc", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status })
      });
      if (res.ok) {
        Swal.fire("Sukses", `User berhasil di ${status}`, "success");
        fetchDashboard();
      } else {
        const error = await res.json();
        Swal.fire("Gagal", error.error || "Gagal mengubah status", "error");
      }
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `Rp ${(amount / 1000).toFixed(0)}K`;
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard title="Total Fleet" value={stats?.totalCars ?? 0} subtitle="Units across all models" />
        <StatCard title="Active Rentals" value={stats?.activeRentals ?? 0} subtitle="Cars currently on the road" />
        <StatCard title="Total Customers" value={stats?.totalCustomers ?? 0} subtitle="Unique renters" />
        <StatCard title="Revenue (Today)" value={formatCurrency(stats?.revenueToday ?? 0)} subtitle="From verified payments" />
        <StatCard title="Revenue (Total)" value={formatCurrency(stats?.revenueTotal ?? 0)} subtitle="Lifetime earnings" />
      </div>

      <div className="mb-8 w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          Pending e-KYC Approvals
          {pendingUsers.length > 0 && (
            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{pendingUsers.length}</span>
          )}
        </h2>
        {pendingUsers.length === 0 ? (
          <p className="text-slate-400 text-center py-4">Semua pengguna sudah diverifikasi.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-sm">
                  <th className="py-3 font-medium">Nama</th>
                  <th className="py-3 font-medium">Email</th>
                  <th className="py-3 font-medium">Dokumen</th>
                  <th className="py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingUsers.map(user => (
                  <tr key={user.id} className="text-sm">
                    <td className="py-4 font-semibold text-slate-800">{user.name}</td>
                    <td className="py-4 text-slate-500">{user.email}</td>
                    <td className="py-4">
                      <div className="flex gap-3">
                        {user.ktp_url && <a href={user.ktp_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Lihat KTP</a>}
                        {user.selfie_url && <a href={user.selfie_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Lihat Selfie</a>}
                      </div>
                    </td>
                    <td className="py-4 flex gap-2 justify-end">
                      <button onClick={() => handleKycStatus(user.id, 'Approved')} className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg" title="Setujui">
                        <CheckCircle size={18} />
                      </button>
                      <button onClick={() => handleKycStatus(user.id, 'Rejected')} className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg" title="Tolak">
                        <XCircle size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white lg:col-span-2 border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Bookings</h2>
          <div className="space-y-4">
            {recentBookings.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Belum ada booking.</p>
            ) : (
              recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex justify-between items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-900">{booking.cars?.brand} {booking.cars?.name}</h4>
                    <p className="text-sm text-slate-500">{booking.users?.name} &bull; {booking.booking_code}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'On Road' ? 'bg-amber-100 text-amber-700' :
                      booking.status === 'Returned' ? 'bg-emerald-100 text-emerald-700' :
                      booking.status === 'Awaiting Payment' ? 'bg-rose-100 text-rose-700' :
                      'bg-sky-100 text-sky-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 text-slate-900 shadow-xl">
          <h2 className="text-lg font-bold mb-2">Quick Actions</h2>
          <p className="text-slate-500 text-sm mb-6">Shortcuts to manage your rental business</p>
          
          <div className="space-y-3">
            <Link href="/admin/cars/add" className="block w-full bg-slate-50 hover:bg-slate-100 text-center py-3 rounded-xl font-medium transition-colors border border-slate-200">
              Add New Car
            </Link>
            <Link href="/admin/bookings" className="block w-full bg-slate-50 hover:bg-slate-100 text-center py-3 rounded-xl font-medium transition-colors border border-slate-200">
              View Bookings
            </Link>
            <Link href="/admin/customers" className="block w-full bg-amber-500 hover:bg-amber-400 text-slate-900 text-center py-3 rounded-xl font-bold transition-colors shadow-lg">
              View Customers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
