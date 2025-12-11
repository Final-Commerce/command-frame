import type { CFOrder } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for order-updated event
 */
export interface OrderUpdatedPayload {
    order: CFOrder;
}

/**
 * Typed event for order-updated
 */
export type OrderUpdatedEvent = TopicEvent<OrderUpdatedPayload>;

