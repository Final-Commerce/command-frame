/**
 * Products Topic Types
 * Aggregated types for all product-related events
 */

// Re-export all event types
export * from "./product-created/types";
export * from "./product-updated/types";
export * from "./product-set-active/types";
export * from "./product-get-active/types";

// Import payload types for union type
import type { ProductCreatedPayload } from "./product-created/types";
import type { ProductUpdatedPayload } from "./product-updated/types";
import type { ProductSetActivePayload } from "./product-set-active/types";
import type { ProductGetActivePayload } from "./product-get-active/types";

// Union type for all product event payloads
export type ProductsEventPayload =
    | ProductCreatedPayload
    | ProductUpdatedPayload
    | ProductSetActivePayload
    | ProductGetActivePayload;

// Literal types for event IDs
export type ProductsEventType =
    | "product-created"
    | "product-updated"
    | "set-active-product"
    | "get-active-product";

