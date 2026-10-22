import Link from "next/link"; // کامپوننت لینک‌دهی در Next.js

import CategoryTiles from "./components/CategoryTiles"; // نمایش دسته‌بندی‌ها
import ClosingCTA from "./components/ClosingCTA"; // بخش دعوت به اقدام پایانی
import HeroSection from "./components/HeroSection"; // بخش اصلی بالای صفحه
import ProductCatalog from "./components/ProductCatalog"; // نمایش کاتالوگ محصولات
import PromiseSection from "./components/PromiseSection"; // نمایش مزایا و تعهدات فروشگاه
import { getProducts } from "@/lib/products"; // دریافت محصولات
import { getSiteSettings } from "@/lib/site-settings"; // دریافت تنظیمات سایت

// کامپوننت اصلی صفحه خانه
export default async function HomePage() {
  // دریافت محصولات و تنظیمات به‌صورت هم‌زمان
  const [products, settings] = await Promise.all([
    getProducts(),
    getSiteSettings(),
  ]);

  // انتخاب محصولاتی که به‌عنوان ویژه علامت‌گذاری شده‌اند
  const featuredProducts = products.filter((product) => product.featured);

  // اگر محصول ویژه‌ای نبود، همه محصولات را برای نمایش انتخاب کن
  const productsToShow = featuredProducts.length > 0 ? featuredProducts : products;

  return (
    // محتوای اصلی صفحه خانه
    <main>
      {/* نمایش بخش معرفی اصلی سایت */}
      <HeroSection settings={settings} />

      {/* نمایش دسته‌بندی‌های محصولات */}
      <CategoryTiles settings={settings} />

      {/* ظرف بخش محصولات با عرض محدود و فاصله کناری */}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* اگر محصولی برای نمایش وجود داشت، کاتالوگ را نشان بده */}
        {productsToShow.length > 0 ? (
          <ProductCatalog
            products={productsToShow} // ارسال محصولات انتخاب‌شده
            title={settings.featuredTitle} // عنوان بخش محصولات
            description={settings.featuredDescription} // توضیحات بخش محصولات
            eyebrow={settings.catalogEyebrow} // متن کوچک بالای عنوان
            searchPlaceholder={settings.catalogSearchPlaceholder} // متن راهنمای جست‌وجو
            emptyTitle={settings.catalogEmptyTitle} // عنوان حالت بدون نتیجه
            emptyDescription={settings.catalogEmptyDescription} // توضیح حالت بدون نتیجه
            limit={4} // نمایش حداکثر چهار محصول
          />
        ) : (
          // اگر محصولی نبود، پیام خالی بودن فروشگاه را نمایش بده
          <section className="my-10 rounded-3xl border border-dashed border-[#e8c6d1] bg-white p-8 text-center">
            {/* آیکون سبد خرید */}
            <span className="text-5xl" aria-hidden="true">🧺</span>

            {/* عنوان بخش محصولات */}
            <h2 className="mt-4 text-xl font-extrabold text-[#553d44]">
              {settings.featuredTitle}
            </h2>

            {/* راهنمای انتشار محصولات از پنل مدیریت */}
            <p className="mt-2 text-sm leading-7 text-[#817477]">
              هنوز محصولی منتشر نشده. محصولات را از پنل مدیریت Strapi منتشر کنید.
            </p>

            {/* لینک رفتن به صفحه فروشگاه */}
            <Link
              className="mt-5 inline-flex rounded-full bg-[#c65f7d] px-5 py-3 text-sm font-bold text-white hover:bg-[#a84766]"
              href="/products"
            >
              دیدن فروشگاه
            </Link>
          </section>
        )}
      </div>

      {/* نمایش بخش مزایا و تعهدات فروشگاه */}
      <PromiseSection settings={settings} />

      {/* ظرف بخش دعوت به اقدام پایانی */}
      <div className="px-5 sm:px-8">
        <ClosingCTA settings={settings} />
      </div>
    </main>
  );
}