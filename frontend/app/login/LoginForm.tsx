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

  return (
    <main className="form-page">
      <form onSubmit={submit} className="form-box">
        <span className="eyebrow">خوش برگشتی</span>
        <h1>ورود به حساب</h1>
        <p className="form-intro">
          برای ادامه‌ی مسیر لبخند نینی وارد شو.
        </p>

        <div className="form-field">
          <label htmlFor="email">ایمیل</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">رمز عبور</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="button button-primary form-submit"
        >
          {loading ? "در حال ورود..." : "ورود به حساب"}
        </button>

        <p className="form-switch">
          هنوز عضو نیستی؟ <Link href="/register">ثبت‌نام کن</Link>
        </p>
      </form>
    </main>
  );
}
