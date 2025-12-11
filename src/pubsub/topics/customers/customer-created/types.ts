import type { CFCustomer } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for customer-created event
 */
export interface CustomerCreatedPayload {
    customer: CFCustomer;
}

/**
 * Typed event for customer-created
 */
export type CustomerCreatedEvent = TopicEvent<CustomerCreatedPayload>;

