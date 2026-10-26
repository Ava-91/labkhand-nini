import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  House,
  Package,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getProducts } from "@/lib/products";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const products = await getProducts();
  const name = session.user.name?.trim() || "دوست عزیز";
  const initial = name === "دوست عزیز" ? "♡" : name.charAt(0);

  return (
    <main
      dir="rtl"
      className="mx-auto min-h-[65vh] w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12"
    >
      <div className="mb-8 flex items-center gap-2 text-sm text-[#8b777b]">
        <Link href="/" className="transition hover:text-[#a84766]">
          خانه
        </Link>
        <span>/</span>
        <span className="font-bold text-[#553d44]">حساب من</span>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-[#f0e3df] bg-[#fbf5ef] p-6 sm:p-10">
        <div className="relative z-10 flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-extrabold text-[#a84766]">
              <Sparkles size={14} aria-hidden="true" />
              فضای کوچولوی تو
            </span>
            <h1 className="mt-5 text-3xl leading-relaxed font-black text-[#443a3c] sm:text-4xl">
              سلام {name}!
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-8 text-[#817477] sm:text-base">
              خوش اومدی به لبخند نینی؛ اینجا می‌تونی گشتی توی محصولات بزنی و
              انتخاب بعدیت رو پیدا کنی.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#a84766] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#883951]"
            >
              گشتن بین محصولات
              <ArrowLeft size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-white/80 bg-white/75 p-4 sm:min-w-60 sm:flex-col sm:items-center sm:justify-center sm:px-8 sm:py-7">
            <div className="grid size-16 shrink-0 place-items-center rounded-full bg-[#f8e5e8] text-2xl font-black text-[#a84766]">
              {initial}
            </div>
            <div className="min-w-0 sm:text-center">
              <p className="font-extrabold text-[#553d44]">{name}</p>
              {session.user.email && (
                <p dir="ltr" className="mt-1 break-all text-xs text-[#8b777b]">
                  {session.user.email}
                </p>
              )}
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#367557]">
                <span className="size-1.5 rounded-full bg-[#4a936b]" />
                واردشده به حساب
              </span>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-10 size-48 rounded-full border-[24px] border-white/35"
        />
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/products"
          className="group flex items-center gap-4 rounded-3xl border border-[#f0e4e3] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#e4bdc8] hover:shadow-sm sm:p-6"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#fff0f3] text-[#a84766]">
            <ShoppingBag size={22} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block text-base font-black text-[#443a3c]">
              فروشگاه لبخند نینی
            </strong>
            <span className="mt-1 block text-sm leading-6 text-[#817477]">
              دیدن {new Intl.NumberFormat("fa-IR").format(products.length)} محصول قابل مشاهده
            </span>
          </span>
          <ArrowUpLeft
            size={18}
            className="shrink-0 text-[#b7a4a7] transition group-hover:text-[#a84766]"
            aria-hidden="true"
          />
        </Link>

        <Link
          href="/"
          className="group flex items-center gap-4 rounded-3xl border border-[#f0e4e3] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#e4bdc8] hover:shadow-sm sm:p-6"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f5f0fa] text-[#786091]">
            <House size={22} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block text-base font-black text-[#443a3c]">
              صفحه اصلی
            </strong>
            <span className="mt-1 block text-sm leading-6 text-[#817477]">
              برگشت به خانه لبخند نینی
            </span>
          </span>
          <ArrowUpLeft
            size={18}
            className="shrink-0 text-[#b7a4a7] transition group-hover:text-[#a84766]"
            aria-hidden="true"
          />
        </Link>
      </section>

      <section className="mt-8 flex flex-col gap-3 rounded-3xl bg-[#fff9f7] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#a84766]">
            <UserRound size={19} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-extrabold text-[#553d44]">حساب کاربری تو</h2>
            <p className="mt-1 text-sm leading-6 text-[#817477]">
              با حساب خودت وارد شدی؛ هر وقت آماده بودی، می‌تونی دوباره به فروشگاه سر بزنی.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#eadbd7] bg-white px-4 py-2 text-sm font-bold text-[#6b555a] sm:self-center">
          <Package size={16} aria-hidden="true" />
          حساب فعال
        </div>
      </section>
    </main>
  );
}
