"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CheckoutRedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const carId = searchParams.get("car");
    if (carId) {
      router.replace(`/checkout?carId=${carId}`);
    } else {
      router.replace("/customer/dashboard");
    }
  }, [router, searchParams]);

  return (
    <div className="flex justify-center items-center h-[70vh] font-sans text-slate-500 font-medium animate-pulse">
      Redirecting to secure checkout system...
    </div>
  );
}

export default function CustomerCheckoutRedirect() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-[70vh] font-sans text-slate-500 font-medium">
        Loading checkout portal...
      </div>
    }>
      <CheckoutRedirectHandler />
    </Suspense>
  );
}
