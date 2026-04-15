import type { CFActiveProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-discount-added event
 */
export interface ProductDiscountAddedPayload {
    product: CFActiveProduct;
    internalId?: string;
    discount: {
        amount: number;
        isPercent: boolean;
        label: string;
    };
}

/**
 * Typed event for product-discount-added
 */
export type ProductDiscountAddedEvent = TopicEvent<ProductDiscountAddedPayload>;
