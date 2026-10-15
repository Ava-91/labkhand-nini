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
    <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <span className="font-bold text-rose-700">{settings.productsPageEyebrow}</span>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">{settings.productsPageTitle}</h1>
        <p className="mx-auto mt-3 max-w-2xl leading-7 text-stone-600">{settings.productsPageDescription}</p>
      </header>

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
