import type { TopicEvent } from "../../../types";

export interface OrderStateTransitionCompletedPayload {
    orderId: string;
    from: { payment: string; fulfillment: string };
    to: { payment: string; fulfillment: string };
    displayState: string;
    forced?: boolean;
}

export type OrderStateTransitionCompletedEvent = TopicEvent<OrderStateTransitionCompletedPayload>;
