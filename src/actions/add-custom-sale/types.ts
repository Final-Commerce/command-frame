// Add Custom Sale Types
export interface AddCustomSaleParams {
    label: string;
    /** Price in major currency units (e.g., 10.50), not cents. */
    price: number | string;
    applyTaxes?: boolean;
    taxTableId?: string;
}

export interface AddCustomSaleResponse {
    success: boolean;
    customSaleId: string;
    label: string;
    /** Price in major currency units (e.g., 10.50), not cents. */
    price: number;
    applyTaxes: boolean;
    timestamp: string;
}

export type AddCustomSale = (params?: AddCustomSaleParams) => Promise<AddCustomSaleResponse>;
