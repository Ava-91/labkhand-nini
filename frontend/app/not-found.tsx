import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
      <span className="text-6xl" aria-hidden="true">🧸</span>
      <h1 className="mt-5 text-2xl font-black text-[#443a3c]">
        این محصول رو پیدا نکردیم
      </h1>
      <p className="mt-3 text-sm leading-7 text-[#817477]">
        شاید جابه‌جا شده باشه؛ بیا دوباره با هم بگردیم.
      </p>
      <Link
        className="mt-6 rounded-full bg-[#c65f7d] px-6 py-3 text-sm font-bold text-white hover:bg-[#a84766]"
        href="/products"
      >
        دیدن محصولات
      </Link>
    </main>
  );
}
