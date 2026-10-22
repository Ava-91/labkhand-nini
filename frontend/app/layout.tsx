import type { Metadata } from "next"; // نوع اطلاعات متادیتای صفحه
import Link from "next/link"; // کامپوننت لینک‌دهی در Next.js
import localFont from "next/font/local"; // بارگذاری فونت محلی

import Navbar from "./components/Navbar"; // کامپوننت نوار ناوبری
import { getSiteSettings } from "@/lib/site-settings"; // دریافت تنظیمات سایت
import "./globals.css"; // وارد کردن استایل‌های سراسری

// تعریف فونت وزیرمتن با وزن معمولی و ضخیم
const vazirmatn = localFont({
  src: [
    { path: "../assets/fonts/Vazirmatn-Regular(1).woff2", weight: "400" }, // فونت معمولی
    { path: "../assets/fonts/Vazirmatn-Bold.woff2", weight: "700" }, // فونت ضخیم
  ],
  display: "swap", // نمایش متن با فونت جایگزین تا فونت اصلی بارگذاری شود
});

// تولید اطلاعات سئو و متادیتای سایت
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings(); // دریافت تنظیمات سایت

  return {
    title: {
      default: settings.seoTitle || settings.brandName, // عنوان پیش‌فرض صفحه
      template: "%s | " + settings.brandName, // قالب عنوان صفحات داخلی
    },
    description: settings.seoDescription, // توضیحات سئو
    applicationName: settings.brandName, // نام برنامه یا سایت
  };
}

// قالب اصلی تمام صفحات سایت
export default async function RootLayout({
  children, // محتوای صفحه فعلی
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings(); // دریافت تنظیمات سایت

  return (
    // تنظیم زبان فارسی و جهت راست‌به‌چپ
    <html lang="fa" dir="rtl">
      {/* اعمال فونت، رنگ پس‌زمینه و استایل کلی صفحه */}
      <body className={`${vazirmatn.className} min-h-screen bg-[#fffaf6] text-[#443a3c] antialiased`}>
        {/* لینک دسترسی سریع برای رفتن به محتوای اصلی با صفحه‌کلید */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:text-[#a84766] focus:shadow-lg"
        >
          پرش به محتوای اصلی
        </a>

        {/* نمایش نوار ناوبری با تنظیمات سایت */}
        <Navbar settings={settings} />

        {/* بخش محتوای اصلی صفحه */}
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>

        {/* بخش پایینی سایت یا فوتر */}
        <footer className="mt-16 border-t border-[#f0e4e3] bg-white/70">
          {/* چیدمان واکنش‌گرای محتوای فوتر */}
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-8 text-sm sm:px-8 md:flex-row md:items-center md:justify-between">
            {/* لینک لوگو و نام برند برای بازگشت به صفحه اصلی */}
            <Link
              className="flex items-center gap-3"
              href="/"
              aria-label={settings.brandName + "، صفحه اصلی"}
            >
              {/* اگر لوگو وجود داشته باشد، آن را نمایش بده */}
              {settings.logo ? (
                <img
                  className="h-11 w-11 rounded-2xl object-cover"
                  src={settings.logo}
                  alt=""
                />
              ) : (
                // در نبود لوگو، حرف اول نام برند را نمایش بده
                <span className="grid h-11 w-11 place-items-center rounded-2xl rounded-bl-md bg-[#c65f7d] text-xl font-bold text-white">
                  {settings.brandName.slice(0, 1)}
                </span>
              )}

              {/* نمایش نام برند و شعار فوتر */}
              <span className="flex flex-col">
                <strong className="text-base font-bold text-[#553d44]">
                  {settings.brandName}
                </strong>
                <small className="text-xs text-[#817477]">
                  {settings.footerTagline}
                </small>
              </span>
            </Link>

            {/* پیام یا توضیح پایانی سایت */}
            <p className="max-w-xl text-[#817477]">{settings.footerMessage}</p>

            {/* نمایش متن حق نشر */}
            <span className="text-xs text-[#817477]">{settings.copyrightText}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}