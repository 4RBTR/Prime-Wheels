/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { UploadCloud, ShieldCheck, CheckCircle2, Calendar, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';

interface CarType {
  id: string | number;
  name: string;
  brand?: string;
  price_per_day: number;
  image_url?: string;
  type?: string;
}

function CheckoutContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const carIdParam = searchParams.get('carId');
  const [car, setCar] = useState<CarType | null>(null);
  const [kycStatus, setKycStatus] = useState<string>("Loading");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dpProof, setDpProof] = useState<File | null>(null);
  
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [days, setDays] = useState(1);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserAndCar = async () => {
      if (session?.user?.id) {
        const { data } = await supabase
          .from("users")
          .select("kyc_status")
          .eq("id", session.user.id)
          .single();
        if (data) {
          setKycStatus(data.kyc_status);
        } else {
          setKycStatus("Pending");
        }
      }

      if (carIdParam) {
        try {
          const { data, error } = await supabase
            .from('cars')
            .select('*')
            .eq('id', carIdParam)
            .single();
            
          if (data && !error) {
            setCar(data as CarType);
          }
        } catch (err) {
          console.error("Error fetching car detail:", err);
        }
      }
    };
    if (status === "authenticated") fetchUserAndCar();
  }, [carIdParam, session, status]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays > 0 ? diffDays : 1);
    }
  }, [startDate, endDate]);

  const carPricePerDay = car?.price_per_day || 0;
  const rentTotal = carPricePerDay * days;
  const tax = rentTotal * 0.11;
  const escrow = 100000;
  const grandTotal = rentTotal + tax + escrow;
  const dpAmount = Math.floor(grandTotal * 0.3);

  const handlePayment = async () => {
    try {
      if (!car) throw new Error("Mobil tidak valid.");
      if (kycStatus !== 'Approved') throw new Error("Akun Anda belum diverifikasi oleh admin. Harap tunggu persetujuan e-KYC Anda.");
      if (!startDate || !endDate) throw new Error("Pilih tanggal pengambilan dan pengembalian.");
      if (!dpProof) throw new Error("Mohon unggah bukti pembayaran DP terlebih dahulu.");

      setIsLoading(true);
      setErrorMessage("");

      const formData = new FormData();
      formData.append("carId", car.id.toString());
      formData.append("startDate", new Date(startDate).toISOString());
      formData.append("endDate", new Date(endDate).toISOString());
      formData.append("dpProof", dpProof);

      const res = await fetch("/api/checkout", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal memproses pemesanan.");
      }

      Swal.fire({
        title: 'Berhasil!',
        text: 'Pemesanan berhasil dibuat. Menunggu verifikasi admin untuk pembayaran DP Anda.',
        icon: 'success',
        confirmButtonColor: '#2563eb'
      }).then(() => {
        router.push("/customer/bookings");
      });

    } catch (error: any) {
       setErrorMessage(error.message || "Terjadi kesalahan");
       window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  if (status === "loading" || kycStatus === "Loading") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600 mb-2" />
        <p className="text-slate-500 font-medium">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/customer/dashboard" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        Kembali ke Katalog
      </Link>

      {kycStatus !== 'Approved' && (
        <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-3xl flex items-start gap-4">
          <AlertCircle className="text-amber-600 w-8 h-8 shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-amber-900 mb-1">Menunggu Verifikasi e-KYC</h3>
            <p className="text-amber-700 font-medium">
              Akun Anda sedang dalam proses peninjauan oleh admin. Anda baru bisa melakukan penyewaan kendaraan setelah e-KYC disetujui.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Booking Period */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-1">Periode Sewa</h2>
            <p className="text-slate-500 text-sm font-medium mb-6">Tentukan kapan Anda akan menggunakan kendaraan.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar size={14} className="text-slate-400" /> Pengambilan
                </label>
                <input 
                  type="date" 
                  disabled={kycStatus !== 'Approved'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 font-semibold focus:ring-2 focus:ring-blue-600/20 disabled:opacity-50" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar size={14} className="text-slate-400" /> Pengembalian
                </label>
                <input 
                  type="date" 
                  disabled={kycStatus !== 'Approved'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 font-semibold focus:ring-2 focus:ring-blue-600/20 disabled:opacity-50"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)} 
                />
              </div>
            </div>
          </div>

          {/* Payment Method QRIS */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-1">Pembayaran DP</h2>
            <p className="text-slate-500 text-sm font-medium mb-6">Pembayaran Uang Muka (30%) untuk mengamankan pesanan Anda.</p>
            
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="shrink-0 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://primewheels.com/pay" alt="QRIS" className="w-40 h-40 object-contain" />
              </div>
              <div className="text-center md:text-left space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Scan QRIS Prime Wheels</h3>
                <p className="text-slate-600 text-sm">Gunakan aplikasi M-Banking atau e-Wallet kesayangan Anda untuk membayar.</p>
                <div className="bg-white inline-block px-4 py-2 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg font-black text-lg">
                  Nominal DP: {formatIDR(dpAmount)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Unggah Bukti Transfer DP</label>
              <label className={`cursor-pointer border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all group ${dpProof ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-blue-500 hover:bg-white'} ${kycStatus !== 'Approved' ? 'opacity-50 pointer-events-none' : ''}`}>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png" 
                  className="hidden"
                  disabled={kycStatus !== 'Approved'}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setDpProof(e.target.files[0]);
                    }
                  }}
                />
                {dpProof ? (
                  <>
                    <CheckCircle2 size={32} className="text-emerald-500 mb-3" />
                    <span className="text-slate-900 text-sm font-black">Bukti DP Diunggah</span>
                    <span className="text-slate-500 text-xs mt-1 truncate max-w-[200px]">{dpProof.name}</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={32} className="text-slate-400 mb-3 group-hover:text-blue-600 transition-colors" />
                    <span className="text-slate-900 text-sm font-bold">Pilih File Bukti Transfer</span>
                    <span className="text-slate-400 text-xs mt-1">JPG/PNG maks 5MB</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm sticky top-24">
            {car ? (
              <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 mb-6 group">
                <div className="h-48 w-full relative">
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent z-10"></div>
                  {car.image_url ? (
                    <img src={car.image_url} alt={car.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-200">🚘</div>
                  )}
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="text-[10px] font-black tracking-widest text-white/80 uppercase">{car.brand}</span>
                    <h3 className="text-xl font-black text-white">{car.name}</h3>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 bg-slate-100 rounded-2xl animate-pulse mb-6"></div>
            )}

            <h3 className="text-lg font-black text-slate-900 mb-4">Ringkasan Biaya</h3>
            
            <div className="space-y-3 mb-6 border-b border-slate-100 pb-6">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-500">Tarif ({days} Hari)</span>
                <span className="font-bold text-slate-900">{formatIDR(rentTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-slate-500">Pajak (11%)</span>
                <span className="font-bold text-slate-900">{formatIDR(tax)}</span>
              </div>
              <div className="flex justify-between text-sm text-amber-600">
                <span className="font-bold">Dana Titipan (Refundable)</span>
                <span className="font-bold">{formatIDR(escrow)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Keseluruhan</span>
              <span className="text-2xl font-black text-slate-900">{formatIDR(grandTotal)}</span>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
              <div className="flex justify-between items-center text-blue-900">
                <span className="font-bold text-sm">DP Harus Dibayar (30%)</span>
                <span className="text-xl font-black">{formatIDR(dpAmount)}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold mb-6 flex gap-2">
                <AlertCircle size={18} className="shrink-0" />
                {errorMessage}
              </div>
            )}

            <button 
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={handlePayment} 
              disabled={isLoading || !car || kycStatus !== 'Approved'}
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
              {isLoading ? "Memproses..." : "Konfirmasi & Kirim DP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
