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

// تعریف ساختار پاسخ API محصولات (با متادیتای صفحه‌بندی Strapi)
type ProductsResponse = {
  data: StrapiProduct[]; // آرایه محصولات دریافتی
  meta?: {
    pagination?: {
      page?: number;
      pageSize?: number;
      pageCount?: number;
      total?: number;
    };
  };
};

/** Page size for catalog fetches. All pages are walked until complete. */
const PRODUCTS_PAGE_SIZE = 100;

/** Safety cap so a bad API cannot loop forever. */
const PRODUCTS_MAX_PAGES = 100;

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

function buildProductsPageUrl(
  strapiUrl: string,
  page: number,
  pageSize: number,
): string {
  const params = new URLSearchParams();
  params.set("populate", "*");
  params.set("pagination[page]", String(page));
  params.set("pagination[pageSize]", String(pageSize));
  return strapiUrl + "/api/products?" + params.toString();
}

async function fetchProductsPage(
  strapiUrl: string,
  page: number,
  pageSize: number,
): Promise<ProductsResponse> {
  const response = await fetch(buildProductsPageUrl(strapiUrl, page, pageSize), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      "Unable to load products from Strapi (HTTP " +
        response.status +
        ", page " +
        page +
        "). Check the public product.find permission and publish the products.",
    );
  }

  const result = (await response.json()) as ProductsResponse;

  if (!Array.isArray(result.data)) {
    throw new Error(
      "Strapi returned an unexpected products response on page " +
        page +
        ". Check the /api/products endpoint.",
    );
  }

  return result;
}

// دریافت فهرست کامل محصولات (همه صفحات)
export async function getProducts(): Promise<Product[]> {
  const strapiUrl = getStrapiUrl(); // بررسی آدرس سرور Strapi

  // فروشگاه فقط از Strapi داده می‌خواند و به داده‌های محلی برنمی‌گردد
  if (!strapiUrl) {
    throw new Error(
      "STRAPI_URL is not configured. The storefront requires Strapi and has no local products fallback.",
    );
  }

  try {
    const allRaw: StrapiProduct[] = [];

    // First page establishes pagination metadata
    const first = await fetchProductsPage(strapiUrl, 1, PRODUCTS_PAGE_SIZE);
    allRaw.push(...first.data);

    const pageCount = Math.max(
      1,
      Number(first.meta?.pagination?.pageCount ?? 1),
    );
    const total = Number(first.meta?.pagination?.total);

    if (pageCount > PRODUCTS_MAX_PAGES) {
      throw new Error(
        "Strapi reported too many product pages (" +
          pageCount +
          "). Refusing incomplete catalog load so cart sync cannot drop valid items.",
      );
    }

    // Fetch remaining pages sequentially so a mid-way failure aborts the whole load
    for (let page = 2; page <= pageCount; page += 1) {
      const next = await fetchProductsPage(strapiUrl, page, PRODUCTS_PAGE_SIZE);
      allRaw.push(...next.data);
    }

    // If Strapi reported a total, ensure we did not silently truncate
    if (Number.isFinite(total) && total >= 0 && allRaw.length < total) {
      throw new Error(
        "Incomplete product catalog: received " +
          allRaw.length +
          " of " +
          total +
          " products. Cart sync requires a full catalog.",
      );
    }

    return allRaw.map(mapProduct);
  } catch (error) {
    // خطای ارتباطی یا پاسخ نامعتبر نباید با فروشگاه خالی پنهان شود
    console.error("[storefront] Failed to load products from Strapi:", error);
    throw error;
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
