import type { CFOrder } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for order-created event
 */
export interface OrderCreatedPayload {
    order: CFOrder;
}

/**
 * Typed event for order-created
 */
export type OrderCreatedEvent = TopicEvent<OrderCreatedPayload>;

