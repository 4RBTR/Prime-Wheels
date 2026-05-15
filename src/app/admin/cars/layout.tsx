import { ReactNode } from "react";

export default function CarsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Car Fleet Management</h1>
        <p className="text-slate-500 mt-1">Manage your premium rental cars, prices, and availability.</p>
      </div>
      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
        {children}
      </div>
    </div>
  );
}
