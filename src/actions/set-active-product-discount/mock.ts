import { SetActiveProductDiscount, SetActiveProductDiscountParams, SetActiveProductDiscountResponse } from "./types";
import { MOCK_ACTIVE_PRODUCT, setMockActiveProduct } from "../../demo/database";

export const mockSetActiveProductDiscount: SetActiveProductDiscount = async (params: SetActiveProductDiscountParams): Promise<SetActiveProductDiscountResponse> => {
    console.log("[Mock] setActiveProductDiscount called", params);

    if (!MOCK_ACTIVE_PRODUCT) {
        throw new Error("No active product. Call setActiveProduct first.");
    }

    const discount = {
        value: params.amount,
        isPercent: params.isPercent || false,
        label: params.label || "Discount"
    };

    setMockActiveProduct({ ...MOCK_ACTIVE_PRODUCT, discount });

    return {
        success: true,
        amount: params.amount,
        isPercent: discount.isPercent,
        label: discount.label,
        timestamp: new Date().toISOString()
    };
};
