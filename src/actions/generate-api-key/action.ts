// Action: Generate API Key
import { commandFrameClient } from "../../client";
import type { GenerateAPIKey, GenerateAPIKeyParams, GenerateAPIKeyResponse } from "./types";

export const generateAPIKey: GenerateAPIKey = async (params: GenerateAPIKeyParams): Promise<GenerateAPIKeyResponse> => {
    return await commandFrameClient.call<GenerateAPIKeyParams, GenerateAPIKeyResponse>("generateAPIKey", params);
};
