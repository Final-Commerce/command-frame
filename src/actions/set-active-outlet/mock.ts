import { MOCK_OUTLETS } from "../../demo/database";
import { SetActiveOutlet, SetActiveOutletParams, SetActiveOutletResponse } from "./types";

export const mockSetActiveOutlet: SetActiveOutlet = async (
    params?: SetActiveOutletParams
): Promise<SetActiveOutletResponse> => {
    console.log("[Mock] setActiveOutlet called", params);
    if (!params?.outletId) {
        throw new Error("outletId is required");
    }
    const found = MOCK_OUTLETS.find(o => o.id === params.outletId || o._id === params.outletId);
    if (!found) {
        throw new Error(`Outlet with ID ${params.outletId} not found`);
    }
    return {
        success: true,
        outlet: found,
        timestamp: new Date().toISOString()
    };
};
