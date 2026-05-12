import type { TopicDefinition } from "../../types";

export const transactionsTopic: TopicDefinition = {
    id: "transactions",
    name: "Transactions",
    description: "Topic for payment transaction events",
    eventTypes: [
        {
            id: "transaction-created",
            name: "Transaction Created",
            description: "Published when a new transaction is created"
        },
        {
            id: "transaction-updated",
            name: "Transaction Updated",
            description: "Published when a transaction is updated"
        }
    ]
};

export * from "./types";
