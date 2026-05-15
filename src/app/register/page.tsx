"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Shield, ArrowLeft, Car } from "lucide-react";

export default function RegisterRoleSelection() {
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
            Mulai Perjalanan Anda Bersama Kami.
          </h1>
          <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
            Bergabung sebagai penyewa untuk pengalaman berkendara premium, atau sebagai pemilik rental untuk mengembangkan bisnis Anda.
          </p>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative p-8 md:p-16 bg-white text-slate-900">
        
        {/* Back Link */}
        <Link href="/" className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>

        <div className="w-full max-w-lg mt-12 lg:mt-0">
          
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
                Pilih Jenis Akun
              </h2>
              <p className="text-slate-500 font-medium">
                Pilih peran Anda untuk melanjutkan proses pendaftaran.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {/* User Card */}
            <Link href="/register/user" className="group block h-full">
              <div className="bg-slate-50 border-2 border-transparent hover:border-blue-600 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 h-full group-hover:shadow-lg group-hover:shadow-blue-600/10 group-hover:bg-white">
                <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 rounded-full flex items-center justify-center mb-4 transition-colors">
                  <User className="w-8 h-8 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Penyewa</h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Cari, pesan, dan sewa kendaraan berkualitas untuk perjalanan Anda.
                </p>
              </div>
            </Link>

            {/* Admin Card */}
            <Link href="/register/admin" className="group block h-full">
              <div className="bg-slate-50 border-2 border-transparent hover:border-blue-600 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 h-full group-hover:shadow-lg group-hover:shadow-blue-600/10 group-hover:bg-white">
                <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 rounded-full flex items-center justify-center mb-4 transition-colors">
                  <Shield className="w-8 h-8 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Pemilik Rental</h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Kelola armada kendaraan dan pantau penyewaan bisnis Anda.
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-10 text-center text-sm font-medium text-slate-500">
            Sudah punya akun? <Link href="/login" className="text-blue-600 hover:underline font-bold">Masuk di sini</Link>
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
