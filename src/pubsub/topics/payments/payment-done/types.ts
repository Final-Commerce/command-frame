import type { CFPaymentMethod, CFOrder } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for payment-done event
 */
export interface PaymentDonePayload {
    payment: CFPaymentMethod;
    order: CFOrder;
    amount: string;
}

/**
 * Typed event for payment-done
 */
export type PaymentDoneEvent = TopicEvent<PaymentDonePayload>;

