// Add Custom Sale Types
export interface AddCustomSaleParams {
    label: string;
    price: number | string;
    /** Line quantity — positive integer, defaults to 1. */
    quantity?: number | string;
    applyTaxes?: boolean;
    taxTableId?: string;
}

export interface AddCustomSaleResponse {
    success: boolean;
    customSaleId: string;
    label: string;
    price: number;
    quantity: number;
    applyTaxes: boolean;
    timestamp: string;
}

export type AddCustomSale = (params?: AddCustomSaleParams) => Promise<AddCustomSaleResponse>;
