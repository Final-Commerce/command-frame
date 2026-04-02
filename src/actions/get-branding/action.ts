/**
 * Get branding action — current theme tokens from the Manage host.
 */

import { commandFrameClient } from "../../client";
import type { GetBranding, GetBrandingResponse } from "./types";

export const getBranding: GetBranding = async (): Promise<GetBrandingResponse> => {
    return await commandFrameClient.call<undefined, GetBrandingResponse>("getBranding");
};
