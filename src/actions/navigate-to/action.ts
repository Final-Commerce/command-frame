/**
 * Navigate to action — SPA navigation in the Manage host.
 */

import { commandFrameClient } from "../../client";
import type { NavigateTo, NavigateToParams, NavigateToResponse } from "./types";

export const navigateTo: NavigateTo = async (params: NavigateToParams): Promise<NavigateToResponse> => {
    return await commandFrameClient.call<NavigateToParams, NavigateToResponse>("navigateTo", params);
};
