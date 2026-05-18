"use client";

import { useState, useEffect } from "react";
import ChatContainer from "@/components/chat/ChatContainer";
import { Loader2, Search, User } from "lucide-react";

export default function AdminChatPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await fetch("/api/chat/contacts");
        const data = await res.json();
        if (res.ok) {
          setContacts(data.contacts || []);
          setFilteredContacts(data.contacts || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredContacts(contacts);
    } else {
      const lower = search.toLowerCase();
      setFilteredContacts(
        contacts.filter(c => c.name?.toLowerCase().includes(lower) || c.city?.toLowerCase().includes(lower))
      );
    }
  }, [search, contacts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[70vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Sidebar Contacts */}
      <div className="w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col min-w-[280px]">
        <div className="p-6 border-b border-slate-200 bg-white">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4 tracking-tight">Messages</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari user atau kota..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredContacts.length === 0 ? (
            <p className="text-center text-sm text-slate-500 mt-4">Belum ada percakapan</p>
          ) : (
            filteredContacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left
                  ${selectedContact?.id === contact.id 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-100"
                  }
                `}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0
                  ${selectedContact?.id === contact.id ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"}
                `}>
                  {contact.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold truncate text-sm">{contact.name}</h4>
                  <p className={`text-[10px] uppercase tracking-wider font-bold mt-1 truncate
                    ${selectedContact?.id === contact.id ? "text-blue-200" : "text-slate-400"}
                  `}>
                    {contact.role === 'ADMIN' ? `Admin - ${contact.city}` : `User - ${contact.city}`}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 bg-slate-50 relative flex flex-col p-6">
        {selectedContact ? (
          <ChatContainer 
            contactId={selectedContact.id} 
            contactName={selectedContact.name} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200 shadow-sm">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Pilih Kontak</h3>
            <p className="text-slate-500 max-w-sm">Pilih kontak dari daftar di sebelah kiri untuk mulai membaca atau mengirim pesan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
