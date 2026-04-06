import { NavigateTo, NavigateToParams, NavigateToResponse } from "./types";

export const mockNavigateTo: NavigateTo = async (params: NavigateToParams): Promise<NavigateToResponse> => {
    console.log("[Mock] navigateTo called", params.path);

    return {
        success: true,
        timestamp: new Date().toISOString()
    };
};
