import { GetSecretVal, GetSecretValParams, GetSecretValResponse } from "./types";

export const mockGetSecretVal: GetSecretVal = async (params: GetSecretValParams): Promise<GetSecretValResponse> => {
    console.log("[Mock] getSecretVal called", params);
    
    return {
        key: params.key,
        value: `mock-value-for-${params.key}`
    };
};
