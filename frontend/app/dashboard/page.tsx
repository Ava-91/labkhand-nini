import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getProducts } from "@/lib/products";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const products = await getProducts();
  const productCount = new Intl.NumberFormat("fa-IR").format(products.length);

  return (
    <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-12">
      <span className="font-bold text-rose-700">حساب کاربری</span>
      <h1 className="mt-2 text-3xl font-black">سلام {session.user.name ?? "دوست عزیز"} 👋</h1>
      <p className="mt-3 text-stone-600">به لبخند نینی خوش اومدی. محصولات رو ببین و انتخاب بعدیت رو پیدا کن.</p>

      <div className="my-8 grid max-w-lg gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <span className="text-sm text-stone-500">محصولات قابل مشاهده</span>
          <strong className="mt-2 block text-3xl text-rose-700">{productCount}</strong>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <span className="text-sm text-stone-500">حساب کاربری</span>
          <strong className="mt-2 block text-3xl text-green-700">فعال</strong>
        </div>
      </div>

      <Link className="inline-block rounded-full bg-rose-500 px-6 py-3 font-bold text-white hover:bg-rose-600" href="/products">
        رفتن به فروشگاه ←
      </Link>
    </main>
  );
}
