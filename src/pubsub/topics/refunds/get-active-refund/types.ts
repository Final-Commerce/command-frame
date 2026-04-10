import type { CFActiveRefundDetails } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface RefundActiveGetPayload {
    refund: CFActiveRefundDetails | null;
}

export type RefundActiveGetEvent = TopicEvent<RefundActiveGetPayload>;
