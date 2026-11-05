import type { CartItem } from "./cart";

export type CheckoutFormData = {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
};

export type PlaceOrderResult = {
  orderCode: string;
  subtotal: number;
  status: string;
};

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

/**
 * Submit order via Next.js API.
 * Only productId + quantity are sent; the server recomputes prices and stock.
 */
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
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
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
      payload.error || "ثبت سفارش ناموفق بود. لطفاً دوباره تلاش کن.",
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
