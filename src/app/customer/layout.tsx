"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const Icons = {
  Fleet: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8.3a2 2 0 0 0-1.6.8L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3m18 0a3 3 0 1 1-6 0m6 0a3 3 0 1 0-6 0M6 16a3 3 0 1 1-6 0m6 0a3 3 0 1 0-6 0" />
    </svg>
  ),
  Bookings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Profile: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Chat: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  SignOut: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  ),
  Menu: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
  ),
  Close: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
  )
};

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const isActive = (path: string) => pathname?.startsWith(path);

  const navItems = [
    { name: "Fleet Catalog", path: "/customer/dashboard", icon: Icons.Fleet },
    { name: "My Bookings", path: "/customer/bookings", icon: Icons.Bookings },
    { name: "Support Chat", path: "/customer/chat", icon: Icons.Chat },
    { name: "Profile", path: "/customer/profile", icon: Icons.Profile },
  ];

  const getUserInitials = () => {
    const name = session?.user?.name || session?.user?.email || "U";
    return name.slice(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F9] flex flex-col font-sans text-slate-900">
      {/* Unified Apple-style Top Navbar (Mirroring Admin UI Exactly) */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left: Brand & Desktop Links */}
            <div className="flex items-center gap-8">
              <div className="shrink-0 flex items-center gap-2 mr-4">
                <Link href="/customer" className="flex items-center gap-2 select-none">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
                    <span className="text-white font-black text-sm">R</span>
                  </div>
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">Prime Wheels</span>
                </Link>
              </div>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center space-x-2">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2
                          ${active ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}
                       `}
                    >
                      <span className={active ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Interactive Session Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Quick Browse Catalog Button */}
              <Link href="/customer/dashboard" className="text-sm font-bold bg-white border border-slate-200 text-slate-900 px-4 py-2 rounded-full hover:bg-slate-50 transition-all shadow-sm">
                Browse Fleet
              </Link>

              {/* Visual Divider */}
              <div className="h-5 w-px bg-slate-200 mx-1"></div>

              {/* Standard Sign Out */}
              <button 
                onClick={handleSignOut} 
                className="text-slate-400 hover:text-rose-500 transition-colors flex items-center p-2 rounded-full hover:bg-rose-50 cursor-pointer" 
                title="Sign Out"
              >
                {Icons.SignOut}
              </button>

              {/* Active User Avatar Bubble */}
              <Link href="/customer/profile" className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-xs font-black text-slate-700 hover:border-slate-400 transition-all shadow-sm uppercase tracking-wider">
                {getUserInitials()}
              </Link>
            </div>

            {/* Mobile Burger Controls */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-500 hover:text-slate-900 p-2"
            >
              {mobileMenuOpen ? Icons.Close : Icons.Menu}
            </button>
          </div>
        </div>

        {/* Mobile Interactive Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold
                         ${isActive(item.path) ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}
                      `}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-4"></div>
              <button 
                onClick={handleSignOut} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-rose-600 hover:bg-rose-50 text-left"
              >
                {Icons.SignOut}
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Display Canvas Area */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto pt-8 pb-12 px-4 sm:px-6 md:px-8">
        {children}
      </main>

      {/* Simple Standardized Premium Footer */}
      <footer className="border-t border-slate-200 bg-white/50 py-6 text-center text-slate-400 text-xs font-semibold select-none mt-auto">
        &copy; 2026 Prime Wheels Executive Rental. All rights reserved.
      </footer>
    </div>
  );
}
