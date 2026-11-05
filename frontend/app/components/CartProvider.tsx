"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  CART_STORAGE_KEY,
  getCartItemCount,
  getCartSubtotal,
  productToCartItem,
  type CartItem,
  type CartState,
} from "@/lib/cart";
import type { Product } from "@/lib/products";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isReady: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as CartState;
    if (!parsed || !Array.isArray(parsed.items)) return [];

    return parsed.items.filter(
      (item) =>
        item &&
        typeof item.productId === "string" &&
        typeof item.quantity === "number" &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;

  try {
    const state: CartState = { items };
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors (private mode, quota, etc.)
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setItems(loadCartFromStorage());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    saveCartToStorage(items);
  }, [items, isReady]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    if (product.stock <= 0) return;

    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      const safeQty = Math.max(1, quantity);

      if (existing) {
        const nextQty = Math.min(product.stock, existing.quantity + safeQty);
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: nextQty, stock: product.stock }
            : item,
        );
      }

      return [
        ...prev,
        productToCartItem(product, Math.min(product.stock, safeQty)),
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.productId === productId);
      if (!item) return prev;

      if (quantity <= 0) {
        return prev.filter((i) => i.productId !== productId);
      }

      const nextQty = Math.min(item.stock, quantity);
      return prev.map((i) =>
        i.productId === productId ? { ...i, quantity: nextQty } : i,
      );
    });
  }, []);

  const increment = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity: Math.min(item.stock, item.quantity + 1),
            }
          : item,
      ),
    );
  }, []);

  const decrement = useCallback((productId: string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (productId: string) => {
      return items.find((item) => item.productId === productId)?.quantity ?? 0;
    },
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: getCartItemCount(items),
      subtotal: getCartSubtotal(items),
      isReady,
      addItem,
      removeItem,
      setQuantity,
      increment,
      decrement,
      clearCart,
      getItemQuantity,
    }),
    [
      items,
      isReady,
      addItem,
      removeItem,
      setQuantity,
      increment,
      decrement,
      clearCart,
      getItemQuantity,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
