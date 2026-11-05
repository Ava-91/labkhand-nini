import { NextResponse } from "next/server";

import { getStrapiUrl } from "@/lib/strapi";

type CheckoutBody = {
  customerName?: string;
  phone?: string;
  address?: string;
  notes?: string;
  items?: unknown;
  subtotal?: number;
  orderCode?: string;
};

function isNonEmptyString(value: unknown, min = 1): value is string {
  return typeof value === "string" && value.trim().length >= min;
}

export async function POST(request: Request) {
  const strapiUrl = getStrapiUrl();

  if (!strapiUrl) {
    return NextResponse.json(
      { error: "سرویس سفارش پیکربندی نشده است (STRAPI_URL)." },
      { status: 503 },
    );
  }

  let body: CheckoutBody;

  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "بدنه درخواست نامعتبر است." }, { status: 400 });
  }

  if (
    !isNonEmptyString(body.customerName, 2) ||
    !isNonEmptyString(body.phone, 8) ||
    !isNonEmptyString(body.address, 8) ||
    !isNonEmptyString(body.orderCode, 4) ||
    !Array.isArray(body.items) ||
    body.items.length === 0 ||
    typeof body.subtotal !== "number" ||
    !Number.isFinite(body.subtotal) ||
    body.subtotal < 0
  ) {
    return NextResponse.json(
      { error: "اطلاعات سفارش ناقص یا نامعتبر است." },
      { status: 400 },
    );
  }

  const orderData = {
    orderCode: body.orderCode.trim(),
    customerName: body.customerName.trim(),
    phone: body.phone.trim(),
    address: body.address.trim(),
    notes: typeof body.notes === "string" ? body.notes.trim() : "",
    items: body.items,
    subtotal: body.subtotal,
    status: "pending",
    paymentMethod: "simulated",
  };

  try {
    const response = await fetch(strapiUrl + "/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: orderData }),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        "[checkout] Strapi order create failed:",
        response.status,
        detail.slice(0, 500),
      );

      if (response.status === 403 || response.status === 401) {
        return NextResponse.json(
          {
            error:
              "دسترسی ثبت سفارش در Strapi فعال نیست. برای نقش Public اجازه create روی Order را فعال کن.",
          },
          { status: 502 },
        );
      }

      return NextResponse.json(
        { error: "ثبت سفارش در سرور ناموفق بود." },
        { status: 502 },
      );
    }

    const result = (await response.json()) as {
      data?: {
        orderCode?: string;
        attributes?: { orderCode?: string; status?: string; subtotal?: number };
        status?: string;
        subtotal?: number;
      };
    };

    // Support both Strapi v4 (attributes) and flatter v5 shapes
    const data = result.data;
    const orderCode =
      data?.orderCode ?? data?.attributes?.orderCode ?? orderData.orderCode;
    const status =
      data?.status ?? data?.attributes?.status ?? orderData.status;
    const subtotal =
      data?.subtotal ?? data?.attributes?.subtotal ?? orderData.subtotal;

    return NextResponse.json({
      orderCode,
      status,
      subtotal: Number(subtotal),
    });
  } catch (error) {
    console.error("[checkout] Failed to reach Strapi:", error);
    return NextResponse.json(
      { error: "ارتباط با سرور سفارش برقرار نشد." },
      { status: 502 },
    );
  }
}
