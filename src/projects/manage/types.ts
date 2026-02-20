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
    GetCustomers,
    GetProducts,
    GetCategories,
    GetOrders
} from "../../index";
import type { GetUsers } from "../../actions/get-users/types";
import type { GetRoles } from "../../actions/get-roles/types";
import type { EditProduct } from "../../actions/edit-product/types";
import type { EditProductVariants } from "../../actions/edit-product-variants/types";
import type { DeleteProduct } from "../../actions/delete-product/types";
import type { GetOutlets } from "../../actions/get-outlets/types";
import type { GetStations } from "../../actions/get-stations/types";

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
    // Catalog Actions
    getProducts: GetProducts;
    getCategories: GetCategories;
    editProduct: EditProduct;
    editProductVariants: EditProductVariants;
    deleteProduct: DeleteProduct;
    // Entity Actions
    getOutlets: GetOutlets;
    getStations: GetStations;
    getOrders: GetOrders;
}
