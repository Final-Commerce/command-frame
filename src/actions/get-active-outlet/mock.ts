import { MOCK_OUTLET_MAIN } from "../../demo/database";
import { GetActiveOutlet, GetActiveOutletResponse } from "./types";

export const mockGetActiveOutlet: GetActiveOutlet = async (): Promise<GetActiveOutletResponse> => {
    console.log("[Mock] getActiveOutlet called");
    return {
        success: true,
        outlet: MOCK_OUTLET_MAIN,
        timestamp: new Date().toISOString()
    };
};
