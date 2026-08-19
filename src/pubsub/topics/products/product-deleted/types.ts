import type { TopicEvent } from '../../../types';

/**
 * Payload for product-deleted event
 */
export interface ProductDeletedPayload {
  productId: string;
  deletedVariantIds: string[];
}

/**
 * Typed event for product-deleted
 */
export type ProductDeletedEvent = TopicEvent<ProductDeletedPayload>;
