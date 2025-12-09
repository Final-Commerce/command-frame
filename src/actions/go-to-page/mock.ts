import { GoToPage, GoToPageParams, GoToPageResponse } from "./types";

export const mockGoToPage: GoToPage = async (params?: GoToPageParams): Promise<GoToPageResponse> => {
    console.log("[Mock] goToPage called", params);
    
    return {
        success: true,
        pageId: params?.pageId || "home",
        timestamp: new Date().toISOString()
    };
};

