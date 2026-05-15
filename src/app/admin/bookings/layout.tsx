import Link from "next/link";
import { ReactNode } from "react";

export default function BookingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="p-6 md:p-10 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          Bookings Hub
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Manage incoming orders, payment approvals, and fleet handovers.</p>
      </div>
      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
            {children}
        </div>
      </div>
    </div>
  );
}
