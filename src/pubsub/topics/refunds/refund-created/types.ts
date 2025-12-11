import type { CFRefundItem } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for refund-created event
 */
export interface RefundCreatedPayload {
    refund: CFRefundItem;
    orderId: string;
}

/**
 * Typed event for refund-created
 */
export type RefundCreatedEvent = TopicEvent<RefundCreatedPayload>;

