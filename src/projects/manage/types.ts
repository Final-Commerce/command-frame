import type {
    GetContext,
    GetFinalContext,
    GetSecretsKeys,
    GetSecretVal,
    SetSecretVal,
    GenerateAPIKey,
    GetCustomTables,
    GetCustomTableData,
    UpsertCustomTableData,
    DeleteCustomTableData,
    GetCustomExtensions,
    GetCurrentCompanyCustomExtensions,
    GetCustomExtensionCustomTables,
    GetCustomers
} from "../../index";
import type { GetUsers } from "../../actions/get-users/types";
import type { GetRoles } from "../../actions/get-roles/types";

export interface ManageProviderActions {
    getContext: GetContext;
    getFinalContext: GetFinalContext;
    getSecretsKeys: GetSecretsKeys;
    getSecretVal: GetSecretVal;
    setSecretVal: SetSecretVal;
    generateAPIKey: GenerateAPIKey;
    // Custom Tables Actions
    getCustomTables: GetCustomTables;
    getCustomTableData: GetCustomTableData;
    upsertCustomTableData: UpsertCustomTableData;
    deleteCustomTableData: DeleteCustomTableData;
    // Custom Extensions Actions
    getCustomExtensions: GetCustomExtensions;
    getCurrentCompanyCustomExtensions: GetCurrentCompanyCustomExtensions;
    getCustomExtensionCustomTables: GetCustomExtensionCustomTables;
    // Company Data Actions
    getUsers: GetUsers;
    getRoles: GetRoles;
    getCustomers: GetCustomers;
}
