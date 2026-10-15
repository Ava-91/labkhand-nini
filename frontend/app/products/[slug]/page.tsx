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

  if (!product) return { title: "محصول پیدا نشد" };

  return { title: product.title, description: product.description };
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
    <main className="mx-auto min-h-[60vh] max-w-5xl px-4 py-8">
      <nav className="mb-8 flex flex-wrap gap-2 text-sm text-stone-500" aria-label="مسیر صفحه">
        <Link className="hover:text-rose-700" href="/">خانه</Link>
        <span>/</span>
        <Link className="hover:text-rose-700" href="/products">محصولات</Link>
        <span>/</span>
        <span className="text-stone-800">{product.title}</span>
      </nav>

      <div className="grid items-center gap-8 md:grid-cols-2">
        <div
          className="relative grid aspect-square min-h-64 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-rose-100 to-violet-100 bg-cover bg-center text-8xl sm:text-9xl"
          style={product.image ? { backgroundImage: "url(" + product.image + ")" } : undefined}
          role="img"
          aria-label={product.title}
        >
          {!product.image && <span>{product.emoji}</span>}
          {hasDiscount && (
            <span className="absolute right-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-sm font-bold text-white">
              {new Intl.NumberFormat("fa-IR").format(product.discount)}٪ تخفیف
            </span>
          )}
        </div>

        <div>
          <span className="font-bold text-rose-700">{product.category}</span>
          <h1 className="mt-2 text-3xl leading-relaxed font-black">{product.title}</h1>
          <p className="mt-4 leading-8 text-stone-600">{product.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <strong className="text-2xl text-rose-700">{money(getDiscountedPrice(product))}</strong>
            {hasDiscount && <del className="text-stone-400">{money(product.price)}</del>}
          </div>

          <p className={"mt-4 text-sm font-bold " + (isInStock ? "text-green-700" : "text-rose-700")}>
            {isInStock ? "● موجود برای انتخاب تو" : "● فعلاً ناموجود"}
          </p>

          <p className="mt-5 rounded-xl bg-rose-50 p-4 leading-7 text-rose-900">{settings.productDetailNote}</p>
          <Link className="mt-6 inline-block rounded-full bg-rose-500 px-6 py-3 font-bold text-white hover:bg-rose-600" href="/products">
            {settings.productDetailBackText}
          </Link>
        </div>
      </div>
    </main>
  );
}
