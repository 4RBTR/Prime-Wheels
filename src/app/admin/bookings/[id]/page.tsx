"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, use, ReactNode } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// This simulates the single booking view
export default function BookingActionRoom({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const [status, setStatus] = useState<"Awaiting Payment" | "Ready for Pickup" | "On Road" | "Returned">(
    unwrappedParams.id.includes("001") ? "Awaiting Payment" : 
    unwrappedParams.id.includes("002") ? "On Road" : "Ready for Pickup"
  );
  
  const [damageNotes, setDamageNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const handleAction = () => {
    if (status === "Awaiting Payment") {
      toast.success("Payment Approved! Car is ready for pickup.", { containerId: "toast-action" });
      setStatus("Ready for Pickup");
    } 
    else if (status === "Ready for Pickup") {
      toast.info("Keys handed over. The car is now on the road.", { containerId: "toast-action" });
      setStatus("On Road");
    }
    else if (status === "On Road") {
       if(!showNotes) {
           setShowNotes(true);
           return;
       }
      toast.success("Car returned successfully! Order complete.", { containerId: "toast-action" });
      setStatus("Returned");
      setShowNotes(false);
    }
  };

  const getStatusBadge = () => {
    switch(status) {
      case "Awaiting Payment": return <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold px-4 py-2 rounded-full text-sm">Awaiting Payment</span>;
      case "Ready for Pickup": return <span className="bg-amber-50 text-amber-700 border border-amber-200 font-bold px-4 py-2 rounded-full text-sm animate-pulse">Ready for Pickup</span>;
      case "On Road": return <span className="bg-sky-50 text-sky-700 border border-sky-200 font-bold px-4 py-2 rounded-full text-sm">🚗 On Road</span>;
      case "Returned": return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-4 py-2 rounded-full text-sm">Returned</span>;
    }
  }

  return (
    <div>
      <ToastContainer containerId={"toast-action"} theme="light" />
      
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-6">
         <div>
             <Link href="/admin/bookings" className="text-slate-500 hover:text-slate-900 text-sm font-bold flex items-center mb-2 transition-colors">
                 &larr; Back to Bookings
             </Link>
             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4">
                Invoice {unwrappedParams.id}
             </h2>
         </div>
         <div>{getStatusBadge()}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detail Column */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Rental Details</h3>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <span className="block text-sm text-slate-500 mb-1">Customer</span>
                    <span className="font-bold text-slate-900">Andi Wijaya</span>
                    <span className="block text-xs text-slate-500">0812-3344-5566</span>
                 </div>
                 <div>
                    <span className="block text-sm text-slate-500 mb-1">Vehicle Selected</span>
                    <span className="font-bold text-slate-900">Mercedes-Benz S450</span>
                    <span className="block text-xs text-slate-500">Plate: B 777 LXR</span>
                 </div>
                 <div className="mt-4">
                    <span className="block text-sm text-slate-500 mb-1">Pick-up Date</span>
                    <span className="font-bold text-slate-900">16 Apr 2026, 09:00</span>
                 </div>
                 <div className="mt-4">
                    <span className="block text-sm text-slate-500 mb-1">Return Date</span>
                    <span className="font-bold text-slate-900">18 Apr 2026, 09:00</span>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                 <span className="block text-sm text-slate-500 mb-1">Total Bill</span>
                 <span className="text-3xl font-black text-slate-900">Rp 10.000.000</span>
              </div>
              <div>
                 {status === "Awaiting Payment" ? (
                   <span className="text-rose-500 font-bold bg-rose-50 px-3 py-1 rounded-lg">Unpaid</span>
                 ) : (
                   <span className="text-emerald-500 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">Paid in Full</span>
                 )}
              </div>
           </div>
        </div>

        {/* Action Room Column */}
        <div>
           <div className="bg-slate-50 text-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
              <h3 className="text-xl font-bold mb-6 text-slate-900 relative z-10">Control Center</h3>
              
              <div className="space-y-6 relative z-10">
                 {status === "Awaiting Payment" && (
                    <button onClick={handleAction} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-4 rounded-xl shadow-md transition-all">
                       Approve Payment
                    </button>
                 )}

                 {status === "Ready for Pickup" && (
                    <button onClick={handleAction} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-4 rounded-xl shadow-md transition-all">
                       Handover Keys to Client
                    </button>
                 )}

                 {status === "On Road" && !showNotes && (
                    <button onClick={handleAction} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-4 rounded-xl shadow-md transition-all">
                       Process Car Return
                    </button>
                 )}

                 {status === "On Road" && showNotes && (
                    <div className="animate-fade-in">
                       <label className="block text-sm font-bold text-slate-700 mb-2">Damage Logs / Notes</label>
                       <textarea 
                          value={damageNotes}
                          onChange={(e) => setDamageNotes(e.target.value)}
                          placeholder="Condition is Safe, No Scratches..." 
                          className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl p-4 mb-4 focus:ring-2 focus:ring-amber-500 outline-none"
                          rows={4}
                       />
                       <button onClick={handleAction} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl transition-all shadow-md">
                          Confirm & Close Order
                       </button>
                    </div>
                 )}

                 {status === "Returned" && (
                    <div className="text-center p-6 bg-white rounded-xl border border-slate-200">
                       <span className="text-2xl block mb-2">🏁</span>
                       <p className="text-emerald-600 font-bold">Order Closed</p>
                       <p className="text-slate-500 text-sm mt-1">Car is back in the fleet.</p>
                       {damageNotes && (
                          <div className="mt-4 text-left bg-slate-50 p-3 rounded-lg border border-slate-200">
                             <span className="block text-slate-600 text-xs font-bold mb-1">Return Notes:</span>
                             <span className="text-slate-900 text-sm font-medium">{damageNotes}</span>
                          </div>
                       )}
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
