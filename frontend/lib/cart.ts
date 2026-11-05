import type { Product } from "./products";
import { getDiscountedPrice } from "./products";

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  price: number;
  discount: number;
  image?: string;
  emoji: string;
  quantity: number;
  stock: number;
};

export type CartState = {
  items: CartItem[];
};

export const CART_STORAGE_KEY = "labkhand-nini-cart";

export function productToCartItem(product: Product, quantity = 1): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    discount: product.discount,
    image: product.image,
    emoji: product.emoji,
    quantity: Math.max(1, quantity),
    stock: product.stock,
  };
}

export function getCartItemUnitPrice(item: CartItem): number {
  const discount = Math.max(0, Math.min(100, item.discount));
  return Math.max(0, Math.round(item.price * (1 - discount / 100)));
}

export function getCartItemLineTotal(item: CartItem): number {
  return getCartItemUnitPrice(item) * item.quantity;
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + getCartItemLineTotal(item), 0);
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function formatMoney(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}
