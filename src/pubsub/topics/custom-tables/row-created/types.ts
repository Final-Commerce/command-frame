import type { TopicEvent } from "../../../types";

/**
 * Payload for customer-created event
 */
export interface RowCreatedPayload {
    tableName: string;
    [key: string]: any;
}

/**
 * Typed event for customer-created
 */
export type RowCreatedEvent = TopicEvent<RowCreatedPayload>;

