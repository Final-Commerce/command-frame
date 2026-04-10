import type { CFActiveOrder } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface OrderActiveGetPayload {
    order: CFActiveOrder | null;
}

export type OrderActiveGetEvent = TopicEvent<OrderActiveGetPayload>;
