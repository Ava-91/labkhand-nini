"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { getDiscountedPrice } from "@/lib/products";

const money = (n: number) => new Intl.NumberFormat("fa-IR").format(n) + " تومان";

export default function ProductCatalog({
  products,
  title = "انتخاب‌های دوست‌داشتنی",
  description = "چیزهای کوچکی که روزهای بزرگ‌تری از عشق می‌سازند.",
  eyebrow = "انتخاب شده با عشق",
  searchPlaceholder = "چی برای کوچولوت می‌خوای؟",
  emptyTitle = "چیزی پیدا نکردیم!",
  emptyDescription = "عبارت جست‌وجو یا دسته‌بندی رو تغییر بده و دوباره بگرد.",
  limit,
}: {
  products: Product[];
  title?: string;
  description?: string;
  eyebrow?: string;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  limit?: number;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("همه دسته‌ها");
  const [sort, setSort] = useState("recommended");
  const categories = useMemo(
    () => ["همه دسته‌ها", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("fa");
    const list = products.filter(
      (p) =>
        (!q || (p.title + " " + p.description + " " + p.category).toLocaleLowerCase("fa").includes(q)) &&
        (category === "همه دسته‌ها" || p.category === category),
    );
    if (sort === "price-asc") list.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b));
    if (sort === "price-desc") list.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a));
    if (sort === "newest") list.sort((a, b) => b.id.localeCompare(a.id));
    return limit ? list.slice(0, limit) : list;
  }, [products, query, category, sort, limit]);

  return (
    <section className="catalog-section" id="products" aria-labelledby="catalog-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 id="catalog-heading">{title}</h2>
          <p>{description}</p>
        </div>
        {limit ? <Link className="text-link" href="/products">دیدن همه محصولات ←</Link> : null}
      </div>
      <div className="catalog-toolbar" role="search" aria-label="جست‌وجو و فیلتر محصولات">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="جست‌وجوی محصولات"
          />
        </label>
        <label className="select-label">
          <span className="visually-hidden">فیلتر بر اساس دسته‌بندی</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="select-label">
          <span className="visually-hidden">مرتب‌سازی محصولات</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recommended">پیشنهاد لبخند نینی</option>
            <option value="newest">جدیدترین</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
          </select>
        </label>
      </div>
      {filtered.length ? (
        <div className="product-grid" aria-label="نتایج محصولات">
          {filtered.map((p) => (
            <article className="product-card" key={p.id}>
              <Link className="product-image-wrap" href={"/products/" + p.slug} aria-label={"مشاهده محصول: " + p.title}>
                {p.discount > 0 ? <span className="discount-badge">{new Intl.NumberFormat("fa-IR").format(p.discount)}٪ تخفیف</span> : null}
                <div
                  className={"product-art" + (p.image ? " has-photo" : "")}
                  style={p.image ? { backgroundImage: "url(" + p.image + ")" } : undefined}
                  role="img"
                  aria-label={"تصویر " + p.title}
                >
                  {!p.image ? <span aria-hidden="true">{p.emoji}</span> : null}
                </div>
                <span className="quick-view" aria-hidden="true">مشاهده محصول ←</span>
              </Link>
              <div className="product-card-body">
                <span className="product-category">{p.category}</span>
                <h3><Link href={"/products/" + p.slug}>{p.title}</Link></h3>
                <p className="product-description">{p.description}</p>
                <div className="product-card-bottom">
                  <div className="price-stack">
                    <strong>{money(getDiscountedPrice(p))}</strong>
                    {p.discount > 0 ? <del>{money(p.price)}</del> : null}
                  </div>
                  <span className={"stock-dot" + (p.stock > 0 ? "" : " out-of-stock")}>
                    {p.stock > 0 ? "موجود" : "ناموجود"}
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
          <button className="button button-primary" type="button" onClick={() => { setQuery(""); setCategory("همه دسته‌ها"); }}>
            نمایش همه محصولات
          </button>
        </div>
      )}
      <p className="catalog-count" role="status" aria-live="polite" aria-atomic="true">
        {new Intl.NumberFormat("fa-IR").format(filtered.length)} محصول برای انتخاب
      </p>
    </section>
  );
}
