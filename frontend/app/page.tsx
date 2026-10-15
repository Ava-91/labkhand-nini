import Link from "next/link";
import ProductCatalog from "./components/ProductCatalog";
import { getProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getSiteSettings()]);
  const featured = products.filter((product) => product.featured);
  const picks = featured.length ? featured : products;

  return (
    <main>
      <section className="hero-section">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="hero-kicker">{settings.heroKicker}</span>
            <h1>{settings.heroTitle}<br /><span>{settings.heroAccent}</span></h1>
            <p>{settings.heroDescription}</p>
            <div className="hero-actions">
              <Link href="/products" className="button button-primary button-large">{settings.heroPrimaryCta}</Link>
              <a href="#why-us" className="button button-outline button-large">{settings.heroSecondaryCta}</a>
            </div>
            <div className="hero-trust">
              <span className="trust-icon" aria-hidden="true">♡</span>
              <span><strong>{settings.heroTrustTitle}</strong><small>{settings.heroTrustDescription}</small></span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-sun">✦</div>
            <div className="hero-blob"><span className="hero-teddy">🧸</span><span className="hero-flower flower-one">✿</span><span className="hero-flower flower-two">✿</span><span className="hero-heart heart-one">♥</span><span className="hero-heart heart-two">♡</span></div>
            <div className="floating-note note-top"><span>☁️</span><span>{settings.heroFloatingTop}</span></div>
            <div className="floating-note note-bottom"><span>🎀</span><span>{settings.heroFloatingBottom}</span></div>
          </div>
        </div>
        <div className="hero-bottom container"><span>یک دنیا کوچولوی دوست‌داشتنی</span><span>♡</span><span>برای لحظه‌های به‌یادموندنی</span><span>♡</span><span>از اولین روز تا همیشه</span></div>
      </section>

      <section className="category-strip container" aria-label="دسته‌بندی محصولات">
        {settings.categoryTiles.map((tile) => (
          <Link href={tile.href} className="category-tile" key={tile.title}>
            <span aria-hidden="true">{tile.emoji}</span><strong>{tile.title}</strong><small>{tile.description}</small>
          </Link>
        ))}
      </section>

      <div className="container">
        {picks.length ? (
          <ProductCatalog products={picks} title={settings.featuredTitle} description={settings.featuredDescription} limit={4} />
        ) : (
          <section className="empty-state" aria-labelledby="featured-empty-title">
            <span aria-hidden="true">🧺</span>
            <h2 id="featured-empty-title">{settings.featuredTitle}</h2>
            <p>هنوز محصولی منتشر نشده. محصولات را از پنل مدیریت Strapi منتشر کنید.</p>
            <Link className="button button-primary" href="/products">دیدن فروشگاه</Link>
          </section>
        )}
      </div>

      <section className="promise-section" id="why-us">
        <div className="container promise-layout">
          <div className="promise-intro">
            <span className="eyebrow">{settings.promisesEyebrow}</span>
            <h2>{settings.promisesTitle}<br /><span>{settings.promisesAccent}</span></h2>
            <p>{settings.promisesDescription}</p>
          </div>
          {settings.promiseCards.map((card) => (
            <div className="promise-card" key={card.title}>
              <span aria-hidden="true">{card.emoji}</span><h3>{card.title}</h3><p>{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="closing-cta container">
        <span className="cta-sparkle" aria-hidden="true">✦</span>
        <div><span className="eyebrow">{settings.closingEyebrow}</span><h2>{settings.closingTitle}</h2><p>{settings.closingDescription}</p></div>
        <Link href="/products" className="button button-primary button-large">{settings.closingCtaText}</Link>
      </section>
    </main>
  );
}
