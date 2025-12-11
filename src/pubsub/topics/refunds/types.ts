/**
 * Refunds Topic Types
 * Aggregated types for all refund-related events
 */

// Re-export all event types
export * from "./refund-created/types";
export * from "./refund-updated/types";

// Import payload types for union type
import type { RefundCreatedPayload } from "./refund-created/types";
import type { RefundUpdatedPayload } from "./refund-updated/types";

// Union type for all refund event payloads
export type RefundsEventPayload = 
    | RefundCreatedPayload
    | RefundUpdatedPayload;

// Literal types for event IDs
export type RefundsEventType = 
    | "refund-created"
    | "refund-updated";

