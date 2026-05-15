import { CustomerType } from "./page";

type Props = {
  customer: CustomerType;
  kycStatus: "Verified" | "Pending" | "None";
};

export default function CustomerCard({ customer, kycStatus }: Props) {
  
  const getKycBadge = () => {
    switch (kycStatus) {
      case "Verified":
        return <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Verified User</span>;
      case "Pending":
        return <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200 animate-pulse">Review KYC</span>;
      case "None":
        return <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">No KYC Data</span>;
    }
  }

  return (
    <div className={`w-full border rounded-xl bg-white hover:shadow-md transition-shadow ${kycStatus === 'Pending' ? 'border-amber-200 ring-2 ring-amber-50' : 'border-slate-200'}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 px-6 py-4 items-center gap-4">
        
        <div className="col-span-1 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-50 text-amber-500 flex items-center justify-center font-bold text-sm shrink-0">
            {customer.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900 truncate">{customer.name}</div>
            <div className="text-xs text-slate-400 truncate">{customer.email}</div>
          </div>
        </div>

        <div className="col-span-1 text-slate-500 text-sm flex items-center">
          <span className="truncate">Bergabung {new Date(customer.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
        
        <div className="col-span-1 flex items-center">
            {getKycBadge()}
        </div>

        <div className="col-span-1 flex justify-end gap-2">
          {kycStatus === "Verified" && customer.ktp_url && (
            <a href={customer.ktp_url} target="_blank" rel="noopener noreferrer" className="bg-slate-50 hover:bg-slate-200 text-slate-600 rounded-lg px-4 py-2 text-xs font-bold transition-colors">
              Lihat KTP
            </a>
          )}
          {kycStatus === "Pending" && (
             <span className="bg-amber-500 text-slate-900 rounded-lg px-4 py-2 text-xs font-bold">
               Review
             </span>
          )}
          {kycStatus === "None" && (
            <span className="bg-slate-50 text-slate-400 rounded-lg px-4 py-2 text-xs font-bold">
              No Data
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
