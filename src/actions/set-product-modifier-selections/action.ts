/**
 * Set product modifier selections action
 * Calls the setProductModifierSelections action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    SetProductModifierSelections,
    SetProductModifierSelectionsParams,
    SetProductModifierSelectionsResponse
} from "./types";

export const setProductModifierSelections: SetProductModifierSelections = async (
    params?: SetProductModifierSelectionsParams
): Promise<SetProductModifierSelectionsResponse> => {
    return await commandFrameClient.call<SetProductModifierSelectionsParams | undefined, SetProductModifierSelectionsResponse>(
        "setProductModifierSelections",
        params
    );
};
