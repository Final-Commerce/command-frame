import type { CFPaymentMethod, CFOrder } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for payment-done event
 */
export interface PaymentDonePayload {
    payment: CFPaymentMethod;
    order: CFOrder;
    /** Amount in major currency units (e.g., Dollars, Euros). Do not use minor units (e.g., cents). */
    amount: string;
}

/**
 * Typed event for payment-done
 */
export type PaymentDoneEvent = TopicEvent<PaymentDonePayload>;

