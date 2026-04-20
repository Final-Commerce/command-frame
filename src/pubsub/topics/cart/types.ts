/**
 * Cart Topic Types
 * Aggregated types for all cart-related events
 */

// Re-export all event types
export * from "./cart-created/types";
export * from "./customer-assigned/types";
export * from "./product-added/types";
export * from "./product-deleted/types";
export * from "./product-updated/types";
export * from "./cart-discount-added/types";
export * from "./cart-discount-removed/types";
export * from "./cart-fee-added/types";
export * from "./cart-fee-removed/types";
export * from "./product-discount-added/types";
export * from "./product-discount-removed/types";
export * from "./product-fee-added/types";
export * from "./product-fee-removed/types";
export * from "./product-note-added/types";
export * from "./product-note-removed/types";

// Import payload types for union type
import type { CartCreatedPayload } from "./cart-created/types";
import type { CartCustomerAssignedPayload } from "./customer-assigned/types";
import type { CustomerUnassignedPayload } from "../customers/customer-unassigned/types";
import type { ProductAddedPayload } from "./product-added/types";
import type { ProductDeletedPayload } from "./product-deleted/types";
import type { CartProductUpdatedPayload } from "./product-updated/types";
import type { CartDiscountAddedPayload } from "./cart-discount-added/types";
import type { CartDiscountRemovedPayload } from "./cart-discount-removed/types";
import type { CartFeeAddedPayload } from "./cart-fee-added/types";
import type { CartFeeRemovedPayload } from "./cart-fee-removed/types";
import type { ProductDiscountAddedPayload } from "./product-discount-added/types";
import type { ProductDiscountRemovedPayload } from "./product-discount-removed/types";
import type { ProductFeeAddedPayload } from "./product-fee-added/types";
import type { ProductFeeRemovedPayload } from "./product-fee-removed/types";
import type { ProductNoteAddedPayload } from "./product-note-added/types";
import type { ProductNoteRemovedPayload } from "./product-note-removed/types";

// Union type for all cart event payloads
export type CartEventPayload =
    | CartCreatedPayload
    | CartCustomerAssignedPayload
    | CustomerUnassignedPayload
    | ProductAddedPayload
    | ProductDeletedPayload
    | CartProductUpdatedPayload
    | CartDiscountAddedPayload
    | CartDiscountRemovedPayload
    | CartFeeAddedPayload
    | CartFeeRemovedPayload
    | ProductDiscountAddedPayload
    | ProductDiscountRemovedPayload
    | ProductFeeAddedPayload
    | ProductFeeRemovedPayload
    | ProductNoteAddedPayload
    | ProductNoteRemovedPayload;

// Literal types for event IDs
export type CartEventType =
    | "cart-created"
    | "customer-assigned"
    | "customer-unassigned"
    | "product-added"
    | "product-deleted"
    | "product-updated"
    | "cart-discount-added"
    | "cart-discount-removed"
    | "cart-fee-added"
    | "cart-fee-removed"
    | "product-discount-added"
    | "product-discount-removed"
    | "product-fee-added"
    | "product-fee-removed"
    | "product-note-added"
    | "product-note-removed";
