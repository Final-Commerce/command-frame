/**
 * Upload media action — upload a file via the Manage host.
 */

import { commandFrameClient } from "../../client";
import type { UploadMedia, UploadMediaParams, UploadMediaResponse } from "./types";

export const uploadMedia: UploadMedia = async (params: UploadMediaParams): Promise<UploadMediaResponse> => {
    return await commandFrameClient.call<UploadMediaParams, UploadMediaResponse>("uploadMedia", params);
};
