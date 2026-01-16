import type {
    ExampleFunction,
    GetProducts,
    AddCustomSale,
    GetCustomers,
    AssignCustomer,
    AddCustomer,
    GetCategories,
    GetOrders,
    GetRefunds,
    AddProductDiscount,
    AddProductToCart,
    RemoveProductFromCart,
    UpdateCartItemQuantity,
    AddCartDiscount,
    GetContext,
    GetFinalContext,
    AddProductNote,
    AddProductFee,
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
    AddCustomerNote,
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
    SetActiveOrder
    GetCustomTables,
    GetCustomTableData,
    UpsertCustomTableData,
    DeleteCustomTableData,
    GetCustomExtensions,
    GetCustomExtensionCustomTables
} from "../../index";

export interface RenderProviderActions {
    exampleFunction: ExampleFunction;
    getProducts: GetProducts;
    addCustomSale: AddCustomSale;
    getCustomers: GetCustomers;
    assignCustomer: AssignCustomer;
    addCustomer: AddCustomer;
    getCategories: GetCategories;
    getOrders: GetOrders;
    getRefunds: GetRefunds;
    addProductDiscount: AddProductDiscount;
    addProductToCart: AddProductToCart;
    removeProductFromCart: RemoveProductFromCart;
    updateCartItemQuantity: UpdateCartItemQuantity;
    addCartDiscount: AddCartDiscount;
    getContext: GetContext;
    getFinalContext: GetFinalContext;
    addProductNote: AddProductNote;
    addProductFee: AddProductFee;
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
    addCustomerNote: AddCustomerNote;
    removeCustomerFromCart: RemoveCustomerFromCart;
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
    getCustomExtensionCustomTables: GetCustomExtensionCustomTables;
}
