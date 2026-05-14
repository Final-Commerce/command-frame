import type { CFTransaction } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

export interface TransactionUpdatedPayload {
    transaction: CFTransaction;
}

export type TransactionUpdatedEvent = TopicEvent<TransactionUpdatedPayload>;
