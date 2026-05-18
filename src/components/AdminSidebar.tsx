"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Icons = {
  Overview: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  ),
  Orders: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Fleet: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H8.3a2 2 0 0 0-1.6.8L4 11l-5.16.86a1 1 0 0 0-.84.99V16h3m18 0a3 3 0 1 1-6 0m6 0a3 3 0 1 0-6 0M6 16a3 3 0 1 1-6 0m6 0a3 3 0 1 0-6 0" />
    </svg>
  ),
  Calendar: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  Finance: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  ),
  Members: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
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

export default function AdminNavbar({ children }: { children?: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  const navItems = [
    { name: "Overview", path: "/admin/dashboard", icon: Icons.Overview },
    { name: "Bookings", path: "/admin/bookings", icon: Icons.Orders },
    { name: "Schedule", path: "/admin/schedule", icon: Icons.Calendar },
    { name: "Finance", path: "/admin/transactions", icon: Icons.Finance },
    { name: "Fleet", path: "/admin/cars", icon: Icons.Fleet },
    { name: "Customers", path: "/admin/customers", icon: Icons.Members },
    { name: "Messages", path: "/admin/chat", icon: Icons.Chat },
    { name: "Settings", path: "/admin/profile", icon: Icons.Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F9] flex flex-col font-sans text-slate-900">

      {/* Apple-style Crisp Light Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left: Brand & Navigation */}
            <div className="flex items-center gap-4 xl:gap-8">
              <div className="shrink-0 flex items-center gap-2 mr-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
                  <span className="text-white font-black text-sm">R</span>
                </div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight hidden sm:block">Prime Wheels</span>
              </div>

              {/* Desktop Links */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`px-3 py-2 rounded-full text-[13px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0
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

            {/* Right: Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Quick Create Button */}
              <Link href="/admin/bookings" className="text-sm font-bold bg-white border border-slate-200 text-slate-900 px-4 py-2 rounded-full hover:bg-slate-50 transition-all shadow-sm whitespace-nowrap shrink-0">
                + New Booking
              </Link>

              {/* Divider */}
              <div className="h-5 w-px bg-slate-200 mx-1"></div>

              {/* Sign Out */}
              <Link href="/login" className="text-slate-400 hover:text-rose-500 transition-colors flex items-center p-2 rounded-full hover:bg-rose-50" title="Sign Out">
                {Icons.SignOut}
              </Link>

              {/* User Avatar */}
              <Link href="/admin/profile" className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-xs font-bold text-slate-700 hover:border-slate-400 transition-colors shadow-sm">
                AW
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-slate-500 hover:text-slate-900 p-2"
            >
              {mobileMenuOpen ? Icons.Close : Icons.Menu}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg">
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
              <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-rose-600 hover:bg-rose-50">
                {Icons.SignOut}
                Sign Out
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto pt-8 pb-12 px-4 sm:px-6 md:px-8">
        {children}
      </main>

    </div>
  );
}
