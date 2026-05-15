"use client";
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2, Camera, User } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [joinedAt, setJoinedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok && data.user) {
          setName(data.user.name);
          setEmail(data.user.email);
          setProfilePhotoUrl(data.user.profile_photo_url || "");
          const date = new Date(data.user.created_at);
          setJoinedAt(date.getFullYear().toString());
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhotoFile(file);
      setProfilePhotoUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (profilePhotoFile) {
        formData.append("profilePhoto", profilePhotoFile);
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui profil");
      }

      toast.success("Profil berhasil diperbarui!");
      if (data.user.profile_photo_url) {
        setProfilePhotoUrl(data.user.profile_photo_url);
        setProfilePhotoFile(null);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Pengaturan Profil</h1>
        
        <form onSubmit={handleUpdate} className="space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-slate-100">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-extrabold text-slate-400 overflow-hidden border-4 border-white shadow-lg relative">
                {profilePhotoUrl ? (
                  <Image src={profilePhotoUrl} alt="Profile" fill className="object-cover" />
                ) : (
                  <User className="w-10 h-10" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-slate-900">{name}</h2>
              <p className="text-slate-500 font-medium">Administrator &bull; Bergabung {joinedAt}</p>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-sm text-blue-600 font-bold hover:underline"
              >
                Ganti Foto Profil
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
            <input
              type="text"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-900"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Alamat Email (Tidak bisa diubah)</label>
            <input
              type="email"
              className="w-full p-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
              value={email}
              disabled
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-70 flex items-center justify-center"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
