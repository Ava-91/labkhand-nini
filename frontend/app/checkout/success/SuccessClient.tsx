"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

import { formatMoney } from "@/lib/cart";
import { useCart } from "../../components/CartProvider";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const { clearCart, isReady } = useCart();

  const orderCode = searchParams.get("code")?.trim() || "";
  const totalRaw = searchParams.get("total");
  const total = totalRaw ? Number(totalRaw) : NaN;
  const hasValidOrder = orderCode.length > 0;

  // Only clear the cart when this page is the result of a real placed order
  useEffect(() => {
    if (isReady && hasValidOrder) {
      clearCart();
    }
  }, [isReady, hasValidOrder, clearCart]);

  if (!hasValidOrder) {
    return (
      <div className="mx-auto min-h-[50vh] w-full max-w-lg px-5 py-16 text-center sm:px-8">
        <h1 className="text-2xl font-black text-[#443a3c]">سفارشی پیدا نشد</h1>
        <p className="mt-3 text-sm leading-7 text-[#817477]">
          این صفحه فقط بعد از ثبت موفق سفارش نمایش داده می‌شود.
        </p>
        <Link
          href="/cart"
          className="mt-8 inline-flex rounded-full bg-[#c65f7d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#a84766]"
        >
          بازگشت به سبد خرید
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[50vh] w-full max-w-lg px-5 py-16 text-center sm:px-8">
      <CheckCircle2
        className="mx-auto text-[#367557]"
        size={56}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h1 className="mt-5 text-2xl font-black text-[#443a3c]">سفارش ثبت شد</h1>
      <p className="mt-3 text-sm leading-7 text-[#817477]">
        سفارش شما با موفقیت ثبت شد و در وضعیت «در انتظار» قرار گرفت. به‌زودی با شما
        تماس می‌گیریم.
      </p>

      <p className="mt-6 rounded-2xl border border-[#f0e4e3] bg-white px-4 py-3 text-sm">
        <span className="text-[#817477]">کد سفارش: </span>
        <strong className="font-extrabold tracking-wide text-[#553d44]" dir="ltr">
          {orderCode}
        </strong>
      </p>

      {Number.isFinite(total) && total >= 0 && (
        <p className="mt-3 text-sm font-bold text-[#553d44]">
          مبلغ: {formatMoney(total)}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/products"
          className="inline-flex justify-center rounded-full bg-[#c65f7d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#a84766]"
        >
          ادامه خرید
        </Link>
        <Link
          href="/"
          className="inline-flex justify-center rounded-full border border-[#e9cbd3] px-6 py-3 text-sm font-bold text-[#a84766] transition hover:bg-[#fff0f3]"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
