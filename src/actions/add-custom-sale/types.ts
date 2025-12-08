// Add Custom Sale Types
export interface AddCustomSaleParams {
    label: string;
    price: number | string;
    applyTaxes?: boolean;
}

export interface AddCustomSaleResponse {
    success: boolean;
    label: string;
    price: number;
    applyTaxes: boolean;
    timestamp: string;
}

export type AddCustomSale = (params?: AddCustomSaleParams) => Promise<AddCustomSaleResponse>;

