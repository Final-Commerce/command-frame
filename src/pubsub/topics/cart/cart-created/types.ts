import type { CFActiveCart } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for cart-created event
 */
export interface CartCreatedPayload {
    cart: CFActiveCart;
}

/**
 * Typed event for cart-created
 */
export type CartCreatedEvent = TopicEvent<CartCreatedPayload>;

