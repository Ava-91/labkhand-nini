import Link from "next/link"; // برای ساخت لینک داخلی سایت
import { ArrowLeft } from "lucide-react"; // آیکون هدایت به فروشگاه

import type { SiteSettings } from "@/lib/site-settings"; // وارد کردن نوع تنظیمات سایت

// نمایش بخش پایانی صفحه برای دعوت کاربر به خرید
export default function ClosingCTA({ settings }: { settings: SiteSettings }) {
  return (
    <section
      className="mx-auto my-12 flex w-full max-w-6xl flex-col gap-6 rounded-[2rem] bg-gradient-to-l from-[#fff0f3] to-[#f5effb] px-6 py-10 sm:my-16 sm:px-10 md:flex-row md:items-center md:justify-between"
      // ساخت بخش واکنش‌گرا با پس‌زمینه گرادیانی و گوشه‌های گرد
    >
      <div>
        <span className="text-xs font-extrabold text-[#a84766]">
          {settings.closingEyebrow} {/* نمایش متن کوچک بالای عنوان */}
        </span>

        <h2 className="mt-2 text-2xl font-black text-[#443a3c] sm:text-3xl">
          {settings.closingTitle} {/* نمایش عنوان اصلی */}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#817477]">
          {settings.closingDescription} {/* نمایش توضیحات بخش */}
        </p>
      </div>

      <Link
        href="/products" // هدایت کاربر به صفحه محصولات
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#c65f7d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#a84766]"
        // طراحی دکمه با تغییر رنگ هنگام هاور
      >
        {settings.closingCtaText} {/* متن دکمه دعوت به خرید */}
        <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" />
      </Link>
    </section>
  );
}