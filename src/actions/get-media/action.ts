/**
 * Get media action — list media library items from the Manage host.
 */

import { commandFrameClient } from "../../client";
import type { GetMedia, GetMediaParams, GetMediaResponse } from "./types";

export const getMedia: GetMedia = async (params?: GetMediaParams): Promise<GetMediaResponse> => {
    return await commandFrameClient.call<GetMediaParams | undefined, GetMediaResponse>("getMedia", params);
};
