import type { Metadata } from "next";

import CartPageClient from "../components/CartPageClient";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "سبد خرید",
  description: "مشاهده و مدیریت سبد خرید شما در لبخند نینی",
};

export default async function CartPage() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];

  try {
    products = await getProducts();
  } catch (error) {
    // Cart still works offline from localStorage; live price/stock sync is best-effort.
    console.error("[cart] Failed to load products for cart sync:", error);
  }

  return (
    <main>
      <CartPageClient products={products} />
    </main>
  );
}
