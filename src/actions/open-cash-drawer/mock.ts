import { OpenCashDrawer, OpenCashDrawerResponse } from "./types";

export const mockOpenCashDrawer: OpenCashDrawer = async (): Promise<OpenCashDrawerResponse> => {
    console.log("[Mock] openCashDrawer called");
    
    return {
        success: true,
        timestamp: new Date().toISOString()
    };
};

