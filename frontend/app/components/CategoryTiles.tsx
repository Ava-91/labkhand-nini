import Link from "next/link"; // برای ساخت لینک‌های داخلی سایت

import type { SiteSettings } from "@/lib/site-settings"; // وارد کردن نوع تنظیمات سایت

// نمایش دسته‌بندی محصولات با استفاده از تنظیمات سایت
export default function CategoryTiles({ settings }: { settings: SiteSettings }) {
  return (
    <section
      className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 px-5 py-10 sm:px-8 md:grid-cols-3 lg:grid-cols-6"
      // ساخت گرید واکنش‌گرا با تعداد ستون‌های متفاوت در اندازه‌های مختلف
      aria-label="دسته‌بندی محصولات" // معرفی بخش برای ابزارهای دسترس‌پذیری
    >
      {settings.categoryTiles.map((tile) => ( // پیمایش تمام دسته‌بندی‌ها
        <Link
          href={tile.href} // آدرس صفحه دسته‌بندی
          key={tile.title} // شناسه یکتا برای هر آیتم
          className="group flex flex-col items-center rounded-3xl border border-[#f0e4e3] bg-white px-4 py-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#e8c6d1] hover:shadow-md"
          // استایل کارت و افکت هنگام قرار گرفتن موس
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f3] text-2xl transition group-hover:scale-105">
            {tile.emoji} {/* نمایش ایموجی دسته‌بندی */}
          </span>

          <strong className="mt-3 text-sm text-[#553d44]">
            {tile.title} {/* نمایش عنوان دسته‌بندی */}
          </strong>

          <small className="mt-1 text-xs leading-6 text-[#817477]">
            {tile.description} {/* نمایش توضیحات دسته‌بندی */}
          </small>
        </Link>
      ))}
    </section>
  );
}