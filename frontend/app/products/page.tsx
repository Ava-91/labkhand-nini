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
    <main className="page-shell container">
      <div className="page-intro">
        <span className="eyebrow">{settings.productsPageEyebrow}</span>
        <h1>{settings.productsPageTitle}</h1>
        <p>{settings.productsPageDescription}</p>
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
