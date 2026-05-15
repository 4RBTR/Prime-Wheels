"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function KycUploadPage() {
  const router = useRouter();
  const [ktp, setKtp] = useState<File | null>(null);
  const [sim, setSim] = useState<File | null>(null);
  const [ktpPreview, setKtpPreview] = useState<string | null>(null);
  const [simPreview, setSimPreview] = useState<string | null>(null);
  
  const [hoveringKtp, setHoveringKtp] = useState(false);
  const [hoveringSim, setHoveringSim] = useState(false);

  // Generate preview URLs when files change
  useEffect(() => {
    if (ktp) {
      const url = URL.createObjectURL(ktp);
      setKtpPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setKtpPreview(null);
    }
  }, [ktp]);

  useEffect(() => {
    if (sim) {
      const url = URL.createObjectURL(sim);
      setSimPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setSimPreview(null);
    }
  }, [sim]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ktp || !sim) {
      toast.error("Please upload both documents if you wish to verify now.", { containerId: "toast-kyc" });
      return;
    }
    toast.success("Documents uploaded! Going to login...", { containerId: "toast-kyc" });
    setTimeout(() => router.push("/login"), 1500);
  };

  const handleSkip = () => {
    toast.info("Validation postponed. You must do this before renting a car.", { containerId: "toast-kyc" });
    setTimeout(() => router.push("/login"), 1500);
  };

  const renderUploadZone = (
    title: string, 
    file: File | null, 
    preview: string | null, 
    setFile: (f: File | null) => void,
    isHovering: boolean,
    setIsHovering: (h: boolean) => void,
    icon: string
  ) => {
    return (
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 w-full mb-6 relative">
        <h3 className="font-bold text-lg mb-4 text-white flex items-center justify-between">
          {title}
          {file && (
            <button 
              type="button"
              onClick={() => setFile(null)}
              className="text-xs bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 px-3 py-1 rounded-full border border-rose-500/30 transition-colors"
            >
              Remove
            </button>
          )}
        </h3>
        
        {preview ? (
           <div className="w-full flex-col flex items-center justify-center p-4 border border-slate-600 rounded-xl bg-slate-900/50">
             <p className="text-emerald-400 text-sm font-bold mb-3">✅ Document Uploaded</p>
             <p className="text-slate-400 text-sm mb-4">Please review if this photo is correct and not blurry.</p>
             <img src={preview} alt="Preview" className="max-h-64 object-contain rounded-lg border border-slate-700 shadow-lg" />
             <p className="text-slate-500 text-xs mt-3 truncate w-full text-center px-4">{file?.name}</p>
           </div>
        ) : (
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
            onDragLeave={() => setIsHovering(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsHovering(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                setFile(e.dataTransfer.files[0]);
              }
            }}
            className={`w-full flex-col flex items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-300 bg-slate-900/50
              ${isHovering ? 'border-amber-500 bg-amber-500/10' : 'border-slate-600 hover:border-slate-500'}
            `}
          >
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
              <span className="text-2xl">{icon}</span>
            </div>
            <p className="text-slate-300 text-center mb-1 font-medium">Drag and drop your document here</p>
            <p className="text-slate-500 text-sm text-center mb-4">JPEG, PNG or PDF (max. 5MB)</p>
            
            <div className="flex items-center gap-3 w-full max-w-xs">
              <div className="h-[1px] bg-slate-700 flex-1"></div>
              <span className="text-slate-500 text-xs uppercase font-bold tracking-widest">OR</span>
              <div className="h-[1px] bg-slate-700 flex-1"></div>
            </div>

            <div className="mt-4 relative overflow-hidden group">
              <button type="button" className="bg-slate-800 border border-slate-600 group-hover:border-amber-500 group-hover:text-amber-500 text-slate-300 px-6 py-2 rounded-lg font-medium transition-all">
                Browse Files
              </button>
              <input 
                type="file" 
                accept="image/jpeg, image/png, application/pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
                  e.target.value = ''; // reset so same file can be selected again
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-dvh flex bg-slate-900 justify-center items-center py-12 px-4 font-sans text-slate-100">
      <ToastContainer containerId={"toast-kyc"} theme="dark" />
      <div className="bg-slate-800 border border-slate-700 shadow-2xl rounded-3xl w-full max-w-2xl p-8 lg:p-12 relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-amber-500 opacity-5 blur-3xl"></div>

        <div className="text-center mb-10 relative z-10">
          <h1 className="font-extrabold text-3xl md:text-4xl tracking-tight text-white mb-3">
            Identity <span className="text-amber-500">Verification</span>
          </h1>
          <p className="text-slate-400">Secure your platform access by providing E-KYC documents. You can skip this and upload later.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
             {renderUploadZone(
               "1. Identity Card (KTP)", 
               ktp, 
               ktpPreview, 
               setKtp, 
               hoveringKtp, 
               setHoveringKtp, 
               "📸"
             )}
             
             {renderUploadZone(
               "2. Driver's License", 
               sim, 
               simPreview, 
               setSim, 
               hoveringSim, 
               setHoveringSim, 
               "🚗"
             )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-700/50 mt-2">
             <button
              type="button"
              onClick={handleSkip}
              className="flex-1 p-4 rounded-xl text-center text-slate-300 font-bold bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              className={`flex-1 p-4 rounded-xl text-center font-extrabold transition-all shadow-lg ${
                ktp && sim 
                ? "bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-amber-500/20" 
                : "bg-slate-700 text-slate-500 cursor-not-allowed shadow-none"
              }`}
              disabled={!ktp || !sim}
            >
              Submit KYC
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
