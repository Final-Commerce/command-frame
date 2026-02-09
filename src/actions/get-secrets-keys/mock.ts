import { GetSecretsKeys, GetSecretsKeysResponse } from "./types";

export const mockGetSecretsKeys: GetSecretsKeys = async (): Promise<GetSecretsKeysResponse> => {
    console.log("[Mock] getSecretsKeys called");
    
    return {
        keys: ["api-key", "api-secret", "webhook-url"]
    };
};
