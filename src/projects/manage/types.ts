import type {
    GetContext,
    GetFinalContext,
    GenerateAPIKey,
    GetCustomTables,
    GetCustomTableData,
    UpsertCustomTableData,
    DeleteCustomTableData,
    GetCustomExtensions,
    GetCurrentCompanyCustomExtensions,
    GetCustomExtensionCustomTables
} from "../../index";

export interface ManageProviderActions {
    getContext: GetContext;
    getFinalContext: GetFinalContext;
    generateAPIKey: GenerateAPIKey;
    // Custom Tables Actions (simplified - getCustomTables returns tables for current extension)
    getCustomTables: GetCustomTables;
    getCustomTableData: GetCustomTableData;
    upsertCustomTableData: UpsertCustomTableData;
    deleteCustomTableData: DeleteCustomTableData;
    // Custom Extensions Actions
    getCustomExtensions: GetCustomExtensions;
    getCurrentCompanyCustomExtensions: GetCurrentCompanyCustomExtensions;
    getCustomExtensionCustomTables: GetCustomExtensionCustomTables;
}

