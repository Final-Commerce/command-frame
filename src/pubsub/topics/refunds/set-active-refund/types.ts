import type { CFActiveRefundDetails } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface RefundActiveSetPayload {
    refund: CFActiveRefundDetails;
}

export type RefundActiveSetEvent = TopicEvent<RefundActiveSetPayload>;
