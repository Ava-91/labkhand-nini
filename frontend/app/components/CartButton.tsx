"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "./CartProvider";

export default function CartButton() {
  const { itemCount, isReady } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center rounded-full border border-[#f0e4e3] bg-white p-2.5 text-[#a84766] transition hover:border-[#c65f7d] hover:bg-[#fff0f3]"
      aria-label={
        isReady && itemCount > 0
          ? `سبد خرید، ${new Intl.NumberFormat("fa-IR").format(itemCount)} کالا`
          : "سبد خرید"
      }
    >
      <ShoppingBag size={20} strokeWidth={1.8} aria-hidden="true" />
      {isReady && itemCount > 0 && (
        <span className="absolute -left-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#c65f7d] px-1 text-[10px] font-bold text-white">
          {new Intl.NumberFormat("fa-IR").format(
            itemCount > 99 ? 99 : itemCount,
          )}
        </span>
      )}
    </Link>
  );
}
