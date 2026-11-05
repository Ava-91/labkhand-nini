import type { CartItem } from "./cart";
import { getCartItemLineTotal, getCartItemUnitPrice, getCartSubtotal } from "./cart";

export type CheckoutFormData = {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
};

export type OrderLineSnapshot = {
  productId: string;
  slug: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  discount: number;
};

export type PlaceOrderPayload = CheckoutFormData & {
  items: CartItem[];
};

export type PlaceOrderResult = {
  orderCode: string;
  subtotal: number;
  status: string;
};

export function buildOrderLines(items: CartItem[]): OrderLineSnapshot[] {
  return items.map((item) => ({
    productId: item.productId,
    slug: item.slug,
    title: item.title,
    quantity: item.quantity,
    unitPrice: getCartItemUnitPrice(item),
    lineTotal: getCartItemLineTotal(item),
    discount: item.discount,
  }));
}

export function validateCheckoutForm(data: CheckoutFormData): string | null {
  const name = data.customerName.trim();
  const phone = data.phone.trim();
  const address = data.address.trim();

  if (name.length < 2) {
    return "لطفاً نام و نام خانوادگی را کامل وارد کن.";
  }

  // Iranian mobile: 09xxxxxxxxx or +989...
  const normalizedPhone = phone.replace(/[\s-]/g, "");
  const phoneOk =
    /^09\d{9}$/.test(normalizedPhone) ||
    /^\+989\d{9}$/.test(normalizedPhone) ||
    /^00989\d{9}$/.test(normalizedPhone);

  if (!phoneOk) {
    return "شماره موبایل معتبر وارد کن (مثلاً ۰۹۱۲۱۲۳۴۵۶۷).";
  }

  if (address.length < 8) {
    return "آدرس ارسال را کامل‌تر بنویس.";
  }

  return null;
}

export function generateClientOrderCode(): string {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return "LN-" + now + "-" + rand;
}

/** Submit order via Next.js API (server proxies to Strapi). */
export async function placeOrder(
  form: CheckoutFormData,
  items: CartItem[],
): Promise<PlaceOrderResult> {
  if (items.length === 0) {
    throw new Error("سبد خرید خالی است.");
  }

  const validationError = validateCheckoutForm(form);
  if (validationError) {
    throw new Error(validationError);
  }

  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      notes: form.notes?.trim() || "",
      items: buildOrderLines(items),
      subtotal: getCartSubtotal(items),
      orderCode: generateClientOrderCode(),
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    error?: string;
    orderCode?: string;
    subtotal?: number;
    status?: string;
  };

  if (!response.ok) {
    throw new Error(
      payload.error ||
        "ثبت سفارش ناموفق بود. لطفاً دوباره تلاش کن.",
    );
  }

  if (!payload.orderCode) {
    throw new Error("پاسخ سرور نامعتبر بود.");
  }

  return {
    orderCode: payload.orderCode,
    subtotal: Number(payload.subtotal ?? 0),
    status: payload.status ?? "pending",
  };
}
