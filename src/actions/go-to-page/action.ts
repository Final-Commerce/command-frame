/**
 * Go to page action
 * Calls the goToPage action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GoToPage,
    GoToPageParams,
    GoToPageResponse
} from "./types";

export const goToPage: GoToPage = async (params?: GoToPageParams): Promise<GoToPageResponse> => {
    return await commandFrameClient.call<GoToPageParams, GoToPageResponse>("goToPage", params);
};

