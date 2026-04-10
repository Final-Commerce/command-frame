import type { CFActiveCustomer } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface CustomerActiveSetPayload {
    customer: CFActiveCustomer;
}

export type CustomerActiveSetEvent = TopicEvent<CustomerActiveSetPayload>;
