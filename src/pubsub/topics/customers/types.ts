/**
 * Customers Topic Types
 * Aggregated types for all customer-related events
 */

// Re-export all event types
export * from "./customer-created/types";
export * from "./customer-updated/types";
export * from "./customer-note-added/types";
export * from "./customer-note-deleted/types";
export * from "./customer-assigned/types";
export * from "./customer-unassigned/types";
export * from "./set-active-customer/types";
export * from "./get-active-customer/types";

// Import payload types for union type
import type { CustomerCreatedPayload } from "./customer-created/types";
import type { CustomerUpdatedPayload } from "./customer-updated/types";
import type { CustomerNoteAddedPayload } from "./customer-note-added/types";
import type { CustomerNoteDeletedPayload } from "./customer-note-deleted/types";
import type { CustomerAssignedPayload } from "./customer-assigned/types";
import type { CustomerUnassignedPayload } from "./customer-unassigned/types";
import type { CustomerActiveSetPayload } from "./set-active-customer/types";
import type { CustomerActiveGetPayload } from "./get-active-customer/types";

// Union type for all customer event payloads
export type CustomersEventPayload =
    | CustomerCreatedPayload
    | CustomerUpdatedPayload
    | CustomerNoteAddedPayload
    | CustomerNoteDeletedPayload
    | CustomerAssignedPayload
    | CustomerUnassignedPayload
    | CustomerActiveSetPayload
    | CustomerActiveGetPayload;

// Literal types for event IDs
export type CustomersEventType =
    | "customer-created"
    | "customer-updated"
    | "customer-note-added"
    | "customer-note-deleted"
    | "customer-assigned"
    | "customer-unassigned"
    | "set-active-customer"
    | "get-active-customer";

