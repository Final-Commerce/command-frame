import type { CFRefundItem } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for refund-updated event
 */
export interface RefundUpdatedPayload {
    refund: CFRefundItem;
    orderId: string;
}

/**
 * Typed event for refund-updated
 */
export type RefundUpdatedEvent = TopicEvent<RefundUpdatedPayload>;

