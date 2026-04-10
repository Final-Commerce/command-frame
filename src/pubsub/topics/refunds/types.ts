/**
 * Refunds Topic Types
 * Aggregated types for all refund-related events
 */

// Re-export all event types
export * from "./refund-created/types";
export * from "./refund-updated/types";
export * from "./set-active-refund/types";
export * from "./get-active-refund/types";

// Import payload types for union type
import type { RefundCreatedPayload } from "./refund-created/types";
import type { RefundUpdatedPayload } from "./refund-updated/types";
import type { RefundActiveSetPayload } from "./set-active-refund/types";
import type { RefundActiveGetPayload } from "./get-active-refund/types";

// Union type for all refund event payloads
export type RefundsEventPayload =
    | RefundCreatedPayload
    | RefundUpdatedPayload
    | RefundActiveSetPayload
    | RefundActiveGetPayload;

// Literal types for event IDs
export type RefundsEventType =
    | "refund-created"
    | "refund-updated"
    | "set-active-refund"
    | "get-active-refund";

