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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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

  // Show Next.js's not-found page when this product does not exist.
  if (!product) {
    notFound();
  }

  const price = money(getDiscountedPrice(product));
  const originalPrice = money(product.price);
  const hasDiscount = product.discount > 0;
  const isInStock = product.stock > 0;

  return (
    <main className="container detail-page">
      <nav className="breadcrumbs" aria-label="مسیر صفحه">
        <Link href="/">خانه</Link>
        <span>/</span>
        <Link href="/products">محصولات</Link>
        <span>/</span>
        <span>{product.title}</span>
      </nav>

      <div className="detail-layout">
        <div
          className={"detail-art" + (product.image ? " has-photo" : "")}
          style={
            product.image
              ? { backgroundImage: "url(" + product.image + ")" }
              : undefined
          }
          role="img"
          aria-label={product.title}
        >
          {!product.image && <span>{product.emoji}</span>}

          {hasDiscount && (
            <span className="discount-badge">
              {new Intl.NumberFormat("fa-IR").format(product.discount)}٪ تخفیف
            </span>
          )}
        </div>

        <div className="detail-copy">
          <span className="product-category">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="detail-description">{product.description}</p>

          <div className="detail-price">
            <strong>{price}</strong>
            {hasDiscount && <del>{originalPrice}</del>}
          </div>

          <p className={"detail-stock" + (isInStock ? "" : " unavailable")}>
            ● {isInStock ? "موجود برای انتخاب تو" : "فعلاً ناموجود"}
          </p>

          <div className="detail-note">
            <span>♡</span>
            <p>{settings.productDetailNote}</p>
          </div>

          <Link
            href="/products"
            className="button button-primary button-large"
          >
            {settings.productDetailBackText}
          </Link>
        </div>
      </div>
    </main>
  );
}
