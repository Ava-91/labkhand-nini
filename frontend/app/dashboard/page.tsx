import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getProducts } from "@/lib/products";

export default async function DashboardPage() {
  const session = await auth();

  // Visitors must sign in before opening their dashboard.
  if (!session?.user) {
    redirect("/login");
  }

  const products = await getProducts();
  const productCount = new Intl.NumberFormat("fa-IR").format(
    products.length,
  );

  return (
    <main className="container dashboard-page">
      <span className="eyebrow">حساب کاربری</span>
      <h1>سلام {session.user.name ?? "دوست عزیز"} 👋</h1>
      <p>
        به لبخند نینی خوش اومدی. محصولات رو ببین و انتخاب بعدیت رو پیدا کن.
      </p>

      <div className="dashboard-summary">
        <div>
          <span>محصولات قابل مشاهده</span>
          <strong>{productCount}</strong>
        </div>
        <div>
          <span>حساب کاربری</span>
          <strong>فعال</strong>
        </div>
      </div>

      <Link
        href="/products"
        className="button button-primary button-large"
      >
        رفتن به فروشگاه ←
      </Link>
    </main>
  );
}
