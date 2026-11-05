import { factories } from '@strapi/strapi';
import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const { ApplicationError, ValidationError } = errors;

type OrderLine = {
  productId?: string;
  quantity?: number;
  title?: string;
};

type OrderCreateData = {
  orderCode?: string;
  customerName?: string;
  phone?: string;
  address?: string;
  notes?: string;
  items?: OrderLine[];
  subtotal?: number;
  status?: string;
  paymentMethod?: string;
};

export default factories.createCoreController(
  'api::order.order',
  ({ strapi }: { strapi: Core.Strapi }) => ({
    /**
     * Create an order and decrement product stock atomically so concurrent checkouts cannot oversell.
     */
    async create(ctx) {
      const body = ctx.request.body as { data?: OrderCreateData };
      const data = body?.data;

      if (!data || typeof data !== 'object') {
        return ctx.badRequest('Missing order data');
      }

      const items = data.items;
      if (!Array.isArray(items) || items.length === 0) {
        return ctx.badRequest('Order items are required');
      }

      try {
        const order = await strapi.db.transaction(async () => {
          for (const line of items) {
            const productId =
              typeof line?.productId === 'string' ? line.productId.trim() : '';
            const quantity =
              typeof line?.quantity === 'number' && Number.isInteger(line.quantity)
                ? line.quantity
                : 0;

            if (!productId || quantity < 1) {
              throw new ValidationError('Invalid order line');
            }

            const product = await strapi.documents('api::product.product').findOne({
              documentId: productId,
              status: 'published',
            });

            if (!product) {
              throw new ApplicationError(
                `Product not found or unpublished: ${productId}`,
              );
            }

            const affected = await strapi.db
              .connection('products')
              .where({ document_id: productId })
              .andWhere('stock', '>=', quantity)
              .decrement('stock', quantity);
            if (!affected) {
              throw new ApplicationError(`Insufficient stock for ${productId}`);
            }
          }

          return strapi.documents('api::order.order').create({
            data: {
              orderCode: data.orderCode,
              customerName: data.customerName,
              phone: data.phone,
              address: data.address,
              notes: data.notes ?? '',
              items: data.items,
              subtotal: data.subtotal,
              status: data.status ?? 'pending',
              paymentMethod: data.paymentMethod ?? 'simulated',
            },
          });
        });

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
