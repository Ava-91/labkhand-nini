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

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

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

  return (
    <main className="form-page">
      <form onSubmit={submit} className="form-box">
        <span className="eyebrow">به خانواده‌مون خوش اومدی</span>
        <h1>ساخت حساب کاربری</h1>
        <p className="form-intro">
          عضو لبخند نینی شو و برای کوچولوت انتخاب کن.
        </p>

        <div className="form-field">
          <label htmlFor="username">نام کاربری</label>
          <input
            id="username"
            autoComplete="username"
            required
            minLength={2}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

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
          <label htmlFor="password">رمز عبور (حداقل ۶ کاراکتر)</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
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
          {loading ? "در حال ثبت‌نام..." : "ساخت حساب"}
        </button>

        <p className="form-switch">
          قبلاً عضو شدی؟ <Link href="/login">وارد شو</Link>
        </p>
      </form>
    </main>
  );
}
