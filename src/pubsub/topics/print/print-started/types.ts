import type { TopicEvent } from "../../../types";

/**
 * Payload for print-started event
 */
export interface PrintStartedPayload {
    type: "image" | "html" | "selector" | "receipt";
    options?: {
        margins?: {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
        };
        paperSize?: string;
        width?: string;
    };
    orderId?: string; // For receipt type
    globalBlockId?: string; // For receipt type
}

/**
 * Typed event for print-started
 */
export type PrintStartedEvent = TopicEvent<PrintStartedPayload>;
