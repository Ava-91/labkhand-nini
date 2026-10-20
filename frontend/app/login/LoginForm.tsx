"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("ورود انجام نشد. ایمیل و رمز عبور رو بررسی کن.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد. دوباره تلاش کن.");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "mt-2 w-full rounded-xl border border-[#f0e4e3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c65f7d] focus:ring-2 focus:ring-[#c65f7d]/15";

  return (
    <main className="flex min-h-[65vh] items-center justify-center px-5 py-12">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-[2rem] border border-[#f0e4e3] bg-white p-6 shadow-sm sm:p-9"
      >
        <span className="text-xs font-extrabold text-[#a84766]">خوش برگشتی</span>
        <h1 className="mt-3 text-2xl font-black text-[#443a3c]">ورود به حساب</h1>
        <p className="mt-2 text-sm leading-7 text-[#817477]">
          برای ادامه‌ی مسیر لبخند نینی وارد شو.
        </p>

        <div className="mt-6">
          <label className="text-sm font-bold text-[#553d44]" htmlFor="email">ایمیل</label>
          <input
            className={fieldClass}
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-bold text-[#553d44]" htmlFor="password">رمز عبور</label>
          <input
            className={fieldClass}
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-[#fff0f3] p-3 text-sm text-[#a84766]" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-[#c65f7d] px-5 py-3 font-bold text-white transition hover:bg-[#a84766] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "در حال ورود..." : "ورود به حساب"}
        </button>

        <p className="mt-5 text-center text-sm text-[#817477]">
          هنوز عضو نیستی؟{" "}
          <Link className="font-bold text-[#a84766] hover:underline" href="/register">
            ثبت‌نام کن
          </Link>
        </p>
      </form>
    </main>
  );
}
