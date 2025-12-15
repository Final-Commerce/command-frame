import { AddCustomSale, AddCustomSaleParams, AddCustomSaleResponse } from "./types";

export const mockAddCustomSale: AddCustomSale = async (params?: AddCustomSaleParams): Promise<AddCustomSaleResponse> => {
    console.log("[Mock] addCustomSale called", params);
    
    if (!params) throw new Error("Params required");

    // Simple mock ID generation
    const mockId = 'sale_' + Math.random().toString(36).substr(2, 9);

    return {
        success: true,
        customSaleId: mockId,
        label: params.label,
        price: Number(params.price),
        applyTaxes: params.applyTaxes ?? false,
        timestamp: new Date().toISOString()
    };
};
