import type { CFCustomer } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for customer-updated event
 */
export interface CustomerUpdatedPayload {
    customer: CFCustomer;
}

/**
 * Typed event for customer-updated
 */
export type CustomerUpdatedEvent = TopicEvent<CustomerUpdatedPayload>;

