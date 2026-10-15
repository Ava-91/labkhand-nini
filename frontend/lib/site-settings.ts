import localSettings from "@/data/site-settings.json";
import { getStrapiUrl } from "./strapi";

export type NavLink = { label: string; href: string };
export type CategoryTile = { title: string; description: string; emoji: string; href: string };
export type PromiseCard = { emoji: string; title: string; description: string };

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
  if (!value || typeof value !== "object") return;
  const record = value as Raw;
  const inner = record.data ?? value;
  if (!inner || typeof inner !== "object" || Array.isArray(inner)) return;
  const media = inner as Raw;
  const fields = (media.attributes && typeof media.attributes === "object" ? media.attributes : media) as Raw;
  if (typeof fields.url !== "string") return;
  if (fields.url.startsWith("http://") || fields.url.startsWith("https://")) return fields.url;
  const base = getStrapiUrl();
  return base ? base + (fields.url.startsWith("/") ? fields.url : "/" + fields.url) : fields.url;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const defaults = localSettings as SiteSettings;
  const base = getStrapiUrl();
  if (!base) return defaults;

  try {
    const response = await fetch(base + "/api/site-setting?populate=logo", { cache: "no-store" });
    if (!response.ok) return defaults;
    const json = (await response.json()) as SettingsResponse;
    const data = json.data;
    if (!data) return defaults;
    const attributes = (data.attributes && typeof data.attributes === "object" ? data.attributes : data) as Raw;
    const logo = getMediaUrl(attributes.logo);
    return {
      ...defaults,
      ...Object.fromEntries(Object.entries(attributes).filter(([, value]) => value !== null && value !== undefined)),
      ...(logo ? { logo } : {}),
    } as SiteSettings;
  } catch {
    return defaults;
  }
}
