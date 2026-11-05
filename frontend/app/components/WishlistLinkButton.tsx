"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { useWishlist } from "./WishlistProvider";

export default function WishlistLinkButton() {
  const { wishlist, isReady } = useWishlist();

  return (
    <Link
      href="/wishlist"
      className="relative inline-flex items-center justify-center rounded-full border border-[#f0e4e3] bg-white p-2.5 text-[#a84766] transition hover:border-[#c65f7d] hover:bg-[#fff0f3]"
      aria-label={
        isReady && wishlist.length > 0
          ? "علاقه‌مندی‌ها، " +
            new Intl.NumberFormat("fa-IR").format(wishlist.length) +
            " محصول"
          : "علاقه‌مندی‌ها"
      }
    >
      <Heart size={20} strokeWidth={1.8} aria-hidden="true" />
      {isReady && wishlist.length > 0 && (
        <span className="absolute -left-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#c65f7d] px-1 text-[10px] font-bold text-white">
          {new Intl.NumberFormat("fa-IR").format(
            wishlist.length > 99 ? 99 : wishlist.length,
          )}
        </span>
      )}
    </Link>
  );
}
