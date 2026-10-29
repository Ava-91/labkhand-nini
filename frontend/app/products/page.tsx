import type { Metadata } from "next"; // نوع اطلاعات متادیتای صفحه

import ProductCatalog from "../components/ProductCatalog"; // کامپوننت نمایش محصولات
import { getProducts } from "@/lib/products"; // دریافت لیست محصولات
import { getSiteSettings } from "@/lib/site-settings"; // دریافت تنظیمات سایت

// تولید عنوان و توضیحات متادیتای صفحه
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings(); // دریافت تنظیمات سایت

  return {
    title: settings.productsPageTitle, // عنوان صفحه
    description: settings.productsPageDescription, // توضیحات صفحه
  };
}

// کامپوننت اصلی صفحه محصولات
export default async function ProductsPage({\n  searchParams,\n}: {\n  searchParams: Promise<{ q?: string }>;\n}) {
  // دریافت محصولات و تنظیمات به‌صورت هم‌زمان
  const [products, settings] = await Promise.all([
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
        searchPlaceholder={settings.catalogSearchPlaceholder} // متن راهنمای جست‌وجو
        emptyTitle={settings.catalogEmptyTitle} // عنوان حالت بدون نتیجه
        emptyDescription={settings.catalogEmptyDescription} // توضیح حالت بدون نتیجه
      />
    </main>
  );
}