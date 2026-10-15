import type { Metadata } from "next";
import Link from "next/link";

import Navbar from "./components/Navbar";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

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
      <body>
        <a className="skip-link" href="#main-content">
          پرش به محتوای اصلی
        </a>

        <Navbar settings={settings} />

        <div id="main-content" tabIndex={-1}>
          {children}
        </div>

        <footer className="site-footer">
          <div className="container footer-inner">
            <Link
              className="brand footer-brand"
              href="/"
              aria-label={settings.brandName + "، صفحه اصلی"}
            >
              {settings.logo ? (
                <img className="brand-logo" src={settings.logo} alt="" />
              ) : (
                <span className="brand-mark" aria-hidden="true">
                  {settings.brandName.slice(0, 1)}
                </span>
              )}

              <span className="brand-copy">
                <strong>{settings.brandName}</strong>
                <small>{settings.footerTagline}</small>
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
