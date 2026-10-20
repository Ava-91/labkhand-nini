import Link from "next/link";

import CategoryTiles from "./components/CategoryTiles";
import ClosingCTA from "./components/ClosingCTA";
import HeroSection from "./components/HeroSection";
import ProductCatalog from "./components/ProductCatalog";
import PromiseSection from "./components/PromiseSection";
import { getProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";

export default async function HomePage() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSiteSettings(),
  ]);

  const featuredProducts = products.filter((product) => product.featured);
  const productsToShow = featuredProducts.length > 0 ? featuredProducts : products;

  return (
    <main>
      <HeroSection settings={settings} />
      <CategoryTiles settings={settings} />

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {productsToShow.length > 0 ? (
          <ProductCatalog
            products={productsToShow}
            title={settings.featuredTitle}
            description={settings.featuredDescription}
            eyebrow={settings.catalogEyebrow}
            searchPlaceholder={settings.catalogSearchPlaceholder}
            emptyTitle={settings.catalogEmptyTitle}
            emptyDescription={settings.catalogEmptyDescription}
            limit={4}
          />
        ) : (
          <section className="my-10 rounded-3xl border border-dashed border-[#e8c6d1] bg-white p-8 text-center">
            <span className="text-5xl" aria-hidden="true">🧺</span>
            <h2 className="mt-4 text-xl font-extrabold text-[#553d44]">
              {settings.featuredTitle}
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#817477]">
              هنوز محصولی منتشر نشده. محصولات را از پنل مدیریت Strapi منتشر کنید.
            </p>
            <Link
              className="mt-5 inline-flex rounded-full bg-[#c65f7d] px-5 py-3 text-sm font-bold text-white hover:bg-[#a84766]"
              href="/products"
            >
              دیدن فروشگاه
            </Link>
          </section>
        )}
      </div>

      <PromiseSection settings={settings} />
      <div className="px-5 sm:px-8">
        <ClosingCTA settings={settings} />
      </div>
    </main>
  );
}
