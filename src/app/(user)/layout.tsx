import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SewaMobil Premium",
  description: "Platform penyewaan mobil modern dengan integrasi e-KYC dan Midtrans",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${outfit.variable} bg-[#F7F7F9] text-slate-900 flex flex-col min-h-screen`}>
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
}
