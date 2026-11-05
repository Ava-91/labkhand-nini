import type { Metadata } from "next";

import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "تسویه حساب",
  description: "ثبت سفارش و اطلاعات ارسال در لبخند نینی",
};

export default function CheckoutPage() {
  return (
    <main>
      <CheckoutClient />
    </main>
  );
}
