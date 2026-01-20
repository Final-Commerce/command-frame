/**
 * Get custom extensions action
 * Calls the getCustomExtensions action on the parent window
 */

import { commandFrameClient } from "../../client";
import type {
    GetCurrentCompanyCustomExtensions,
    GetCurrentCompanyCustomExtensionsParams,
    GetCurrentCompanyCustomExtensionsResponse,
} from "./types";

export const getCurrentCompanyCustomExtensions: GetCurrentCompanyCustomExtensions = async (params: GetCurrentCompanyCustomExtensionsParams): Promise<GetCurrentCompanyCustomExtensionsResponse> => {
    return await commandFrameClient.call<GetCurrentCompanyCustomExtensionsParams, GetCurrentCompanyCustomExtensionsResponse>("getCurrentCompanyCustomExtensions", params);
};
