import { mockGetContextManage } from "../../actions/get-context/mock";
import { mockGenerateAPIKey } from "../../actions/generate-api-key/mock";
import { GetFinalContext, GetFinalContextResponse } from "../../actions/get-final-context/types";
import { mockGetSecretsKeys } from "../../actions/get-secrets-keys/mock";
import { mockGetSecretVal } from "../../actions/get-secret-val/mock";
import { mockSetSecretVal } from "../../actions/set-secret-val/mock";
import { ManageProviderActions } from "./types";
// Custom Tables Mocks
import { mockGetCustomTables } from "../../actions/get-custom-tables/mock";
import { mockGetCustomTableData } from "../../actions/get-custom-table-data/mock";
import { mockUpsertCustomTableData } from "../../actions/upsert-custom-table-data/mock";
import { mockDeleteCustomTableData } from "../../actions/delete-custom-table-data/mock";
// Custom Extensions Mocks
import { mockGetCustomExtensions } from "../../actions/get-custom-extensions/mock";
import { mockGetCurrentCompanyCustomExtensions } from "../../actions/get-current-company-custom-extensions/mock";
import { mockGetCustomExtensionCustomTables } from "../../actions/get-custom-extension-custom-tables/mock";
// Company Data Mocks
import { mockGetUsers } from "../../actions/get-users/mock";
import { mockGetRoles } from "../../actions/get-roles/mock";
import { mockGetCustomers } from "../../actions/get-customers/mock";
// Catalog Mocks
import { mockGetProducts } from "../../actions/get-products/mock";
import { mockGetCategories } from "../../actions/get-categories/mock";

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
    getSecretsKeys: mockGetSecretsKeys,
    getSecretVal: mockGetSecretVal,
    setSecretVal: mockSetSecretVal,
    generateAPIKey: mockGenerateAPIKey,
    // Custom Tables Actions
    getCustomTables: mockGetCustomTables,
    getCustomTableData: mockGetCustomTableData,
    upsertCustomTableData: mockUpsertCustomTableData,
    deleteCustomTableData: mockDeleteCustomTableData,
    // Custom Extensions Actions
    getCustomExtensions: mockGetCustomExtensions,
    getCurrentCompanyCustomExtensions: mockGetCurrentCompanyCustomExtensions,
    getCustomExtensionCustomTables: mockGetCustomExtensionCustomTables,
    // Company Data Actions
    getUsers: mockGetUsers,
    getRoles: mockGetRoles,
    getCustomers: mockGetCustomers,
    // Catalog Actions
    getProducts: mockGetProducts,
    getCategories: mockGetCategories
};
