/**
 * Split Payments Topic Types
 * Aggregated types for all split-payment-related events.
 */

export * from "./split-payment-updated/types";

import type { SplitPaymentUpdatedPayload } from "./split-payment-updated/types";

/** Union type for all split-payments event payloads. */
export type SplitPaymentsEventPayload = SplitPaymentUpdatedPayload;

/** Literal types for split-payments event IDs. */
export type SplitPaymentsEventType = "split-payment-updated";
