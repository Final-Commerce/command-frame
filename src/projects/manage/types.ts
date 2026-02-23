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
    EditProduct,
    EditProductVariants,
    DeleteProduct,
    GetOutlets,
    GetStations,
    GetOrders,
    GetUsers,
    GetRoles,
} from "../../index";

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
