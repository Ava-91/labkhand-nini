import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "لبخند نینی | دنیای کوچولوی تو", template: "%s | لبخند نینی" },
  description: "لباس، سیسمونی و وسایل دوست‌داشتنی نوزاد؛ انتخاب شده با عشق برای کوچولوی شما.",
  applicationName: "لبخند نینی",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <a className="skip-link" href="#main-content">پرش به محتوای اصلی</a>
        <Navbar />
        <div id="main-content" tabIndex={-1}>{children}</div>
        <footer className="site-footer">
          <div className="container footer-inner">
            <Link className="brand footer-brand" href="/" aria-label="لبخند نینی، صفحه اصلی">
              <span className="brand-mark" aria-hidden="true">ن</span>
              <span className="brand-copy"><strong>لبخند نینی</strong><small>هر انتخاب، پر از عشق</small></span>
            </Link>
            <p>با عشق برای کوچولوها آماده شده 💗</p>
            <span>© لبخند نینی</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
