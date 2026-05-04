import type { TopicEvent } from "../../../types";
import type { CFBlockedBy } from "../../../../common-types/order-state";

export interface OrderStateTransitionBlockedPayload {
    orderId: string;
    from: { payment: string; fulfillment: string };
    to: { payment: string; fulfillment: string };
    blockedBy: CFBlockedBy;
    reason?: string;
}

export type OrderStateTransitionBlockedEvent = TopicEvent<OrderStateTransitionBlockedPayload>;
