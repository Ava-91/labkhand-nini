"use client"; // اجرای کامپوننت در سمت مرورگر

import Link from "next/link"; // ساخت لینک داخلی
import { signIn } from "next-auth/react"; // ورود کاربر با NextAuth
import { useRouter } from "next/navigation"; // مدیریت مسیرهای سایت
import { useState } from "react"; // مدیریت وضعیت فرم

// فرم ورود کاربران
export default function LoginForm() {
  const router = useRouter(); // دسترسی به مسیریابی

  const [email, setEmail] = useState(""); // ذخیره ایمیل
  const [password, setPassword] = useState(""); // ذخیره رمز عبور
  const [error, setError] = useState(""); // ذخیره پیام خطا
  const [loading, setLoading] = useState(false); // وضعیت ارسال فرم

  // تابع ارسال اطلاعات ورود
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // جلوگیری از بارگذاری مجدد صفحه
    setError(""); // پاک‌کردن خطای قبلی
    setLoading(true); // فعال‌کردن حالت انتظار

    try {
      const result = await signIn("credentials", {
        email, // ارسال ایمیل
        password, // ارسال رمز عبور
        redirect: false, // جلوگیری از تغییر مسیر خودکار
      });

      if (!result || result.error) {
        // بررسی ناموفق بودن ورود
        setError("ورود انجام نشد. ایمیل و رمز عبور رو بررسی کن.");
        return; // توقف ادامه تابع
      }

      router.push("/dashboard"); // انتقال به پنل کاربری
      router.refresh(); // به‌روزرسانی اطلاعات صفحه
    } catch {
      // مدیریت خطاهای ارتباطی
      setError("ارتباط با سرور برقرار نشد. دوباره تلاش کن.");
    } finally {
      setLoading(false); // غیرفعال‌کردن حالت انتظار
    }
  }

  const fieldClass =
    "mt-2 w-full rounded-xl border border-[#f0e4e3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c65f7d] focus:ring-2 focus:ring-[#c65f7d]/15";
    // استایل مشترک فیلدهای ورودی

  return (
    <main className="flex min-h-[65vh] items-center justify-center px-5 py-12">
      {/* قرار دادن فرم در مرکز صفحه */}

      <form
        onSubmit={submit} // اجرای تابع هنگام ارسال فرم
        className="w-full max-w-md rounded-[2rem] border border-[#f0e4e3] bg-white p-6 shadow-sm sm:p-9"
      >
        <span className="text-xs font-extrabold text-[#a84766]">
          خوش برگشتی {/* متن خوشامدگویی */}
        </span>

        <h1 className="mt-3 text-2xl font-black text-[#443a3c]">
          ورود به حساب {/* عنوان فرم */}
        </h1>

        <p className="mt-2 text-sm leading-7 text-[#817477]">
          برای ادامه‌ی مسیر لبخند نینی وارد شو. {/* توضیح فرم */}
        </p>

        <div className="mt-6">
          <label
            className="text-sm font-bold text-[#553d44]"
            htmlFor="email" // اتصال برچسب به فیلد ایمیل
          >
            ایمیل
          </label>

          <input
            className={fieldClass} // استایل مشترک ورودی
            id="email" // شناسه فیلد
            type="email" // دریافت ایمیل
            autoComplete="email" // پیشنهاد ایمیل ذخیره‌شده مرورگر
            required // اجباری بودن فیلد
            value={email} // مقدار فعلی ایمیل
            onChange={(event) => setEmail(event.target.value)} // ذخیره ایمیل هنگام تایپ
          />
        </div>

        <div className="mt-4">
          <label
            className="text-sm font-bold text-[#553d44]"
            htmlFor="password" // اتصال برچسب به فیلد رمز
          >
            رمز عبور
          </label>

          <input
            className={fieldClass} // استایل مشترک ورودی
            id="password" // شناسه فیلد
            type="password" // مخفی‌کردن کاراکترهای رمز
            autoComplete="current-password" // پیشنهاد رمز ذخیره‌شده
            required // اجباری بودن فیلد
            value={password} // مقدار فعلی رمز
            onChange={(event) => setPassword(event.target.value)} // ذخیره رمز هنگام تایپ
          />
        </div>

        {error && ( // نمایش پیام در صورت وجود خطا
          <p
            className="mt-4 rounded-xl bg-[#fff0f3] p-3 text-sm text-[#a84766]"
            role="alert" // اعلام خطا به ابزارهای دسترس‌پذیری
          >
            {error} {/* متن پیام خطا */}
          </p>
        )}

        <button
          type="submit" // ارسال فرم
          disabled={loading} // جلوگیری از ارسال مجدد هنگام پردازش
          className="mt-6 w-full rounded-full bg-[#c65f7d] px-5 py-3 font-bold text-white transition hover:bg-[#a84766] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "در حال ورود..." : "ورود به حساب"}
          {/* تغییر متن دکمه هنگام ورود */}
        </button>

        <p className="mt-5 text-center text-sm text-[#817477]">
          هنوز عضو نیستی؟ {/* متن دعوت به ثبت‌نام */}

          {" "}

          <Link
            className="font-bold text-[#a84766] hover:underline"
            href="/register" // رفتن به صفحه ثبت‌نام
          >
            ثبت‌نام کن
          </Link>
        </p>
      </form>
    </main>
  );
}