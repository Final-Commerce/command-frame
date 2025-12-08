// Adjust Inventory Types
export interface AdjustInventoryParams {
    amount: string;
    stockType: 'add' | 'subtract' | 'set';
}

export interface AdjustInventoryResponse {
    success: boolean;
    amount: string;
    stockType: 'add' | 'subtract' | 'set';
    newStock: number;
    timestamp: string;
}

export type AdjustInventory = (params?: AdjustInventoryParams) => Promise<AdjustInventoryResponse>;

