import type { TopicEvent } from '../../../types';

/**
 * Payload for catalog-visibility-changed: a product was hidden or shown at an outlet. `getProducts` leaves hidden
 * products out and a composite offers only items sold at the till's outlet — debounce, then re-ask `getProducts`.
 */
export interface CatalogVisibilityChangedPayload {
  visibility: { _id: string; productId: string; outletId: string; isDeleted?: boolean };
}

/**
 * Typed event for catalog-visibility-changed
 */
export type CatalogVisibilityChangedEvent = TopicEvent<CatalogVisibilityChangedPayload>;
