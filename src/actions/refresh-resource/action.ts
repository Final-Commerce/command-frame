/**
 * Refresh resource action — invalidate cached list/detail data in the Manage host.
 */

import { commandFrameClient } from "../../client";
import type { RefreshResource, RefreshResourceParams, RefreshResourceResponse } from "./types";

export const refreshResource: RefreshResource = async (
    params: RefreshResourceParams
): Promise<RefreshResourceResponse> => {
    return await commandFrameClient.call<RefreshResourceParams, RefreshResourceResponse>("refreshResource", params);
};
