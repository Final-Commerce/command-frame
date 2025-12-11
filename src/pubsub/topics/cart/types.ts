/**
 * Cart Topic Types
 * Aggregated types for all cart-related events
 */

// Re-export all event types
export * from "./cart-created/types";
export * from "./customer-assigned/types";
export * from "./product-added/types";
export * from "./product-deleted/types";
export * from "./cart-discount-added/types";
export * from "./cart-discount-removed/types";
export * from "./cart-fee-added/types";
export * from "./cart-fee-removed/types";

// Import payload types for union type
import type { CartCreatedPayload } from "./cart-created/types";
import type { CartCustomerAssignedPayload } from "./customer-assigned/types";
import type { ProductAddedPayload } from "./product-added/types";
import type { ProductDeletedPayload } from "./product-deleted/types";
import type { CartDiscountAddedPayload } from "./cart-discount-added/types";
import type { CartDiscountRemovedPayload } from "./cart-discount-removed/types";
import type { CartFeeAddedPayload } from "./cart-fee-added/types";
import type { CartFeeRemovedPayload } from "./cart-fee-removed/types";

// Union type for all cart event payloads
export type CartEventPayload = 
    | CartCreatedPayload
    | CartCustomerAssignedPayload
    | ProductAddedPayload
    | ProductDeletedPayload
    | CartDiscountAddedPayload
    | CartDiscountRemovedPayload
    | CartFeeAddedPayload
    | CartFeeRemovedPayload;

// Literal types for event IDs
export type CartEventType = 
    | "cart-created"
    | "customer-assigned"
    | "product-added"
    | "product-deleted"
    | "cart-discount-added"
    | "cart-discount-removed"
    | "cart-fee-added"
    | "cart-fee-removed";

