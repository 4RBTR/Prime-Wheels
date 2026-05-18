"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { Send, Paperclip, Loader2, Image as ImageIcon } from "lucide-react";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  attachment_url: string | null;
  attachment_type: string | null;
  created_at: string;
}

export default function ChatContainer({ contactId, contactName }: { contactId: string, contactName: string }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!session?.user?.id || !contactId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/chat/messages?userId=${contactId}`);
        const data = await res.json();
        if (res.ok) setMessages(data.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    };

    fetchMessages();

    // Subscribe to realtime messages
    const channel = supabase
      .channel(`chat_${session.user.id}_${contactId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `receiver_id=eq.${session.user.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.sender_id === contactId) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
            setTimeout(scrollToBottom, 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, contactId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachment) return;
    if (!session?.user?.id || !contactId) return;

    setSending(true);
    const formData = new FormData();
    formData.append("receiver_id", contactId);
    if (newMessage.trim()) formData.append("content", newMessage.trim());
    if (attachment) formData.append("attachment", attachment);

    try {
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticMsg: Message = {
        id: tempId,
        sender_id: session.user.id,
        receiver_id: contactId,
        content: newMessage,
        attachment_url: attachment ? URL.createObjectURL(attachment) : null,
        attachment_type: attachment ? attachment.type : null,
        created_at: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, optimisticMsg]);
      setNewMessage("");
      setAttachment(null);
      setTimeout(scrollToBottom, 100);

      const res = await fetch("/api/chat/messages", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (res.ok) {
        // Replace optimistic msg with real msg
        setMessages((prev) => prev.map(m => m.id === tempId ? data.message : m));
      } else {
        // Handle error (remove optimistic msg)
        setMessages((prev) => prev.filter(m => m.id !== tempId));
        alert("Gagal mengirim pesan");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative rounded-3xl overflow-hidden shadow-inner border border-slate-200">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
            {contactName?.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">{contactName}</h3>
            <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-slate-400">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <span className="text-2xl">👋</span>
            </div>
            <p className="font-medium">Belum ada pesan. Mulai percakapan sekarang!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === session?.user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
                }`}>
                  {msg.attachment_url && (
                    <div className="mb-2">
                      {msg.attachment_type?.startsWith('image/') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={msg.attachment_url} alt="Attachment" className="max-w-full h-auto rounded-xl max-h-48 object-cover" />
                      ) : (
                        <a href={msg.attachment_url} target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-sm underline ${isMe ? 'text-blue-200' : 'text-blue-600'}`}>
                          <Paperclip className="w-4 h-4" /> Buka Dokumen
                        </a>
                      )}
                    </div>
                  )}
                  {msg.content && <p className="text-sm leading-relaxed">{msg.content}</p>}
                  <span className={`text-[9px] font-medium mt-2 block ${isMe ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        {attachment && (
          <div className="mb-3 px-4 py-2 bg-slate-100 rounded-xl flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-700 font-medium truncate">
              {attachment.type.startsWith('image/') ? <ImageIcon className="w-4 h-4 text-blue-500" /> : <Paperclip className="w-4 h-4 text-slate-500" />}
              <span className="truncate">{attachment.name}</span>
            </div>
            <button onClick={() => setAttachment(null)} className="text-rose-500 font-bold hover:text-rose-700">Batal</button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-3 relative">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors shrink-0"
            disabled={sending}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Tulis pesan..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-slate-100 border-none px-5 py-3.5 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || (!newMessage.trim() && !attachment)}
            className="p-3.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
