import { AddProductDiscount, AddProductDiscountParams, AddProductDiscountResponse } from "./types";

export const mockAddProductDiscount: AddProductDiscount = async (params?: AddProductDiscountParams): Promise<AddProductDiscountResponse> => {
    console.log("[Mock] addProductDiscount called", params);
    
    return {
        success: true,
        amount: params?.amount || 0,
        isPercent: params?.isPercent || false,
        label: params?.label || "",
        timestamp: new Date().toISOString()
    };
};

