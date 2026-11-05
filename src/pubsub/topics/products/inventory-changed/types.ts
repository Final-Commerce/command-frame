import type { TopicEvent } from '../../../types';

/**
 * Payload for inventory-changed (B35): a variant's stock at an outlet moved. A composite may turn Sold out or
 * Unavailable by its components' shelves — debounce, then re-ask `getProducts`.
 */
export interface InventoryChangedPayload {
  inventory: { _id: string; variantId: string; outletId: string; quantity?: number | null; manageStock?: boolean };
}

/**
 * Typed event for inventory-changed
 */
export type InventoryChangedEvent = TopicEvent<InventoryChangedPayload>;
