import localProducts from "@/data/products.json"; // دریافت محصولات محلی از فایل JSON

import { getStrapiUrl } from "./strapi"; // دریافت آدرس سرور Strapi

// تعریف ساختار اطلاعات محصول
export type Product = {
  id: string; // شناسه محصول
  documentId?: string; // شناسه سند در Strapi
  slug: string; // آدرس اختصاصی محصول
  title: string; // عنوان محصول
  description: string; // توضیحات محصول
  price: number; // قیمت اصلی
  discount: number; // درصد تخفیف
  stock: number; // تعداد موجودی
  category: string; // دسته‌بندی محصول
  image?: string; // آدرس تصویر محصول، در صورت وجود
  emoji: string; // ایموجی جایگزین یا نمایشی محصول
  featured: boolean; // مشخص می‌کند محصول ویژه است یا نه
};

// تعریف ساختار تصویر دریافتی از Strapi
type StrapiMedia = {
  url?: string; // آدرس تصویر
};

// تعریف ساختار دسته‌بندی در Strapi
type StrapiCategory = {
  name?: string; // نام دسته‌بندی
};

// تعریف ساختار محصول دریافتی از Strapi
type StrapiProduct = {
  id: number; // شناسه عددی محصول
  documentId?: string; // شناسه سند
  slug?: string; // آدرس اختصاصی محصول
  title?: string; // عنوان محصول
  description?: string; // توضیحات محصول
  price?: number; // قیمت محصول
  discount?: number; // درصد تخفیف
  stock?: number; // موجودی محصول
  category?: StrapiCategory | null; // دسته‌بندی محصول یا مقدار خالی
  image?: StrapiMedia | null; // تصویر محصول یا مقدار خالی
  emoji?: string; // ایموجی محصول
  featured?: boolean; // وضعیت ویژه بودن محصول
};

// تعریف ساختار پاسخ API محصولات
type ProductsResponse = {
  data: StrapiProduct[]; // آرایه محصولات دریافتی
};

// تعیین ایموجی پیش‌فرض برای هر دسته‌بندی
const categoryEmojis: Record<string, string> = {
  "لباس نوزاد": "🧸",
  "خواب و آرامش": "☁️",
  "هدیه و سیسمونی": "🎁",
  غذاخوری: "🍓",
  "مراقبت روزانه": "🫧",
  "بازی و سرگرمی": "🐰",
};

// تبدیل مسیر تصویر به آدرس کامل
function getImageUrl(path?: string) {
  if (!path) return undefined; // اگر مسیری وجود ندارد، تصویری برنگردان

  // اگر آدرس کامل است، همان را برگردان
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const strapiUrl = getStrapiUrl(); // دریافت آدرس اصلی Strapi
  return strapiUrl ? strapiUrl + path : undefined; // ساخت آدرس کامل تصویر
}

// تبدیل محصول Strapi به ساختار استاندارد برنامه
function mapProduct(item: StrapiProduct): Product {
  // انتخاب نام دسته‌بندی یا مقدار پیش‌فرض
  const category = item.category?.name ?? "سایر محصولات";

  return {
    id: String(item.documentId ?? item.id), // تبدیل شناسه به رشته
    documentId: item.documentId, // نگهداری شناسه سند
    slug: item.slug ?? String(item.documentId ?? item.id), // تعیین آدرس محصول
    title: item.title ?? "محصول لبخند نینی", // تعیین عنوان پیش‌فرض
    description: item.description ?? "", // توضیحات یا رشته خالی
    price: Number(item.price ?? 0), // تبدیل قیمت به عدد
    discount: Number(item.discount ?? 0), // تبدیل تخفیف به عدد
    stock: Number(item.stock ?? 0), // تبدیل موجودی به عدد
    category, // ثبت دسته‌بندی
    image: getImageUrl(item.image?.url), // تبدیل مسیر تصویر به آدرس کامل
    emoji: item.emoji ?? categoryEmojis[category] ?? "🧸", // انتخاب ایموجی محصول یا دسته‌بندی
    featured: item.featured ?? false, // مقدار پیش‌فرض برای محصول ویژه
  };
}

// دریافت فهرست محصولات
export async function getProducts(): Promise<Product[]> {
  const strapiUrl = getStrapiUrl(); // بررسی آدرس سرور Strapi

  // اگر Strapi تنظیم نشده، از محصولات محلی استفاده کن
  if (!strapiUrl) {
    return localProducts as Product[];
  }

  try {
    // درخواست دریافت محصولات از API همراه با تصاویر و اطلاعات مرتبط
    const response = await fetch(
      strapiUrl + "/api/products?populate=*&pagination[pageSize]=100",
      { cache: "no-store" }, // جلوگیری از استفاده از پاسخ کش‌شده
    );

    if (!response.ok) return []; // در صورت خطای پاسخ، آرایه خالی برگردان

    // تبدیل پاسخ API به داده‌های قابل استفاده
    const result = (await response.json()) as ProductsResponse;

    // تبدیل تمام محصولات به ساختار استاندارد
    return result.data.map(mapProduct);
  } catch {
    return []; // در صورت بروز خطا هنگام درخواست، آرایه خالی برگردان
  }
}

// پیدا کردن محصول با استفاده از آدرس اختصاصی آن
export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const products = await getProducts(); // دریافت همه محصولات
  return products.find((product) => product.slug === slug); // پیدا کردن محصول موردنظر
}

// محاسبه قیمت نهایی پس از اعمال تخفیف
export function getDiscountedPrice(product: Product): number {
  // محدود کردن درصد تخفیف به بازه صفر تا صد
  const discount = Math.max(0, Math.min(100, product.discount));

  // محاسبه قیمت تخفیف‌خورده و جلوگیری از قیمت منفی
  return Math.max(0, Math.round(product.price * (1 - discount / 100)));
}