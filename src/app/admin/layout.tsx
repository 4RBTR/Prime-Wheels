import AdminSidebar from "@/components/AdminSidebar";
import { ReactNode } from "react";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <AdminSidebar>
      {children}
    </AdminSidebar>
  );
}
