"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { FormEvent, useState } from "react";

import {
  formatMoney,
  getCartItemLineTotal,
  getCartItemUnitPrice,
} from "@/lib/cart";
import { placeOrder, validateCheckoutForm } from "@/lib/orders";
import { useCart } from "../components/CartProvider";

export default function CheckoutClient() {
  const router = useRouter();
  const { items, itemCount, subtotal, isReady, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isReady) {
    return (
      <div className="mx-auto min-h-[50vh] w-full max-w-5xl px-5 py-16 text-center sm:px-8">
        <p className="text-sm text-[#817477]">در حال بارگذاری...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto min-h-[50vh] w-full max-w-5xl px-5 py-16 text-center sm:px-8">
        <ShoppingBag
          className="mx-auto text-[#c65f7d]"
          size={52}
          strokeWidth={1.4}
          aria-hidden="true"
        />
        <h1 className="mt-5 text-2xl font-black text-[#443a3c]">سبد خرید خالی است</h1>
        <p className="mt-3 text-sm leading-7 text-[#817477]">
          برای تسویه حساب ابتدا محصولی به سبد اضافه کن.
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = { customerName, phone, address, notes };
    const validationError = validateCheckoutForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const result = await placeOrder(form, items);
      clearCart();
      router.push(
        "/checkout/success?code=" +
          encodeURIComponent(result.orderCode) +
          "&total=" +
          encodeURIComponent(String(result.subtotal)),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ثبت سفارش ناموفق بود. لطفاً دوباره تلاش کن.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <nav
        className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#817477]"
        aria-label="مسیر صفحه"
      >
        <Link href="/" className="transition hover:text-[#a84766]">
          خانه
        </Link>
        <span>/</span>
        <Link href="/cart" className="transition hover:text-[#a84766]">
          سبد خرید
        </Link>
        <span>/</span>
        <span className="font-semibold text-[#443a3c]">تسویه حساب</span>
      </nav>

      <h1 className="text-2xl font-black text-[#443a3c] sm:text-3xl">تسویه حساب</h1>
      <p className="mt-2 text-sm text-[#817477]">
        {new Intl.NumberFormat("fa-IR").format(itemCount)} کالا · جمع{" "}
        {formatMoney(subtotal)}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-[#f0e4e3] bg-white p-5 shadow-sm sm:p-6"
          noValidate
        >
          <h2 className="text-lg font-extrabold text-[#553d44]">اطلاعات ارسال</h2>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-[#553d44]">نام و نام خانوادگی</span>
            <input
              type="text"
              name="customerName"
              autoComplete="name"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-2xl border border-[#f0e4e3] bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-[#c65f7d]"
              placeholder="مثلاً سارا محمدی"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-[#553d44]">شماره موبایل</span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-[#f0e4e3] bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-[#c65f7d]"
              placeholder="۰۹۱۲۱۲۳۴۵۶۷"
              dir="ltr"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-[#553d44]">آدرس ارسال</span>
            <textarea
              name="address"
              required
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full resize-y rounded-2xl border border-[#f0e4e3] bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-[#c65f7d]"
              placeholder="استان، شهر، خیابان، پلاک، واحد"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-[#553d44]">
              توضیحات (اختیاری)
            </span>
            <textarea
              name="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-y rounded-2xl border border-[#f0e4e3] bg-[#fffaf6] px-4 py-3 text-sm outline-none focus:border-[#c65f7d]"
              placeholder="ساعت تماس، راهنمای پلاک، و..."
            />
          </label>

          <div className="rounded-2xl border border-dashed border-[#e9cbd3] bg-[#fff8f8] p-4 text-xs leading-6 text-[#817477]">
            پرداخت به‌صورت شبیه‌سازی‌شده ثبت می‌شود و سفارش با وضعیت «در انتظار»
            در پنل مدیریت ذخیره می‌گردد. در نسخه بعدی می‌توان درگاه واقعی متصل کرد.
          </div>

          {error && (
            <p
              className="rounded-2xl border border-[#e8c6d1] bg-[#fff0f3] px-4 py-3 text-sm font-bold text-[#a84766]"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#c65f7d] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#a84766] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "در حال ثبت سفارش..." : "ثبت سفارش و پرداخت شبیه‌سازی‌شده"}
          </button>

          <Link
            href="/cart"
            className="block text-center text-sm font-bold text-[#a84766] hover:text-[#81364f]"
          >
            بازگشت به سبد خرید
          </Link>
        </form>

        <aside className="h-fit rounded-3xl border border-[#f0e4e3] bg-[#fff8f8] p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-[#553d44]">خلاصه سفارش</h2>

          <ul className="mt-4 space-y-4">
            {items.map((item) => {
              const unitPrice = getCartItemUnitPrice(item);
              const lineTotal = getCartItemLineTotal(item);

              return (
                <li
                  key={item.productId}
                  className="flex gap-3 border-b border-[#f0e4e3] pb-4 last:border-0 last:pb-0"
                >
                  <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl" aria-hidden="true">
                        {item.emoji}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#443a3c]">{item.title}</p>
                    <p className="mt-1 text-xs text-[#817477]">
                      {new Intl.NumberFormat("fa-IR").format(item.quantity)} ×{" "}
                      {formatMoney(unitPrice)}
                    </p>
                  </div>
                  <strong className="shrink-0 text-sm font-extrabold text-[#553d44]">
                    {formatMoney(lineTotal)}
                  </strong>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-[#f0e4e3] pt-4">
            <span className="text-sm font-bold text-[#69595d]">مبلغ قابل پرداخت</span>
            <strong className="text-xl font-black text-[#553d44]">
              {formatMoney(subtotal)}
            </strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
