import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomerProfile() {
  // Simulating KYC status for the current logged in user.
  const isKycVerified = false; // Set to false to show the warning

  return (
    <div className="max-w-4xl mx-auto py-8">
      <ToastContainer theme="dark" />
      
      {/* E-KYC Warning Box */}
      {!isKycVerified && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
           <div>
              <h3 className="text-amber-800 font-extrabold text-lg flex items-center gap-2">
                 <span className="text-2xl">⚠️</span> Action Required: Identity Verification
              </h3>
              <p className="text-amber-700/80 mt-1 text-sm font-medium">
                 Please complete your E-KYC verification to unlock the ability to rent premium cars seamlessly. Upload your KTP and Driver's License now.
              </p>
           </div>
           <Link 
              href="/register/kyc"
              className="whitespace-nowrap bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold py-3 px-6 rounded-xl transition-colors shadow-md"
           >
              Verify My Account
           </Link>
        </div>
      )}

      {/* Profile Form (Mockup) */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-6 mb-10 border-b border-slate-100 pb-8">
          <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-4xl font-extrabold text-amber-500 shadow-lg">
            US
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">User Customer</h2>
            <div className="flex items-center gap-3 mt-2">
               <span className="text-slate-500 font-medium">Standard Member</span>
               {isKycVerified ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">✔ Verified</span>
               ) : (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100">✖ Unverified</span>
               )}
            </div>
          </div>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" defaultValue="User Customer" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
              <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500" defaultValue="0812XXXXXXXX" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
            <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px]" defaultValue="Jl. Sudirman, Jakarta" />
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button type="button" className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-md">
              Update Profile Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
