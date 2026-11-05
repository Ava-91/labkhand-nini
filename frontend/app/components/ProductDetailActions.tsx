"use client";

import type { Product } from "@/lib/products";
import AddToCartControls from "./AddToCartControls";

export default function ProductDetailActions({ product }: { product: Product }) {
  return <AddToCartControls product={product} variant="detail" />;
}
