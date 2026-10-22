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
export default async function ProductsPage() {
  // دریافت محصولات و تنظیمات به‌صورت هم‌زمان
  const [products, settings] = await Promise.all([
    getProducts(),
    getSiteSettings(),
  ]);

  return (
    // ظرف اصلی صفحه با عرض و فاصله‌های واکنش‌گرا
    <main className="mx-auto min-h-[60vh] w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-2xl">
        {/* متن کوچک بالای عنوان */}
        <span className="text-xs font-extrabold text-[#a84766]">
          {settings.productsPageEyebrow}
        </span>

        {/* عنوان اصلی صفحه */}
        <h1 className="mt-3 text-3xl font-black text-[#443a3c] sm:text-4xl">
          {settings.productsPageTitle}
        </h1>

        {/* توضیحات صفحه محصولات */}
        <p className="mt-3 text-sm leading-8 text-[#817477]">
          {settings.productsPageDescription}
        </p>
      </div>

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