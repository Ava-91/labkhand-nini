import type { Metadata } from "next"; // تعریف اطلاعات متادیتای صفحه
import Link from "next/link"; // ساخت لینک‌های داخلی
import { Heart } from "lucide-react"; // آیکون قلب
import { notFound } from "next/navigation"; // نمایش صفحه 404 در صورت نبود محصول

import { getDiscountedPrice, getProductBySlug } from "@/lib/products"; // دریافت محصول و محاسبه قیمت تخفیف‌خورده
import { getSiteSettings } from "@/lib/site-settings"; // دریافت تنظیمات سایت

// تبدیل قیمت به اعداد فارسی همراه واحد تومان
const money = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(price) + " تومان";

// تعریف نوع پارامترهای صفحه
type PageProps = {
  params: Promise<{ slug: string }>; // دریافت شناسه متنی محصول از آدرس
};

// تولید عنوان و توضیحات سئو برای صفحه محصول
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; // دریافت اسلاگ محصول
  const product = await getProductBySlug(slug); // پیدا کردن محصول

  if (!product) {
    return { title: "محصول پیدا نشد" }; // عنوان صفحه در صورت نبود محصول
  }

  return {
    title: product.title, // عنوان صفحه از نام محصول
    description: product.description, // توضیحات صفحه برای موتورهای جست‌وجو
  };
}

// نمایش صفحه جزئیات یک محصول
export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params; // استخراج اسلاگ از آدرس

  const [product, settings] = await Promise.all([
    getProductBySlug(slug), // دریافت اطلاعات محصول
    getSiteSettings(), // دریافت تنظیمات سایت به‌صورت هم‌زمان
  ]);

  if (!product) {
    notFound(); // نمایش صفحه 404 اگر محصول پیدا نشود
  }

  const hasDiscount = product.discount > 0; // بررسی وجود تخفیف
  const isInStock = product.stock > 0; // بررسی موجود بودن محصول

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
      {/* محتوای اصلی صفحه با عرض محدود و فاصله واکنش‌گرا */}

      <nav
        className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#817477]"
        aria-label="مسیر صفحه" // معرفی مسیر صفحه به ابزارهای دسترس‌پذیری
      >
        <Link className="hover:text-[#a84766]" href="/">
          خانه {/* لینک صفحه اصلی */}
        </Link>
        <span>/</span>
        <Link className="hover:text-[#a84766]" href="/products">
          محصولات {/* لینک فهرست محصولات */}
        </Link>
        <span>/</span>
        <span className="font-semibold text-[#443a3c]">
          {product.title} {/* نام محصول فعلی در مسیر */}
        </span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        {/* تقسیم صفحه به دو ستون در نمایشگرهای بزرگ */}

        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fff0f3] to-[#f5effb]">
          {/* بخش تصویر محصول با پس‌زمینه گرادیانی */}

          {product.image ? ( // اگر تصویر محصول وجود داشته باشد
            <img
              src={product.image} // آدرس تصویر محصول
              alt={product.title} // متن جایگزین تصویر
              className="h-full w-full object-cover" // پرکردن کادر بدون تغییر نسبت تصویر
            />
          ) : (
            <span className="text-8xl" aria-hidden="true">
              {product.emoji} {/* نمایش ایموجی در نبود تصویر */}
            </span>
          )}

          {hasDiscount && ( // نمایش نشان تخفیف فقط برای محصولات تخفیف‌دار
            <span className="absolute right-5 top-5 rounded-full bg-[#c65f7d] px-4 py-2 text-sm font-bold text-white">
              {new Intl.NumberFormat("fa-IR").format(product.discount)}٪ تخفیف
              {/* نمایش درصد تخفیف با اعداد فارسی */}
            </span>
          )}
        </div>

        <div className="py-2">
          <span className="text-sm font-bold text-[#a84766]">
            {product.category} {/* دسته‌بندی محصول */}
          </span>

          <h1 className="mt-3 text-3xl leading-relaxed font-black text-[#443a3c] sm:text-4xl">
            {product.title} {/* عنوان اصلی صفحه */}
          </h1>

          <p className="mt-5 text-sm leading-8 text-[#817477]">
            {product.description} {/* توضیحات محصول */}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            {/* بخش نمایش قیمت */}

            <strong className="text-2xl font-black text-[#553d44]">
              {money(getDiscountedPrice(product))}
              {/* نمایش قیمت نهایی با اعمال تخفیف */}
            </strong>

            {hasDiscount && ( // نمایش قیمت قبلی در صورت وجود تخفیف
              <del className="text-sm text-[#a49a9c]">
                {money(product.price)} {/* قیمت اصلی خط‌خورده */}
              </del>
            )}
          </div>

          <p
            className={isInStock
              ? "mt-5 inline-flex rounded-full bg-[#e8f5ee] px-4 py-2 text-sm font-bold text-[#367557]"
              : "mt-5 inline-flex rounded-full bg-[#fbe8ec] px-4 py-2 text-sm font-bold text-[#a84766]"
            }
            // تغییر رنگ نشان موجودی بر اساس وضعیت محصول
          >
            {isInStock ? "● موجود برای انتخاب تو" : "● فعلاً ناموجود"}
            {/* نمایش وضعیت موجودی */}
          </p>

          <div className="mt-7 rounded-2xl border border-[#f0e4e3] bg-white p-5">
            {/* کادر توضیح تکمیلی محصول */}

            <Heart className="text-[#c65f7d]" size={22} strokeWidth={1.7} aria-hidden="true" />

            <p className="mt-2 text-sm leading-7 text-[#817477]">
              {settings.productDetailNote} {/* متن تکمیلی از تنظیمات سایت */}
            </p>
          </div>

          <Link
            href="/products" // بازگشت به فهرست محصولات
            className="mt-6 inline-flex rounded-full bg-[#c65f7d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#a84766]"
          >
            {settings.productDetailBackText} {/* متن دکمه بازگشت */}
          </Link>
        </div>
      </div>
    </main>
  );
}