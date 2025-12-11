import type { CFCustomer, CFCustomerNote } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for customer-note-deleted event
 */
export interface CustomerNoteDeletedPayload {
    customer: CFCustomer;
    note: CFCustomerNote;
}

/**
 * Typed event for customer-note-deleted
 */
export type CustomerNoteDeletedEvent = TopicEvent<CustomerNoteDeletedPayload>;

