import {
    GetProductModifierSelections,
    GetProductModifierSelectionsParams,
    GetProductModifierSelectionsResponse
} from "./types";
import { MOCK_CART } from "../../demo/database";

export const mockGetProductModifierSelections: GetProductModifierSelections = async (
    params?: GetProductModifierSelectionsParams
): Promise<GetProductModifierSelectionsResponse> => {
    console.log("[Mock] getProductModifierSelections called", params);

    // Read the line's stored selections from the mock cart (last line when no internalId).
    const line = params?.internalId
        ? MOCK_CART.products.find((p) => p.internalId === params.internalId)
        : MOCK_CART.products[MOCK_CART.products.length - 1];

    if (!line) {
        return {
            success: false,
            reason: "No matching cart line",
            internalId: params?.internalId,
            selections: [],
            timestamp: new Date().toISOString()
        };
    }

    return {
        success: true,
        internalId: line.internalId,
        selections: line.modifierSelections ?? [],
        timestamp: new Date().toISOString()
    };
};
