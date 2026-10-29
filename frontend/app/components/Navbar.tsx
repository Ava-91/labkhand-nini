import Link from "next/link"; // ساخت لینک‌های داخلی سایت
import { Menu, Search } from "lucide-react"; // آیکون‌های منو و جست‌وجو

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
        className="mx-auto flex min-h-20 w-full max-w-6xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-8"
        // چیدمان افقی و واکنش‌گرای نوار ناوبری
        aria-label="ناوبری اصلی" // معرفی منو برای دسترس‌پذیری
      >
        <Link
          className="flex shrink-0 items-center gap-2 sm:gap-3"
          href="/" // رفتن به صفحه اصلی
          aria-label={settings.brandName + "، صفحه اصلی"} // توضیح لینک برای ابزارهای دسترس‌پذیری
        >
          {settings.logo ? ( // اگر لوگو تنظیم شده باشد
            <img
              className="h-9 w-9 rounded-2xl object-cover sm:h-11 sm:w-11"
              src={settings.logo} // آدرس تصویر لوگو
              alt="" // لوگو تزئینی در نظر گرفته شده است
            />
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-2xl rounded-bl-md bg-[#c65f7d] text-lg font-bold text-white sm:h-11 sm:w-11 sm:text-xl">
              {settings.brandName.slice(0, 1)} {/* نمایش حرف اول نام برند به‌جای لوگو */}
            </span>
          )}

          <span className="flex flex-col leading-snug">
            <strong className="text-sm font-extrabold text-[#553d44] sm:text-base">
              {settings.brandName} {/* نمایش نام برند */}
            </strong>
            <small className="hidden text-[10px] text-[#817477] sm:block">
              {settings.brandTagline} {/* نمایش شعار برند */}
            </small>
          </span>
        </Link>

        <div className="hidden shrink-0 items-center gap-5 text-sm text-[#69595d] lg:flex">
          {/* نمایش لینک‌های اصلی در صفحه‌های بزرگ */}

          {settings.navLinks.map((item) => ( // پیمایش لینک‌های منو
            <Link
              href={item.href} // آدرس مقصد لینک
              key={item.href + item.label} // کلید یکتا برای React
              className="whitespace-nowrap transition hover:text-[#a84766]" // تغییر رنگ هنگام هاور
            >
              {item.label} {/* متن لینک */}
            </Link>
          ))}
        </div>

        <form
          action="/products"
          method="get"
          role="search"
          className="mx-auto flex min-w-0 max-w-md flex-1"
        >
          <label className="flex min-w-0 w-full items-center gap-2 rounded-full border border-[#ead9dc] bg-white px-3 py-2 transition focus-within:border-[#c65f7d] focus-within:ring-2 focus-within:ring-[#c65f7d]/10 sm:gap-3 sm:px-4">
            <Search
              className="shrink-0 text-[#a84766]"
              size={18}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              placeholder="جست‌وجوی محصولات..."
              aria-label="جست‌وجوی محصولات"
              className="min-w-0 w-full bg-transparent text-xs text-[#553d44] outline-none placeholder:text-[#a49a9c] sm:text-sm"
            />
            <button
              type="submit"
              aria-label="جست‌وجو"
              className="shrink-0 rounded-full bg-[#c65f7d] p-2 text-white transition hover:bg-[#a84766] sm:px-4 sm:py-2 sm:text-xs sm:font-bold"
            >
              <Search className="sm:hidden" size={15} aria-hidden="true" />
              <span className="hidden sm:inline">جست‌وجو</span>
            </button>
          </label>
        </form>

        <div className="hidden shrink-0 items-center gap-3 text-sm md:flex">
          {/* نمایش گزینه‌های حساب کاربری در صفحه‌های متوسط و بزرگ‌تر */}

          {session ? ( // اگر کاربر وارد شده باشد
            <>
              <Link
                className="whitespace-nowrap rounded-full border border-[#f0e4e3] bg-white px-4 py-2 font-semibold transition hover:border-[#c65f7d]"
                href="/dashboard" // رفتن به پنل کاربر
              >
                حساب من
              </Link>
              <LogoutButton /> {/* نمایش دکمه خروج */}
            </>
          ) : ( // اگر کاربر وارد نشده باشد
            <>
              <Link className="whitespace-nowrap px-2 py-2 hover:text-[#a84766]" href="/login">
                ورود {/* لینک صفحه ورود */}
              </Link>
              <Link
                className="whitespace-nowrap rounded-full bg-[#c65f7d] px-4 py-2.5 font-bold text-white shadow-sm transition hover:bg-[#a84766] sm:px-5"
                href="/register" // رفتن به صفحه ثبت‌نام
              >
                عضویت
              </Link>
            </>
          )}
        </div>

        <details className="relative shrink-0 md:hidden">
          {/* منوی بازشونده مخصوص موبایل */}

          <summary className="cursor-pointer list-none rounded-xl border border-[#f0e4e3] bg-white p-2 text-xl">
            <Menu aria-hidden="true" size={21} strokeWidth={1.8} /> {/* آیکون منو */}
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