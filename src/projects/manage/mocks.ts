import { mockGetContextManage } from "../../actions/get-context/mock";
import { mockGenerateAPIKey } from "../../actions/generate-api-key/mock";
import { GetFinalContext, GetFinalContextResponse } from "../../actions/get-final-context/types";
import { ManageProviderActions } from "./types";
// Custom Tables Mocks
import { mockGetCustomTables } from "../../actions/get-custom-tables/mock";
import { mockGetCustomTableData } from "../../actions/get-custom-table-data/mock";
import { mockDeleteCustomTableData } from "../../actions/delete-custom-table-data/mock";
// Custom Extensions Mocks
import { mockGetCustomExtensions } from "../../actions/get-custom-extensions/mock";
import { mockGetCurrentCompanyCustomExtensions } from "../../actions/get-current-company-custom-extensions/mock";
import { mockGetCustomExtensionCustomTables } from "../../actions/get-custom-extension-custom-tables/mock";

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
    generateAPIKey: mockGenerateAPIKey,
    // Custom Tables Actions (simplified for Manage)
    getCustomTables: mockGetCustomTables,
    getCustomTableData: mockGetCustomTableData,
    deleteCustomTableData: mockDeleteCustomTableData,
    // Custom Extensions Actions
    getCustomExtensions: mockGetCustomExtensions,
    getCurrentCompanyCustomExtensions: mockGetCurrentCompanyCustomExtensions,
    getCustomExtensionCustomTables: mockGetCustomExtensionCustomTables
};

