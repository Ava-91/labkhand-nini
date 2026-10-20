import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";

import Navbar from "./components/Navbar";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

const vazirmatn = localFont({
  src: [
    { path: "../assets/fonts/Vazirmatn-Regular(1).woff2", weight: "400" },
    { path: "../assets/fonts/Vazirmatn-Bold.woff2", weight: "700" },
  ],
  display: "swap",
});

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
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.className} min-h-screen bg-[#fffaf6] text-[#443a3c] antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:text-[#a84766] focus:shadow-lg"
        >
          پرش به محتوای اصلی
        </a>

        <Navbar settings={settings} />

        <div id="main-content" tabIndex={-1}>
          {children}
        </div>

        <footer className="mt-16 border-t border-[#f0e4e3] bg-white/70">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-8 text-sm sm:px-8 md:flex-row md:items-center md:justify-between">
            <Link
              className="flex items-center gap-3"
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

              <span className="flex flex-col">
                <strong className="text-base font-bold text-[#553d44]">
                  {settings.brandName}
                </strong>
                <small className="text-xs text-[#817477]">
                  {settings.footerTagline}
                </small>
              </span>
            </Link>

            <p className="max-w-xl text-[#817477]">{settings.footerMessage}</p>
            <span className="text-xs text-[#817477]">{settings.copyrightText}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
