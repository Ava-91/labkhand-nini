import type { Product } from "./products";

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

/** Merge live product fields onto a cart line (keeps quantity, clamps to stock). */
export function applyProductToCartItem(
  item: CartItem,
  product: Product,
): CartItem {
  const stock = Math.max(0, product.stock);

  return {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    discount: product.discount,
    image: product.image,
    emoji: product.emoji,
    quantity: stock > 0 ? Math.min(item.quantity, stock) : 0,
    stock,
  };
}

export function productToCartItem(product: Product, quantity = 1): CartItem {
  const stock = Math.max(0, product.stock);
  return {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    discount: product.discount,
    image: product.image,
    emoji: product.emoji,
    quantity: Math.min(Math.max(1, quantity), stock || 1),
    stock,
  };
}

/**
 * Reconcile stored cart lines with the live catalog.
 * - Updates price, discount, stock, and display fields from products
 * - Clamps quantity to current stock
 * - Removes lines for products missing from the catalog or with zero stock
 * Call only after a successful catalog fetch.
 */
export function syncCartItemsWithProducts(
  items: CartItem[],
  products: Product[],
): CartItem[] {
  const byId = new Map(products.map((p) => [p.id, p]));

  return items
    .map((item) => {
      const product = byId.get(item.productId);
      if (!product) return null; // unpublished or deleted
      return applyProductToCartItem(item, product);
    })
    .filter((item): item is CartItem => item !== null && item.quantity > 0 && item.stock > 0);
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
