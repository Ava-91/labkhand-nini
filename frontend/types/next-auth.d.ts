import type { DefaultSession } from "next-auth"; // دریافت نوع پیش‌فرض اطلاعات نشست کاربر

// توسعه نوع‌های کتابخانه NextAuth
declare module "next-auth" {
  // اضافه کردن شناسه و توکن Strapi به اطلاعات کاربر در نشست
  interface Session {
    user: {
      id: string; // شناسه کاربر
      strapiToken: string; // توکن احراز هویت Strapi
    } & DefaultSession["user"]; // حفظ فیلدهای پیش‌فرض کاربر
  }

  // اضافه کردن توکن Strapi به نوع کاربر
  interface User {
    strapiToken: string; // توکن دسترسی به Strapi
  }
}

// توسعه نوع JWT برای ذخیره اطلاعات احراز هویت
declare module "@auth/core/jwt" {
  interface JWT {
    id?: string; // شناسه کاربر، به‌صورت اختیاری
    strapiToken?: string; // توکن Strapi، به‌صورت اختیاری
  }
}