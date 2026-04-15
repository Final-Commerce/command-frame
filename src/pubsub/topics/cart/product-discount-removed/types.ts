import type { CFActiveProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-discount-removed event
 */
export interface ProductDiscountRemovedPayload {
    product: CFActiveProduct;
    internalId?: string;
}

/**
 * Typed event for product-discount-removed
 */
export type ProductDiscountRemovedEvent = TopicEvent<ProductDiscountRemovedPayload>;
