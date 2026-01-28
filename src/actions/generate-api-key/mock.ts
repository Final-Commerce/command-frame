import type { GenerateAPIKey, GenerateAPIKeyParams, GenerateAPIKeyResponse } from "./types";

export const mockGenerateAPIKey: GenerateAPIKey = async (params: GenerateAPIKeyParams): Promise<GenerateAPIKeyResponse> => {
    const now = new Date();
    const name = params.name || `command-frame-${now.toISOString().slice(0, 16).replace('T', '-')}`;
    console.log("[Mock] generateAPIKey called for:", name);
    return {
        apiKey: "mock-api-key-" + Math.random().toString(36).substring(7)
    };
};
