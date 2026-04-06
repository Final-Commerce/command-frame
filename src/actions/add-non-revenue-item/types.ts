/**
 * Add a non-revenue line to the host cart (e.g. gift card liability / load).
 * Extensions send id, amount, and optional label/metadata; host sums into cart total.
 */
export interface AddNonRevenueItemParams {
    /**
     * Reference id from the extension (e.g. product/sku key). Stored in cart line metadata as refId.
     * The cart uses a separate unique line id per add so multiple lines can share the same refId.
     */
    id: string;
    /** Amount in major currency units (e.g. dollars), same as cart totals */
    amount: number;
    /** Short label for receipts/UI */
    label?: string;
    /** Extra fields (customTableId, cardCode, etc.) */
    metadata?: Record<string, unknown>;
    /**
     * When true, line may be taxed (requires taxTableId when taxing is implemented). Default false — e.g. gift card load is typically not taxed.
     */
    applyTaxes?: boolean;
    taxTableId?: string;
}

export interface AddNonRevenueItemResponse {
    success: true;
    /** Unique cart line id (same as `cart.nonRevenueItems[].externalId`; use for remove / correlation). */
    externalId: string;
    /** Same as request `id` — extension reference */
    refId: string;
    amount: number;
    label?: string;
    metadata?: Record<string, unknown>;
    applyTaxes?: boolean;
    taxTableId?: string;
    timestamp: string;
}

export type AddNonRevenueItem = (params: AddNonRevenueItemParams) => Promise<AddNonRevenueItemResponse>;
