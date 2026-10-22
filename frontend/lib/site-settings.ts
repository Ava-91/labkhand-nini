import localSettings from "@/data/site-settings.json"; // دریافت تنظیمات پیش‌فرض از فایل JSON

import { getStrapiUrl } from "./strapi"; // دریافت آدرس سرور Strapi

// تعریف ساختار لینک‌های منو
export type NavLink = {
  label: string; // متن لینک
  href: string; // آدرس مقصد لینک
};

// تعریف ساختار کارت‌های دسته‌بندی
export type CategoryTile = {
  title: string; // عنوان دسته‌بندی
  description: string; // توضیحات دسته‌بندی
  emoji: string; // ایموجی دسته‌بندی
  href: string; // آدرس صفحه دسته‌بندی
};

// تعریف ساختار کارت‌های مزایا و تعهدات فروشگاه
export type PromiseCard = {
  emoji: string; // ایموجی کارت
  title: string; // عنوان کارت
  description: string; // توضیحات کارت
};

// تعریف ساختار کامل تنظیمات سایت
export type SiteSettings = {
  brandName: string; // نام برند
  brandTagline: string; // شعار برند
  footerTagline: string; // شعار بخش پایینی سایت
  logo?: string; // آدرس لوگو، در صورت وجود
  announcement: string; // پیام اطلاع‌رسانی سایت
  navLinks: NavLink[]; // لینک‌های منوی اصلی
  footerMessage: string; // پیام فوتر
  copyrightText: string; // متن حق نشر
  seoTitle: string; // عنوان سئو
  seoDescription: string; // توضیحات سئو
  heroKicker: string; // متن کوچک بالای عنوان اصلی
  heroTitle: string; // عنوان اصلی بخش معرفی
  heroAccent: string; // متن برجسته در عنوان
  heroDescription: string; // توضیحات بخش معرفی
  heroPrimaryCta: string; // متن دکمه اصلی
  heroSecondaryCta: string; // متن دکمه دوم
  heroTrustTitle: string; // عنوان بخش اعتمادسازی
  heroTrustDescription: string; // توضیحات اعتمادسازی
  heroFloatingTop: string; // متن بخش شناور بالایی
  heroFloatingBottom: string; // متن بخش شناور پایینی
  heroBottomFirst: string; // متن مورد اول پایین بخش معرفی
  heroBottomSecond: string; // متن مورد دوم پایین بخش معرفی
  heroBottomThird: string; // متن مورد سوم پایین بخش معرفی
  productsPageEyebrow: string; // متن کوچک بالای عنوان صفحه محصولات
  productsPageTitle: string; // عنوان صفحه محصولات
  productsPageDescription: string; // توضیحات صفحه محصولات
  catalogEyebrow: string; // متن کوچک بالای کاتالوگ
  catalogSearchPlaceholder: string; // متن راهنمای کادر جست‌وجو
  catalogEmptyTitle: string; // عنوان حالت بدون محصول یا نتیجه
  catalogEmptyDescription: string; // توضیح حالت بدون محصول یا نتیجه
  productDetailNote: string; // یادداشت صفحه جزئیات محصول
  productDetailBackText: string; // متن لینک بازگشت از جزئیات محصول
  featuredTitle: string; // عنوان محصولات ویژه
  featuredDescription: string; // توضیحات محصولات ویژه
  categoryTiles: CategoryTile[]; // فهرست کارت‌های دسته‌بندی
  promisesEyebrow: string; // متن کوچک بالای بخش مزایا
  promisesTitle: string; // عنوان بخش مزایا
  promisesAccent: string; // متن برجسته در عنوان مزایا
  promisesDescription: string; // توضیحات بخش مزایا
  promiseCards: PromiseCard[]; // فهرست کارت‌های مزایا
  closingEyebrow: string; // متن کوچک بالای بخش پایانی
  closingTitle: string; // عنوان بخش پایانی
  closingDescription: string; // توضیحات بخش پایانی
  closingCtaText: string; // متن دکمه دعوت به اقدام
};

// تعریف ساختار تنظیمات دریافتی از Strapi
// همه فیلدهای تنظیمات اختیاری هستند و لوگو ساختار جداگانه‌ای دارد
type StrapiSettings = Omit<Partial<SiteSettings>, "logo"> & {
  logo?: { url?: string } | null; // اطلاعات لوگو از سرور
};

// تعریف ساختار پاسخ API تنظیمات
type SettingsResponse = {
  data?: StrapiSettings | null; // تنظیمات دریافتی یا مقدار خالی
};

// تبدیل مسیر تصویر به آدرس قابل استفاده
function getImageUrl(path?: string) {
  if (!path) return undefined; // اگر مسیری وجود ندارد، مقدار خالی برگردان

  // اگر مسیر از قبل آدرس کامل است، همان را برگردان
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const strapiUrl = getStrapiUrl(); // دریافت آدرس سرور Strapi
  return strapiUrl ? strapiUrl + path : path; // ساخت آدرس کامل یا حفظ مسیر اصلی
}

// دریافت تنظیمات سایت از Strapi یا فایل محلی
export async function getSiteSettings(): Promise<SiteSettings> {
  const defaults = localSettings as SiteSettings; // تنظیمات پیش‌فرض محلی
  const strapiUrl = getStrapiUrl(); // دریافت آدرس سرور

  // اگر سرور تنظیم نشده باشد، تنظیمات محلی را برگردان
  if (!strapiUrl) {
    return defaults;
  }

  try {
    // درخواست تنظیمات سایت همراه با اطلاعات لوگو
    const response = await fetch(
      strapiUrl + "/api/site-setting?populate=logo",
      { cache: "no-store" }, // دریافت اطلاعات تازه و بدون کش
    );

    if (!response.ok) return defaults; // در صورت خطای پاسخ، استفاده از تنظیمات محلی

    // تبدیل پاسخ API به ساختار تعریف‌شده
    const result = (await response.json()) as SettingsResponse;

    if (!result.data) return defaults; // اگر تنظیماتی دریافت نشد، تنظیمات محلی را برگردان

    // جدا کردن لوگو از سایر تنظیمات
    const { logo, ...settings } = result.data;

    return {
      ...defaults, // استفاده از تنظیمات محلی برای مقادیر پیش‌فرض
      ...settings, // جایگزینی مقادیر موجود با تنظیمات دریافتی از سرور
      logo: getImageUrl(logo?.url) ?? defaults.logo, // تعیین آدرس لوگو یا استفاده از لوگوی پیش‌فرض
    };
  } catch {
    return defaults; // در صورت بروز خطا، تنظیمات محلی را برگردان
  }
}