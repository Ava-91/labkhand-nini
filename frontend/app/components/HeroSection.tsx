import Link from "next/link"; // برای ساخت لینک‌های داخلی سایت

import type { SiteSettings } from "@/lib/site-settings"; // وارد کردن نوع تنظیمات سایت

// ساخت بخش اصلی و ابتدایی صفحه (Hero)
export default function HeroSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="overflow-hidden bg-linear-to-br from-[#fff8f2] via-[#fff0f1] to-[#f5effb]">
      {/* پس‌زمینه گرادیانی و مخفی کردن محتوای بیرون‌زده */}

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-12 sm:px-8 md:min-h-117.5 md:grid-cols-2 md:py-16">
        {/* چیدمان دو ستونه در دسکتاپ و تک‌ستونه در موبایل */}

        <div>
          <span className="inline-flex rounded-full border border-[#f4dfe6] bg-white px-4 py-2 text-xs font-extrabold text-[#a84766]">
            {settings.heroKicker} {/* متن کوچک بالای عنوان */}
          </span>

          <h1 className="mt-5 text-4xl leading-relaxed font-black tracking-tight text-[#443a3c] sm:text-5xl">
            {settings.heroTitle} {/* عنوان اصلی صفحه */}
            <br /> {/* رفتن به خط بعد */}
            <span className="text-[#c65f7d]">
              {settings.heroAccent} {/* نمایش بخش رنگی عنوان */}
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-8 text-[#7e6e72] sm:text-base">
            {settings.heroDescription} {/* توضیحات اصلی صفحه */}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {/* گروه دکمه‌های هدایت کاربر */}

            <Link
              href="/products" // رفتن به صفحه محصولات
              className="rounded-full bg-[#c65f7d] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#a84766]"
            >
              {settings.heroPrimaryCta} {/* متن دکمه اصلی */}
            </Link>

            <a
              href="#why-us" // رفتن به بخش دارای شناسه why-us
              className="rounded-full border border-[#e2c6cf] bg-white/80 px-6 py-3 text-sm font-bold text-[#76515e] transition hover:bg-white"
            >
              {settings.heroSecondaryCta} {/* متن دکمه دوم */}
            </a>
          </div>

          <div className="mt-7 flex items-center gap-3">
            {/* بخش نمایش پیام اعتماد مشتری */}

            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-xl text-[#c65f7d]">
              ♡ {/* آیکون قلب */}
            </span>

            <span className="flex flex-col">
              <strong className="text-sm">
                {settings.heroTrustTitle} {/* عنوان پیام اعتماد */}
              </strong>

              <small className="mt-1 text-xs text-[#817477]">
                {settings.heroTrustDescription} {/* توضیحات پیام اعتماد */}
              </small>
            </span>
          </div>
        </div>

        <div
          className="relative mx-auto grid min-h-72 w-full max-w-md place-items-center sm:min-h-96"
          aria-hidden="true" // مخفی کردن تزئینات از ابزارهای دسترس‌پذیری
        >
          <span className="absolute right-8 top-5 text-4xl text-[#d6a263]">
            ✦ {/* ستاره تزئینی */}
          </span>

          <div className="grid aspect-square w-[78%] place-items-center rounded-[48%_52%_45%_55%/49%_43%_57%_51%] border-10px border-white/60 bg-linear-to-br from-[#f9dfe4] via-[#e8e0f4] to-[#e8d4db] shadow-2xl shadow-[#b16d82]/20">
            {/* ساخت شکل مرکزی با گرادیان، حاشیه و سایه */}

            <span className="text-8xl drop-shadow-lg sm:text-9xl">
              🧸 {/* نمایش ایموجی عروسک */}
            </span>
          </div>

          <span className="absolute left-4 top-1/4 rounded-2xl border border-[#f2e2e6] bg-white px-4 py-3 text-xs font-bold shadow-lg">
            ☁️ {settings.heroFloatingTop} {/* برچسب شناور سمت چپ */}
          </span>

          <span className="absolute bottom-8 right-2 rounded-2xl border border-[#f2e2e6] bg-white px-4 py-3 text-xs font-bold shadow-lg">
            🎀 {settings.heroFloatingBottom} {/* برچسب شناور پایین */}
          </span>

          <span className="absolute bottom-10 left-10 text-3xl text-[#c65f7d]">
            ✿ 
          </span>

          <span className="absolute right-8 top-1/3 text-3xl text-[#a89acb]">
            ♡ 
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-5 pb-6 text-xs font-semibold text-[#76515e] sm:px-8 sm:text-sm">
        {/* ردیف پیام‌های کوتاه در پایین بخش اصلی */}

        <span>{settings.heroBottomFirst}</span> {/* پیام اول */}
        <span aria-hidden="true">♡</span> {/* جداکننده قلب */}
        <span>{settings.heroBottomSecond}</span> {/* پیام دوم */}
        <span aria-hidden="true">♡</span> {/* جداکننده قلب */}
        <span>{settings.heroBottomThird}</span> {/* پیام سوم */}
      </div>
    </section>
  );
}