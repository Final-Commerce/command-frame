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
    ShowNotification,
    NavigateTo,
    RefreshResource,
    GetMedia,
    UploadMedia,
    GetTaxTables,
    GetBranding,
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
    /** Optional: toast / notification in host shell (e.g. Deerlake). */
    showNotification?: ShowNotification;
    /** Optional: SPA navigation (e.g. Deerlake). */
    navigateTo?: NavigateTo;
    /** Optional: invalidate cached data for a resource key (e.g. Deerlake). */
    refreshResource?: RefreshResource;
    /** Optional: list media library (e.g. Deerlake). */
    getMedia?: GetMedia;
    /** Optional: upload media via host (e.g. Deerlake). */
    uploadMedia?: UploadMedia;
    /** Optional: tax tables for company (e.g. Deerlake). */
    getTaxTables?: GetTaxTables;
    /** Optional: theme tokens for iframe styling (e.g. Deerlake). */
    getBranding?: GetBranding;
}
