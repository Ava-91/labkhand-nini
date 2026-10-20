import Link from "next/link";

import type { SiteSettings } from "@/lib/site-settings";

export default function HeroSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-[#fff8f2] via-[#fff0f1] to-[#f5effb]">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-12 sm:px-8 md:min-h-[470px] md:grid-cols-2 md:py-16">
        <div>
          <span className="inline-flex rounded-full border border-[#f4dfe6] bg-white px-4 py-2 text-xs font-extrabold text-[#a84766]">
            {settings.heroKicker}
          </span>

          <h1 className="mt-5 text-4xl leading-relaxed font-black tracking-tight text-[#443a3c] sm:text-5xl">
            {settings.heroTitle}
            <br />
            <span className="text-[#c65f7d]">{settings.heroAccent}</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-8 text-[#7e6e72] sm:text-base">
            {settings.heroDescription}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-[#c65f7d] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#a84766]"
            >
              {settings.heroPrimaryCta}
            </Link>
            <a
              href="#why-us"
              className="rounded-full border border-[#e2c6cf] bg-white/80 px-6 py-3 text-sm font-bold text-[#76515e] transition hover:bg-white"
            >
              {settings.heroSecondaryCta}
            </a>
          </div>

          <div className="mt-7 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-xl text-[#c65f7d]">
              ♡
            </span>
            <span className="flex flex-col">
              <strong className="text-sm">{settings.heroTrustTitle}</strong>
              <small className="mt-1 text-xs text-[#817477]">
                {settings.heroTrustDescription}
              </small>
            </span>
          </div>
        </div>

        <div className="relative mx-auto grid min-h-72 w-full max-w-md place-items-center sm:min-h-96" aria-hidden="true">
          <span className="absolute right-8 top-5 text-4xl text-[#d6a263]">✦</span>
          <div className="grid aspect-square w-[78%] place-items-center rounded-[48%_52%_45%_55%/49%_43%_57%_51%] border-[10px] border-white/60 bg-gradient-to-br from-[#f9dfe4] via-[#e8e0f4] to-[#e8d4db] shadow-2xl shadow-[#b16d82]/20">
            <span className="text-8xl drop-shadow-lg sm:text-9xl">🧸</span>
          </div>
          <span className="absolute left-4 top-1/4 rounded-2xl border border-[#f2e2e6] bg-white px-4 py-3 text-xs font-bold shadow-lg">
            ☁️ {settings.heroFloatingTop}
          </span>
          <span className="absolute bottom-8 right-2 rounded-2xl border border-[#f2e2e6] bg-white px-4 py-3 text-xs font-bold shadow-lg">
            🎀 {settings.heroFloatingBottom}
          </span>
          <span className="absolute bottom-10 left-10 text-3xl text-[#c65f7d]">✿</span>
          <span className="absolute right-8 top-1/3 text-3xl text-[#a89acb]">♡</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-5 pb-6 text-xs font-semibold text-[#76515e] sm:px-8 sm:text-sm">
        <span>{settings.heroBottomFirst}</span>
        <span aria-hidden="true">♡</span>
        <span>{settings.heroBottomSecond}</span>
        <span aria-hidden="true">♡</span>
        <span>{settings.heroBottomThird}</span>
      </div>
    </section>
  );
}
