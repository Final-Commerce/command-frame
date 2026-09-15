/**
 * Get product modifier selections action (read-only)
 * Calls the getProductModifierSelections action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetProductModifierSelections,
    GetProductModifierSelectionsParams,
    GetProductModifierSelectionsResponse
} from "./types";

export const getProductModifierSelections: GetProductModifierSelections = async (
    params?: GetProductModifierSelectionsParams
): Promise<GetProductModifierSelectionsResponse> => {
    return await commandFrameClient.call<GetProductModifierSelectionsParams | undefined, GetProductModifierSelectionsResponse>(
        "getProductModifierSelections",
        params
    );
};
