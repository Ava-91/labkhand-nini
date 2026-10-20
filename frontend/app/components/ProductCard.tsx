import Link from "next/link";

import { getDiscountedPrice, type Product } from "@/lib/products";

const money = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(price) + " تومان";

export default function ProductCard({ product }: { product: Product }) {
  const discountedPrice = getDiscountedPrice(product);
  const hasDiscount = product.discount > 0;

  return (
    <article className="overflow-hidden rounded-3xl border border-[#f0e4e3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={"/products/" + product.slug}
        className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-gradient-to-br from-[#fff0f3] to-[#f5effb]"
        aria-label={"مشاهده محصول: " + product.title}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <span className="text-6xl" aria-hidden="true">{product.emoji}</span>
        )}

        {hasDiscount && (
          <span className="absolute right-3 top-3 rounded-full bg-[#c65f7d] px-3 py-1 text-xs font-bold text-white">
            {new Intl.NumberFormat("fa-IR").format(product.discount)}٪ تخفیف
          </span>
        )}
      </Link>

      <div className="p-5">
        <span className="text-xs font-bold text-[#a84766]">{product.category}</span>
        <h3 className="mt-2 text-base font-extrabold text-[#443a3c]">
          <Link className="hover:text-[#a84766]" href={"/products/" + product.slug}>
            {product.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-[#817477]">
          {product.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col">
            <strong className="text-sm font-extrabold text-[#553d44]">
              {money(discountedPrice)}
            </strong>
            {hasDiscount && (
              <del className="mt-1 text-xs text-[#a49a9c]">{money(product.price)}</del>
            )}
          </div>
          <span className={product.stock > 0
            ? "rounded-full bg-[#e8f5ee] px-3 py-1 text-xs font-bold text-[#367557]"
            : "rounded-full bg-[#fbe8ec] px-3 py-1 text-xs font-bold text-[#a84766]"
          }>
            {product.stock > 0 ? "موجود" : "ناموجود"}
          </span>
        </div>
      </div>
    </article>
  );
}
