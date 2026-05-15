/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { UploadCloud, ShieldCheck, CreditCard, Calendar, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Swal from 'sweetalert2';

interface CarType {
  id: string | number;
  name: string;
  brand?: string;
  price_per_day: number; // <--- Replaced "price" with true schema key
  image_url?: string;
  type?: string;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const carIdParam = searchParams.get('carId');
  const [car, setCar] = useState<CarType | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ktpFileName, setKtpFileName] = useState("");
  const [selfieFileName, setSelfieFileName] = useState("");
  
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [days, setDays] = useState(1);

  useEffect(() => {
    const fetchCar = async () => {
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
    fetchCar();
  }, [carIdParam]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays > 0 ? diffDays : 1);
    }
  }, [startDate, endDate]);

  // Safe numerical computation
  const carPricePerDay = car?.price_per_day || 0;
  const rentTotal = carPricePerDay * days;
  const tax = rentTotal * 0.11;
  const escrow = 100000; // Consistent escrow deposit
  const grandTotal = rentTotal + tax + escrow;

  const handlePayment = async () => {
    try {
      if (!car) {
        throw new Error("Mobil tidak valid. Silakan kembali ke katalog.");
      }
      if (!ktpFileName || !selfieFileName) {
        throw new Error("Mohon unggah dokumen KTP dan Selfie terlebih dahulu untuk verifikasi.");
      }
      if (!startDate || !endDate) {
        throw new Error("Mohon pilih tanggal pengambilan dan pengembalian.");
      }

      setIsLoading(true);
      setErrorMessage("");

      const payload = {
        userId: "00000000-0000-0000-0000-000000000000",
        carId: car.id.toString(),
        price: grandTotal,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        customerDetail: { name: "Client User", email: "client@primewheels.com" }
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mendapatkan token pembayaran");
      }

      if (data.isMock) {
        Swal.fire({
          title: 'Simulasi Pembayaran Berhasil!',
          text: 'Transaksi berhasil di-bypass karena API Midtrans belum aktif. (Sandbox)',
          icon: 'success',
          confirmButtonColor: '#2563eb',
          confirmButtonText: 'Selesai'
        });
        return;
      }

      const snapWindow = window as any;
      if (snapWindow.snap) {
        snapWindow.snap.pay(data.token, {
          onSuccess: function () {
             Swal.fire({ title: 'Berhasil!', text: 'Pembayaran berhasil dikonfirmasi.', icon: 'success', confirmButtonColor: '#2563eb' });
          },
          onPending: function () {
             Swal.fire({ title: 'Menunggu', text: 'Menunggu penyelesaian pembayaran...', icon: 'info', confirmButtonColor: '#2563eb' });
          },
          onError: function () {
             Swal.fire({ title: 'Gagal', text: 'Pembayaran gagal diproses.', icon: 'error', confirmButtonColor: '#ef4444' });
          },
          onClose: function () {
             Swal.fire({
               title: 'Dibatalkan',
               text: 'Anda menutup jendela pembayaran.',
               icon: 'warning',
               toast: true,
               position: 'top-end',
               showConfirmButton: false,
               timer: 3000
             });
          }
        });
      } else {
        throw new Error("Midtrans SDK gagal dimuat");
      }
    } catch (error: any) {
       setErrorMessage(error.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="animate-fade-in">
      <Script 
        src={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.startsWith('SB-') ? "https://app.sandbox.midtrans.com/snap/snap.js" : "https://app.midtrans.com/snap/snap.js"} 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} 
      />

      {/* Checkout Visual Layout Wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Booking Fields Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Booking Core */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Detail Penyewaan</h2>
              <p className="text-slate-500 text-sm font-medium">Lengkapi data periode sewa dan titik penjemputan kendaraan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar size={14} className="text-slate-400" /> Tanggal Pengambilan
                </label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  onClick={(e) => e.currentTarget.showPicker()}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar size={14} className="text-slate-400" /> Tanggal Pengembalian
                </label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 font-semibold outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)} 
                  onClick={(e) => e.currentTarget.showPicker()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Alamat Penjemputan / Tujuan Pengantaran</label>
              <input 
                type="text" 
                placeholder="Contoh: Terminal 3 Bandara Soekarno-Hatta / Alamat Hotel" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 font-semibold placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Step 2: KYC Documents */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verifikasi e-KYC</h2>
              <p className="text-slate-500 text-sm font-medium">Lakukan unggah KTP dan foto wajah diri demi keamanan transaksi sewa.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* KTP Drop */}
              <label className={`cursor-pointer border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all group ${ktpFileName ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-500'}`}>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png" 
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setKtpFileName(e.target.files[0].name);
                    }
                  }}
                />
                {ktpFileName ? (
                  <>
                    <CheckCircle2 size={32} className="text-emerald-500 mb-3" />
                    <span className="text-slate-900 text-sm font-black">KTP Berhasil Diunggah</span>
                    <span className="text-slate-500 text-xs mt-1 truncate w-full max-w-[180px] font-medium">{ktpFileName}</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={32} className="text-slate-400 mb-3 group-hover:text-blue-600 group-hover:-translate-y-1 transition-all" />
                    <span className="text-slate-900 text-sm font-extrabold">Unggah Kartu Identitas</span>
                    <span className="text-slate-400 text-[10px] mt-1 font-semibold tracking-wide uppercase">JPG / PNG Max 5MB</span>
                  </>
                )}
              </label>

              {/* Selfie Drop */}
              <label className={`cursor-pointer border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all group ${selfieFileName ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-500'}`}>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setSelfieFileName(e.target.files[0].name);
                    }
                  }}
                />
                {selfieFileName ? (
                  <>
                    <CheckCircle2 size={32} className="text-emerald-500 mb-3" />
                    <span className="text-slate-900 text-sm font-black">Selfie Berhasil Diunggah</span>
                    <span className="text-slate-500 text-xs mt-1 truncate w-full max-w-[180px] font-medium">{selfieFileName}</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={32} className="text-slate-400 mb-3 group-hover:text-blue-600 group-hover:-translate-y-1 transition-all" />
                    <span className="text-slate-900 text-sm font-extrabold">Unggah Foto Selfie</span>
                    <span className="text-slate-400 text-[10px] mt-1 font-semibold tracking-wide uppercase">Pastikan Wajah Terlihat Jelas</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Right: Total & Sticky Action summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm sticky top-24 space-y-6">
            
            {/* Minimal Luxury Fleet Preview Card */}
            {car ? (
              <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative group shadow-sm">
                <div className="h-40 w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/10 to-transparent z-10"></div>
                  {car.image_url ? (
                    <img 
                      src={car.image_url} 
                      alt={car.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    />
                  ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-100">🚘</div>
                  )}
                  
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="text-[9px] font-black tracking-widest text-blue-400 uppercase block mb-0.5">{car.brand || "Premium Fleet"}</span>
                    <h3 className="text-lg font-black text-white leading-tight">{car.name}</h3>
                  </div>
                  
                  <span className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur text-[9px] font-black text-slate-900 uppercase px-2.5 py-1 rounded-full shadow-sm">
                    {car.type || "LUXURY"}
                  </span>
                </div>
                
                <div className="p-4 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">Tarif Harian</span>
                  <span className="text-sm font-black text-slate-950">{formatIDR(carPricePerDay)} / hari</span>
                </div>
              </div>
            ) : (
              <div className="p-10 bg-slate-50 border border-slate-100 rounded-2xl text-center animate-pulse">
                <Loader2 className="animate-spin w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-500">Mengambil detail armada...</p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4">Ringkasan Pembayaran</h3>
              
              <div className="space-y-3.5">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-500">Tarif Sewa ({days} Hari)</span>
                  <span className="font-extrabold text-slate-950">{formatIDR(rentTotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-500">Pajak & Biaya Jasa (11%)</span>
                  <span className="font-extrabold text-slate-950">{formatIDR(tax)}</span>
                </div>

                <div className="flex justify-between items-center text-sm border-t border-dashed border-slate-200 pt-3.5 mt-1">
                  <span className="font-bold text-amber-600 flex items-center gap-1.5">
                    <AlertCircle size={16} /> Dana Titipan (Escrow)
                  </span>
                  <span className="font-extrabold text-slate-950">{formatIDR(escrow)}</span>
                </div>

                <div className="border-t border-slate-200 pt-4 flex justify-between items-end">
                  <div>
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block mb-0.5">Total Biaya</span>
                    <span className="text-3xl font-black text-slate-950 tracking-tight leading-none">{formatIDR(grandTotal)}</span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] font-semibold text-slate-400 leading-relaxed italic mt-4">
                *Dana titipan (Escrow) bersifat wajib namun akan direfund sepenuhnya secara otomatis ke rekening Anda maksimal 12 jam setelah unit mobil diserahterimakan kembali tanpa kerusakan berarti.
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold flex items-start gap-2.5 shadow-sm">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button 
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-base shadow-xl shadow-blue-600/20 hover:-translate-y-0.5 active:scale-98 disabled:opacity-60 disabled:pointer-events-none disabled:translate-y-0 transition-all flex items-center justify-center gap-2.5"
              onClick={handlePayment} 
              disabled={isLoading || !car}
            >
              {isLoading ? (
                <><Loader2 size={20} className="animate-spin" /> Memproses Dokumen...</>
              ) : (
                <><CreditCard size={20} /> Selesaikan & Bayar Sekarang</>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 select-none pt-1">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Secured by Midtrans Network</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-3">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        <p className="text-sm font-bold text-slate-500">Menghubungkan sistem enkripsi checkout...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
