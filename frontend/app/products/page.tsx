import type { Metadata } from "next";

import ProductCatalog from "../components/ProductCatalog";
import { getProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings.productsPageTitle,
    description: settings.productsPageDescription,
  };
}

export default async function ProductsPage() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSiteSettings(),
  ]);

  return (
    <main className="mx-auto min-h-[60vh] w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="max-w-2xl">
        <span className="text-xs font-extrabold text-[#a84766]">
          {settings.productsPageEyebrow}
        </span>
        <h1 className="mt-3 text-3xl font-black text-[#443a3c] sm:text-4xl">
          {settings.productsPageTitle}
        </h1>
        <p className="mt-3 text-sm leading-8 text-[#817477]">
          {settings.productsPageDescription}
        </p>
      </div>

      <ProductCatalog
        products={products}
        title={settings.featuredTitle}
        description={settings.featuredDescription}
        eyebrow={settings.catalogEyebrow}
        searchPlaceholder={settings.catalogSearchPlaceholder}
        emptyTitle={settings.catalogEmptyTitle}
        emptyDescription={settings.catalogEmptyDescription}
      />
    </main>
  );
}
