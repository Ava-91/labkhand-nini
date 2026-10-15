"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "ثبت‌نام انجام نشد. اطلاعات رو بررسی کن.");
        return;
      }

      const result = await signIn("credentials", { email, password, redirect: false });

      if (!result || result.error) {
        router.push("/login");
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

  const fieldClass = "w-full rounded-xl border border-rose-200 bg-white px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-rose-400";

  return (
    <main className="grid min-h-[65vh] place-items-center bg-gradient-to-br from-orange-50 to-rose-100 px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <span className="font-bold text-rose-700">به خانواده‌مون خوش اومدی</span>
        <h1 className="mt-2 text-3xl font-black">ساخت حساب کاربری</h1>
        <p className="mb-6 mt-2 text-sm leading-7 text-stone-600">عضو لبخند نینی شو و برای کوچولوت انتخاب کن.</p>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold" htmlFor="username">نام کاربری</label>
          <input className={fieldClass} id="username" autoComplete="username" required minLength={2} value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold" htmlFor="email">ایمیل</label>
          <input className={fieldClass} id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold" htmlFor="password">رمز عبور (حداقل ۶ کاراکتر)</label>
          <input className={fieldClass} id="password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>

        {error && <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-800" role="alert">{error}</p>}

        <button className="w-full rounded-full bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={loading}>
          {loading ? "در حال ثبت‌نام..." : "ساخت حساب"}
        </button>

        <p className="mt-5 text-center text-sm text-stone-600">
          قبلاً عضو شدی؟ <Link className="font-bold text-rose-700 hover:underline" href="/login">وارد شو</Link>
        </p>
      </form>
    </main>
  );
}
