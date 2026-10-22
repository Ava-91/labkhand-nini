"use client"; // مشخص می‌کند این کامپوننت در سمت کاربر اجرا می‌شود

import Link from "next/link"; // ساخت لینک‌های داخلی
import { useState } from "react"; // مدیریت وضعیت جست‌وجو و فیلترها

import { getDiscountedPrice, type Product } from "@/lib/products"; // محاسبه قیمت تخفیف‌خورده و نوع محصول
import ProductCard from "./ProductCard"; // کامپوننت نمایش کارت محصول

// تعریف پراپ‌های قابل دریافت توسط کاتالوگ
type ProductCatalogProps = {
  products: Product[]; // فهرست محصولات
  title?: string; // عنوان بخش
  description?: string; // توضیحات بخش
  eyebrow?: string; // متن کوچک بالای عنوان
  searchPlaceholder?: string; // متن راهنمای جست‌وجو
  emptyTitle?: string; // عنوان حالت بدون نتیجه
  emptyDescription?: string; // توضیح حالت بدون نتیجه
  limit?: number; // محدودیت تعداد محصولات
};

// نمایش کاتالوگ محصولات همراه جست‌وجو، فیلتر و مرتب‌سازی
export default function ProductCatalog({
  products,
  title = "انتخاب‌های دوست‌داشتنی", // عنوان پیش‌فرض
  description = "چیزهای کوچکی که روزهای بزرگ‌تری از عشق می‌سازند.", // توضیح پیش‌فرض
  eyebrow = "انتخاب شده با عشق", // متن بالای عنوان
  searchPlaceholder = "چی برای کوچولوت می‌خوای؟", // راهنمای جست‌وجو
  emptyTitle = "چیزی پیدا نکردیم!", // عنوان نبود محصول
  emptyDescription = "عبارت جست‌وجو یا دسته‌بندی رو تغییر بده و دوباره بگرد.", // راهنمای تغییر فیلتر
  limit, // تعداد محصولات قابل نمایش
}: ProductCatalogProps) {
  const [searchText, setSearchText] = useState(""); // ذخیره عبارت جست‌وجو
  const [selectedCategory, setSelectedCategory] = useState("همه دسته‌ها"); // دسته‌بندی انتخاب‌شده
  const [sortOrder, setSortOrder] = useState("recommended"); // روش مرتب‌سازی

  const categories = [
    "همه دسته‌ها", // گزینه نمایش تمام دسته‌ها
    ...new Set(products.map((product) => product.category)), // استخراج دسته‌های یکتا
  ];

  const search = searchText.trim().toLocaleLowerCase("fa"); // پاک‌کردن فاصله‌ها و یکسان‌سازی حروف

  const visibleProducts = products.filter((product) => { // فیلترکردن محصولات
    const text = [product.title, product.description, product.category]
      .join(" ") // ترکیب عنوان، توضیحات و دسته‌بندی
      .toLocaleLowerCase("fa"); // یکسان‌سازی حروف برای جست‌وجو

    const matchesSearch = text.includes(search); // بررسی تطابق عبارت جست‌وجو

    const matchesCategory =
      selectedCategory === "همه دسته‌ها" ||
      product.category === selectedCategory; // بررسی دسته‌بندی انتخاب‌شده

    return matchesSearch && matchesCategory; // نمایش محصول در صورت تطابق هر دو شرط
  });

  if (sortOrder === "price-asc") {
    // مرتب‌سازی از ارزان‌ترین به گران‌ترین
    visibleProducts.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
  } else if (sortOrder === "price-desc") {
    // مرتب‌سازی از گران‌ترین به ارزان‌ترین
    visibleProducts.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
  } else if (sortOrder === "newest") {
    // مرتب‌سازی بر اساس شناسه، با فرض اینکه شناسه جدیدتر ترتیب را مشخص کند
    visibleProducts.sort((a, b) => b.id.localeCompare(a.id));
  }

  const productsToShow = limit
    ? visibleProducts.slice(0, limit) // نمایش تعداد محدود محصول
    : visibleProducts; // نمایش همه محصولات مطابق فیلترها

  function resetFilters() {
    setSearchText(""); // پاک‌کردن جست‌وجو
    setSelectedCategory("همه دسته‌ها"); // بازگشت به همه دسته‌ها
    setSortOrder("recommended"); // بازگشت به ترتیب پیش‌فرض
  }

  return (
    <section
      id="products" // شناسه برای لینک مستقیم به بخش محصولات
      className="py-10 sm:py-14" // فاصله عمودی واکنش‌گرا
      aria-labelledby="catalog-heading" // اتصال بخش به عنوان برای دسترس‌پذیری
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {/* چیدمان عنوان و لینک در کنار هم در صفحه‌های بزرگ */}

        <div>
          <span className="text-xs font-extrabold text-[#a84766]">
            {eyebrow} {/* نمایش متن بالای عنوان */}
          </span>

          <h2
            id="catalog-heading"
            className="mt-2 text-2xl font-black text-[#443a3c] sm:text-3xl"
          >
            {title} {/* نمایش عنوان کاتالوگ */}
          </h2>

          <p className="mt-2 text-sm leading-7 text-[#817477]">
            {description} {/* نمایش توضیحات کاتالوگ */}
          </p>
        </div>

        {limit && ( // فقط در صورت تعیین محدودیت، لینک همه محصولات نمایش داده می‌شود
          <Link
            className="text-sm font-bold text-[#a84766] hover:text-[#81364f]"
            href="/products" // رفتن به صفحه کامل محصولات
          >
            دیدن همه محصولات ←
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_220px_220px]">
        {/* چیدمان ورودی جست‌وجو و دو فیلتر */}

        <label className="flex items-center gap-3 rounded-2xl border border-[#f0e4e3] bg-white px-4 py-3 focus-within:border-[#c65f7d]">
          <span className="text-xl text-[#a84766]" aria-hidden="true">
            ⌕ {/* آیکون جست‌وجو */}
          </span>

          <input
            type="search" // ورودی جست‌وجو
            value={searchText} // مقدار فعلی جست‌وجو
            onChange={(event) => setSearchText(event.target.value)} // به‌روزرسانی با تایپ کاربر
            placeholder={searchPlaceholder} // متن راهنمای ورودی
            aria-label="جست‌وجوی محصولات" // نام قابل‌دسترسی ورودی
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#a49a9c]"
          />
        </label>

        <label>
          <span className="sr-only">فیلتر بر اساس دسته‌بندی</span>
          {/* عنوان مخفی برای ابزارهای دسترس‌پذیری */}

          <select
            value={selectedCategory} // دسته فعلی
            onChange={(event) => setSelectedCategory(event.target.value)} // تغییر دسته
            className="w-full rounded-2xl border border-[#f0e4e3] bg-white px-4 py-3 text-sm outline-none focus:border-[#c65f7d]"
          >
            {categories.map((category) => ( // ساخت گزینه برای هر دسته
              <option key={category} value={category}>
                {category} {/* متن گزینه */}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">مرتب‌سازی محصولات</span>
          {/* عنوان مخفی فهرست مرتب‌سازی */}

          <select
            value={sortOrder} // روش مرتب‌سازی فعلی
            onChange={(event) => setSortOrder(event.target.value)} // تغییر روش مرتب‌سازی
            className="w-full rounded-2xl border border-[#f0e4e3] bg-white px-4 py-3 text-sm outline-none focus:border-[#c65f7d]"
          >
            <option value="recommended">پیشنهاد لبخند نینی</option> {/* ترتیب پیش‌فرض */}
            <option value="newest">جدیدترین</option> {/* نمایش جدیدترین‌ها */}
            <option value="price-asc">ارزان‌ترین</option> {/* قیمت صعودی */}
            <option value="price-desc">گران‌ترین</option> {/* قیمت نزولی */}
          </select>
        </label>
      </div>

      {productsToShow.length > 0 ? ( // اگر محصولی برای نمایش وجود دارد
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* چیدمان کارت‌ها در ستون‌های واکنش‌گرا */}

          {productsToShow.map((product) => ( // ساخت کارت برای هر محصول
            <ProductCard key={product.id} product={product} /> // ارسال اطلاعات محصول به کارت
          ))}
        </div>
      ) : (
        // اگر هیچ محصولی مطابق فیلترها نبود
        <div className="mt-6 rounded-3xl border border-dashed border-[#e8c6d1] bg-white px-6 py-12 text-center">
          <span className="text-5xl" aria-hidden="true">
            🧺 {/* آیکون سبد خالی */}
          </span>

          <h3 className="mt-4 text-lg font-extrabold text-[#553d44]">
            {emptyTitle} {/* عنوان پیام خالی */}
          </h3>

          <p className="mt-2 text-sm leading-7 text-[#817477]">
            {emptyDescription} {/* توضیح نبود نتیجه */}
          </p>

          <button
            type="button" // جلوگیری از ارسال ناخواسته فرم
            onClick={resetFilters} // پاک‌کردن همه فیلترها
            className="mt-5 rounded-full bg-[#c65f7d] px-5 py-3 text-sm font-bold text-white hover:bg-[#a84766]"
          >
            نمایش همه محصولات
          </button>
        </div>
      )}

      <p
        className="mt-5 text-center text-xs text-[#817477]"
        role="status" // معرفی متن به‌عنوان وضعیت قابل اعلام
        aria-live="polite" // اعلام تغییر تعداد محصولات به صفحه‌خوان
      >
        {new Intl.NumberFormat("fa-IR").format(productsToShow.length)}{" "}
        {/* نمایش تعداد با ارقام فارسی */}
        محصول برای انتخاب
      </p>
    </section>
  );
}