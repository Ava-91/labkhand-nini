"use client";

import Link from "next/link";
import { AlertTriangle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

import {
  formatMoney,
  getCartItemLineTotal,
  getCartItemUnitPrice,
} from "@/lib/cart";
import type { Product } from "@/lib/products";
import { useCart } from "./CartProvider";

type CartPageClientProps = {
  /** Live catalog from Strapi so persisted cart lines get current price/stock. */
  products: Product[];
  /** True only when getProducts() succeeded (even if the list is empty). */
  catalogAvailable: boolean;
};

export default function CartPageClient({
  products,
  catalogAvailable,
}: CartPageClientProps) {
  const {
    items,
    itemCount,
    subtotal,
    isReady,
    increment,
    decrement,
    removeItem,
    clearCart,
    syncWithProducts,
  } = useCart();

  const didSync = useRef(false);

  useEffect(() => {
    // Only reconcile against a successfully loaded catalog.
    // On failure, keep localStorage lines as-is and show the warning banner.
    if (!isReady || didSync.current || !catalogAvailable) return;
    didSync.current = true;
    syncWithProducts(products);
  }, [isReady, catalogAvailable, products, syncWithProducts]);

  if (!isReady) {
    return (
      <div className="mx-auto min-h-[50vh] w-full max-w-4xl px-5 py-16 text-center sm:px-8">
        <p className="text-sm text-[#817477]">در حال بارگذاری سبد خرید...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto min-h-[50vh] w-full max-w-4xl px-5 py-16 text-center sm:px-8">
        <ShoppingBag
          className="mx-auto text-[#c65f7d]"
          size={52}
          strokeWidth={1.4}
          aria-hidden="true"
        />
        <h1 className="mt-5 text-2xl font-black text-[#443a3c]">سبد خرید خالی است</h1>
        <p className="mt-3 text-sm leading-7 text-[#817477]">
          هنوز محصولی به سبدت اضافه نکردی. برو محصولات رو ببین و انتخاب کن.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex rounded-full bg-[#c65f7d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#a84766]"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#443a3c] sm:text-3xl">
            سبد خرید
          </h1>
          <p className="mt-2 text-sm text-[#817477]">
            {new Intl.NumberFormat("fa-IR").format(itemCount)} کالا در سبد
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-bold text-[#a84766] transition hover:text-[#81364f]"
        >
          خالی کردن سبد
        </button>
      </div>

      {!catalogAvailable && (
        <div
          className="mt-6 flex gap-3 rounded-2xl border border-[#e8c6d1] bg-[#fff0f3] p-4 text-sm leading-7 text-[#875366]"
          role="alert"
        >
          <AlertTriangle
            className="mt-0.5 shrink-0 text-[#c65f7d]"
            size={20}
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <div>
            <p className="font-bold text-[#a84766]">
              اطلاعات به‌روز محصولات در دسترس نیست
            </p>
            <p className="mt-1">
              قیمت، تخفیف و موجودی نمایش‌داده‌شده ممکن است قدیمی باشد. تا اتصال
              دوباره برقرار شود، افزایش تعداد غیرفعال است و این ارقام به‌عنوان
              دادهٔ قطعی در نظر گرفته نمی‌شوند.
            </p>
          </div>
        </div>
      )}

      <ul className="mt-8 space-y-4">
        {items.map((item) => {
          const unitPrice = getCartItemUnitPrice(item);
          const lineTotal = getCartItemLineTotal(item);
          const hasDiscount = item.discount > 0;
          const canIncrease =
            catalogAvailable && item.quantity < item.stock;

          return (
            <li
              key={item.productId}
              className="flex flex-col gap-4 rounded-3xl border border-[#f0e4e3] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:gap-5 sm:p-5"
            >
              <Link
                href={`/products/${item.slug}`}
                className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#fff0f3] to-[#f5effb]"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl" aria-hidden="true">
                    {item.emoji}
                  </span>
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-base font-extrabold text-[#443a3c] hover:text-[#a84766]"
                >
                  {item.title}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                  <strong className="font-bold text-[#553d44]">
                    {formatMoney(unitPrice)}
                  </strong>
                  {hasDiscount && (
                    <del className="text-xs text-[#a49a9c]">
                      {formatMoney(item.price)}
                    </del>
                  )}
                  {!catalogAvailable && (
                    <span className="text-[11px] font-bold text-[#a84766]">
                      (ممکن است به‌روز نباشد)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                <div className="inline-flex items-center rounded-full border border-[#e9cbd3] bg-[#fffaf6]">
                  <button
                    type="button"
                    onClick={() => decrement(item.productId)}
                    aria-label="کاهش تعداد"
                    className="grid h-9 w-9 place-items-center rounded-full text-[#a84766] transition hover:bg-[#fff0f3]"
                  >
                    <Minus size={14} strokeWidth={2} aria-hidden="true" />
                  </button>
                  <span className="min-w-8 text-center text-sm font-extrabold text-[#443a3c]">
                    {new Intl.NumberFormat("fa-IR").format(item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => increment(item.productId)}
                    disabled={!canIncrease}
                    aria-label="افزایش تعداد"
                    title={
                      !catalogAvailable
                        ? "تا دریافت موجودی به‌روز، افزایش تعداد ممکن نیست"
                        : undefined
                    }
                    className="grid h-9 w-9 place-items-center rounded-full text-[#a84766] transition hover:bg-[#fff0f3] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={14} strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>

                <strong className="min-w-24 text-left text-sm font-extrabold text-[#553d44] sm:text-base">
                  {formatMoney(lineTotal)}
                </strong>

                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  aria-label={`حذف ${item.title} از سبد`}
                  className="grid h-9 w-9 place-items-center rounded-full text-[#a84766] transition hover:bg-[#fbe8ec]"
                >
                  <Trash2 size={16} strokeWidth={1.8} aria-hidden="true" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 rounded-3xl border border-[#f0e4e3] bg-[#fff8f8] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-bold text-[#69595d]">
            {catalogAvailable ? "جمع کل" : "جمع تقریبی"}
          </span>
          <strong className="text-xl font-black text-[#553d44] sm:text-2xl">
            {formatMoney(subtotal)}
          </strong>
        </div>
        <p className="mt-3 text-xs leading-6 text-[#817477]">
          {catalogAvailable
            ? "با ادامه، اطلاعات ارسال را وارد می‌کنی و سفارش ثبت می‌شود."
            : "این مبلغ بر اساس داده‌های ذخیره‌شده است و تا به‌روزرسانی اطلاعات محصولات قطعی نیست."}
        </p>
        {catalogAvailable ? (
          <Link
            href="/checkout"
            className="mt-5 flex w-full items-center justify-center rounded-full bg-[#c65f7d] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#a84766]"
          >
            ادامه پرداخت
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="mt-5 w-full cursor-not-allowed rounded-full bg-[#c65f7d]/70 px-6 py-3.5 text-sm font-bold text-white opacity-80"
            title="تا دریافت اطلاعات به‌روز محصولات، تسویه حساب ممکن نیست"
          >
            ادامه پرداخت (نیاز به اتصال)
          </button>
        )}
        <Link
          href="/products"
          className="mt-3 block text-center text-sm font-bold text-[#a84766] hover:text-[#81364f]"
        >
          ادامه خرید محصولات
        </Link>
      </div>
    </div>
  );
}
