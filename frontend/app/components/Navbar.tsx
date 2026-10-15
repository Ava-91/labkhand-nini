import Link from "next/link";

import { auth } from "@/auth";
import type { SiteSettings } from "@/lib/site-settings";
import LogoutButton from "./LogoutButton";

export default async function Navbar({ settings }: { settings: SiteSettings }) {
  const session = await auth();

  return (
    <header className="border-b border-rose-100 bg-white">
      {settings.announcement && (
        <div className="bg-rose-100 px-4 py-2 text-center text-xs text-rose-900">
          {settings.announcement}
        </div>
      )}

      <nav
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4"
        aria-label="ناوبری اصلی"
      >
        <Link
          className="flex items-center gap-3"
          href="/"
          aria-label={settings.brandName + "، صفحه اصلی"}
        >
          {settings.logo ? (
            <img className="h-11 w-11 rounded-xl object-cover" src={settings.logo} alt="" />
          ) : (
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-500 text-xl font-bold text-white">
              {settings.brandName.slice(0, 1)}
            </span>
          )}
          <span>
            <strong className="block text-lg">{settings.brandName}</strong>
            <small className="block text-xs text-stone-500">{settings.brandTagline}</small>
          </span>
        </Link>

        <div className="hidden items-center gap-5 text-sm text-stone-600 md:flex">
          {settings.navLinks.map((item) => (
            <Link className="transition hover:text-rose-700" href={item.href} key={item.href + item.label}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm">
          {session ? (
            <>
              <Link className="rounded-full border border-rose-200 px-4 py-2 hover:bg-rose-50" href="/dashboard">
                حساب من
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link className="px-3 py-2 hover:text-rose-700" href="/login">ورود</Link>
              <Link className="rounded-full bg-rose-500 px-4 py-2 font-bold text-white hover:bg-rose-600" href="/register">
                عضویت
              </Link>
            </>
          )}
        </div>

        <details className="relative w-full md:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-rose-200 px-4 py-2 text-center text-sm">
            ☰ منو
          </summary>
          <div className="mt-2 grid gap-1 rounded-xl border border-rose-100 bg-white p-3 shadow-sm">
            {settings.navLinks.map((item) => (
              <Link className="rounded-lg px-3 py-2 hover:bg-rose-50" href={item.href} key={"mobile-" + item.href + item.label}>
                {item.label}
              </Link>
            ))}
            {session ? (
              <Link className="rounded-lg px-3 py-2 hover:bg-rose-50" href="/dashboard">حساب من</Link>
            ) : (
              <>
                <Link className="rounded-lg px-3 py-2 hover:bg-rose-50" href="/login">ورود</Link>
                <Link className="rounded-lg px-3 py-2 hover:bg-rose-50" href="/register">ثبت‌نام</Link>
              </>
            )}
          </div>
        </details>
      </nav>
    </header>
  );
}
