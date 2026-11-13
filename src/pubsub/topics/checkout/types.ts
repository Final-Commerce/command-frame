/**
 * Checkout Topic Types
 * Aggregated types for all online-checkout events
 */

// Re-export all event types
export * from "./checkout-started/types";
export * from "./payment-completed/types";
export * from "./payment-failed/types";

// Import payload types for union type
import type { CheckoutStartedPayload } from "./checkout-started/types";
import type { PaymentCompletedPayload } from "./payment-completed/types";
import type { PaymentFailedPayload } from "./payment-failed/types";

// Union type for all checkout event payloads
export type CheckoutEventPayload =
    | CheckoutStartedPayload
    | PaymentCompletedPayload
    | PaymentFailedPayload;

// Literal types for event IDs
export type CheckoutEventType =
    | "checkout-started"
    | "payment-completed"
    | "payment-failed";
