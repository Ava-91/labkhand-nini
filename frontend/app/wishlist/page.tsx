import type { Metadata } from "next";

import WishlistContent from "./WishlistContent";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "لیست علاقه‌مندی‌ها",
  description: "محصولات مورد علاقه‌ات را در یک جا ببین.",
};

export default async function WishlistPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <WishlistContent products={products} />
    </main>
  );
}
