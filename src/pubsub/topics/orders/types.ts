/**
 * Orders Topic Types
 * Aggregated types for all order-related events
 */

// Re-export all event types
export * from "./order-created/types";
export * from "./order-updated/types";
export * from "./set-active-order/types";
export * from "./get-active-order/types";

// Import payload types for union type
import type { OrderCreatedPayload } from "./order-created/types";
import type { OrderUpdatedPayload } from "./order-updated/types";
import type { OrderActiveSetPayload } from "./set-active-order/types";
import type { OrderActiveGetPayload } from "./get-active-order/types";

// Union type for all order event payloads
export type OrdersEventPayload =
    | OrderCreatedPayload
    | OrderUpdatedPayload
    | OrderActiveSetPayload
    | OrderActiveGetPayload;

// Literal types for event IDs
export type OrdersEventType =
    | "order-created"
    | "order-updated"
    | "set-active-order"
    | "get-active-order";

