import localProducts from "@/data/products.json";

import { getStrapiUrl } from "./strapi";

export type Product = {
  id: string;
  documentId?: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  category: string;
  image?: string;
  emoji: string;
  featured: boolean;
};

type RawRecord = Record<string, unknown>;
type ProductResponse = {
  data?: RawRecord[];
  meta?: { pagination?: { pageCount?: number } };
};

function getMediaUrl(value: unknown): string | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as RawRecord;
  const mediaData = record.data ?? value;

  if (Array.isArray(mediaData)) {
    return getMediaUrl(mediaData[0]);
  }

  if (!mediaData || typeof mediaData !== "object") {
    return undefined;
  }

  const media = mediaData as RawRecord;
  const fields =
    media.attributes && typeof media.attributes === "object"
      ? (media.attributes as RawRecord)
      : media;

  return typeof fields.url === "string" ? fields.url : undefined;
}

function mapProduct(item: RawRecord): Product {
  const fields =
    item.attributes && typeof item.attributes === "object"
      ? (item.attributes as RawRecord)
      : item;

  const rawCategory = fields.category as RawRecord | undefined;
  const categoryData = rawCategory?.data ?? rawCategory;

  const categoryFields =
    categoryData && typeof categoryData === "object"
      ? (((categoryData as RawRecord).attributes ?? categoryData) as RawRecord)
      : undefined;

  const title = String(fields.title ?? fields.name ?? "محصول لبخند نینی");
  const fallbackSlug = String(item.documentId ?? item.id ?? title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const slug = String(fields.slug ?? fallbackSlug);
  const category = String(
    categoryFields?.name ?? fields.categoryName ?? "سایر محصولات",
  );

  const image = getMediaUrl(fields.image ?? fields.images ?? fields.cover);
  const strapiUrl = getStrapiUrl();
  let imageUrl: string | undefined;

  if (image?.startsWith("http://") || image?.startsWith("https://")) {
    imageUrl = image;
  } else if (image && strapiUrl) {
    imageUrl = strapiUrl + (image.startsWith("/") ? image : "/" + image);
  }

  const categoryEmojis: Record<string, string> = {
    "لباس نوزاد": "🧸",
    "خواب و آرامش": "☁️",
    "هدیه و سیسمونی": "🎁",
    غذاخوری: "🍓",
    "مراقبت روزانه": "🫧",
    "بازی و سرگرمی": "🐰",
  };

  return {
    id: String(item.documentId ?? item.id ?? slug),
    documentId:
      typeof item.documentId === "string" ? item.documentId : undefined,
    slug,
    title,
    description: String(fields.description ?? ""),
    price: Number(fields.price ?? 0),
    discount: Number(fields.discount ?? 0),
    stock: Number(fields.stock ?? 0),
    category,
    image: imageUrl,
    emoji: String(fields.emoji ?? categoryEmojis[category] ?? "🧸"),
    featured: Boolean(fields.featured ?? fields.isFeatured ?? false),
  };
}

export async function getProducts(): Promise<Product[]> {
  const strapiUrl = getStrapiUrl();

  // Use sample data when Strapi has not been configured.
  if (!strapiUrl) {
    return localProducts as Product[];
  }

  try {
    const response = await fetch(
      strapiUrl + "/api/products?populate=*&pagination[pageSize]=100",
      { cache: "no-store" },
    );

    if (!response.ok) {
      return [];
    }

    const result = (await response.json()) as ProductResponse;
    return (result.data ?? []).map(mapProduct);
  } catch {
    // Do not show sample products if the configured CMS is unavailable.
    return [];
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export function getDiscountedPrice(product: Product): number {
  const discount = Math.max(0, Math.min(100, product.discount));
  return Math.max(0, Math.round(product.price * (1 - discount / 100)));
}
