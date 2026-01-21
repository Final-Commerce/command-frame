import type { TopicEvent } from "../../../types";

/**
 * Payload for print-error event
 */
export interface PrintErrorPayload {
    type: "image" | "html" | "selector" | "receipt";
    error: string;
    orderId?: string; // For receipt type
    globalBlockId?: string; // For receipt type
}

/**
 * Typed event for print-error
 */
export type PrintErrorEvent = TopicEvent<PrintErrorPayload>;
