import type { CFCustomer } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for customer-assigned event
 */
export interface CustomerAssignedPayload {
    customer: CFCustomer;
}

/**
 * Typed event for customer-assigned
 */
export type CustomerAssignedEvent = TopicEvent<CustomerAssignedPayload>;

