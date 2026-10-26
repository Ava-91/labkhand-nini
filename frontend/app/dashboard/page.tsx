import Link from "next/link";
import { ArrowLeft, Package, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getProducts } from "@/lib/products";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const products = await getProducts();

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <span className="text-xs font-extrabold text-[#a84766]">حساب کاربری</span>
      <h1 className="mt-3 text-3xl font-black text-[#443a3c] sm:text-4xl">
        سلام {session.user.name ?? "دوست عزیز"} 👋
      </h1>
      <p className="mt-3 text-sm leading-8 text-[#817477]">
        به لبخند نینی خوش اومدی. محصولات رو ببین و انتخاب بعدیت رو پیدا کن.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <section className="rounded-3xl border border-[#f0e4e3] bg-white p-6">
          <span className="inline-flex items-center gap-2 text-sm text-[#817477]"><Package size={16} strokeWidth={1.8} aria-hidden="true" /> محصولات قابل مشاهده</span>
          <strong className="mt-2 block text-3xl font-black text-[#553d44]">
            {new Intl.NumberFormat("fa-IR").format(products.length)}
          </strong>
        </section>
        <section className="rounded-3xl border border-[#f0e4e3] bg-white p-6">
          <span className="inline-flex items-center gap-2 text-sm text-[#817477]"><UserRound size={16} strokeWidth={1.8} aria-hidden="true" /> حساب کاربری</span>
          <strong className="mt-2 block text-3xl font-black text-[#367557]">فعال</strong>
        </section>
      </div>

      <Link
        href="/products"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#c65f7d] px-6 py-3 text-sm font-bold text-white hover:bg-[#a84766]"
      >
        رفتن به فروشگاه <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" />
      </Link>
    </main>
  );
}
