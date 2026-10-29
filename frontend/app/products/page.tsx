import type { Metadata } from "next"; // نوع اطلاعات متادیتای صفحه

import ProductCatalog from "../components/ProductCatalog"; // کامپوننت نمایش محصولات
import { getProducts } from "@/lib/products"; // دریافت لیست محصولات
import { getSiteSettings } from "@/lib/site-settings"; // دریافت تنظیمات سایت

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings(); 

  return {
    title: settings.productsPageTitle,
    description: settings.productsPageDescription,
  };
}

// کامپوننت اصلی صفحه محصولات
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // دریافت محصولات، تنظیمات و عبارت جست‌وجو به‌صورت هم‌زمان
  const [{ q }, products, settings] = await Promise.all([
    searchParams,
    getProducts(),
    getSiteSettings(),
  ]);
  return (
    // ظرف اصلی صفحه با عرض و فاصله‌های واکنش‌گرا
    <main className="mx-auto min-h-[60vh] w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      {/* نمایش فهرست محصولات همراه با تنظیمات کاتالوگ */}
      <ProductCatalog
        products={products} // ارسال لیست محصولات
        title={settings.featuredTitle} // عنوان کاتالوگ
        description={settings.featuredDescription} // توضیحات کاتالوگ
        eyebrow={settings.catalogEyebrow} // متن کوچک بالای کاتالوگ
        initialSearch={q ?? ""} // اعمال عبارت جست‌وجو از نوار بالای سایت
        emptyTitle={settings.catalogEmptyTitle} // عنوان حالت بدون نتیجه
        emptyDescription={settings.catalogEmptyDescription} // توضیح حالت بدون نتیجه
      />
    </main>
  );
}