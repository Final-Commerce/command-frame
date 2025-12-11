import type { CFCustomer, CFCustomerNote } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for customer-note-added event
 */
export interface CustomerNoteAddedPayload {
    customer: CFCustomer;
    note: CFCustomerNote;
}

/**
 * Typed event for customer-note-added
 */
export type CustomerNoteAddedEvent = TopicEvent<CustomerNoteAddedPayload>;

