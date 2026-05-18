"use client";

import { useState, useEffect } from "react";
import ChatContainer from "@/components/chat/ChatContainer";
import { Loader2, ShieldAlert } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CustomerChatPage() {
  const { data: session } = useSession();
  const [adminContact, setAdminContact] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await fetch("/api/chat/contacts");
        const data = await res.json();
        if (res.ok && data.contacts && data.contacts.length > 0) {
          setAdminContact(data.contacts[0]); // Only 1 admin per city
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdmin();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-slate-900" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 text-center md:text-left relative">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Customer Support
        </h1>
        <p className="text-sm text-slate-500">
          Hubungi Admin {(session?.user as any)?.city} untuk bantuan rental atau kendala teknis.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] p-4 md:p-8">
        {adminContact ? (
          <ChatContainer 
            contactId={adminContact.id} 
            contactName={`Admin ${adminContact.city}`} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-500">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Layanan Tidak Tersedia</h3>
            <p className="text-slate-500 max-w-md">
              Saat ini belum ada Admin yang bertugas di wilayah {(session?.user as any)?.city}. 
              Silakan ganti wilayah Anda di halaman Dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
