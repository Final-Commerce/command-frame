/**
 * Orders Topic Types
 * Aggregated types for all order-related events
 */

// Re-export all event types
export * from "./order-created/types";
export * from "./order-updated/types";

// Import payload types for union type
import type { OrderCreatedPayload } from "./order-created/types";
import type { OrderUpdatedPayload } from "./order-updated/types";

// Union type for all order event payloads
export type OrdersEventPayload = 
    | OrderCreatedPayload
    | OrderUpdatedPayload;

// Literal types for event IDs
export type OrdersEventType = 
    | "order-created"
    | "order-updated";

