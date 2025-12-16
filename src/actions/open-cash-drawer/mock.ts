import { OpenCashDrawer, OpenCashDrawerResponse } from "./types";

export const mockOpenCashDrawer: OpenCashDrawer = async (): Promise<OpenCashDrawerResponse> => {
    console.log("[Mock] openCashDrawer called");
    
    window.alert("Demo: *Click* Cash Drawer Opened!");

    return {
        success: true,
        timestamp: new Date().toISOString()
    };
};

