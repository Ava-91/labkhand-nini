import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, House, ShoppingBag } from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getProducts } from "@/lib/products";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const products = await getProducts();
  const name = session.user.name?.trim() || "دوست عزیز";

  return (
    <main dir="rtl" className="mx-auto min-h-[65vh] max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <nav className="mb-8 flex gap-2 text-sm text-[#8b777b]" aria-label="مسیر صفحه">
        <Link href="/" className="hover:text-[#a84766]">خانه</Link>
        <span>/</span>
        <span className="font-bold text-[#553d44]">حساب من</span>
      </nav>

      <section className="flex flex-col gap-6 rounded-3xl border border-[#f0e3df] bg-[#fbf5ef] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div className="max-w-xl">
          <h1 className="text-3xl font-black leading-relaxed text-[#443a3c] sm:text-4xl">
            سلام {name}!
          </h1>
          <p className="mt-3 text-sm leading-8 text-[#817477] sm:text-base">
            خوش اومدی به لبخند نینی؛ محصولات رو ببین و انتخاب بعدیت رو پیدا کن.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#a84766] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#883951]"
          >
            گشتن بین محصولات
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="rounded-2xl bg-white/80 p-5 sm:min-w-56">
          <p className="font-bold text-[#553d44]">{name}</p>
          {session.user.email && (
            <p dir="ltr" className="mt-1 break-all text-xs text-[#8b777b]">
              {session.user.email}
            </p>
          )}
          <p className="mt-3 text-xs font-bold text-[#367557]">● واردشده به حساب</p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/products"
          className="group flex items-center gap-4 rounded-3xl border border-[#f0e4e3] bg-white p-5 transition hover:border-[#e4bdc8] hover:shadow-sm sm:p-6"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#fff0f3] text-[#a84766]">
            <ShoppingBag size={22} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block font-black text-[#443a3c]">فروشگاه لبخند نینی</strong>
            <span className="mt-1 block text-sm text-[#817477]">
              دیدن {new Intl.NumberFormat("fa-IR").format(products.length)} محصول قابل مشاهده
            </span>
          </span>
          <ArrowUpLeft size={18} className="text-[#b7a4a7] group-hover:text-[#a84766]" aria-hidden="true" />
        </Link>

        <Link
          href="/"
          className="group flex items-center gap-4 rounded-3xl border border-[#f0e4e3] bg-white p-5 transition hover:border-[#e4bdc8] hover:shadow-sm sm:p-6"
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f5f0fa] text-[#786091]">
            <House size={22} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block font-black text-[#443a3c]">صفحه اصلی</strong>
            <span className="mt-1 block text-sm text-[#817477]">برگشت به خانه لبخند نینی</span>
          </span>
          <ArrowUpLeft size={18} className="text-[#b7a4a7] group-hover:text-[#a84766]" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
