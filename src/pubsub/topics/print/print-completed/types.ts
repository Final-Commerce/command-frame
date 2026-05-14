import type { TopicEvent } from "../../../types";

/**
 * Payload for print-completed event
 */
export interface PrintCompletedPayload {
    type: "image" | "html" | "receipt";
    orderId?: string; // For receipt type
    globalBlockId?: string; // For receipt type
}

/**
 * Typed event for print-completed
 */
export type PrintCompletedEvent = TopicEvent<PrintCompletedPayload>;
