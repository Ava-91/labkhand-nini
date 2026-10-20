import Link from "next/link";

import { auth } from "@/auth";
import type { SiteSettings } from "@/lib/site-settings";
import LogoutButton from "./LogoutButton";

export default async function Navbar({
  settings,
}: {
  settings: SiteSettings;
}) {
  const session = await auth();

  return (
    <header className="relative z-20 border-b border-[#f0e4e3] bg-[#fffaf6]">
      {settings.announcement && (
        <p className="bg-[#f5dfe6] px-4 py-2 text-center text-xs text-[#875366]">
          {settings.announcement}
        </p>
      )}

      <nav
        className="mx-auto flex min-h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8"
        aria-label="ناوبری اصلی"
      >
        <Link
          className="flex shrink-0 items-center gap-3"
          href="/"
          aria-label={settings.brandName + "، صفحه اصلی"}
        >
          {settings.logo ? (
            <img
              className="h-11 w-11 rounded-2xl object-cover"
              src={settings.logo}
              alt=""
            />
          ) : (
            <span className="grid h-11 w-11 place-items-center rounded-2xl rounded-bl-md bg-[#c65f7d] text-xl font-bold text-white">
              {settings.brandName.slice(0, 1)}
            </span>
          )}

          <span className="flex flex-col leading-snug">
            <strong className="text-base font-extrabold text-[#553d44]">
              {settings.brandName}
            </strong>
            <small className="text-[10px] text-[#817477]">
              {settings.brandTagline}
            </small>
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm text-[#69595d] md:flex">
          {settings.navLinks.map((item) => (
            <Link
              href={item.href}
              key={item.href + item.label}
              className="transition hover:text-[#a84766]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 text-sm sm:flex">
          {session ? (
            <>
              <Link
                className="rounded-full border border-[#f0e4e3] bg-white px-4 py-2 font-semibold transition hover:border-[#c65f7d]"
                href="/dashboard"
              >
                حساب من
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link className="px-2 py-2 hover:text-[#a84766]" href="/login">
                ورود
              </Link>
              <Link
                className="rounded-full bg-[#c65f7d] px-5 py-2.5 font-bold text-white shadow-sm transition hover:bg-[#a84766]"
                href="/register"
              >
                عضویت
              </Link>
            </>
          )}
        </div>

        <details className="relative sm:hidden">
          <summary className="cursor-pointer list-none rounded-xl border border-[#f0e4e3] bg-white px-3 py-2 text-xl">
            <span aria-hidden="true">☰</span>
            <span className="sr-only">باز کردن منو</span>
          </summary>
          <div className="absolute left-0 top-12 flex min-w-44 flex-col gap-1 rounded-2xl border border-[#f0e4e3] bg-white p-3 shadow-xl">
            {settings.navLinks.map((item) => (
              <Link
                href={item.href}
                key={"mobile-" + item.href + item.label}
                className="rounded-xl px-3 py-2 text-sm hover:bg-[#fff0f3]"
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link className="rounded-xl px-3 py-2 text-sm hover:bg-[#fff0f3]" href="/dashboard">حساب من</Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link className="rounded-xl px-3 py-2 text-sm hover:bg-[#fff0f3]" href="/login">ورود</Link>
                <Link className="rounded-xl px-3 py-2 text-sm hover:bg-[#fff0f3]" href="/register">ثبت‌نام</Link>
              </>
            )}
          </div>
        </details>
      </nav>
    </header>
  );
}
