import Link from "next/link"; // ساخت لینک‌های داخلی سایت

import { auth } from "@/auth"; // بررسی وضعیت ورود کاربر
import type { SiteSettings } from "@/lib/site-settings"; // نوع تنظیمات سایت
import LogoutButton from "./LogoutButton"; // کامپوننت دکمه خروج

// ساخت نوار ناوبری به‌صورت async برای دریافت سشن کاربر
export default async function Navbar({
  settings, // دریافت تنظیمات سایت
}: {
  settings: SiteSettings; // تعیین نوع تنظیمات
}) {
  const session = await auth(); // دریافت اطلاعات نشست کاربر

  return (
    <header className="relative z-20 border-b border-[#f0e4e3] bg-[#fffaf6]">
      {/* هدر اصلی با پس‌زمینه روشن و حاشیه پایین */}

      {settings.announcement && ( // اگر پیام اطلاع‌رسانی وجود داشت
        <p className="bg-[#f5dfe6] px-4 py-2 text-center text-xs text-[#875366]">
          {settings.announcement} {/* نمایش پیام اطلاع‌رسانی */}
        </p>
      )}

      <nav
        className="mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8"
        // چیدمان افقی و واکنش‌گرای نوار ناوبری
        aria-label="ناوبری اصلی" // معرفی منو برای دسترس‌پذیری
      >
        <Link
          className="flex shrink-0 items-center gap-3"
          href="/" // رفتن به صفحه اصلی
          aria-label={settings.brandName + "، صفحه اصلی"} // توضیح لینک برای ابزارهای دسترس‌پذیری
        >
          {settings.logo ? ( // اگر لوگو تنظیم شده باشد
            <img
              className="h-11 w-11 rounded-2xl object-cover"
              src={settings.logo} // آدرس تصویر لوگو
              alt="" // لوگو تزئینی در نظر گرفته شده است
            />
          ) : (
            <span className="grid h-11 w-11 place-items-center rounded-2xl rounded-bl-md bg-[#c65f7d] text-xl font-bold text-white">
              {settings.brandName.slice(0, 1)} {/* نمایش حرف اول نام برند به‌جای لوگو */}
            </span>
          )}

          <span className="flex flex-col leading-snug">
            <strong className="text-base font-extrabold text-[#553d44]">
              {settings.brandName} {/* نمایش نام برند */}
            </strong>
            <small className="text-[10px] text-[#817477]">
              {settings.brandTagline} {/* نمایش شعار برند */}
            </small>
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-[#69595d] md:flex">
          {/* نمایش لینک‌های اصلی در صفحه‌های متوسط و بزرگ */}

          {settings.navLinks.map((item) => ( // پیمایش لینک‌های منو
            <Link
              href={item.href} // آدرس مقصد لینک
              key={item.href + item.label} // کلید یکتا برای React
              className="transition hover:text-[#a84766]" // تغییر رنگ هنگام هاور
            >
              {item.label} {/* متن لینک */}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 text-sm md:flex">
          {/* نمایش گزینه‌های حساب کاربری در صفحه‌های بزرگ‌تر */}

          {session ? ( // اگر کاربر وارد شده باشد
            <>
              <Link
                className="rounded-full border border-[#f0e4e3] bg-white px-4 py-2 font-semibold transition hover:border-[#c65f7d]"
                href="/dashboard" // رفتن به پنل کاربر
              >
                حساب من
              </Link>
              <LogoutButton /> {/* نمایش دکمه خروج */}
            </>
          ) : ( // اگر کاربر وارد نشده باشد
            <>
              <Link className="px-2 py-2 hover:text-[#a84766]" href="/login">
                ورود {/* لینک صفحه ورود */}
              </Link>
              <Link
                className="rounded-full bg-[#c65f7d] px-5 py-2.5 font-bold text-white shadow-sm transition hover:bg-[#a84766]"
                href="/register" // رفتن به صفحه ثبت‌نام
              >
                عضویت
              </Link>
            </>
          )}
        </div>

        <details className="relative md:hidden">
          {/* منوی بازشونده مخصوص موبایل */}

          <summary className="cursor-pointer list-none rounded-xl border border-[#f0e4e3] bg-white px-3 py-2 text-xl">
            <span aria-hidden="true">☰</span> {/* آیکون منو */}
            <span className="sr-only">باز کردن منو</span> {/* متن مخصوص صفحه‌خوان */}
          </summary>

          <div className="absolute left-0 top-12 flex min-w-44 flex-col gap-1 rounded-2xl border border-[#f0e4e3] bg-white p-3 shadow-xl">
            {/* محتوای منوی موبایل */}

            {settings.navLinks.map((item) => ( // نمایش لینک‌های منو در موبایل
              <Link
                href={item.href} // آدرس مقصد
                key={"mobile-" + item.href + item.label} // کلید یکتا برای آیتم موبایل
                className="rounded-xl px-3 py-2 text-sm hover:bg-[#fff0f3]"
              >
                {item.label} {/* متن لینک */}
              </Link>
            ))}

            {session ? ( // اگر کاربر وارد شده باشد
              <>
                <Link
                  className="rounded-xl px-3 py-2 text-sm hover:bg-[#fff0f3]"
                  href="/dashboard" // لینک پنل کاربری
                >
                  حساب من
                </Link>
                <LogoutButton /> {/* دکمه خروج در موبایل */}
              </>
            ) : ( // اگر کاربر وارد نشده باشد
              <>
                <Link
                  className="rounded-xl px-3 py-2 text-sm hover:bg-[#fff0f3]"
                  href="/login" // لینک ورود
                >
                  ورود
                </Link>
                <Link
                  className="rounded-xl px-3 py-2 text-sm hover:bg-[#fff0f3]"
                  href="/register" // لینک ثبت‌نام
                >
                  ثبت‌نام
                </Link>
              </>
            )}
          </div>
        </details>
      </nav>
    </header>
  );
}