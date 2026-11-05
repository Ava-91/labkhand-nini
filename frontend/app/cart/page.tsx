import type { Metadata } from "next";

import CartPageClient from "../components/CartPageClient";
import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/products";

export const metadata: Metadata = {
  title: "سبد خرید",
  description: "مشاهده و مدیریت سبد خرید شما در لبخند نینی",
};

export default async function CartPage() {
  let products: Product[] = [];
  let catalogAvailable = false;

  try {
    products = await getProducts();
    catalogAvailable = true;
  } catch (error) {
    // Keep cart contents; client must not treat stored price/stock as live data.
    console.error("[cart] Failed to load products for cart sync:", error);
  }

  return (
    <main>
      <CartPageClient products={products} catalogAvailable={catalogAvailable} />
    </main>
  );
}
