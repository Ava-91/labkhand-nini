import Link from "next/link"; // برای ساخت لینک‌های داخلی سایت
import { Baby, Gift, Heart, Moon, Shirt, Sparkles } from "lucide-react"; // آیکون‌های دسته‌بندی

import type { SiteSettings } from "@/lib/site-settings"; // وارد کردن نوع تنظیمات سایت

// انتخاب آیکون مناسب برای هر دسته‌بندی
function getCategoryIcon(title: string) {
  const normalizedTitle = title.toLocaleLowerCase("fa");

  if (normalizedTitle.includes("نوزاد") || normalizedTitle.includes("بچه") || normalizedTitle.includes("کودک")) return Baby;
  if (normalizedTitle.includes("لباس") || normalizedTitle.includes("پوشاک")) return Shirt;
  if (normalizedTitle.includes("خواب") || normalizedTitle.includes("استراحت")) return Moon;
  if (normalizedTitle.includes("هدیه") || normalizedTitle.includes("کادو")) return Gift;
  if (normalizedTitle.includes("مراقبت") || normalizedTitle.includes("روزانه")) return Heart;

  return Sparkles;
}

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
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f3] text-[#c65f7d] transition group-hover:scale-105">
            {(() => {
              const Icon = getCategoryIcon(tile.title);
              return <Icon size={24} strokeWidth={1.7} aria-hidden="true" />;
            })()}
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