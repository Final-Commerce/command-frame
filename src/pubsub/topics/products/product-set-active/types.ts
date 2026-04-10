import type { CFActiveProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-set-active event
 */
export interface ProductSetActivePayload {
    product: CFActiveProduct;
}

/**
 * Typed event for product-set-active
 */
export type ProductSetActiveEvent = TopicEvent<ProductSetActivePayload>;