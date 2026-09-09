import {
    SetProductModifierSelections,
    SetProductModifierSelectionsParams,
    SetProductModifierSelectionsResponse
} from "./types";
import { MOCK_CART } from "../../demo/database";

export const mockSetProductModifierSelections: SetProductModifierSelections = async (
    params?: SetProductModifierSelectionsParams
): Promise<SetProductModifierSelectionsResponse> => {
    console.log("[Mock] setProductModifierSelections called", params);

    if (!params?.selections) {
        return {
            success: false,
            reason: "selections is required (pass [] to clear)",
            internalId: params?.internalId,
            selections: [],
            timestamp: new Date().toISOString()
        };
    }

    // Write the selections onto the mock cart line (last line when no internalId).
    // The mock does not re-run rule validation or repricing — the real host does.
    const line = params.internalId
        ? MOCK_CART.products.find((p) => p.internalId === params.internalId)
        : MOCK_CART.products[MOCK_CART.products.length - 1];

    if (!line) {
        return {
            success: false,
            reason: "No matching cart line",
            internalId: params.internalId,
            selections: [],
            timestamp: new Date().toISOString()
        };
    }

    line.modifierSelections = params.selections;

    return {
        success: true,
        internalId: line.internalId,
        selections: params.selections,
        timestamp: new Date().toISOString()
    };
};
