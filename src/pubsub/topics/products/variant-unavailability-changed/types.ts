import type { TopicEvent } from '../../../types';

/**
 * Payload for variant-unavailability-changed: a variant was marked sold out at an outlet, or the mark was removed
 * (`isDeleted`). `getProducts` reports the mark as `variant.unavailable` and a composite refuses a marked item —
 * debounce, then re-ask `getProducts`.
 */
export interface VariantUnavailabilityChangedPayload {
  unavailability: { _id: string; productId: string; variantId: string; outletId: string; isDeleted?: boolean };
}

/**
 * Typed event for variant-unavailability-changed
 */
export type VariantUnavailabilityChangedEvent = TopicEvent<VariantUnavailabilityChangedPayload>;
