"use client";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import GlobalNotification from "@/components/GlobalNotification";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ToastContainer />
      <GlobalNotification />
    </SessionProvider>
  );
}
