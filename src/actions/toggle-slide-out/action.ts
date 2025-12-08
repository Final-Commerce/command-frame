/**
 * Toggle slide out action
 * Calls the toggleSlideOut action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    ToggleSlideOut,
    ToggleSlideOutParams,
    ToggleSlideOutResponse
} from "./types";

export const toggleSlideOut: ToggleSlideOut = async (params?: ToggleSlideOutParams): Promise<ToggleSlideOutResponse> => {
    return await commandFrameClient.call<ToggleSlideOutParams, ToggleSlideOutResponse>("toggleSlideOut", params);
};

