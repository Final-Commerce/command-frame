import type { CFActiveCustomer } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface CustomerActiveGetPayload {
    customer: CFActiveCustomer | null;
}

export type CustomerActiveGetEvent = TopicEvent<CustomerActiveGetPayload>;
