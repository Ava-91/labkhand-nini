"use client";

import { Heart } from "lucide-react";

import { useWishlist } from "./WishlistProvider";

type FavoriteButtonProps = {
  productId: string;
  productTitle: string;
  variant?: "card" | "detail";
};

export default function FavoriteButton({
  productId,
  productTitle,
  variant = "card",
}: FavoriteButtonProps) {
  const { isFavorite, isReady, toggleFavorite } = useWishlist();
  const favorite = isFavorite(productId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(productId)}
      disabled={!isReady}
      aria-pressed={favorite}
      aria-label={
        favorite
          ? "حذف " + productTitle + " از علاقه‌مندی‌ها"
          : "افزودن " + productTitle + " به علاقه‌مندی‌ها"
      }
      className={
        variant === "detail"
          ? "inline-flex items-center gap-2 rounded-full border border-[#f0e4e3] bg-white px-5 py-3 text-sm font-bold text-[#a84766] shadow-sm transition hover:border-[#c65f7d] hover:bg-[#fff0f3] disabled:cursor-wait disabled:opacity-60"
          : "absolute left-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-[#f0e4e3] bg-white/95 text-[#c65f7d] shadow-sm transition hover:scale-105 hover:bg-[#fff0f3] disabled:cursor-wait disabled:opacity-60"
      }
    >
      <Heart
        size={variant === "detail" ? 18 : 19}
        strokeWidth={1.8}
        fill={favorite ? "currentColor" : "none"}
        aria-hidden="true"
      />
      {variant === "detail" && (
        <span>{favorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}</span>
      )}
    </button>
  );
}
