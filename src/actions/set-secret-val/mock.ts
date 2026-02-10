import { SetSecretVal, SetSecretValParams, SetSecretValResponse } from "./types";

export const mockSetSecretVal: SetSecretVal = async (params: SetSecretValParams): Promise<SetSecretValResponse> => {
    console.log("[Mock] setSecretVal called", params);
    
    return {
        success: true
    };
};
