"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Car, ShieldCheck, Map, Clock, ArrowRight, Star, Zap, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LandingPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedCars() {
      try {
        const { data, error } = await supabase
          .from("cars")
          .select("*")
          .eq("admin_status", "Available")
          .limit(4)
          .order("created_at", { ascending: false });

        if (data && !error) {
          setCars(data);
        }
      } catch (err) {
        console.error("Error loading landing cars:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedCars();
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `Rp ${(price / 1000000).toFixed(1)}M`;
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600/10 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-100 bg-white/70 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Car className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">Prime Wheels</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <Link href="#fleet" className="hover:text-blue-600 transition-colors">The Fleet</Link>
            <Link href="#features" className="hover:text-blue-600 transition-colors">Services</Link>
            <Link href="#about" className="hover:text-blue-600 transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="text-sm font-black bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl transition-all shadow-xl shadow-blue-600/20">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-50 rounded-full blur-[100px] -z-10 opacity-40"></div>

        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Indonesia's #1 Premium Rental Platform
            </div>
            
            <h1 className="text-6xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.95] text-slate-950">
              Drive The <br />
              <span className="text-blue-600">Extraordinary.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-lg font-medium leading-relaxed">
              Experience the pinnacle of mobility. Curated fleet, instant e-KYC validation, and a seamless digital booking experience.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/register/user" className="w-full sm:w-auto px-10 py-5 bg-slate-950 hover:bg-slate-800 text-white rounded-2xl font-black text-base transition-all shadow-2xl shadow-slate-950/20 flex items-center justify-center gap-3">
                Start Exploring <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/register/admin" className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl font-bold text-base transition-all">
                Become a Partner
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl relative group">
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
                alt="Porsche Hero"
              />
              <div className="absolute bottom-8 left-8 z-20 flex items-center gap-4 bg-white/20 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-2xl">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-950 shadow-lg">9.8</div>
                <div>
                  <div className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Customer Satisfaction</div>
                  <div className="text-white font-bold text-base">Elite Driving Standards</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="text-center mb-24 space-y-4">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 block">The Prime Advantage</span>
             <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight">Redefining The Standard</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.25rem] flex items-center justify-center mb-8 text-2xl">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-950 mb-4">Instant e-KYC</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Zero friction onboarding. Our automated system validates your identity instantly for a secure and trusted experience.
              </p>
            </div>

            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-[1.25rem] flex items-center justify-center mb-8 text-2xl">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-950 mb-4">DP-First Booking</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Secure your dream car with just 30% down payment. Pay the rest once your reservation is confirmed by our concierge.
              </p>
            </div>

            <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.25rem] flex items-center justify-center mb-8 text-2xl">
                <Clock size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-950 mb-4">Fleet Transparency</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                What you see is what you get. Real-time availability, clear unit counts, and live status tracking for every vehicle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Spotlight */}
      <section id="fleet" className="py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 block">Current Availability</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tight">The Featured Fleet</h2>
            </div>
            <Link href="/login" className="text-slate-950 font-black hover:text-blue-600 transition-colors flex items-center gap-2 group pb-1 border-b-2 border-slate-950 hover:border-blue-600">
              View Full Catalog <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
               <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
               <p className="text-slate-400 font-bold">The garage is currently being refreshed. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {cars.map(car => (
                <div key={car.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={car.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={car.name}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-sm">
                      {car.type}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="mb-6">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{car.brand}</span>
                      <h3 className="text-2xl font-black text-slate-950 leading-tight">{car.name}</h3>
                    </div>
                    
                    <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Price/Day</span>
                        <span className="text-2xl font-black text-slate-950">{formatPrice(car.price_per_day)}</span>
                      </div>
                      <Link href="/login" className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg shadow-slate-950/20 group-hover:shadow-blue-600/20">
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-blue-600/30 blur-[150px] rounded-full pointer-events-none opacity-40"></div>
        
        <div className="max-w-[1400px] mx-auto px-6 text-center relative z-10 space-y-12">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter max-w-4xl mx-auto leading-tight">
             Ready to Elevated Your <span className="text-blue-500">Journey?</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
             Join thousands of premium travelers who trust Prime Wheels for their mobility needs. Professional, secure, and always elite.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
             <Link href="/register/user" className="w-full sm:w-auto px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95">
                Create My Account
             </Link>
             <Link href="/contact" className="w-full sm:w-auto px-12 py-6 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] font-bold text-lg border border-white/10 backdrop-blur-xl transition-all">
                Speak to Concierge
             </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                 <Car className="w-4 h-4" />
              </div>
              <span className="font-black text-slate-900 tracking-tight">Prime Wheels Executive</span>
           </div>
           
           <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Link href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Fleet Partnership</Link>
           </div>
           
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Prime Wheels International
           </div>
        </div>
      </footer>
    </div>
  );
}

