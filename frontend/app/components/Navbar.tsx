import Link from "next/link";
import { auth } from "@/auth";
import { getSiteSettings } from "@/lib/site-settings";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const [session, settings] = await Promise.all([auth(), getSiteSettings()]);

  return (
    <header className="site-header">
      {settings.announcement ? <div className="announcement">{settings.announcement}</div> : null}
      <nav className="site-nav container" aria-label="ناوبری اصلی">
        <Link className="brand" href="/" aria-label={settings.brandName + "، صفحه اصلی"}>
          {settings.logo ? (
            // A plain img allows CMS-hosted logos without requiring per-domain Next.js image configuration.
            <img className="brand-logo" src={settings.logo} alt="" />
          ) : (
            <span className="brand-mark" aria-hidden="true">{settings.brandName.slice(0, 1)}</span>
          )}
          <span className="brand-copy"><strong>{settings.brandName}</strong><small>{settings.brandTagline}</small></span>
        </Link>
        <div className="nav-links">
          {settings.navLinks.map((item) => <Link href={item.href} key={item.href + item.label}>{item.label}</Link>)}
        </div>
        <div className="nav-actions">
          {session ? (
            <>
              <Link className="button button-quiet" href="/dashboard">حساب من</Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link className="nav-login" href="/login">ورود</Link>
              <Link className="button button-primary" href="/register">عضویت</Link>
            </>
          )}
        </div>
        <details className="mobile-menu">
          <summary aria-label="باز کردن منوی موبایل"><span aria-hidden="true">☰</span><span className="visually-hidden">منو</span></summary>
          <div className="mobile-menu-panel">
            {settings.navLinks.map((item) => <Link href={item.href} key={"mobile-" + item.href + item.label}>{item.label}</Link>)}
            {session ? <Link href="/dashboard">حساب من</Link> : <><Link href="/login">ورود</Link><Link href="/register">ثبت‌نام</Link></>}
          </div>
        </details>
      </nav>
    </header>
  );
}
