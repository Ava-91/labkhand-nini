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

  // Build the category list from the products we have.
  const categories = useMemo(
    () => [
      "همه دسته‌ها",
      ...Array.from(new Set(products.map((product) => product.category))),
    ],
    [products],
  );

  // Search, filter, sort, and optionally limit the products.
  const visibleProducts = useMemo(() => {
    const search = searchText.trim().toLocaleLowerCase("fa");

    const matches = products.filter((product) => {
      const searchableText =
        product.title + " " + product.description + " " + product.category;

      const matchesSearch = searchableText
        .toLocaleLowerCase("fa")
        .includes(search);
      const matchesCategory =
        selectedCategory === "همه دسته‌ها" ||
        product.category === selectedCategory;

      return (!search || matchesSearch) && matchesCategory;
    });

    if (sortOrder === "price-asc") {
      matches.sort(
        (a, b) => getDiscountedPrice(a) - getDiscountedPrice(b),
      );
    }

    if (sortOrder === "price-desc") {
      matches.sort(
        (a, b) => getDiscountedPrice(b) - getDiscountedPrice(a),
      );
    }

    if (sortOrder === "newest") {
      matches.sort((a, b) => b.id.localeCompare(a.id));
    }

    return limit ? matches.slice(0, limit) : matches;
  }, [products, searchText, selectedCategory, sortOrder, limit]);

  function resetFilters() {
    setSearchText("");
    setSelectedCategory("همه دسته‌ها");
  }

  return (
    <section
      className="catalog-section"
      id="products"
      aria-labelledby="catalog-heading"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 id="catalog-heading">{title}</h2>
          <p>{description}</p>
        </div>

        {limit && (
          <Link className="text-link" href="/products">
            دیدن همه محصولات ←
          </Link>
        )}
      </div>

      <div
        className="catalog-toolbar"
        role="search"
        aria-label="جست‌وجو و فیلتر محصولات"
      >
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label="جست‌وجوی محصولات"
          />
        </label>

        <label className="select-label">
          <span className="visually-hidden">فیلتر بر اساس دسته‌بندی</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="select-label">
          <span className="visually-hidden">مرتب‌سازی محصولات</span>
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="recommended">پیشنهاد لبخند نینی</option>
            <option value="newest">جدیدترین</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
          </select>
        </label>
      </div>

      {visibleProducts.length > 0 ? (
        <div className="product-grid" aria-label="نتایج محصولات">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <Link
                className="product-image-wrap"
                href={"/products/" + product.slug}
                aria-label={"مشاهده محصول: " + product.title}
              >
                {product.discount > 0 && (
                  <span className="discount-badge">
                    {new Intl.NumberFormat("fa-IR").format(
                      product.discount,
                    )}
                    ٪ تخفیف
                  </span>
                )}

                <div
                  className={
                    "product-art" + (product.image ? " has-photo" : "")
                  }
                  style={
                    product.image
                      ? { backgroundImage: "url(" + product.image + ")" }
                      : undefined
                  }
                  role="img"
                  aria-label={"تصویر " + product.title}
                >
                  {!product.image && (
                    <span aria-hidden="true">{product.emoji}</span>
                  )}
                </div>

                <span className="quick-view" aria-hidden="true">
                  مشاهده محصول ←
                </span>
              </Link>

              <div className="product-card-body">
                <span className="product-category">{product.category}</span>
                <h3>
                  <Link href={"/products/" + product.slug}>
                    {product.title}
                  </Link>
                </h3>
                <p className="product-description">{product.description}</p>

                <div className="product-card-bottom">
                  <div className="price-stack">
                    <strong>
                      {money(getDiscountedPrice(product))}
                    </strong>
                    {product.discount > 0 && <del>{money(product.price)}</del>}
                  </div>

                  <span
                    className={
                      "stock-dot" +
                      (product.stock > 0 ? "" : " out-of-stock")
                    }
                  >
                    {product.stock > 0 ? "موجود" : "ناموجود"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">🧺</span>
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
          <button
            className="button button-primary"
            type="button"
            onClick={resetFilters}
          >
            نمایش همه محصولات
          </button>
        </div>
      )}

      <p
        className="catalog-count"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {new Intl.NumberFormat("fa-IR").format(visibleProducts.length)} محصول
        برای انتخاب
      </p>
    </section>
  );
}
