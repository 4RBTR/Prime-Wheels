/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useSession, signOut } from "next-auth/react";

const Icons = {
  SignOut: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Disable rendering on dashboard namespaces
  if (pathname && (pathname.startsWith('/cs-dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/customer'))) {
    return null;
  }

  const getHomeLink = () => {
    if (status === "authenticated" && session?.user) {
      const role = (session.user as any).role;
      if (role === "ADMIN") return "/admin/dashboard";
      if (role === "USER") return "/customer/dashboard";
    }
    return "/";
  };

  const isLinkActive = (href: string) => pathname === href;
  const role = (session?.user as any)?.role;

  const getUserInitials = () => {
    const name = session?.user?.name || session?.user?.email || "U";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_-6px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Brand Logo & Links (Aligned with Customer UI) */}
          <div className="flex items-center gap-8">
            <Link href={getHomeLink()} className="shrink-0 flex items-center gap-2 select-none group">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
                <span className="text-white font-black text-sm">R</span>
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">Prime Wheels</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link 
                href={getHomeLink()} 
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2
                  ${isLinkActive("/") 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                Beranda
              </Link>
              <Link 
                href="/catalog" 
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2
                  ${isLinkActive("/catalog") 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                Katalog
              </Link>
              <Link 
                href="/services" 
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2
                  ${isLinkActive("/services") 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                Layanan
              </Link>
              <Link 
                href="/contact" 
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2
                  ${isLinkActive("/contact") 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                Kontak
              </Link>
            </nav>
          </div>

          {/* Right: Session Controls (Mirrors Customer Layout Exactly!) */}
          <div className="hidden md:flex items-center gap-4">
            {status === "loading" ? (
              <span className="text-xs font-bold text-slate-400 animate-pulse">Connecting...</span>
            ) : session && session.user ? (
              <>
                {/* Main Quick Action */}
                <Link 
                  href={role === "ADMIN" ? "/admin/dashboard" : "/customer/dashboard"} 
                  className="text-sm font-bold bg-white border border-slate-200 text-slate-900 px-4 py-2 rounded-full hover:bg-slate-50 transition-all shadow-sm"
                >
                  Browse Fleet
                </Link>

                <div className="h-5 w-px bg-slate-200 mx-1"></div>

                {/* Standard Sign Out Button */}
                <button 
                  onClick={handleLogout} 
                  className="text-slate-400 hover:text-rose-500 transition-colors flex items-center p-2 rounded-full hover:bg-rose-50 cursor-pointer" 
                  title="Sign Out"
                >
                  {Icons.SignOut}
                </button>

                {/* In-Bubble Initials Avatar */}
                <Link 
                  href={role === "ADMIN" ? "/admin/profile" : "/customer/profile"} 
                  className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-xs font-black text-slate-700 hover:border-slate-400 transition-all shadow-sm uppercase tracking-wider"
                >
                  {getUserInitials()}
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-full transition-all"
                >
                  Masuk
                </Link>
                <Link 
                  href="/register" 
                  className="text-sm font-bold bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 px-5 py-2 rounded-full hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  Daftar Baru
                </Link>
              </>
            )}
          </div>

          {/* Mobile Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-lg">
          <nav className="px-4 py-4 space-y-2">
            <Link 
              href={getHomeLink()} 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold
                ${isLinkActive("/") ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}
              `}
            >
              Beranda
            </Link>
            <Link 
              href="/catalog" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold
                ${isLinkActive("/catalog") ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}
              `}
            >
              Katalog
            </Link>
            
            {session && session.user ? (
              <>
                <div className="h-px bg-slate-100 my-4"></div>
                <Link 
                  href={role === "ADMIN" ? "/admin/dashboard" : "/customer/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-slate-700 hover:bg-slate-50"
                >
                  Dashboard Saya
                </Link>
                <button 
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-rose-600 hover:bg-rose-50 text-left"
                >
                  {Icons.SignOut}
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div className="h-px bg-slate-100 my-4"></div>
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-3 border border-slate-200 rounded-2xl font-bold text-sm text-slate-700 hover:bg-slate-50"
                >
                  Masuk
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-md shadow-blue-600/10 mt-2"
                >
                  Daftar
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
