import type { GenerateAPIKey, GenerateAPIKeyResponse } from "./types";

export const mockGenerateAPIKey: GenerateAPIKey = async (): Promise<GenerateAPIKeyResponse> => {
    console.log("[Mock] generateAPIKey called");
    return {
        apiKey: "mock-api-key-" + Math.random().toString(36).substring(7)
    };
};
