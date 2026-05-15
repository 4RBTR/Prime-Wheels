"use client";

import React from 'react';
import Link from 'next/link';
import { Car, Mail, MapPin, Phone, Compass, ShieldCheck, Globe } from 'lucide-react';
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Don't show pre-login footer inside internal dashboards (they have their own miniature footer)
  if (pathname && (pathname.startsWith('/cs-dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/customer'))) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-slate-200/80 py-16 mt-auto text-slate-600 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Col 1: Brand and Philosophy */}
        <div className="space-y-6 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-8.5 h-8.5 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
              <Car size={18} className="text-white" />
            </div>
            <div className="font-black text-xl text-slate-900 tracking-tight">
              Prime<span className="text-blue-600">Wheels</span>
            </div>
          </Link>
          <p className="text-sm leading-relaxed text-slate-500 font-medium max-w-xs">
            The premiere luxury car rental platform in the region. Fully verified digital identities and automated escrow deposits for absolute peace of mind.
          </p>
          <div className="flex gap-3 pt-2">
            <a href="#" className="w-9 h-9 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300 shadow-sm"><Compass size={16} /></a>
            <a href="#" className="w-9 h-9 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300 shadow-sm"><ShieldCheck size={16} /></a>
            <a href="#" className="w-9 h-9 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300 shadow-sm"><Globe size={16} /></a>
          </div>
        </div>

        {/* Col 2: Quick Navigation */}
        <div className="space-y-5">
          <h4 className="text-slate-900 text-xs font-black uppercase tracking-widest">Explore Platforms</h4>
          <ul className="space-y-3 flex flex-col">
            <li><Link href="/" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Corporate Homepage</Link></li>
            <li><Link href="/catalog" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Luxury Fleet Catalog</Link></li>
            <li><Link href="/services" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Corporate Services</Link></li>
            <li><Link href="/login" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Agent Portal Login</Link></li>
          </ul>
        </div>

        {/* Col 3: Support */}
        <div className="space-y-5">
          <h4 className="text-slate-900 text-xs font-black uppercase tracking-widest">Client Support</h4>
          <ul className="space-y-3 flex flex-col">
            <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Rental Agreement Policies</Link></li>
            <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Escrow & Refund Terms</Link></li>
            <li><Link href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">E-KYC Verification Help</Link></li>
            <li><Link href="/contact" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Contact Support Center</Link></li>
          </ul>
        </div>

        {/* Col 4: Direct Contacts */}
        <div className="space-y-5">
          <h4 className="text-slate-900 text-xs font-black uppercase tracking-widest">Headquarters</h4>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <MapPin size={18} className="text-blue-600 mt-0.5 shrink-0" />
              <span className="text-sm leading-relaxed font-semibold text-slate-700">Sudirman Central Business District, Block T-12, Jakarta 12190</span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone size={16} className="text-blue-600 shrink-0" />
              <span className="text-sm font-semibold text-slate-700">+62 (21) 500-8889</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail size={16} className="text-blue-600 shrink-0" />
              <span className="text-sm font-semibold text-slate-700">concierge@primewheels.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 mt-16 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs font-medium text-slate-400">
          &copy; {new Date().getFullYear()} Prime Wheels Premium Rent. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-xs font-bold text-slate-400 hover:text-blue-600">Privacy</a>
          <a href="#" className="text-xs font-bold text-slate-400 hover:text-blue-600">Terms</a>
          <a href="#" className="text-xs font-bold text-slate-400 hover:text-blue-600">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
