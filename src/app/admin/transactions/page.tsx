"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function TransactionsLedger() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        if (res.ok) setTransactions(data.transactions || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => 
    filter === "All" || (filter === "Deposits" && t.type.includes("Deposit")) || t.status === filter
  );

  const netRevenue = transactions.filter(t => t.status === "Verified").reduce((sum, t) => sum + t.amount, 0);
  const heldDeposits = transactions.filter(t => t.status === "Held").reduce((sum, t) => sum + t.amount, 0);
  const pendingCount = transactions.filter(t => t.status === "Pending Review").length;

  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000000) return `Rp ${(amount / 1000000).toFixed(0)}M`;
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
    <div className="py-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Finance & Ledger</h1>
          <p className="text-slate-500 mt-2 font-medium">Verify payments, manage security deposits, and track company revenue.</p>
        </div>
        <div className="bg-white p-1 rounded-full border border-slate-200 shadow-sm flex items-center">
            {["All", "Pending Review", "Deposits"].map(f => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === f ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
               >
                 {f}
               </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-sm font-bold text-slate-500 mb-2">Net Revenue</span>
            <span className="text-4xl font-black text-slate-900 tracking-tighter">{formatCurrency(netRevenue)}</span>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-sm font-bold text-slate-500 mb-2">Held Security Deposits</span>
            <span className="text-4xl font-black text-slate-900 tracking-tighter">{formatCurrency(heldDeposits)}</span>
         </div>
         <div className="bg-amber-500 p-6 rounded-2xl border border-amber-600 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-[-20%] top-[-20%] w-32 h-32 bg-amber-400 rounded-full blur-2xl opacity-50"></div>
            <span className="text-sm font-bold text-slate-900 mb-2 relative z-10">Requires Verification</span>
            <div className="flex items-end gap-3 relative z-10">
               <span className="text-4xl font-black text-slate-950 tracking-tighter">{pendingCount}</span>
               <span className="text-slate-800 font-bold mb-1">Transfer{pendingCount !== 1 ? 's' : ''}</span>
            </div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
         <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800">Recent Transactions</h3>
         </div>
         
         {filteredTransactions.length === 0 ? (
           <div className="text-center py-16 text-slate-400">
             Belum ada transaksi yang tercatat.
           </div>
         ) : (
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-white border-b border-slate-100">
                       <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Trx Code</th>
                       <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
                       <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                       <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                       <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {filteredTransactions.map((trx: any) => (
                       <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                             <span className="font-bold text-slate-900 block">{trx.trx_code}</span>
                             <span className="text-xs font-medium text-slate-400">{new Date(trx.created_at).toLocaleDateString("id-ID")}</span>
                          </td>
                          <td className="py-4 px-6">
                             <span className="font-bold text-slate-800 block">{trx.client_name}</span>
                          </td>
                          <td className="py-4 px-6">
                             <span className="font-medium text-slate-600">{trx.type}</span>
                          </td>
                          <td className="py-4 px-6">
                             <span className={`font-black tracking-tight ${trx.amount < 0 ? 'text-rose-500' : 'text-slate-900'}`}>
                                {trx.amount < 0 ? '- ' : ''}Rp {Math.abs(trx.amount).toLocaleString('id-ID')}
                             </span>
                          </td>
                          <td className="py-4 px-6">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block
                                ${trx.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : ''}
                                ${trx.status === 'Pending Review' ? 'bg-amber-100 text-amber-800 animate-pulse' : ''}
                                ${trx.status === 'Held' ? 'bg-sky-50 text-sky-700' : ''}
                                ${trx.status === 'Refunded' ? 'bg-slate-100 text-slate-500' : ''}
                                ${trx.status === 'Deducted' ? 'bg-rose-50 text-rose-700' : ''}
                             `}>
                                {trx.status}
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
  );
}
