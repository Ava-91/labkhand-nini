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
type ProductResponse = { data?: RawRecord[]; meta?: { pagination?: { pageCount?: number } } };

function mediaUrl(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return;
  const record = value as RawRecord;
  const inner = record.data ?? value;
  if (Array.isArray(inner)) return mediaUrl(inner[0]);
  if (!inner || typeof inner !== "object") return;
  const media = inner as RawRecord;
  const fields = (media.attributes && typeof media.attributes === "object" ? media.attributes : media) as RawRecord;
  return typeof fields.url === "string" ? fields.url : undefined;
}

function mapProduct(item: RawRecord): Product {
  const fields = (item.attributes && typeof item.attributes === "object" ? item.attributes : item) as RawRecord;
  const rawCategory = fields.category as RawRecord | undefined;
  const categoryData = rawCategory?.data ?? rawCategory;
  const categoryFields = categoryData && typeof categoryData === "object"
    ? (((categoryData as RawRecord).attributes ?? categoryData) as RawRecord)
    : undefined;
  const title = String(fields.title ?? fields.name ?? "محصول لبخند نینی");
  const slug = String(fields.slug ?? String(item.documentId ?? item.id ?? title).toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  const category = String(categoryFields?.name ?? fields.categoryName ?? "سایر محصولات");
  const image = mediaUrl(fields.image ?? fields.images ?? fields.cover);
  const base = getStrapiUrl();
  const imageUrl = image && (image.startsWith("http://") || image.startsWith("https://"))
    ? image
    : image && base ? base + (image.startsWith("/") ? image : "/" + image) : undefined;
  const emojis: Record<string, string> = {
    "لباس نوزاد": "🧸", "خواب و آرامش": "☁️", "هدیه و سیسمونی": "🎁",
    "غذاخوری": "🍓", "مراقبت روزانه": "🫧", "بازی و سرگرمی": "🐰",
  };
  return {
    id: String(item.documentId ?? item.id ?? slug),
    documentId: typeof item.documentId === "string" ? item.documentId : undefined,
    slug,
    title,
    description: String(fields.description ?? ""),
    price: Number(fields.price ?? 0),
    discount: Number(fields.discount ?? 0),
    stock: Number(fields.stock ?? 0),
    category,
    image: imageUrl,
    emoji: String(fields.emoji ?? emojis[category] ?? "🧸"),
    featured: Boolean(fields.featured ?? fields.isFeatured ?? false),
  };
}

export async function getProducts(): Promise<Product[]> {
  const base = getStrapiUrl();
  // Local JSON is only a development fallback when Strapi has not been configured.
  if (!base) return localProducts as Product[];

  try {
    const response = await fetch(
      base + "/api/products?populate=*&pagination[pageSize]=100",
      { cache: "no-store" },
    );
    if (!response.ok) return [];
    const json = (await response.json()) as ProductResponse;
    return (json.data ?? []).map(mapProduct);
  } catch {
    // Do not silently show stale sample products when the configured CMS is down.
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((product) => product.slug === slug);
}

export function getDiscountedPrice(product: Product): number {
  return Math.max(0, Math.round(product.price * (1 - Math.max(0, Math.min(100, product.discount)) / 100)));
}
