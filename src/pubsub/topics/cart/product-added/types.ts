import type { CFActiveProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-added event
 */
export interface ProductAddedPayload {
    product: CFActiveProduct;
}

/**
 * Typed event for product-added
 */
export type ProductAddedEvent = TopicEvent<ProductAddedPayload>;

