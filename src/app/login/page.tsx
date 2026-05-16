/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { Loader2, ArrowLeft, Eye, EyeOff, Car } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();

      if (sessionData?.user?.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/customer"); 
      }
      
    } catch (err: any) {
      Swal.fire({
        title: "Login Gagal",
        text: err.message || "Email atau password salah",
        icon: "error",
      });
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
            Kemudahan sewa mobil premium dalam genggaman Anda.
          </h1>
          <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
            Pesan kendaraan impian Anda, pantau riwayat penyewaan, dan nikmati layanan pelanggan yang responsif, transparan, dan modern.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative p-8 md:p-16 bg-white text-slate-900">
        
        {/* Back Link */}
        <Link href="/" className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>

        <div className="w-full max-w-md mt-12 lg:mt-0">
          
          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <Car className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Prime Wheels</span>
            </div>
            
            <div className="w-full text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center justify-center lg:justify-start">
                Selamat Datang! 👋
              </h2>
              <p className="text-slate-500 font-medium">
                Silakan masuk ke akun Anda atau <Link href="/register" className="text-blue-600 hover:underline">daftar baru</Link>.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2 uppercase">
                Alamat Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full p-4 bg-slate-100 text-slate-900 rounded-xl border-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-medium"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2 uppercase">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full p-4 pr-12 bg-slate-100 text-slate-900 rounded-xl border-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none font-medium font-sans"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer" />
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Ingat saya</span>
              </label>
              <Link href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">
                Lupa kata sandi?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 px-6 rounded-xl flex items-center justify-center text-white font-bold text-sm tracking-widest bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {loading ? "MEMPROSES..." : "MASUK SEKARANG"}
            </button>
          </form>

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
