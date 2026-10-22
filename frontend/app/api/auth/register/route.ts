import { NextResponse } from "next/server"; // ساخت پاسخ HTTP در Next.js

import { getStrapiUrl } from "@/lib/strapi"; // دریافت آدرس سرور Strapi

export async function POST(request: Request) { // مدیریت درخواست ثبت‌نام
  const strapiUrl = getStrapiUrl(); // گرفتن آدرس Strapi

  if (!strapiUrl) { // بررسی تنظیم بودن آدرس سرور
    return NextResponse.json(
      { message: "سرور ثبت‌نام هنوز تنظیم نشده است." }, // پیام خطا
      { status: 503 }, // سرویس در دسترس نیست
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown>; // خواندن اطلاعات ارسالی

    const username =
      typeof body.username === "string" ? body.username.trim() : ""; // دریافت و حذف فاصله نام کاربری

    const email = typeof body.email === "string" ? body.email.trim() : ""; // دریافت ایمیل

    const password = typeof body.password === "string" ? body.password : ""; // دریافت رمز عبور

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // بررسی ساختار ایمیل

    const isValidInput =
      username.length >= 2 && isValidEmail && password.length >= 6; // بررسی اعتبار اطلاعات

    if (!isValidInput) { // اگر اطلاعات نامعتبر باشند
      return NextResponse.json(
        { message: "نام کاربری، ایمیل یا رمز عبور معتبر نیست." }, // پیام خطا
        { status: 400 }, // درخواست نامعتبر
      );
    }

    const response = await fetch(strapiUrl + "/api/auth/local/register", { // ارسال اطلاعات به Strapi
      method: "POST", // نوع درخواست
      headers: { "Content-Type": "application/json" }, // مشخص کردن فرمت JSON
      body: JSON.stringify({ username, email, password }), // تبدیل اطلاعات به JSON
      cache: "no-store", // جلوگیری از استفاده از کش
    });

    const result = await response.json().catch(() => ({})); // دریافت پاسخ سرور

    if (!response.ok) { // بررسی ناموفق بودن ثبت‌نام
      return NextResponse.json(
        {
          message:
            result?.error?.message ?? "ثبت‌نام انجام نشد. دوباره تلاش کن.", // پیام خطای سرور یا پیام پیش‌فرض
        },
        { status: response.status }, // ارسال کد خطای سرور
      );
    }

    return NextResponse.json(
      {
        id: result.user?.id, // شناسه کاربر
        username: result.user?.username, // نام کاربری ثبت‌شده
        email: result.user?.email, // ایمیل ثبت‌شده
      },
      { status: 201 }, // ثبت‌نام با موفقیت انجام شد
    );
  } catch {
    return NextResponse.json(
      { message: "در حال حاضر ارتباط با سرور برقرار نیست." }, // پیام خطای ارتباط
      { status: 502 }, // خطای دریافت پاسخ از سرور
    );
  }
}