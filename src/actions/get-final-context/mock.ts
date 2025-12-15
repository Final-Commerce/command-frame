import { GetFinalContext, GetFinalContextResponse } from "./types";

export const mockGetFinalContext: GetFinalContext = async (): Promise<GetFinalContextResponse | null> => {
    console.log("[Mock] getFinalContext called");
    
    return {
        projectName: "Mock Project"
    };
};
