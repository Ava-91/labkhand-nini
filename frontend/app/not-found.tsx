import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-16 text-center">
      <div>
        <span className="text-6xl" aria-hidden="true">🧸</span>
        <h1 className="mt-4 text-3xl font-black">این محصول رو پیدا نکردیم</h1>
        <p className="my-4 leading-7 text-stone-600">شاید جابه‌جا شده باشه؛ بیا دوباره با هم بگردیم.</p>
        <Link className="inline-block rounded-full bg-rose-500 px-6 py-3 font-bold text-white hover:bg-rose-600" href="/products">
          دیدن محصولات
        </Link>
      </div>
    </main>
  );
}
