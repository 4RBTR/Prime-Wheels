import Link from "next/link";
import Image from "next/image";
import { Car, ShieldCheck, Map, Clock, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Prime Wheels</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="#" className="hover:text-white transition-colors">Beranda</Link>
            <Link href="#" className="hover:text-white transition-colors">Tentang Kami</Link>
            <Link href="#" className="hover:text-white transition-colors">Armada</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold hover:text-blue-400 transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="text-sm font-bold bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1000px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Platform Sewa Mobil Premium #1 di Indonesia
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] max-w-4xl">
            Perjalanan Berkelas,<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-600">
              Tanpa Batas.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
            Temukan dan sewa kendaraan impian Anda dengan mudah. Pengalaman mobilitas tingkat tinggi didukung oleh e-KYC instant dan keamanan transaksi terjamin.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/register/user" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center">
              Mulai Menyewa <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link href="/register/admin" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center backdrop-blur-sm">
              Gabung Sebagai Mitra
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50 border-y border-white/5 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <div className="bg-slate-950 p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Keamanan Ekstra (e-KYC)</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Verifikasi identitas instan untuk keamanan ganda. Hanya penyewa terverifikasi yang dapat menggunakan layanan.
              </p>
            </div>

            <div className="bg-slate-950 p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pilihan Kendaraan Luas</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Dari mobil sport eksotis hingga SUV premium, kami memiliki kendaraan untuk setiap kebutuhan perjalanan Anda.
              </p>
            </div>

            <div className="bg-slate-950 p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Proses Cepat & Transparan</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tanpa biaya tersembunyi. Pesan, bayar, dan ambil kendaraan Anda dalam hitungan menit tanpa ribet.
              </p>
            </div>

          </div>
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="py-8 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Prime Wheels Platform. All rights reserved.
      </footer>
    </div>
  );
}
