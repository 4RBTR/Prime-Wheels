"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReviewKycPage() {
  const router = useRouter();

  const handleDecision = (decision: "Approve" | "Reject") => {
    if (decision === "Approve") {
      toast.success("Identity Verified successfully! User can now rent cars.", { containerId: "toast-review" });
    } else {
      toast.error("Identity Rejected. User will be notified to re-upload.", { containerId: "toast-review" });
    }
    
    // Mockup redirect
    setTimeout(() => {
      router.push("/admin/customers");
    }, 2000);
  };

  return (
    <div className="bg-slate-950/20 min-h-screen text-slate-100">
      <ToastContainer containerId={"toast-review"} theme="dark" />
      
      <div className="flex justify-between items-center mb-6">
         <div>
             <Link href="/admin/customers" className="text-amber-500 hover:text-amber-400 text-sm font-bold flex items-center mb-2">
                 &larr; Back to Customers
             </Link>
             <h1 className="text-3xl font-extrabold text-white tracking-tight">Review KYC Documents</h1>
             <p className="text-slate-400 mt-1">Reviewing identity for: <span className="font-bold text-slate-200">Andi Wijaya (C-002)</span></p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Document Viewer Column */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
             <h3 className="font-bold text-slate-200 mb-4 border-b border-slate-700 pb-2">Identity Card (KTP)</h3>
             <div className="w-full bg-slate-800 rounded-xl flex items-center justify-center p-2">
                <img 
                   src="https://images.unsplash.com/photo-1633265486064-086b219458ce?q=80&w=800&auto=format&fit=crop" 
                   alt="Mock KTP" 
                   className="rounded-lg max-h-64 object-cover w-full opacity-90"
                />
             </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
             <h3 className="font-bold text-slate-200 mb-4 border-b border-slate-700 pb-2">Driving License (SIM A)</h3>
             <div className="w-full bg-slate-800 rounded-xl flex items-center justify-center p-2">
                <img 
                   src="https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?q=80&w=800&auto=format&fit=crop" 
                   alt="Mock SIM" 
                   className="rounded-lg max-h-64 object-cover w-full opacity-90"
                />
             </div>
          </div>
        </div>

        {/* Verification Actions Column */}
        <div>
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl sticky top-8 border border-slate-700">
             <h2 className="text-xl font-bold mb-6 text-amber-500">Verification Action</h2>
             
             <div className="space-y-4 mb-8">
                 <div className="flex justify-between border-b border-slate-800 pb-2">
                     <span className="text-slate-400">Match Name</span>
                     <span className="text-emerald-400 font-bold">100% Match</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-800 pb-2">
                     <span className="text-slate-400">Driver License Type</span>
                     <span className="text-emerald-400 font-bold">SIM A (Car)</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-800 pb-2">
                     <span className="text-slate-400">Expiry Date</span>
                     <span className="text-emerald-400 font-bold">Valid (2028)</span>
                 </div>
             </div>

             <p className="text-sm text-slate-400 mb-6">By approving this, the user will be granted a "Verified User" badge and will be permitted to rent premium cars.</p>

             <div className="flex gap-4">
                 <button 
                    onClick={() => handleDecision("Reject")}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30 font-bold py-3 px-4 rounded-xl transition-colors"
                 >
                    Reject KYC
                 </button>
                 <button 
                    onClick={() => handleDecision("Approve")}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-amber-500/20"
                 >
                    Approve KYC
                 </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
