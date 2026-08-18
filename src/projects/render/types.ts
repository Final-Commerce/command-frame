import type {
  ExampleFunction,
  GetProducts,
  AddCustomSale,
  EditCustomSale,
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
  VoidOrder,
  InitiateRefund,
  CashPayment,
  GetCashRoundingAmount,
  TapToPayPayment,
  TerminalPayment,
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
  SetRefundStockAction,
  SelectAllRefundItems,
  ResetRefundDetails,
  CalculateRefundTotal,
  GetRemainingRefundableQuantities,
  ProcessPartialRefund,
  RedeemRefund,
  GetRefundPlan,
  CheckPermission,
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
  GetActiveStation,
  GetActiveSession,
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
  GetAvailableTransitions,
  ApplyTransition,
  IntegrationPayment,
  GetSmartGridLayout,
  SaveSmartGridLayout,
  SendEmail,
  SendSms,
  AddProduct,
  EditProduct,
  EditProductVariants,
  DeleteProduct,
  GetProductVariants,
  GetInventory,
  GetStockHistory,
  GetProductVisibility,
  GetOutlets,
} from '../../index';

export interface RenderProviderActions {
  exampleFunction: ExampleFunction;
  getProducts: GetProducts;
  addCustomSale: AddCustomSale;
  editCustomSale: EditCustomSale;
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
  voidOrder: VoidOrder;
  initiateRefund: InitiateRefund;
  cashPayment: CashPayment;
  getCashRoundingAmount: GetCashRoundingAmount;
  tapToPayPayment: TapToPayPayment;
  terminalPayment: TerminalPayment;
  extensionPayment: ExtensionPayment;
  redeemPayment: RedeemPayment;
  integrationPayment: IntegrationPayment;
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
  setRefundStockAction: SetRefundStockAction;
  selectAllRefundItems: SelectAllRefundItems;
  resetRefundDetails: ResetRefundDetails;
  calculateRefundTotal: CalculateRefundTotal;
  getRemainingRefundableQuantities: GetRemainingRefundableQuantities;
  processPartialRefund: ProcessPartialRefund;
  redeemRefund: RedeemRefund;
  getRefundPlan: GetRefundPlan;
  checkPermission: CheckPermission;
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
  getActiveStation: GetActiveStation;
  getActiveSession: GetActiveSession;
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
  applyTransition: ApplyTransition;
  getSmartGridLayout: GetSmartGridLayout;
  saveSmartGridLayout: SaveSmartGridLayout;
  sendEmail: SendEmail;
  sendSms: SendSms;
  addProduct: AddProduct;
  editProduct: EditProduct;
  editProductVariants: EditProductVariants;
  deleteProduct: DeleteProduct;
  // Product domain reads
  getProductVariants: GetProductVariants;
  getInventory: GetInventory;
  getStockHistory: GetStockHistory;
  getProductVisibility: GetProductVisibility;
  getOutlets: GetOutlets;
}
