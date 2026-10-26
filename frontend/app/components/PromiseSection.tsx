import { BadgeCheck, HeartHandshake, ShieldCheck, Sparkles, Truck } from "lucide-react";

import type { SiteSettings } from "@/lib/site-settings";

function getPromiseIcon(title: string) {
  const normalizedTitle = title.toLocaleLowerCase("fa");

  if (normalizedTitle.includes("ارسال") || normalizedTitle.includes("تحویل")) return Truck;
  if (normalizedTitle.includes("امن") || normalizedTitle.includes("اعتماد")) return ShieldCheck;
  if (normalizedTitle.includes("پشتیبانی") || normalizedTitle.includes("همراه")) return HeartHandshake;
  if (normalizedTitle.includes("کیفیت") || normalizedTitle.includes("تضمین")) return BadgeCheck;

  return Sparkles;
}

export default function PromiseSection({ settings }: { settings: SiteSettings }) {
  return (
    <section id="why-us" className="bg-[#fff3f2] py-14 sm:py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-5 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="mb-2 md:col-span-2 lg:col-span-1">
          <span className="text-xs font-extrabold text-[#a84766]">
            {settings.promisesEyebrow}
          </span>
          <h2 className="mt-3 text-3xl leading-relaxed font-black text-[#443a3c]">
            {settings.promisesTitle}
            <br />
            <span className="text-[#c65f7d]">{settings.promisesAccent}</span>
          </h2>
          <p className="mt-3 text-sm leading-8 text-[#817477]">
            {settings.promisesDescription}
          </p>
        </div>

        {settings.promiseCards.map((card) => (
          <article
            key={card.title}
            className="rounded-3xl border border-white bg-white/80 p-6 shadow-sm"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f3] text-[#c65f7d]">
              {(() => {
                const Icon = getPromiseIcon(card.title);
                return <Icon size={24} strokeWidth={1.7} aria-hidden="true" />;
              })()}
            </span>
            <h3 className="mt-4 font-extrabold text-[#553d44]">{card.title}</h3>
            <p className="mt-2 text-sm leading-7 text-[#817477]">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
