import type { CFProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-updated event
 */
export interface ProductUpdatedPayload {
    product: CFProduct;
}

/**
 * Typed event for product-updated
 */
export type ProductUpdatedEvent = TopicEvent<ProductUpdatedPayload>;

