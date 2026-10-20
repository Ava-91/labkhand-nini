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

type StrapiMedia = {
  url?: string;
};

type StrapiCategory = {
  name?: string;
};

type StrapiProduct = {
  id: number;
  documentId?: string;
  slug?: string;
  title?: string;
  description?: string;
  price?: number;
  discount?: number;
  stock?: number;
  category?: StrapiCategory | null;
  image?: StrapiMedia | null;
  emoji?: string;
  featured?: boolean;
};

type ProductsResponse = {
  data: StrapiProduct[];
};

const categoryEmojis: Record<string, string> = {
  "لباس نوزاد": "🧸",
  "خواب و آرامش": "☁️",
  "هدیه و سیسمونی": "🎁",
  غذاخوری: "🍓",
  "مراقبت روزانه": "🫧",
  "بازی و سرگرمی": "🐰",
};

function getImageUrl(path?: string) {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const strapiUrl = getStrapiUrl();
  return strapiUrl ? strapiUrl + path : undefined;
}

function mapProduct(item: StrapiProduct): Product {
  const category = item.category?.name ?? "سایر محصولات";

  return {
    id: String(item.documentId ?? item.id),
    documentId: item.documentId,
    slug: item.slug ?? String(item.documentId ?? item.id),
    title: item.title ?? "محصول لبخند نینی",
    description: item.description ?? "",
    price: Number(item.price ?? 0),
    discount: Number(item.discount ?? 0),
    stock: Number(item.stock ?? 0),
    category,
    image: getImageUrl(item.image?.url),
    emoji: item.emoji ?? categoryEmojis[category] ?? "🧸",
    featured: item.featured ?? false,
  };
}

export async function getProducts(): Promise<Product[]> {
  const strapiUrl = getStrapiUrl();

  if (!strapiUrl) {
    return localProducts as Product[];
  }

  try {
    const response = await fetch(
      strapiUrl + "/api/products?populate=*&pagination[pageSize]=100",
      { cache: "no-store" },
    );

    if (!response.ok) return [];

    const result = (await response.json()) as ProductsResponse;
    return result.data.map(mapProduct);
  } catch {
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
