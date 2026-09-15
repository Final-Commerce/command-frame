import {
    SetProductModifierSelections,
    SetProductModifierSelectionsParams,
    SetProductModifierSelectionsResponse
} from "./types";
import { MOCK_CART, MOCK_PRODUCTS, buildCartLineModifiers, buildModifierRows } from "../../demo/database";

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
            rows: [],
            modifiersTotal: 0,
            timestamp: new Date().toISOString()
        };
    }

    // Write the selections onto the mock cart line (last line when no internalId).
    // The mock does not re-run rule VALIDATION — the real host does — but it does reprice,
    // because a replacement that left the old rows and the old money behind would make the
    // cart disagree with itself the moment a cashier edits a line.
    const line = params.internalId
        ? MOCK_CART.products.find((p) => p.internalId === params.internalId)
        : MOCK_CART.products[MOCK_CART.products.length - 1];

    if (!line) {
        return {
            success: false,
            reason: "No matching cart line",
            internalId: params.internalId,
            selections: [],
            rows: [],
            modifiersTotal: 0,
            timestamp: new Date().toISOString()
        };
    }

    // Full replacement — passing [] clears the rows. The line drops the product's resolved
    // stack when it is built, so the menu is re-read from the catalogue to price against.
    // Cart totals are not touched, for the same reason addProductToCart does not move them
    // for modifiers: this mock does not accumulate per-line money.
    const source = MOCK_PRODUCTS.find((product) => product._id === line.id);
    line.modifierSelections = params.selections;
    line.modifiers = buildCartLineModifiers(source?.modifiers, params.selections, source?.taxTable);

    const { rows, modifiersTotal } = buildModifierRows(line.modifiers, line.quantity);

    return {
        success: true,
        internalId: line.internalId,
        selections: params.selections,
        rows,
        modifiersTotal,
        timestamp: new Date().toISOString()
    };
};
