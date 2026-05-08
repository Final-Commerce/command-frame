export * from "./transaction-created/types";
export * from "./transaction-updated/types";

import type { TransactionCreatedPayload } from "./transaction-created/types";
import type { TransactionUpdatedPayload } from "./transaction-updated/types";

export type TransactionsEventPayload = TransactionCreatedPayload | TransactionUpdatedPayload;

export type TransactionsEventType = "transaction-created" | "transaction-updated";
