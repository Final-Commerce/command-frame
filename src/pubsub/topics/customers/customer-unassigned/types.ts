import type { CFCustomer } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for customer-unassigned event
 */
export interface CustomerUnassignedPayload {
    customer: CFCustomer;
}

/**
 * Typed event for customer-unassigned
 */
export type CustomerUnassignedEvent = TopicEvent<CustomerUnassignedPayload>;

