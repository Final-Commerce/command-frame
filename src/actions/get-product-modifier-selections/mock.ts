import {
    GetProductModifierSelections,
    GetProductModifierSelectionsParams,
    GetProductModifierSelectionsResponse
} from "./types";
import { MOCK_CART, buildModifierRows } from "../../demo/database";

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
            rows: [],
            modifiersTotal: 0,
            timestamp: new Date().toISOString()
        };
    }

    // The priced rows already sit on the line; extending them by the line quantity is
    // the host's job, not the flow's.
    const { rows, modifiersTotal } = buildModifierRows(line.modifiers, line.quantity);

    return {
        success: true,
        internalId: line.internalId,
        selections: line.modifierSelections ?? [],
        rows,
        modifiersTotal,
        timestamp: new Date().toISOString()
    };
};
