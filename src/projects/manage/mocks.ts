import { mockGetContext, mockGetContextManage } from "../../actions/get-context/mock";
import { mockGetPublicKey } from "../../actions/get-public-key/mock";
import { GetFinalContext, GetFinalContextResponse } from "../../actions/get-final-context/types";
import { ManageProviderActions } from "./types";

// Manage-specific mock for getFinalContext
const mockGetFinalContextManage: GetFinalContext = async (): Promise<GetFinalContextResponse | null> => {
    console.log("[Mock] getFinalContext called (Manage)");
    return {
        projectName: "Manage"
    };
};

export const MANAGE_MOCKS: ManageProviderActions = {
    getContext: mockGetContextManage,
    getFinalContext: mockGetFinalContextManage,
    getPublicKey: mockGetPublicKey
};

