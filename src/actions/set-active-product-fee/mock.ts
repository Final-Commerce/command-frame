import { SetActiveProductFee, SetActiveProductFeeParams, SetActiveProductFeeResponse } from "./types";
import { MOCK_ACTIVE_PRODUCT, setMockActiveProduct } from "../../demo/database";

export const mockSetActiveProductFee: SetActiveProductFee = async (params: SetActiveProductFeeParams): Promise<SetActiveProductFeeResponse> => {
    console.log("[Mock] setActiveProductFee called", params);

    if (!MOCK_ACTIVE_PRODUCT) {
        throw new Error("No active product. Call setActiveProduct first.");
    }

    const fee = {
        label: params.label || "Fee",
        amount: params.amount,
        isPercent: params.isPercent || false,
        applyTaxes: params.applyTaxes || false
    };

    setMockActiveProduct({ ...MOCK_ACTIVE_PRODUCT, fee });

    return {
        success: true,
        amount: params.amount,
        isPercent: fee.isPercent,
        label: fee.label,
        applyTaxes: fee.applyTaxes,
        timestamp: new Date().toISOString()
    };
};
