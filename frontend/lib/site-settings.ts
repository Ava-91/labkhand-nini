import localSettings from "@/data/site-settings.json";

import { getStrapiUrl } from "./strapi";

export type NavLink = {
  label: string;
  href: string;
};

export type CategoryTile = {
  title: string;
  description: string;
  emoji: string;
  href: string;
};

export type PromiseCard = {
  emoji: string;
  title: string;
  description: string;
};

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
  categoryTiles: CategoryTile[];
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

type StrapiSettings = Omit<Partial<SiteSettings>, "logo"> & {
  logo?: { url?: string } | null;
};

type SettingsResponse = {
  data?: StrapiSettings | null;
};

function getImageUrl(path?: string) {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const strapiUrl = getStrapiUrl();
  return strapiUrl ? strapiUrl + path : path;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const defaults = localSettings as SiteSettings;
  const strapiUrl = getStrapiUrl();

  if (!strapiUrl) {
    return defaults;
  }

  try {
    const response = await fetch(
      strapiUrl + "/api/site-setting?populate=logo",
      { cache: "no-store" },
    );

    if (!response.ok) return defaults;

    const result = (await response.json()) as SettingsResponse;
    if (!result.data) return defaults;

    const { logo, ...settings } = result.data;

    return {
      ...defaults,
      ...settings,
      logo: getImageUrl(logo?.url) ?? defaults.logo,
    };
  } catch {
    return defaults;
  }
}
