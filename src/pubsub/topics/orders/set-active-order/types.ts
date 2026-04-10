import type { CFActiveOrder } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface OrderActiveSetPayload {
    order: CFActiveOrder;
}

export type OrderActiveSetEvent = TopicEvent<OrderActiveSetPayload>;
