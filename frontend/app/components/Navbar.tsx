import Link from "next/link";
import { auth } from "@/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="site-header">
      <div className="announcement">ارسال با عشق برای روزهای قشنگ کوچولوها ✨</div>
      <nav className="site-nav container" aria-label="ناوبری اصلی">
        <Link className="brand" href="/" aria-label="لبخند نینی، صفحه اصلی">
          <span className="brand-mark" aria-hidden="true">ن</span>
          <span className="brand-copy"><strong>لبخند نینی</strong><small>دنیای کوچولوی تو</small></span>
        </Link>
        <div className="nav-links">
          <Link href="/">خانه</Link>
          <Link href="/products">همه محصولات</Link>
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
            <Link href="/">خانه</Link>
            <Link href="/products">همه محصولات</Link>
            {session ? <Link href="/dashboard">حساب من</Link> : <><Link href="/login">ورود</Link><Link href="/register">ثبت‌نام</Link></>}
          </div>
        </details>
      </nav>
    </header>
  );
}
