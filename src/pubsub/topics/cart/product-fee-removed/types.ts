import type { CFActiveProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-fee-removed event
 */
export interface ProductFeeRemovedPayload {
    product: CFActiveProduct;
    internalId?: string;
}

/**
 * Typed event for product-fee-removed
 */
export type ProductFeeRemovedEvent = TopicEvent<ProductFeeRemovedPayload>;
