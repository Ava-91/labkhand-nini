import { factories } from '@strapi/strapi';
import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const { ApplicationError, ValidationError } = errors;

type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'fulfilled';
type PaymentMethod = 'cod' | 'simulated';

type OrderLine = {
  productId: string;
  quantity: number;
  title: string;
};

type OrderCreateData = {
  orderCode: string;
  customerName: string;
  phone: string;
  address: string;
  notes: string;
  items: OrderLine[];
  subtotal: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    value === 'pending' ||
    value === 'paid' ||
    value === 'cancelled' ||
    value === 'fulfilled'
  );
}

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === 'cod' || value === 'simulated';
}

export default factories.createCoreController(
  'api::order.order',
  ({ strapi }: { strapi: Core.Strapi }) => ({
    /**
     * Create an order and decrement product stock atomically so concurrent checkouts cannot oversell.
     */
    async create(ctx) {
      const body: unknown = ctx.request.body;

      if (!isRecord(body) || !isRecord(body.data)) {
        return ctx.badRequest('Missing order data');
      }

      const input = body.data;

      const orderCode =
        typeof input.orderCode === 'string' ? input.orderCode.trim() : '';
      const customerName =
        typeof input.customerName === 'string' ? input.customerName.trim() : '';
      const phone = typeof input.phone === 'string' ? input.phone.trim() : '';
      const address =
        typeof input.address === 'string' ? input.address.trim() : '';

      if (!orderCode || !customerName || !phone || !address) {
        return ctx.badRequest(
          'Order code, customer name, phone, and address are required',
        );
      }

      if (
        typeof input.subtotal !== 'number' ||
        !Number.isFinite(input.subtotal) ||
        input.subtotal < 0
      ) {
        return ctx.badRequest('Subtotal must be a valid non-negative number');
      }

      if (!Array.isArray(input.items) || input.items.length === 0) {
        return ctx.badRequest('Order items are required');
      }

      const items: OrderLine[] = [];

      for (const rawLine of input.items) {
        if (!isRecord(rawLine)) {
          return ctx.badRequest('Each order item must be an object');
        }

        const productId =
          typeof rawLine.productId === 'string' ? rawLine.productId.trim() : '';
        const quantity = rawLine.quantity;
        const title =
          typeof rawLine.title === 'string' ? rawLine.title.trim() : '';

        if (
          !productId ||
          typeof quantity !== 'number' ||
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          (rawLine.title !== undefined && typeof rawLine.title !== 'string')
        ) {
          return ctx.badRequest('Each order item needs a product ID and a positive integer quantity');
        }

        items.push({ productId, quantity, title });
      }

      const notes =
        input.notes === undefined || input.notes === null
          ? ''
          : typeof input.notes === 'string'
            ? input.notes.trim()
            : null;

      if (notes === null) {
        return ctx.badRequest('Order notes must be a string');
      }

      const requestedStatus = input.status ?? 'pending';
      if (!isOrderStatus(requestedStatus)) {
        return ctx.badRequest('Invalid order status');
      }

      // A public checkout must never be able to mark an order as paid or fulfilled.
      if (requestedStatus !== 'pending') {
        return ctx.badRequest('New orders must have pending status');
      }

      const requestedPaymentMethod = input.paymentMethod ?? 'simulated';
      if (!isPaymentMethod(requestedPaymentMethod)) {
        return ctx.badRequest('Invalid payment method');
      }

      const data: OrderCreateData = {
        orderCode,
        customerName,
        phone,
        address,
        notes,
        items,
        subtotal: input.subtotal,
        status: 'pending',
        paymentMethod: requestedPaymentMethod,
      };

      try {
        const order = await strapi.db.transaction(async () => {
          const orderItems: OrderLine[] = [];

          for (const line of data.items) {
            const product = await strapi.documents('api::product.product').findOne({
              documentId: line.productId,
              status: 'published',
            });

            if (!product) {
              throw new ApplicationError(
                `Product not found or unpublished: ${line.productId}`,
              );
            }

            const affected = await strapi.db
              .connection('products')
              .where({ document_id: line.productId })
              .andWhere('stock', '>=', line.quantity)
              .decrement('stock', line.quantity);

            if (!affected) {
              throw new ApplicationError(
                `Insufficient stock for ${line.productId}`,
              );
            }

            orderItems.push({
              ...line,
              title:
                typeof product.title === 'string' ? product.title : line.title,
            });
          }

          return strapi.documents('api::order.order').create({
            data: {
              orderCode: data.orderCode,
              customerName: data.customerName,
              phone: data.phone,
              address: data.address,
              notes: data.notes,
              items: orderItems,
              subtotal: data.subtotal,
              status: data.status,
              paymentMethod: data.paymentMethod,
            },
          });
        });

        if (
          typeof this.sanitizeOutput !== 'function' ||
          typeof this.transformResponse !== 'function'
        ) {
          throw new Error('Strapi core controller response helpers are unavailable');
        }

        const sanitized = await this.sanitizeOutput(order, ctx);
        return this.transformResponse(sanitized);
      } catch (error) {
        if (
          error instanceof ApplicationError ||
          error instanceof ValidationError
        ) {
          return ctx.badRequest(error.message);
        }

        throw error;
      }
    },
  }),
);
