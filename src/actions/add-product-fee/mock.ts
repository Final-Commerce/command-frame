import { AddProductFee, AddProductFeeParams, AddProductFeeResponse } from "./types";

export const mockAddProductFee: AddProductFee = async (params?: AddProductFeeParams): Promise<AddProductFeeResponse> => {
    console.log("[Mock] addProductFee called", params);
    
    return {
        success: true,
        amount: params?.amount || 0,
        isPercent: params?.isPercent || false,
        label: params?.label || "",
        applyTaxes: params?.applyTaxes || false,
        timestamp: new Date().toISOString()
    };
};

