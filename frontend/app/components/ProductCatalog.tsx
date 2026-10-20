"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

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
    () => ["همه دسته‌ها", ...new Set(products.map((product) => product.category))],
    [products],
  );

  const visibleProducts = useMemo(() => {
    const search = searchText.trim().toLocaleLowerCase("fa");

    const matches = products.filter((product) => {
      const text = [product.title, product.description, product.category]
        .join(" ")
        .toLocaleLowerCase("fa");

      const matchesSearch = text.includes(search);
      const matchesCategory =
        selectedCategory === "همه دسته‌ها" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (sortOrder === "price-asc") {
      matches.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      matches.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "newest") {
      matches.sort((a, b) => b.id.localeCompare(a.id));
    }

    return limit ? matches.slice(0, limit) : matches;
  }, [products, searchText, selectedCategory, sortOrder, limit]);

  function resetFilters() {
    setSearchText("");
    setSelectedCategory("همه دسته‌ها");
    setSortOrder("recommended");
  }

  return (
    <section id="products" className="py-10 sm:py-14" aria-labelledby="catalog-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-extrabold text-[#a84766]">{eyebrow}</span>
          <h2 id="catalog-heading" className="mt-2 text-2xl font-black text-[#443a3c] sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#817477]">{description}</p>
        </div>

        {limit && (
          <Link className="text-sm font-bold text-[#a84766] hover:text-[#81364f]" href="/products">
            دیدن همه محصولات ←
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_220px_220px]">
        <label className="flex items-center gap-3 rounded-2xl border border-[#f0e4e3] bg-white px-4 py-3 focus-within:border-[#c65f7d]">
          <span className="text-xl text-[#a84766]" aria-hidden="true">⌕</span>
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label="جست‌وجوی محصولات"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#a49a9c]"
          />
        </label>

        <label>
          <span className="sr-only">فیلتر بر اساس دسته‌بندی</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="w-full rounded-2xl border border-[#f0e4e3] bg-white px-4 py-3 text-sm outline-none focus:border-[#c65f7d]"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <label>
          <span className="sr-only">مرتب‌سازی محصولات</span>
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            className="w-full rounded-2xl border border-[#f0e4e3] bg-white px-4 py-3 text-sm outline-none focus:border-[#c65f7d]"
          >
            <option value="recommended">پیشنهاد لبخند نینی</option>
            <option value="newest">جدیدترین</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
          </select>
        </label>
      </div>

      {visibleProducts.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-[#e8c6d1] bg-white px-6 py-12 text-center">
          <span className="text-5xl" aria-hidden="true">🧺</span>
          <h3 className="mt-4 text-lg font-extrabold text-[#553d44]">{emptyTitle}</h3>
          <p className="mt-2 text-sm leading-7 text-[#817477]">{emptyDescription}</p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 rounded-full bg-[#c65f7d] px-5 py-3 text-sm font-bold text-white hover:bg-[#a84766]"
          >
            نمایش همه محصولات
          </button>
        </div>
      )}

      <p className="mt-5 text-center text-xs text-[#817477]" role="status" aria-live="polite">
        {new Intl.NumberFormat("fa-IR").format(visibleProducts.length)} محصول برای انتخاب
      </p>
    </section>
  );
}
