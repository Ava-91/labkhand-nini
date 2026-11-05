"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";

import type { Product } from "@/lib/products";
import ProductCard from "../components/ProductCard";
import { useWishlist } from "../components/WishlistProvider";

export default function WishlistContent({ products }: { products: Product[] }) {
  const { wishlist, isReady, toggleFavorite } = useWishlist();
  const favoriteProducts = products.filter((product) =>
    wishlist.includes(product.id),
  );

  if (!isReady) {
    return (
      <div className="rounded-3xl border border-[#f0e4e3] bg-white p-10 text-center text-sm text-[#817477]">
        در حال بارگذاری علاقه‌مندی‌ها...
      </div>
    );
  }

  return (
    <section>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-extrabold text-[#a84766]">انتخاب‌های تو</span>
          <h1 className="mt-2 text-3xl font-black text-[#443a3c]">لیست علاقه‌مندی‌ها</h1>
          <p className="mt-2 text-sm text-[#817477]">
            محصولاتی که دوست داری اینجا نگه داشته می‌شوند.
          </p>
        </div>
        <span className="rounded-full bg-[#fff0f3] px-4 py-2 text-sm font-bold text-[#a84766]">
          {new Intl.NumberFormat("fa-IR").format(favoriteProducts.length)} محصول
        </span>
      </div>

      {favoriteProducts.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="flex flex-col gap-3">
              <ProductCard product={product} />
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                className="inline-flex self-start items-center gap-2 rounded-full border border-[#f0e4e3] bg-white px-4 py-2 text-xs font-bold text-[#a84766] shadow-sm transition hover:border-[#c65f7d] hover:bg-[#fff0f3]"
                aria-label={"حذف " + product.title + " از علاقه‌مندی‌ها"}
              >
                <Trash2 size={15} aria-hidden="true" />
                حذف از فهرست
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#e8c6d1] bg-white px-6 py-14 text-center">
          <Heart className="mx-auto text-[#c65f7d]" size={42} strokeWidth={1.5} />
          <h2 className="mt-4 text-xl font-extrabold text-[#553d44]">
            هنوز محصولی انتخاب نکردی
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#817477]">
            با زدن دکمه قلب روی کارت یا صفحه هر محصول، آن را به این فهرست اضافه کن.
          </p>
          <Link
            href="/products"
            className="mt-5 inline-flex rounded-full bg-[#c65f7d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#a84766]"
          >
            دیدن محصولات
          </Link>
        </div>
      )}
    </section>
  );
}
