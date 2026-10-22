// دریافت آدرس Strapi از متغیر محیطی و حذف اسلش انتهایی
const STRAPI_URL = process.env.STRAPI_URL?.replace(/\/$/, "");

// برگرداندن آدرس سرور Strapi
export function getStrapiUrl() {
  return STRAPI_URL;
}

// ارسال درخواست به Strapi و دریافت پاسخ با نوع مشخص‌شده
export async function strapiFetch<T>(
  path: string, // مسیر API
  token?: string, // توکن احراز هویت، در صورت نیاز
  options: RequestInit = {}, // تنظیمات درخواست
): Promise<T> {
  // بررسی تنظیم بودن آدرس سرور
  if (!STRAPI_URL) {
    throw new Error("STRAPI_URL is not configured");
  }

  // ساخت هدرها با حفظ هدرهای ارسال‌شده
  const headers = new Headers(options.headers);

  // مشخص کردن فرمت داده‌های ارسالی
  headers.set("Content-Type", "application/json");

  // افزودن توکن برای احراز هویت
  if (token) {
    headers.set("Authorization", "Bearer " + token);
  }

  // ارسال درخواست به آدرس کامل API
  const response = await fetch(STRAPI_URL + path, {
    ...options, // اعمال تنظیمات اضافی درخواست
    headers, // ارسال هدرها
    cache: "no-store", // جلوگیری از استفاده از پاسخ کش‌شده
  });

  // بررسی خطای احراز هویت یا انقضای توکن
  if (response.status === 401) {
    throw new Error("strapi_token_expired");
  }

  // بررسی سایر خطاهای پاسخ سرور
  if (!response.ok) {
    throw new Error("Strapi request failed: " + response.status);
  }

  // تبدیل پاسخ JSON به نوع داده مشخص‌شده
  return (await response.json()) as T;
}