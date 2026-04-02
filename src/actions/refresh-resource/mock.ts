import { RefreshResource, RefreshResourceParams, RefreshResourceResponse } from "./types";

export const mockRefreshResource: RefreshResource = async (
    params: RefreshResourceParams
): Promise<RefreshResourceResponse> => {
    console.log("[Mock] refreshResource called", params.resource);

    return {
        success: true,
        timestamp: new Date().toISOString()
    };
};
