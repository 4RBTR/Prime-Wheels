"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

export default function GlobalNotification() {
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel(`global_notifications_${session.user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `receiver_id=eq.${session.user.id}`,
        },
        (payload) => {
          toast.info("Pesan baru masuk!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, pathname]);

  return null;
}
