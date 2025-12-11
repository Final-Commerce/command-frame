import type { CFProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-created event
 */
export interface ProductCreatedPayload {
    product: CFProduct;
}

/**
 * Typed event for product-created
 */
export type ProductCreatedEvent = TopicEvent<ProductCreatedPayload>;

