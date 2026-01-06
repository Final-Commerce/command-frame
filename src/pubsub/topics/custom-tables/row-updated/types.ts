import type { TopicEvent } from "../../../types";

/**
 * Payload for row-updated event
 */
export interface RowUpdatedPayload {
    tableName: string;
    [key: string]: any;
}

/**
 * Typed event for customer-created
 */
export type RowUpdatedEvent = TopicEvent<RowUpdatedPayload>;
