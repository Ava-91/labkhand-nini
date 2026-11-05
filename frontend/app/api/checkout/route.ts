import { NextResponse } from "next/server";

import { getDiscountedPrice, getProducts } from "@/lib/products";
import { getStrapiUrl } from "@/lib/strapi";

type CheckoutBody = {
  customerName?: string;
  phone?: string;
  address?: string;
  notes?: string;
  items?: unknown;
};

type ClientLine = {
  productId: string;
  quantity: number;
};

function isNonEmptyString(value: unknown, min = 1): value is string {
  return typeof value === "string" && value.trim().length >= min;
}

function parseClientLines(raw: unknown): ClientLine[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const lines: ClientLine[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") return null;

    const productId = (entry as { productId?: unknown }).productId;
    const quantity = (entry as { quantity?: unknown }).quantity;

    if (typeof productId !== "string" || productId.trim().length === 0) {
      return null;
    }

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return null;
    }

    lines.push({ productId: productId.trim(), quantity });
  }

  return lines;
}

function generateOrderCode(): string {
  const now = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return "LN-" + now + "-" + rand;
}

export async function POST(request: Request) {
  const strapiUrl = getStrapiUrl();
  const apiToken = process.env.STRAPI_API_TOKEN?.trim();

  if (!strapiUrl) {
    return NextResponse.json(
      { error: "سرویس سفارش پیکربندی نشده است (STRAPI_URL)." },
      { status: 503 },
    );
  }

  if (!apiToken) {
    return NextResponse.json(
      {
        error:
          "توکن API سرور تنظیم نشده است. STRAPI_API_TOKEN را در محیط فرانت‌اند قرار بده و Public create روی Order را باز نکن.",
      },
      { status: 503 },
    );
  }

  let body: CheckoutBody;

  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "بدنه درخواست نامعتبر است." }, { status: 400 });
  }

  const clientLines = parseClientLines(body.items);

  if (
    !isNonEmptyString(body.customerName, 2) ||
    !isNonEmptyString(body.phone, 8) ||
    !isNonEmptyString(body.address, 8) ||
    !clientLines
  ) {
    return NextResponse.json(
      { error: "اطلاعات سفارش ناقص یا نامعتبر است." },
      { status: 400 },
    );
  }

  let products;
  try {
    products = await getProducts();
  } catch (error) {
    console.error("[checkout] Failed to load catalog for order pricing:", error);
    return NextResponse.json(
      { error: "دریافت قیمت و موجودی محصولات ممکن نشد. بعداً دوباره تلاش کن." },
      { status: 502 },
    );
  }

  const byId = new Map(products.map((p) => [p.id, p]));
  const quantityById = new Map<string, number>();
  for (const line of clientLines) {
    quantityById.set(
      line.productId,
      (quantityById.get(line.productId) ?? 0) + line.quantity,
    );
  }

  const orderLines: {
    productId: string;
    slug: string;
    title: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    discount: number;
  }[] = [];

  for (const [productId, quantity] of quantityById) {
    const product = byId.get(productId);

    if (!product) {
      return NextResponse.json(
        { error: "یکی از محصولات سبد در کاتالوگ پیدا نشد." },
        { status: 400 },
      );
    }

    if (product.stock <= 0 || quantity > product.stock) {
      return NextResponse.json(
        {
          error:
            "موجودی «" +
            product.title +
            "» کافی نیست (حداکثر " +
            String(product.stock) +
            " عدد).",
        },
        { status: 400 },
      );
    }

    const unitPrice = getDiscountedPrice(product);
    orderLines.push({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
      discount: product.discount,
    });
  }

  if (orderLines.length === 0) {
    return NextResponse.json(
      { error: "سبد خرید خالی است." },
      { status: 400 },
    );
  }

  const subtotal = orderLines.reduce((sum, line) => sum + line.lineTotal, 0);
  const orderCode = generateOrderCode();

  // status and paymentMethod are always set server-side — never from the client
  // Stock is decremented inside Strapi's order.create controller (transaction)
  const orderData = {
    orderCode,
    customerName: body.customerName.trim(),
    phone: body.phone.trim(),
    address: body.address.trim(),
    notes: typeof body.notes === "string" ? body.notes.trim() : "",
    items: orderLines,
    subtotal,
    status: "pending",
    paymentMethod: "simulated",
  };

  try {
    const response = await fetch(strapiUrl + "/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiToken,
      },
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
              "توکن STRAPI_API_TOKEN نامعتبر است یا اجازه Order create / Product update ندارد. Public را باز نکن؛ از API token با این دسترسی‌ها استفاده کن.",
          },
          { status: 502 },
        );
      }

      // Strapi custom controller returns 400 when stock is insufficient at create time
      if (response.status === 400) {
        let message = "موجودی کافی نیست یا داده سفارش نامعتبر است.";
        try {
          const parsed = JSON.parse(detail) as {
            error?: { message?: string };
            message?: string;
          };
          message =
            parsed.error?.message || parsed.message || message;
        } catch {
          // keep default
        }
        return NextResponse.json({ error: message }, { status: 400 });
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

    const data = result.data;
    const savedCode =
      data?.orderCode ?? data?.attributes?.orderCode ?? orderData.orderCode;
    const status =
      data?.status ?? data?.attributes?.status ?? orderData.status;
    const savedSubtotal =
      data?.subtotal ?? data?.attributes?.subtotal ?? orderData.subtotal;

    return NextResponse.json({
      orderCode: savedCode,
      status,
      subtotal: Number(savedSubtotal),
    });
  } catch (error) {
    console.error("[checkout] Failed to reach Strapi:", error);
    return NextResponse.json(
      { error: "ارتباط با سرور سفارش برقرار نشد." },
      { status: 502 },
    );
  }
}
