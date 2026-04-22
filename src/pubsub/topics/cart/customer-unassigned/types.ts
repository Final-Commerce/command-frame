import type { CustomerUnassignedPayload } from "../../customers/customer-unassigned/types";
import type { TopicEvent } from "../../../types";

/**
 * Cart-topic variant of customer-unassigned (same payload as customers topic).
 * @see ../../customers/customer-unassigned/types.ts
 */
export type CartCustomerUnassignedPayload = CustomerUnassignedPayload;

/**
 * Typed event for customer-unassigned on the cart topic
 */
export type CartCustomerUnassignedEvent = TopicEvent<CartCustomerUnassignedPayload>;
