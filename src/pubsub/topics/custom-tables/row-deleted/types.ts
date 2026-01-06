import type { TopicEvent } from "../../../types";

/**
 * Payload for row-deleted event
 */
export interface RowDeletedPayload {
    tableName: string;
    rowId: string;
}

/**
 * Typed event for customer-created
 */
export type RowDeletedEvent = TopicEvent<RowDeletedPayload>;

