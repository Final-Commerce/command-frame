import type { TopicEvent } from "../../../types";

export interface InventoryUpdatedPayload {
    variantId: string;
    previousStock?: number;
    newStock?: number;
    delta?: number;
}

export type InventoryUpdatedEvent = TopicEvent<InventoryUpdatedPayload>;
