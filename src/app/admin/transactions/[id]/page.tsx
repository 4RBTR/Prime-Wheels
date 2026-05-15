"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, use } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VerificationRoom({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  
  const isPending = unwrappedParams.id === "TRX-90024";
  const isHeld = unwrappedParams.id === "TRX-90022";
  
  const [status, setStatus] = useState(
      isPending ? "Pending Review" : isHeld ? "Held" : "Verified"
  );
  
  const [deduction, setDeduction] = useState(0);

  const handleApprovePayment = () => {
    toast.success("Payment Verified! Transfer matched.", { containerId: "toast-finance" });
    setStatus("Verified");
  };

  const handleRejectPayment = () => {
    toast.error("Payment Rejected. Notification sent to client.", { containerId: "toast-finance" });
    setStatus("Rejected");
  };

  const handleRefundDeposit = () => {
     if(deduction > 0) {
        toast.info(`Deposit refunded with Rp ${deduction.toLocaleString('id-ID')} deduction for penalties.`, { containerId: "toast-finance" });
     } else {
        toast.success("Full Deposit Refunded to Client's Bank Account.", { containerId: "toast-finance" });
     }
     setStatus("Refunded");
  };

  return (
    <div className="py-4 min-h-screen">
      <ToastContainer containerId={"toast-finance"} theme="light" />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-6">
         <div>
             <Link href="/admin/transactions" className="text-slate-500 hover:text-slate-900 text-sm font-bold flex items-center mb-2 transition-colors">
                 &larr; Back to Ledger
             </Link>
             <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4">
                Transaction {unwrappedParams.id}
             </h2>
         </div>
         <div>
             <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm border
                 ${status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                 ${status === 'Pending Review' ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse' : ''}
                 ${status === 'Held' ? 'bg-sky-50 text-sky-700 border-sky-200' : ''}
                 ${status === 'Refunded' ? 'bg-slate-100 text-slate-600 border-slate-200' : ''}
                 ${status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : ''}
             `}>
                 {status}
             </span>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Left Col: Receipt Proof */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
           <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex justify-between items-center">
              <span>Proof of Transfer</span>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">Uploaded 16 Apr, 09:12</span>
           </h3>
           
           <div className="bg-slate-50 flex-1 rounded-2xl border border-slate-200 p-4 flex items-center justify-center relative overflow-hidden group">
              {isPending ? (
                  <img 
                      src="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=800&auto=format&fit=crop" 
                      alt="Bank Transfer Receipt" 
                      className="max-h-96 object-contain rounded-lg shadow-sm mix-blend-multiply"
                  />
              ) : (
                  <div className="flex flex-col items-center text-slate-400">
                     <span className="text-4xl mb-3">🧾</span>
                     <p className="font-bold">System Processed / No Attachment</p>
                  </div>
              )}
           </div>
        </div>

        {/* Right Col: Action & Details */}
        <div className="space-y-6">
           {/* Invoice Info */}
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full blur-3xl -z-10"></div>
               
               <h3 className="text-slate-500 font-bold mb-6 text-sm uppercase tracking-wider">Transaction Details</h3>
               
               <div className="space-y-4 text-slate-900 mb-8">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                     <span className="text-slate-500 font-medium">Booking Ref</span>
                     <span className="font-bold border px-2 py-0.5 rounded border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">B-2102 ↗</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                     <span className="text-slate-500 font-medium">Customer</span>
                     <span className="font-bold">Citra Kirana</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                     <span className="text-slate-500 font-medium">Type</span>
                     <span className="font-bold">{isHeld ? 'Security Deposit' : 'Down Payment'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                     <span className="text-slate-500 font-medium">Sender Bank</span>
                     <span className="font-bold">BCA (Citra Kirana)</span>
                  </div>
                  <div className="flex justify-between pt-4">
                     <span className="text-slate-800 font-bold text-lg">Claimed Amount</span>
                     <span className="font-black text-2xl tracking-tighter">Rp {isHeld ? '5.000.000' : '2.500.000'}</span>
                  </div>
               </div>
           </div>

           {/* Execution Center */}
           <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
               <h3 className="text-amber-500 font-bold text-lg mb-6">Financial Execution</h3>

               {status === "Pending Review" && (
                  <div className="space-y-4 mt-8">
                     <p className="text-slate-400 mb-4 text-sm font-medium">Cross-check the uploaded receipt with the company's bank mutation before approving.</p>
                     <button onClick={handleApprovePayment} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-4 rounded-xl transition-all shadow-md">
                         Verify & Accept Transfer
                     </button>
                     <button onClick={handleRejectPayment} className="w-full bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 font-bold py-4 rounded-xl transition-all border border-slate-700 hover:border-rose-900">
                         Reject (Invalid Proof)
                     </button>
                  </div>
               )}

               {status === "Held" && (
                  <div className="space-y-4">
                     <p className="text-slate-400 text-sm font-medium mb-2">This security deposit is held. Process the refund when the car is returned safely.</p>
                     
                     <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
                        <label className="block text-slate-300 text-xs font-bold mb-2">Apply Damage Penalty (Rp)</label>
                        <div className="flex shadow-sm rounded-lg overflow-hidden">
                            <span className="bg-slate-700 px-4 py-3 text-slate-400 font-bold">Rp</span>
                            <input 
                               type="number" 
                               value={deduction || ""}
                               onChange={(e) => setDeduction(Number(e.target.value))}
                               placeholder="0"
                               className="w-full bg-slate-950 text-white px-4 border-none focus:ring-0 outline-none font-bold"
                            />
                        </div>
                        {deduction > 0 && (
                            <p className="text-xs font-bold text-rose-400 mt-2">Will refund only: Rp {(5000000 - deduction).toLocaleString('id-ID')}</p>
                        )}
                     </div>

                     <button onClick={handleRefundDeposit} className="w-full bg-sky-500 hover:bg-sky-400 text-white font-extrabold py-4 rounded-xl transition-all shadow-md">
                         Release Deposit to Client
                     </button>
                  </div>
               )}

               {(status === "Verified" || status === "Refunded" || status === "Rejected") && (
                  <div className="text-center py-6 bg-slate-800/50 rounded-2xl border border-slate-800">
                     <span className="text-3xl block mb-3">🔒</span>
                     <p className="text-emerald-400 font-bold text-lg">Transaction Closed</p>
                     <p className="text-slate-400 text-sm mt-1">This record is permanently recorded in the ledger.</p>
                  </div>
               )}
           </div>
        </div>

      </div>
    </div>
  );
}
