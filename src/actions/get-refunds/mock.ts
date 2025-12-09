import { GetRefunds, GetRefundsParams, GetRefundsResponse } from "./types";

export const mockGetRefunds: GetRefunds = async (params?: GetRefundsParams): Promise<GetRefundsResponse> => {
    console.log("[Mock] getRefunds called", params);
    
    return {
        success: true,
        refunds: [],
        total: 0,
        timestamp: new Date().toISOString()
    };
};

