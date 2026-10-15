import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "./components/Navbar";
import { getSiteSettings } from "@/lib/site-settings";
import "./tailwind.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.seoTitle || settings.brandName,
      template: "%s | " + settings.brandName,
    },
    description: settings.seoDescription,
    applicationName: settings.brandName,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html lang="fa" dir="rtl" className="scroll-smooth">
      <body className="min-h-screen bg-orange-50 font-sans text-stone-800 antialiased">
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:shadow"
          href="#main-content"
        >
          پرش به محتوای اصلی
        </a>

        <Navbar settings={settings} />

        <div id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </div>

        <footer className="mt-12 border-t border-rose-100 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <Link
              className="flex items-center gap-3 font-bold text-stone-800"
              href="/"
              aria-label={settings.brandName + "، صفحه اصلی"}
            >
              {settings.logo ? (
                <img className="h-10 w-10 rounded-xl object-cover" src={settings.logo} alt="" />
              ) : (
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500 text-lg text-white">
                  {settings.brandName.slice(0, 1)}
                </span>
              )}
              <span>
                <span className="block">{settings.brandName}</span>
                <span className="block text-xs font-normal text-stone-500">{settings.footerTagline}</span>
              </span>
            </Link>
            <p>{settings.footerMessage}</p>
            <span>{settings.copyrightText}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
