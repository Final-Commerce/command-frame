/**
 * Products Topic Types
 * Aggregated types for all product-related events
 */

// Re-export all event types
export * from "./product-created/types";
export * from "./product-updated/types";
export * from "./inventory-adjusted/types";
export * from "./inventory-updated/types";

// Import payload types for union type
import type { ProductCreatedPayload } from "./product-created/types";
import type { ProductUpdatedPayload } from "./product-updated/types";
import type { InventoryAdjustedPayload } from "./inventory-adjusted/types";
import type { InventoryUpdatedPayload } from "./inventory-updated/types";

// Union type for all product event payloads
export type ProductsEventPayload = 
    | ProductCreatedPayload
    | ProductUpdatedPayload
    | InventoryAdjustedPayload
    | InventoryUpdatedPayload;

// Literal types for event IDs
export type ProductsEventType = 
    | "product-created"
    | "product-updated"
    | "inventory-adjusted"
    | "inventory-updated";

