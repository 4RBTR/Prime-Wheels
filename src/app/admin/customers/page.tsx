"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import CustomerCard from "./card-customers";

export interface CustomerType {
  id: string;
  name: string;
  email: string;
  ktp_url: string | null;
  selfie_url: string | null;
  kyc_status: string;
  created_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/customers");
        const data = await res.json();
        if (res.ok) setCustomers(data.customers || []);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const getKycStatus = (c: CustomerType) => {
    if (c.kyc_status === "Approved") return "Verified";
    if (c.kyc_status === "Pending" && (c.ktp_url || c.selfie_url)) return "Pending";
    return "None";
  };

  const pendingCount = customers.filter(c => getKycStatus(c) === "Pending").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 pb-4 border-b border-slate-200 gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Customers & KYC Verification</h2>
           <p className="text-slate-500 text-sm">Total users: {customers.length} | Pending KYC: {pendingCount}</p>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-200">
          Belum ada penyewa yang terdaftar.
        </div>
      ) : (
        <div className="space-y-4">
          {customers.map(customer => (
            <CustomerCard key={customer.id} customer={customer} kycStatus={getKycStatus(customer)} />
          ))}
        </div>
      )}
    </div>
  );
}
