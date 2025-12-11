import type { CFActiveProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-deleted event
 */
export interface ProductDeletedPayload {
    product: CFActiveProduct;
    internalId: string;
}

/**
 * Typed event for product-deleted
 */
export type ProductDeletedEvent = TopicEvent<ProductDeletedPayload>;

