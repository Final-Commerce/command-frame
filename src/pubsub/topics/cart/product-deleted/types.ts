import type { CFActiveProduct } from '../../../../CommonTypes';
import type { TopicEvent } from '../../../types';

/**
 * Payload for cart product-deleted event
 */
export interface CartProductDeletedPayload {
  product: CFActiveProduct;
  internalId: string;
}

/**
 * Typed event for cart product-deleted
 */
export type CartProductDeletedEvent = TopicEvent<CartProductDeletedPayload>;
