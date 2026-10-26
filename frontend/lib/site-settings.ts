import { getStrapiUrl } from "./strapi";

// تعریف ساختار لینک‌های منو
export type NavLink = {
  label: string;
  href: string;
};

// نگه‌داشتن این نوع برای سازگاری با ساختار داده‌های قبلی
export type CategoryTile = {
  title: string;
  description: string;
  emoji: string;
  href: string;
};

// تعریف ساختار کارت‌های مزایا و تعهدات فروشگاه
export type PromiseCard = {
  emoji: string;
  title: string;
  description: string;
};

// تعریف ساختار کامل تنظیمات سایت
export type SiteSettings = {
  brandName: string;
  brandTagline: string;
  footerTagline: string;
  logo?: string;
  announcement: string;
  navLinks: NavLink[];
  footerMessage: string;
  copyrightText: string;
  seoTitle: string;
  seoDescription: string;
  heroKicker: string;
  heroTitle: string;
  heroAccent: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroTrustTitle: string;
  heroTrustDescription: string;
  heroFloatingTop: string;
  heroFloatingBottom: string;
  heroBottomFirst: string;
  heroBottomSecond: string;
  heroBottomThird: string;
  productsPageEyebrow: string;
  productsPageTitle: string;
  productsPageDescription: string;
  catalogEyebrow: string;
  catalogSearchPlaceholder: string;
  catalogEmptyTitle: string;
  catalogEmptyDescription: string;
  productDetailNote: string;
  productDetailBackText: string;
  featuredTitle: string;
  featuredDescription: string;
  promisesEyebrow: string;
  promisesTitle: string;
  promisesAccent: string;
  promisesDescription: string;
  promiseCards: PromiseCard[];
  closingEyebrow: string;
  closingTitle: string;
  closingDescription: string;
  closingCtaText: string;
};

// شکل پاسخ تنظیمات فروشگاه در Strapi
type StrapiSettings = Partial<Omit<SiteSettings, "logo">> & {
  logo?: { url?: string } | null;
};

type SettingsResponse = {
  data?: StrapiSettings | null;
  error?: { message?: string };
};

// تبدیل مسیر فایل رسانه‌ای به آدرس کامل
function getImageUrl(path?: string) {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const strapiUrl = getStrapiUrl();
  return strapiUrl ? strapiUrl + path : path;
}

// دریافت تنظیمات فقط از Strapi؛ خطاها عمداً مخفی نمی‌شوند
export async function getSiteSettings(): Promise<SiteSettings> {
  const strapiUrl = getStrapiUrl();

  if (!strapiUrl) {
    throw new Error(
      "STRAPI_URL is not configured. The storefront requires Strapi and has no local settings fallback.",
    );
  }

  const response = await fetch(
    strapiUrl + "/api/site-setting?populate=logo",
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load storefront settings from Strapi (HTTP ${response.status}). Check the public site-setting.find permission and publish the settings entry.`,
    );
  }

  const result = (await response.json()) as SettingsResponse;

  if (!result.data) {
    throw new Error(
      "Strapi returned no published Storefront Settings entry. Create and publish the single-type entry in Strapi.",
    );
  }

  const settings = result.data;

  if (!settings.brandName?.trim()) {
    throw new Error(
      "The published Strapi Storefront Settings entry is missing brandName. Check that the correct entry is published.",
    );
  }

  if (!Array.isArray(settings.navLinks)) {
    throw new Error(
      "The published Strapi Storefront Settings entry is missing navLinks. Check the JSON field and publish the entry.",
    );
  }

  if (!Array.isArray(settings.promiseCards)) {
    throw new Error(
      "The published Strapi Storefront Settings entry is missing promiseCards. Check the JSON field and publish the entry.",
    );
  }

  // مقادیر خالی در CMS به‌صورت خالی نمایش داده می‌شوند؛ از داده محلی قدیمی استفاده نمی‌شود.
  const text = (value: string | null | undefined) => value ?? "";

  return {
    brandName: settings.brandName,
    brandTagline: text(settings.brandTagline),
    footerTagline: text(settings.footerTagline),
    logo: getImageUrl(settings.logo?.url),
    announcement: text(settings.announcement),
    navLinks: settings.navLinks,
    footerMessage: text(settings.footerMessage),
    copyrightText: text(settings.copyrightText),
    seoTitle: text(settings.seoTitle),
    seoDescription: text(settings.seoDescription),
    heroKicker: text(settings.heroKicker),
    heroTitle: text(settings.heroTitle),
    heroAccent: text(settings.heroAccent),
    heroDescription: text(settings.heroDescription),
    heroPrimaryCta: text(settings.heroPrimaryCta),
    heroSecondaryCta: text(settings.heroSecondaryCta),
    heroTrustTitle: text(settings.heroTrustTitle),
    heroTrustDescription: text(settings.heroTrustDescription),
    heroFloatingTop: text(settings.heroFloatingTop),
    heroFloatingBottom: text(settings.heroFloatingBottom),
    heroBottomFirst: text(settings.heroBottomFirst),
    heroBottomSecond: text(settings.heroBottomSecond),
    heroBottomThird: text(settings.heroBottomThird),
    productsPageEyebrow: text(settings.productsPageEyebrow),
    productsPageTitle: text(settings.productsPageTitle),
    productsPageDescription: text(settings.productsPageDescription),
    catalogEyebrow: text(settings.catalogEyebrow),
    catalogSearchPlaceholder: text(settings.catalogSearchPlaceholder),
    catalogEmptyTitle: text(settings.catalogEmptyTitle),
    catalogEmptyDescription: text(settings.catalogEmptyDescription),
    productDetailNote: text(settings.productDetailNote),
    productDetailBackText: text(settings.productDetailBackText),
    featuredTitle: text(settings.featuredTitle),
    featuredDescription: text(settings.featuredDescription),
    promisesEyebrow: text(settings.promisesEyebrow),
    promisesTitle: text(settings.promisesTitle),
    promisesAccent: text(settings.promisesAccent),
    promisesDescription: text(settings.promisesDescription),
    promiseCards: settings.promiseCards,
    closingEyebrow: text(settings.closingEyebrow),
    closingTitle: text(settings.closingTitle),
    closingDescription: text(settings.closingDescription),
    closingCtaText: text(settings.closingCtaText),
  };
}
