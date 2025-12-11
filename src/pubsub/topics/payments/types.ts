/**
 * Payments Topic Types
 * Aggregated types for all payment-related events
 */

// Re-export all event types
export * from "./payment-done/types";
export * from "./payment-err/types";

// Import payload types for union type
import type { PaymentDonePayload } from "./payment-done/types";
import type { PaymentErrPayload } from "./payment-err/types";

// Union type for all payment event payloads
export type PaymentsEventPayload = 
    | PaymentDonePayload
    | PaymentErrPayload;

// Literal types for event IDs
export type PaymentsEventType = 
    | "payment-done"
    | "payment-err";

