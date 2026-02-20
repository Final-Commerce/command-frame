import type { TopicEvent } from "../../../types";

export interface InventoryAdjustedPayload {
    variantId: string;
    amount: number;
    stockType: "add" | "subtract";
    previousStock?: number;
    newStock?: number;
}

export type InventoryAdjustedEvent = TopicEvent<InventoryAdjustedPayload>;
