import type { CFActiveProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-get-active event
 */
export interface ProductGetActivePayload {
    product: CFActiveProduct;
}

/**
 * Typed event for product-get-active
 */ 
export type ProductGetActiveEvent = TopicEvent<ProductGetActivePayload>;