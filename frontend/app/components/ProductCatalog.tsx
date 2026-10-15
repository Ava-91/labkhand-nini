"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { getDiscountedPrice } from "@/lib/products";
import type { Product } from "@/lib/products";

const money = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(price) + " تومان";

type ProductCatalogProps = {
  products: Product[];
  title?: string;
  description?: string;
  eyebrow?: string;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  limit?: number;
};

export default function ProductCatalog({
  products,
  title = "انتخاب‌های دوست‌داشتنی",
  description = "چیزهای کوچکی که روزهای بزرگ‌تری از عشق می‌سازند.",
  eyebrow = "انتخاب شده با عشق",
  searchPlaceholder = "چی برای کوچولوت می‌خوای؟",
  emptyTitle = "چیزی پیدا نکردیم!",
  emptyDescription = "عبارت جست‌وجو یا دسته‌بندی رو تغییر بده و دوباره بگرد.",
  limit,
}: ProductCatalogProps) {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه دسته‌ها");
  const [sortOrder, setSortOrder] = useState("recommended");

  const categories = useMemo(
    () => [
      "همه دسته‌ها",
      ...Array.from(new Set(products.map((product) => product.category))),
    ],
    [products],
  );

  const visibleProducts = useMemo(() => {
    const search = searchText.trim().toLocaleLowerCase("fa");
    const matches = products.filter((product) => {
      const text = (product.title + " " + product.description + " " + product.category).toLocaleLowerCase("fa");
      const matchesSearch = text.includes(search);
      const matchesCategory = selectedCategory === "همه دسته‌ها" || product.category === selectedCategory;
      return (!search || matchesSearch) && matchesCategory;
    });

    if (sortOrder === "price-asc") {
      matches.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
    }
    if (sortOrder === "price-desc") {
      matches.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
    }
    if (sortOrder === "newest") {
      matches.sort((a, b) => b.id.localeCompare(a.id));
    }

    return limit ? matches.slice(0, limit) : matches;
  }, [products, searchText, selectedCategory, sortOrder, limit]);

  function resetFilters() {
    setSearchText("");
    setSelectedCategory("همه دسته‌ها");
    setSortOrder("recommended");
  }

  const inputClass = "w-full rounded-xl border border-rose-100 bg-white px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-rose-400";

  return (
    <section className="py-8" id="products" aria-labelledby="catalog-heading">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="font-bold text-rose-700">{eyebrow}</span>
          <h2 className="mt-1 text-2xl font-black">{title}</h2>
          <p className="mt-2 text-sm leading-7 text-stone-600">{description}</p>
        </div>
        {limit && (
          <Link className="shrink-0 font-bold text-rose-700 hover:text-rose-900" href="/products">
            دیدن همه محصولات ←
          </Link>
        )}
      </div>

      <div className="mb-6 grid gap-3 rounded-2xl border border-rose-100 bg-rose-50/60 p-3 md:grid-cols-[2fr_1fr_1fr]">
        <label>
          <span className="sr-only">جست‌وجوی محصولات</span>
          <input
            className={inputClass}
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label="جست‌وجوی محصولات"
          />
        </label>

        <label>
          <span className="sr-only">فیلتر بر اساس دسته‌بندی</span>
          <select className={inputClass} value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>

        <label>
          <span className="sr-only">مرتب‌سازی محصولات</span>
          <select className={inputClass} value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
            <option value="recommended">پیشنهاد لبخند نینی</option>
            <option value="newest">جدیدترین</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
          </select>
        </label>
      </div>

      {visibleProducts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="نتایج محصولات">
          {visibleProducts.map((product) => (
            <article className="overflow-hidden rounded-2xl border border-rose-100 bg-white transition hover:-translate-y-1 hover:shadow-md" key={product.id}>
              <Link className="relative block p-3" href={"/products/" + product.slug} aria-label={"مشاهده محصول: " + product.title}>
                {product.discount > 0 && (
                  <span className="absolute right-5 top-5 z-10 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">
                    {new Intl.NumberFormat("fa-IR").format(product.discount)}٪ تخفیف
                  </span>
                )}
                <div
                  className="grid aspect-[1/0.88] place-items-center rounded-xl bg-gradient-to-br from-rose-100 to-violet-100 bg-cover bg-center text-7xl"
                  style={product.image ? { backgroundImage: "url(" + product.image + ")" } : undefined}
                  role="img"
                  aria-label={"تصویر " + product.title}
                >
                  {!product.image && <span aria-hidden="true">{product.emoji}</span>}
                </div>
              </Link>

              <div className="p-4">
                <span className="text-xs font-bold text-rose-700">{product.category}</span>
                <h3 className="mt-1 font-bold">
                  <Link className="hover:text-rose-700" href={"/products/" + product.slug}>{product.title}</Link>
                </h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-stone-500">{product.description}</p>

                <div className="mt-4 flex items-end justify-between gap-2 border-t border-rose-50 pt-3">
                  <div>
                    <strong className="block text-sm">{money(getDiscountedPrice(product))}</strong>
                    {product.discount > 0 && <del className="text-xs text-stone-400">{money(product.price)}</del>}
                  </div>
                  <span className={"text-xs font-bold " + (product.stock > 0 ? "text-green-700" : "text-rose-700")}>
                    {product.stock > 0 ? "موجود" : "ناموجود"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-rose-200 bg-white p-8 text-center">
          <span className="text-4xl" aria-hidden="true">🧺</span>
          <h3 className="mt-3 text-xl font-bold">{emptyTitle}</h3>
          <p className="my-3 text-sm text-stone-600">{emptyDescription}</p>
          <button className="rounded-full bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-600" type="button" onClick={resetFilters}>
            نمایش همه محصولات
          </button>
        </div>
      )}

      <p className="mt-5 text-center text-xs text-stone-500" role="status" aria-live="polite" aria-atomic="true">
        {new Intl.NumberFormat("fa-IR").format(visibleProducts.length)} محصول برای انتخاب
      </p>
    </section>
  );
}
