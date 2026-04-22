import type { CFCustomer } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for customer-unassigned event (cart topic)
 */
export interface CartCustomerUnassignedPayload {
    customer: CFCustomer;
}

/**
 * Typed event for customer-unassigned (cart topic)
 */
export type CartCustomerUnassignedEvent = TopicEvent<CartCustomerUnassignedPayload>;
