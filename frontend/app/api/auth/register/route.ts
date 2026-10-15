import { NextResponse } from "next/server";

import { getStrapiUrl } from "@/lib/strapi";

export async function POST(request: Request) {
  const strapiUrl = getStrapiUrl();

  if (!strapiUrl) {
    return NextResponse.json(
      { message: "سرور ثبت‌نام هنوز تنظیم نشده است." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;

    const username =
      typeof body.username === "string" ? body.username.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidInput =
      username.length >= 2 && isValidEmail && password.length >= 6;

    if (!isValidInput) {
      return NextResponse.json(
        { message: "نام کاربری، ایمیل یا رمز عبور معتبر نیست." },
        { status: 400 },
      );
    }

    const response = await fetch(strapiUrl + "/api/auth/local/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
      cache: "no-store",
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            result?.error?.message ?? "ثبت‌نام انجام نشد. دوباره تلاش کن.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(
      {
        id: result.user?.id,
        username: result.user?.username,
        email: result.user?.email,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "در حال حاضر ارتباط با سرور برقرار نیست." },
      { status: 502 },
    );
  }
}
