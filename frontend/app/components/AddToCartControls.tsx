"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { useCart } from "./CartProvider";
import type { Product } from "@/lib/products";

type AddToCartControlsProps = {
  product: Product;
  /** Compact layout for product cards; full layout for detail page */
  variant?: "card" | "detail";
};

export default function AddToCartControls({
  product,
  variant = "card",
}: AddToCartControlsProps) {
  const { addItem, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const isInStock = product.stock > 0;
  const inCartQty = getItemQuantity(product.id);
  const maxQty = product.stock;

  function handleDecrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function handleIncrement() {
    setQuantity((q) => Math.min(maxQty, q + 1));
  }

  function handleAdd() {
    if (!isInStock) return;
    addItem(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  if (!isInStock) {
    return (
      <p
        className={
          variant === "detail"
            ? "mt-4 text-sm font-bold text-[#a84766]"
            : "mt-4 text-center text-xs font-bold text-[#a84766]"
        }
      >
        فعلاً ناموجود
      </p>
    );
  }

  if (variant === "detail") {
    return (
      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm font-bold text-[#553d44]">تعداد:</span>
          <div className="inline-flex items-center rounded-full border border-[#e9cbd3] bg-white">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 1}
              aria-label="کاهش تعداد"
              className="grid h-11 w-11 place-items-center rounded-full text-[#a84766] transition hover:bg-[#fff0f3] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus size={16} strokeWidth={2} aria-hidden="true" />
            </button>
            <span
              className="min-w-10 text-center text-base font-extrabold text-[#443a3c]"
              aria-live="polite"
            >
              {new Intl.NumberFormat("fa-IR").format(quantity)}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={quantity >= maxQty}
              aria-label="افزایش تعداد"
              className="grid h-11 w-11 place-items-center rounded-full text-[#a84766] transition hover:bg-[#fff0f3] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
          {inCartQty > 0 && (
            <span className="text-xs font-bold text-[#367557]">
              {new Intl.NumberFormat("fa-IR").format(inCartQty)} عدد در سبد
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c65f7d] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#a84766] sm:w-auto sm:min-w-48"
        >
          <ShoppingCart size={18} strokeWidth={1.8} aria-hidden="true" />
          {justAdded ? "به سبد اضافه شد ✓" : "افزودن به سبد خرید"}
        </button>
      </div>
    );
  }

  // Card variant
  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center rounded-full border border-[#e9cbd3] bg-[#fffaf6]">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={quantity <= 1}
            aria-label="کاهش تعداد"
            className="grid h-8 w-8 place-items-center rounded-full text-[#a84766] transition hover:bg-[#fff0f3] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus size={14} strokeWidth={2} aria-hidden="true" />
          </button>
          <span
            className="min-w-7 text-center text-sm font-extrabold text-[#443a3c]"
            aria-live="polite"
          >
            {new Intl.NumberFormat("fa-IR").format(quantity)}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={quantity >= maxQty}
            aria-label="افزایش تعداد"
            className="grid h-8 w-8 place-items-center rounded-full text-[#a84766] transition hover:bg-[#fff0f3] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={14} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#c65f7d] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#a84766]"
        >
          <ShoppingCart size={14} strokeWidth={1.8} aria-hidden="true" />
          {justAdded ? "اضافه شد ✓" : "افزودن"}
        </button>
      </div>

      {inCartQty > 0 && (
        <p className="text-center text-[11px] font-bold text-[#367557]">
          {new Intl.NumberFormat("fa-IR").format(inCartQty)} عدد در سبد
        </p>
      )}
    </div>
  );
}
