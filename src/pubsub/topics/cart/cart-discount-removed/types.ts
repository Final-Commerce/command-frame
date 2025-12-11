import type { TopicEvent } from "../../../types";

/**
 * Payload for cart-discount-removed event
 */
export interface CartDiscountRemovedPayload {
    // No additional data needed - discount was removed
}

/**
 * Typed event for cart-discount-removed
 */
export type CartDiscountRemovedEvent = TopicEvent<CartDiscountRemovedPayload>;

