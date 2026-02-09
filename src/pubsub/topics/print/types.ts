/**
 * Print Topic Types
 * Aggregated types for all print-related events
 */

// Re-export all event types
export * from "./print-started/types";
export * from "./print-completed/types";
export * from "./print-error/types";

// Import payload types for union type
import type { PrintStartedPayload } from "./print-started/types";
import type { PrintCompletedPayload } from "./print-completed/types";
import type { PrintErrorPayload } from "./print-error/types";

// Union type for all print event payloads
export type PrintEventPayload = PrintStartedPayload | PrintCompletedPayload | PrintErrorPayload;

// Literal types for event IDs
export type PrintEventType = "print-started" | "print-completed" | "print-error";
