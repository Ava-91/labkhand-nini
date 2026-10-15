import Link from "next/link";

import ProductCatalog from "./components/ProductCatalog";
import { getProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";

export default async function HomePage() {
  const [products, settings] = await Promise.all([
    getProducts(),
    getSiteSettings(),
  ]);

  const featuredProducts = products.filter((product) => product.featured);
  const productsToShow = featuredProducts.length ? featuredProducts : products;

  return (
    <main>
      <section className="bg-gradient-to-l from-rose-100 via-orange-50 to-violet-100">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-block rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-700">
              {settings.heroKicker}
            </span>
            <h1 className="mt-5 text-4xl leading-relaxed font-black sm:text-5xl">
              {settings.heroTitle}
              <br />
              <span className="text-rose-600">{settings.heroAccent}</span>
            </h1>
            <p className="mt-4 max-w-xl leading-8 text-stone-600">
              {settings.heroDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="rounded-full bg-rose-500 px-6 py-3 font-bold text-white hover:bg-rose-600" href="/products">
                {settings.heroPrimaryCta}
              </Link>
              <a className="rounded-full border border-rose-300 bg-white/70 px-6 py-3 font-bold text-rose-800 hover:bg-white" href="#why-us">
                {settings.heroSecondaryCta}
              </a>
            </div>
            <div className="mt-6 rounded-xl bg-white/70 p-4">
              <strong className="block text-sm">{settings.heroTrustTitle}</strong>
              <span className="text-sm text-stone-600">{settings.heroTrustDescription}</span>
            </div>
          </div>

          <div className="grid min-h-64 place-items-center" aria-hidden="true">
            <div className="grid h-64 w-64 place-items-center rounded-[35%] border-8 border-white/70 bg-gradient-to-br from-rose-200 to-violet-200 text-8xl shadow-lg sm:h-80 sm:w-80 sm:text-9xl">
              🧸
            </div>
          </div>
        </div>
        <div className="border-t border-rose-200/70">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-5 gap-y-2 px-4 py-4 text-sm text-stone-600">
            <span>{settings.heroBottomFirst}</span>
            <span aria-hidden="true">♡</span>
            <span>{settings.heroBottomSecond}</span>
            <span aria-hidden="true">♡</span>
            <span>{settings.heroBottomThird}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10" aria-label="دسته‌بندی محصولات">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {settings.categoryTiles.map((tile) => (
            <Link
              href={tile.href}
              className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-white p-4 transition hover:-translate-y-1 hover:shadow-md"
              key={tile.title}
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-rose-50 text-3xl" aria-hidden="true">
                {tile.emoji}
              </span>
              <span>
                <strong className="block">{tile.title}</strong>
                <small className="text-stone-500">{tile.description}</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
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
          <section className="my-8 rounded-2xl border border-dashed border-rose-200 bg-white p-10 text-center">
            <span className="text-5xl" aria-hidden="true">🧺</span>
            <h2 className="mt-3 text-2xl font-bold">{settings.featuredTitle}</h2>
            <p className="my-3 text-stone-600">هنوز محصولی منتشر نشده. محصولات را از پنل مدیریت Strapi منتشر کنید.</p>
            <Link className="inline-block rounded-full bg-rose-500 px-5 py-3 font-bold text-white" href="/products">دیدن فروشگاه</Link>
          </section>
        )}
      </div>

      <section className="mt-10 bg-rose-50 py-12" id="why-us">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 max-w-2xl">
            <span className="font-bold text-rose-700">{settings.promisesEyebrow}</span>
            <h2 className="mt-2 text-3xl font-black">{settings.promisesTitle} <span className="text-rose-600">{settings.promisesAccent}</span></h2>
            <p className="mt-3 leading-7 text-stone-600">{settings.promisesDescription}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {settings.promiseCards.map((card) => (
              <article className="rounded-2xl border border-rose-100 bg-white p-5" key={card.title}>
                <span className="text-3xl" aria-hidden="true">{card.emoji}</span>
                <h3 className="mt-3 font-bold">{card.title}</h3>
                <p className="mt-2 text-sm leading-7 text-stone-600">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-4 py-12 sm:flex-row sm:items-center">
        <div>
          <span className="font-bold text-rose-700">{settings.closingEyebrow}</span>
          <h2 className="mt-2 text-2xl font-black">{settings.closingTitle}</h2>
          <p className="mt-2 text-stone-600">{settings.closingDescription}</p>
        </div>
        <Link className="shrink-0 rounded-full bg-rose-500 px-6 py-3 font-bold text-white hover:bg-rose-600" href="/products">
          {settings.closingCtaText}
        </Link>
      </section>
    </main>
  );
}
