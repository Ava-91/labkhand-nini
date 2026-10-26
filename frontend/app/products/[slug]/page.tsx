import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Heart, PackageCheck } from "lucide-react";
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

  if (!product) return { title: "محصول پیدا نشد" };

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

  if (!product) notFound();

  const hasDiscount = product.discount > 0;
  const isInStock = product.stock > 0;

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <nav
        className="mb-10 flex flex-wrap items-center gap-2 text-sm text-[#817477]"
        aria-label="مسیر صفحه"
      >
        <Link href="/" className="transition hover:text-[#a84766]">
          خانه
        </Link>
        <span>/</span>
        <Link href="/products" className="transition hover:text-[#a84766]">
          محصولات
        </Link>
        <span>/</span>
        <span className="font-semibold text-[#443a3c]">{product.title}</span>
      </nav>

      <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[2rem] border border-[#f0e4e3] bg-gradient-to-br from-[#fff5f5] to-[#f7f2fa] p-5 shadow-sm sm:p-8">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-8xl" aria-hidden="true">
              {product.emoji}
            </span>
          )}

          {hasDiscount && (
            <span className="absolute right-5 top-5 rounded-full bg-[#c65f7d] px-4 py-2 text-sm font-bold text-white shadow-sm">
              {new Intl.NumberFormat("fa-IR").format(product.discount)}٪ تخفیف
            </span>
          )}
        </div>

        <div className="pt-1 sm:pt-3">
          <span className="inline-flex rounded-full bg-[#fff0f3] px-3 py-1.5 text-sm font-bold text-[#a84766]">
            {product.category}
          </span>

          <h1 className="mt-4 text-3xl leading-relaxed font-black text-[#443a3c] sm:text-4xl">
            {product.title}
          </h1>

          <p className="mt-4 text-sm leading-8 text-[#817477] sm:text-base">
            {product.description}
          </p>

          <div className="mt-7 rounded-2xl bg-[#fff8f8] p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <strong className="text-2xl font-black text-[#553d44] sm:text-3xl">
                {money(getDiscountedPrice(product))}
              </strong>
              {hasDiscount && (
                <del className="text-sm text-[#a49a9c]">
                  {money(product.price)}
                </del>
              )}
            </div>

            <p
              className={`mt-4 inline-flex items-center gap-2 text-sm font-bold ${
                isInStock ? "text-[#367557]" : "text-[#a84766]"
              }`}
            >
              <PackageCheck size={17} strokeWidth={1.8} aria-hidden="true" />
              {isInStock ? "موجود برای انتخاب تو" : "فعلاً ناموجود"}
            </p>
          </div>

          <div className="mt-5 flex gap-3 rounded-2xl border border-[#f0e4e3] bg-white p-4 sm:p-5">
            <Heart
              className="mt-1 shrink-0 text-[#c65f7d]"
              size={20}
              strokeWidth={1.7}
              aria-hidden="true"
            />
            <p className="text-sm leading-7 text-[#817477]">
              {settings.productDetailNote}
            </p>
          </div>

          <Link
            href="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#e9cbd3] px-5 py-3 text-sm font-bold text-[#a84766] transition hover:bg-[#fff0f3]"
          >
            <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" />
            {settings.productDetailBackText}
          </Link>
        </div>
      </div>
    </main>
  );
}
