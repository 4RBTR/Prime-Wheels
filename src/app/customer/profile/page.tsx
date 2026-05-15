"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomerProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
          setName(data.user.name);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!");
        setUser(data.user);
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      toast.error("An error occurred during update");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
      </div>
    );
  }

  const isKycVerified = user?.ktp_url && user?.selfie_url;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* E-KYC Warning Box */}
      {!isKycVerified && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
          <div>
            <h3 className="text-amber-800 font-extrabold text-lg flex items-center gap-2">
              <span className="text-2xl">⚠️</span> Action Required: Identity Verification
            </h3>
            <p className="text-amber-700/80 mt-1 text-sm font-medium">
              Please complete your E-KYC verification. Standard identity validation secures luxury vehicle rentals.
            </p>
          </div>
          <button
            onClick={() => toast.info("Manual KYC triggers automatically when renting cars via Checkout!")}
            className="whitespace-nowrap bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold py-3 px-6 rounded-xl transition-colors shadow-md text-sm"
          >
            Verify Now
          </button>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-slate-900 z-0"></div>

        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-10 pb-8 border-b border-slate-100 relative z-10 mt-8">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-4xl font-extrabold text-amber-500 shadow-xl overflow-hidden">
              {user?.profile_photo_url ? (
                <img src={user.profile_photo_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-[10px] font-bold rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
              Change
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && setProfilePhoto(e.target.files[0])}
              />
            </label>
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{user?.name}</h2>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
              <span className="text-slate-500 font-bold text-sm">{user?.email}</span>
              {isKycVerified ? (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  ✔ Verified ID
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  ⚠️ Unverified
                </span>
              )}
            </div>
            {profilePhoto && (
              <span className="text-xs text-blue-600 font-bold mt-2 block">Selected new photo: {profilePhoto.name}</span>
            )}
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium transition-all"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Account Role
              </label>
              <input
                type="text"
                disabled
                value={user?.role || "USER"}
                className="w-full p-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">
              Joined Since:{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </span>
            <button
              type="submit"
              disabled={updating}
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600 text-white font-bold rounded-xl transition-colors shadow-md flex items-center gap-2"
            >
              {updating && <Loader2 className="w-4 h-4 animate-spin" />}
              {updating ? "Saving..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
