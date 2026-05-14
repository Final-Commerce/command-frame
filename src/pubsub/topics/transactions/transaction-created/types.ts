import type { CFTransaction } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface TransactionCreatedPayload {
    transaction: CFTransaction;
}

export type TransactionCreatedEvent = TopicEvent<TransactionCreatedPayload>;
