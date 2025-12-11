import type { TopicEvent } from "../../../types";

/**
 * Payload for cart-fee-removed event
 */
export interface CartFeeRemovedPayload {
    feeIndex: number;
}

/**
 * Typed event for cart-fee-removed
 */
export type CartFeeRemovedEvent = TopicEvent<CartFeeRemovedPayload>;

