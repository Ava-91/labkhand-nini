import { handlers } from "@/auth"; // دریافت هندلرهای احراز هویت از فایل auth

// خروجی گرفتن از متدهای GET و POST برای مدیریت درخواست‌های احراز هویت
export const { GET, POST } = handlers;