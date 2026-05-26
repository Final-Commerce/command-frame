import type {
    ExampleFunction,
    GetProducts,
    AddCustomSale,
    GetCustomers,
    AssignCustomer,
    AddCustomer,
    EditCustomer,
    GetCategories,
    GetOrders,
    GetRefunds,
    GetTaxTables,
    AddProductDiscount,
    AddProductToCart,
    RemoveProductFromCart,
    UpdateCartItemQuantity,
    AddCartDiscount,
    GetContext,
    GetFinalContext,
    AddProductNote,
    AddProductFee,
    SetActiveProductFee,
    SetActiveProductDiscount,
    GetActiveProduct,
    SetActiveProduct,
    AdjustInventory,
    AddOrderNote,
    AddCartFee,
    ClearCart,
    ParkOrder,
    ResumeParkedOrder,
    DeleteParkedOrder,
    InitiateRefund,
    CashPayment,
    TapToPayPayment,
    TerminalPayment,
    VendaraPayment,
    ExtensionPayment,
    RedeemPayment,
    AddNonRevenueItem,
    AddCustomerNote,
    RemoveCustomerNote,
    RemoveCustomerFromCart,
    GoToStationHome,
    OpenCashDrawer,
    ShowNotification,
    ShowConfirmation,
    AuthenticateUser,
    PartialPayment,
    SwitchUser,
    TriggerWebhook,
    TriggerZapierWebhook,
    SetRefundStockAction,
    SelectAllRefundItems,
    ResetRefundDetails,
    CalculateRefundTotal,
    GetRemainingRefundableQuantities,
    ProcessPartialRefund,
    GetCurrentCart,
    Print,
    SetActiveOrder,
    GetCustomTables,
    GetCustomTableData,
    UpsertCustomTableData,
    DeleteCustomTableData,
    GetCustomExtensions,
    GetCurrentCompanyCustomExtensions,
    GetCustomExtensionCustomTables,
    GetCustomTableFields,
    GetSecretsKeys,
    GetSecretVal,
    SetSecretVal,
    GetUsers,
    GetRoles,
    RemoveCartDiscount,
    GetActiveOrder,
    GetActiveCustomer,
    SetActiveCustomer,
    GetActiveOutlet,
    SetActiveOutlet,
    GetActiveStation,
    SetActiveStation,
    GetActiveSession,
    SetActiveSession,
    GetActiveUser,
    SetActiveUser,
    SetActiveRefund,
    RemoveProductDiscount,
    RemoveProductFee,
    RemoveProductNote,
    RemoveCartFee,
    RemoveOrderNote,
    RemoveCustomSale,
    RemoveNonRevenueItem,
    CanTransition,
    GetAvailableTransitions
} from "../../index";

export interface RenderProviderActions {
    exampleFunction: ExampleFunction;
    getProducts: GetProducts;
    addCustomSale: AddCustomSale;
    getCustomers: GetCustomers;
    assignCustomer: AssignCustomer;
    addCustomer: AddCustomer;
    editCustomer: EditCustomer;
    getCategories: GetCategories;
    getOrders: GetOrders;
    getRefunds: GetRefunds;
    getTaxTables: GetTaxTables;
    addProductDiscount: AddProductDiscount;
    addProductToCart: AddProductToCart;
    removeProductFromCart: RemoveProductFromCart;
    updateCartItemQuantity: UpdateCartItemQuantity;
    addCartDiscount: AddCartDiscount;
    getContext: GetContext;
    getFinalContext: GetFinalContext;
    addProductNote: AddProductNote;
    addProductFee: AddProductFee;
    setActiveProductFee: SetActiveProductFee;
    setActiveProductDiscount: SetActiveProductDiscount;
    getActiveProduct: GetActiveProduct;
    setActiveProduct: SetActiveProduct;
    adjustInventory: AdjustInventory;
    addOrderNote: AddOrderNote;
    addCartFee: AddCartFee;
    clearCart: ClearCart;
    parkOrder: ParkOrder;
    resumeParkedOrder: ResumeParkedOrder;
    deleteParkedOrder: DeleteParkedOrder;
    initiateRefund: InitiateRefund;
    cashPayment: CashPayment;
    tapToPayPayment: TapToPayPayment;
    terminalPayment: TerminalPayment;
    vendaraPayment: VendaraPayment;
    extensionPayment: ExtensionPayment;
    redeemPayment: RedeemPayment;
    addNonRevenueItem: AddNonRevenueItem;
    addCustomerNote: AddCustomerNote;
    removeCustomerNote: RemoveCustomerNote;
    removeCustomerFromCart: RemoveCustomerFromCart;
    removeCartDiscount: RemoveCartDiscount;
    goToStationHome: GoToStationHome;
    openCashDrawer: OpenCashDrawer;
    showNotification: ShowNotification;
    showConfirmation: ShowConfirmation;
    authenticateUser: AuthenticateUser;
    partialPayment: PartialPayment;
    switchUser: SwitchUser;
    triggerWebhook: TriggerWebhook;
    triggerZapierWebhook: TriggerZapierWebhook;
    setRefundStockAction: SetRefundStockAction;
    selectAllRefundItems: SelectAllRefundItems;
    resetRefundDetails: ResetRefundDetails;
    calculateRefundTotal: CalculateRefundTotal;
    getRemainingRefundableQuantities: GetRemainingRefundableQuantities;
    processPartialRefund: ProcessPartialRefund;
    getCurrentCart: GetCurrentCart;
    print: Print;
    setActiveOrder: SetActiveOrder;
    getCustomTables: GetCustomTables;
    getCustomTableData: GetCustomTableData;
    upsertCustomTableData: UpsertCustomTableData;
    deleteCustomTableData: DeleteCustomTableData;
    getCustomExtensions: GetCustomExtensions;
    getCurrentCompanyCustomExtensions: GetCurrentCompanyCustomExtensions;
    getCustomExtensionCustomTables: GetCustomExtensionCustomTables;
    getCustomTableFields: GetCustomTableFields;
    getSecretsKeys: GetSecretsKeys;
    getSecretVal: GetSecretVal;
    setSecretVal: SetSecretVal;
    getUsers: GetUsers;
    getRoles: GetRoles;
    getActiveOrder: GetActiveOrder;
    getActiveCustomer: GetActiveCustomer;
    setActiveCustomer: SetActiveCustomer;
    getActiveOutlet: GetActiveOutlet;
    setActiveOutlet: SetActiveOutlet;
    getActiveStation: GetActiveStation;
    setActiveStation: SetActiveStation;
    getActiveSession: GetActiveSession;
    setActiveSession: SetActiveSession;
    getActiveUser: GetActiveUser;
    setActiveUser: SetActiveUser;
    setActiveRefund: SetActiveRefund;
    removeProductDiscount: RemoveProductDiscount;
    removeProductFee: RemoveProductFee;
    removeProductNote: RemoveProductNote;
    removeCartFee: RemoveCartFee;
    removeOrderNote: RemoveOrderNote;
    removeCustomSale: RemoveCustomSale;
    removeNonRevenueItem: RemoveNonRevenueItem;
    canTransition: CanTransition;
    getAvailableTransitions: GetAvailableTransitions;
}
