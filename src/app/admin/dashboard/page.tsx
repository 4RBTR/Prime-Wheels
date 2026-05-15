"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import RealtimeChart from "@/components/RealtimeChart";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        if (res.ok) {
          setStats(data.stats);
          setRecentBookings(data.recentBookings || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Cars" value={stats?.totalCars ?? 0} subtitle="Total fleet managed" />
        <StatCard title="Active Rentals" value={stats?.activeRentals ?? 0} subtitle="Cars currently on the road" />
        <StatCard title="Total Customers" value={stats?.totalCustomers ?? 0} subtitle="Unique renters" />
        <StatCard title="Revenue (Today)" value={formatCurrency(stats?.revenueToday ?? 0)} subtitle="From verified payments" />
      </div>

      <div className="mb-8 w-full">
         <RealtimeChart />
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
