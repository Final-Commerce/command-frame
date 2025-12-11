import type { CFCustomer } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for customer-assigned event (in cart context)
 */
export interface CartCustomerAssignedPayload {
    customer: CFCustomer;
}

/**
 * Typed event for customer-assigned (in cart context)
 */
export type CartCustomerAssignedEvent = TopicEvent<CartCustomerAssignedPayload>;

