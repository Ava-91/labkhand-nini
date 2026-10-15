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

type Raw = Record<string, unknown>;
type SettingsResponse = { data?: Raw | null };

function getMediaUrl(value: unknown): string | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Raw;
  const mediaData = record.data ?? value;

  if (!mediaData || typeof mediaData !== "object" || Array.isArray(mediaData)) {
    return undefined;
  }

  const media = mediaData as Raw;
  const fields =
    media.attributes && typeof media.attributes === "object"
      ? (media.attributes as Raw)
      : media;

  if (typeof fields.url !== "string") {
    return undefined;
  }

  const imageUrl = fields.url;

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  const strapiUrl = getStrapiUrl();

  return strapiUrl
    ? strapiUrl + (imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl)
    : imageUrl;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const defaultSettings = localSettings as SiteSettings;
  const strapiUrl = getStrapiUrl();

  // Use local settings when Strapi is not configured.
  if (!strapiUrl) {
    return defaultSettings;
  }

  try {
    const response = await fetch(
      strapiUrl + "/api/site-setting?populate=logo",
      { cache: "no-store" },
    );

    if (!response.ok) {
      return defaultSettings;
    }

    const result = (await response.json()) as SettingsResponse;
    const data = result.data;

    if (!data) {
      return defaultSettings;
    }

    const settings =
      data.attributes && typeof data.attributes === "object"
        ? (data.attributes as Raw)
        : data;

    const logo = getMediaUrl(settings.logo);

    // Keep local defaults for any fields that are missing from Strapi.
    return {
      ...defaultSettings,
      ...Object.fromEntries(
        Object.entries(settings).filter(
          ([, value]) => value !== null && value !== undefined,
        ),
      ),
      ...(logo ? { logo } : {}),
    } as SiteSettings;
  } catch {
    return defaultSettings;
  }
}
