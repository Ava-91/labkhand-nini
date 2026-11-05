import type { Metadata } from "next";

import CartPageClient from "../components/CartPageClient";

export const metadata: Metadata = {
  title: "سبد خرید",
  description: "مشاهده و مدیریت سبد خرید شما در لبخند نینی",
};

export default function CartPage() {
  return (
    <main>
      <CartPageClient />
    </main>
  );
}
