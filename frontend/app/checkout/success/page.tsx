import type { Metadata } from "next";
import { Suspense } from "react";

import SuccessClient from "./SuccessClient";

export const metadata: Metadata = {
  title: "سفارش ثبت شد",
  description: "تأیید ثبت سفارش در لبخند نینی",
};

export default function CheckoutSuccessPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="mx-auto min-h-[50vh] w-full max-w-lg px-5 py-16 text-center text-sm text-[#817477]">
            در حال بارگذاری...
          </div>
        }
      >
        <SuccessClient />
      </Suspense>
    </main>
  );
}
