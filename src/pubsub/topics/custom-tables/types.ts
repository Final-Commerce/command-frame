/**
 * Custom Tables Topic Types
 * Aggregated types for all custom table-related events
 */

// Re-export all event types
export * from "./row-created/types";
export * from "./row-updated/types";
export * from "./row-deleted/types";

// Import payload types for union type
import type { RowCreatedPayload } from "./row-created/types";
import type { RowUpdatedPayload } from "./row-updated/types";
import type { RowDeletedPayload } from "./row-deleted/types";

// Union type for all customer event payloads
export type CustomTablesEventPayload = 
    | RowCreatedPayload
    | RowUpdatedPayload
    | RowDeletedPayload

// Literal types for event IDs
export type CustomTablesEventType = 
    | "row-created"
    | "row-updated"
    | "row-deleted";
