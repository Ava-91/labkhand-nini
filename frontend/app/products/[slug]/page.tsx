import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDiscountedPrice, getProductBySlug } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";

const money = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(price) + " تومان";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "محصول پیدا نشد" };
  }

  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const hasDiscount = product.discount > 0;
  const isInStock = product.stock > 0;

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#817477]" aria-label="مسیر صفحه">
        <Link className="hover:text-[#a84766]" href="/">خانه</Link>
        <span>/</span>
        <Link className="hover:text-[#a84766]" href="/products">محصولات</Link>
        <span>/</span>
        <span className="font-semibold text-[#443a3c]">{product.title}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 md:items-start">
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fff0f3] to-[#f5effb]">
          {product.image ? (
            <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
          ) : (
            <span className="text-8xl" aria-hidden="true">{product.emoji}</span>
          )}

          {hasDiscount && (
            <span className="absolute right-5 top-5 rounded-full bg-[#c65f7d] px-4 py-2 text-sm font-bold text-white">
              {new Intl.NumberFormat("fa-IR").format(product.discount)}٪ تخفیف
            </span>
          )}
        </div>

        <div className="py-2">
          <span className="text-sm font-bold text-[#a84766]">{product.category}</span>
          <h1 className="mt-3 text-3xl leading-relaxed font-black text-[#443a3c] sm:text-4xl">
            {product.title}
          </h1>
          <p className="mt-5 text-sm leading-8 text-[#817477]">{product.description}</p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <strong className="text-2xl font-black text-[#553d44]">
              {money(getDiscountedPrice(product))}
            </strong>
            {hasDiscount && (
              <del className="text-sm text-[#a49a9c]">{money(product.price)}</del>
            )}
          </div>

          <p className={isInStock
            ? "mt-5 inline-flex rounded-full bg-[#e8f5ee] px-4 py-2 text-sm font-bold text-[#367557]"
            : "mt-5 inline-flex rounded-full bg-[#fbe8ec] px-4 py-2 text-sm font-bold text-[#a84766]"
          }>
            {isInStock ? "● موجود برای انتخاب تو" : "● فعلاً ناموجود"}
          </p>

          <div className="mt-7 rounded-2xl border border-[#f0e4e3] bg-white p-5">
            <span className="text-xl text-[#c65f7d]" aria-hidden="true">♡</span>
            <p className="mt-2 text-sm leading-7 text-[#817477]">{settings.productDetailNote}</p>
          </div>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-full bg-[#c65f7d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#a84766]"
          >
            {settings.productDetailBackText}
          </Link>
        </div>
      </div>
    </main>
  );
}
