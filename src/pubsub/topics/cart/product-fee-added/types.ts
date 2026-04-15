import type { CFActiveProduct } from "../../../../CommonTypes";
import type { TopicEvent } from "../../../types";

/**
 * Payload for product-fee-added event
 */
export interface ProductFeeAddedPayload {
    product: CFActiveProduct;
    internalId?: string;
    fee: {
        amount: number;
        isPercent: boolean;
        label: string;
        applyTaxes: boolean;
    };
}

/**
 * Typed event for product-fee-added
 */
export type ProductFeeAddedEvent = TopicEvent<ProductFeeAddedPayload>;
