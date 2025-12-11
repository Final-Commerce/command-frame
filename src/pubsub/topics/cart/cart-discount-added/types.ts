import type { CFDiscount } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for cart-discount-added event
 */
export interface CartDiscountAddedPayload {
    discount: CFDiscount;
}

/**
 * Typed event for cart-discount-added
 */
export type CartDiscountAddedEvent = TopicEvent<CartDiscountAddedPayload>;

