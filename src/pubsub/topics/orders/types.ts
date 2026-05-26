/**
 * Orders Topic Types
 * Aggregated types for all order-related events
 */

// Re-export all event types
export * from "./order-created/types";
export * from "./order-updated/types";
export * from "./set-active-order/types";
export * from "./get-active-order/types";
export * from "./state-transition-completed/types";
export * from "./state-transition-blocked/types";

// Import payload types for union type
import type { OrderCreatedPayload } from "./order-created/types";
import type { OrderUpdatedPayload } from "./order-updated/types";
import type { OrderActiveSetPayload } from "./set-active-order/types";
import type { OrderActiveGetPayload } from "./get-active-order/types";
import type { OrderStateTransitionCompletedPayload } from "./state-transition-completed/types";
import type { OrderStateTransitionBlockedPayload } from "./state-transition-blocked/types";

// Union type for all order event payloads
export type OrdersEventPayload =
    | OrderCreatedPayload
    | OrderUpdatedPayload
    | OrderActiveSetPayload
    | OrderActiveGetPayload
    | OrderStateTransitionCompletedPayload
    | OrderStateTransitionBlockedPayload;

// Literal types for event IDs
export type OrdersEventType =
    | "order-created"
    | "order-updated"
    | "set-active-order"
    | "get-active-order"
    | "state-transition-completed"
    | "state-transition-blocked";

