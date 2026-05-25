/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { Loader2, ArrowLeft, Upload, Car } from "lucide-react";
import { compressImage } from "@/lib/image-compression";

export default function RegistrationForm() {
  const router = useRouter();
  const params = useParams();
  const roleParam = params?.role as string;
  const role = roleParam?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "Surabaya",
  });
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "ktp" | "selfie") => {
    if (e.target.files && e.target.files[0]) {
      if (type === "ktp") setKtpFile(e.target.files[0]);
      if (type === "selfie") setSelfieFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("role", role);
      submitData.append("city", formData.city);

      if (ktpFile) {
        const compressedKtp = await compressImage(ktpFile);
        submitData.append("ktp", compressedKtp);
      }
      if (selfieFile) {
        const compressedSelfie = await compressImage(selfieFile);
        submitData.append("selfie", compressedSelfie);
      }

      const res = await fetch("/api/register", {
        method: "POST",
        body: submitData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Pendaftaran gagal");
      }

      Swal.fire({
        title: "Sukses!",
        text: "Pendaftaran berhasil! Silakan masuk.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      }).then(() => {
        router.push("/login");
      });
    } catch (err: any) {
      Swal.fire({
        title: "Gagal",
        text: err.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-white">
      {/* Left Side - Image Background */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900">
        <Image
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Car"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-12 text-white">
          <div className="w-16 h-1 bg-blue-600 mb-6 rounded-full"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Langkah pertama menuju kemudahan mobilitas.
          </h1>
          <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
            Daftar sekarang dan nikmati ekosistem penyewaan mobil yang mengutamakan keamanan dan kenyamanan.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative p-8 md:p-12 lg:h-screen lg:overflow-y-auto bg-white text-slate-900">
        
        {/* Back Link */}
        <Link href="/register" className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Link>

        <div className="w-full max-w-md mt-16 lg:mt-8 pb-8">
          
          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">Prime Wheels</span>
            </div>
            
            <div className="w-full text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                Daftar {role === "ADMIN" ? "Pemilik Rental" : "Penyewa"}
              </h2>
              <p className="text-slate-500 font-medium">
                Lengkapi data diri Anda di bawah ini.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2 uppercase">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                className="w-full p-3.5 bg-slate-100 text-slate-900 rounded-xl border-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-medium"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2 uppercase">
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full p-3.5 bg-slate-100 text-slate-900 rounded-xl border-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-medium"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2 uppercase">
                Kata Sandi
              </label>
              <input
                type="password"
                name="password"
                minLength={6}
                className="w-full p-3.5 bg-slate-100 text-slate-900 rounded-xl border-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-medium font-sans"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2 uppercase">
                Pilih Kota/Wilayah
              </label>
              <select
                name="city"
                className="w-full p-3.5 bg-slate-100 text-slate-900 rounded-xl border-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-medium appearance-none"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              >
                <option value="Surabaya">Surabaya</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Bandung">Bandung</option>
                <option value="Semarang">Semarang</option>
                <option value="Yogyakarta">Yogyakarta</option>
                <option value="Bali">Bali</option>
                <option value="Medan">Medan</option>
                <option value="Malang">Malang</option>
                <option value="Makassar">Makassar</option>
                <option value="Samarinda">Samarinda</option>
                <option value="Solo">Solo</option>
                <option value="Pontianak">Pontianak</option>
                <option value="Palembang">Palembang</option>
                <option value="Lampung">Lampung</option>
                <option value="Banten">Banten</option>
                <option value="Kalimantan Utara">Kalimantan Utara</option>
                <option value="Kalimantan Tengah">Kalimantan Tengah</option>
                <option value="Kalimantan Barat">Kalimantan Barat</option>
                <option value="Kalimantan Selatan">Kalimantan Selatan</option>
                <option value="Kalimantan Timur">Kalimantan Timur</option>
                <option value="Bangka Belitung">Bangka Belitung</option>
                <option value="Bengkulu">Bengkulu</option>
                <option value="Jambi">Jambi</option>
                <option value="Kepulauan Riau">Kepulauan Riau</option>
                <option value="Lampung">Lampung</option>
                <option value="Riau">Riau</option>
                <option value="Sumatera Barat">Sumatera Barat</option>
                <option value="Sumatera Selatan">Sumatera Selatan</option>
                <option value="Sumatera Utara">Sumatera Utara</option>
                <option value="Aceh">Aceh</option>
                <option value="Sulawesi Tenggara">Sulawesi Tenggara</option>
                <option value="Sulawesi Selatan">Sulawesi Selatan</option>
                <option value="Sulawesi Utara">Sulawesi Utara</option>
                <option value="Sulawesi Barat">Sulawesi Barat</option>
                <option value="Sulawesi Tengah">Sulawesi Tengah</option>
                <option value="Gorontalo">Gorontalo</option>
                <option value="Papua">Papua</option>
                <option value="Papua Barat">Papua Barat</option>
                <option value="Papua Selatan">Papua Selatan</option>
                <option value="Papua Tengah">Papua Tengah</option>
                <option value="Papua Pegunungan">Papua Pegunungan</option>
                <option value="Nusa Tenggara Barat">Nusa Tenggara Barat</option>
                <option value="Nusa Tenggara Timur">Nusa Tenggara Timur</option>
                <option value="Nusa Tenggara Barat">Nusa Tenggara Barat</option>
                <option value="Nusa Tenggara Timur">Nusa Tenggara Timur</option>
                
              </select>
            </div>

            {/* e-KYC exclusively for Users */}
            {role === "USER" && (
              <>
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2 uppercase">Unggah Foto KTP (e-KYC)</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "ktp")}
                      className="hidden"
                      id="ktp-upload"
                      required
                    />
                    <label
                      htmlFor="ktp-upload"
                      className={`flex items-center justify-center w-full p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${ktpFile ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-slate-200 hover:border-blue-400 bg-slate-50 text-slate-500 font-medium'}`}
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {ktpFile ? ktpFile.name : "Pilih File KTP"}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2 uppercase">Unggah Selfie + KTP</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "selfie")}
                      className="hidden"
                      id="selfie-upload"
                      required
                    />
                    <label
                      htmlFor="selfie-upload"
                      className={`flex items-center justify-center w-full p-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${selfieFile ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-slate-200 hover:border-blue-400 bg-slate-50 text-slate-500 font-medium'}`}
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {selfieFile ? selfieFile.name : "Pilih File Selfie"}
                    </label>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 px-6 rounded-xl flex items-center justify-center text-white font-bold text-sm tracking-widest bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {loading ? "MEMPROSES..." : "DAFTAR SEKARANG"}
            </button>
          </form>

          <div className="flex justify-center mt-8 text-sm font-medium text-slate-500">
            <span>Sudah punya akun?</span>
            <Link href="/login" className="text-blue-600 hover:underline font-bold ml-2">
              Masuk di sini
            </Link>
          </div>
          
          {/* Footer */}
          <div className="mt-12 text-center text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            Dilindungi oleh enkripsi aman.<br />
            Syarat & Ketentuan • Privasi
          </div>
        </div>
      </div>
    </div>
  );
}
