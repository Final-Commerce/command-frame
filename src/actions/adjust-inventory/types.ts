// Adjust Inventory Types
export interface AdjustInventoryParams {
    /** String to preserve precision. */
    amount: string;
    /** 'add' (increase), 'subtract' (decrease), or 'set' (recount). */
    stockType: 'add' | 'subtract' | 'set';
    /** Variant to adjust. Omit to use the active product's selected variant. */
    variantId?: string;
}

export interface AdjustInventoryResponse {
    success: boolean;
    amount: string;
    stockType: 'add' | 'subtract' | 'set';
    newStock: number;
    timestamp: string;
}

export type AdjustInventory = (params?: AdjustInventoryParams) => Promise<AdjustInventoryResponse>;
