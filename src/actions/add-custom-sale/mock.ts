import { AddCustomSale, AddCustomSaleParams, AddCustomSaleResponse } from "./types";

export const mockAddCustomSale: AddCustomSale = async (params?: AddCustomSaleParams): Promise<AddCustomSaleResponse> => {
    console.log("[Mock] addCustomSale called", params);
    
    if (!params) throw new Error("Params required");

    return {
        success: true,
        label: params.label,
        price: Number(params.price),
        applyTaxes: params.applyTaxes ?? false,
        timestamp: new Date().toISOString()
    };
};

