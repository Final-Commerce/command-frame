import { mockAddCartDiscount } from "../../actions/add-cart-discount/mock";
import { mockAddCartFee } from "../../actions/add-cart-fee/mock";
import { mockAddCustomSale } from "../../actions/add-custom-sale/mock";
import { mockAddCustomer } from "../../actions/add-customer/mock";
import { mockAddCustomerNote } from "../../actions/add-customer-note/mock";
import { mockAddOrderNote } from "../../actions/add-order-note/mock";
import { mockAddProductDiscount } from "../../actions/add-product-discount/mock";
import { mockAddProductFee } from "../../actions/add-product-fee/mock";
import { mockAddProductNote } from "../../actions/add-product-note/mock";
import { mockAddProductToCart } from "../../actions/add-product-to-cart/mock";
import { mockRemoveProductFromCart } from "../../actions/remove-product-from-cart/mock";
import { mockUpdateCartItemQuantity } from "../../actions/update-cart-item-quantity/mock";
import { mockAdjustInventory } from "../../actions/adjust-inventory/mock";
import { mockAssignCustomer } from "../../actions/assign-customer/mock";
import { mockAuthenticateUser } from "../../actions/authenticate-user/mock";
import { mockCalculateRefundTotal } from "../../actions/calculate-refund-total/mock";
import { mockCashPayment } from "../../actions/cash-payment/mock";
import { mockClearCart } from "../../actions/clear-cart/mock";
import { mockDeleteParkedOrder } from "../../actions/delete-parked-order/mock";
import { mockExampleFunction } from "../../actions/example-function/mock";
import { mockGetCategories } from "../../actions/get-categories/mock";
import { mockGetContext } from "../../actions/get-context/mock";
import { mockGetCurrentCart } from "../../actions/get-current-cart/mock";
import { mockGetCustomers } from "../../actions/get-customers/mock";
import { mockGetOrders } from "../../actions/get-orders/mock";
import { mockGetProducts } from "../../actions/get-products/mock";
import { mockGetRefunds } from "../../actions/get-refunds/mock";
import { mockGetRemainingRefundableQuantities } from "../../actions/get-remaining-refundable-quantities/mock";
import { mockGoToStationHome } from "../../actions/go-to-station-home/mock";
import { mockInitiateRefund } from "../../actions/initiate-refund/mock";
import { mockOpenCashDrawer } from "../../actions/open-cash-drawer/mock";
import { mockParkOrder } from "../../actions/park-order/mock";
import { mockPartialPayment } from "../../actions/partial-payment/mock";
import { mockProcessPartialRefund } from "../../actions/process-partial-refund/mock";
import { mockRemoveCustomerFromCart } from "../../actions/remove-customer-from-cart/mock";
import { mockResetRefundDetails } from "../../actions/reset-refund-details/mock";
import { mockResumeParkedOrder } from "../../actions/resume-parked-order/mock";
import { mockSelectAllRefundItems } from "../../actions/select-all-refund-items/mock";
import { mockSetRefundStockAction } from "../../actions/set-refund-stock-action/mock";
import { mockShowConfirmation } from "../../actions/show-confirmation/mock";
import { mockShowNotification } from "../../actions/show-notification/mock";
import { mockSwitchUser } from "../../actions/switch-user/mock";
import { mockTapToPayPayment } from "../../actions/tap-to-pay-payment/mock";
import { mockTerminalPayment } from "../../actions/terminal-payment/mock";
import { mockTriggerWebhook } from "../../actions/trigger-webhook/mock";
import { mockTriggerZapierWebhook } from "../../actions/trigger-zapier-webhook/mock";
import { mockVendaraPayment } from "../../actions/vendara-payment/mock";
import { mockGetFinalContext } from "../../actions/get-final-context/mock";
import { mockPrint } from "../../actions/print/mock";
import { mockSetActiveOrder } from "../../actions/set-active-order/mock";
import { mockGetCustomTables } from "../../actions/get-custom-tables/mock";
import { mockGetCustomTableData } from "../../actions/get-custom-table-data/mock";
import { mockUpsertCustomTableData } from "../../actions/upsert-custom-table-data/mock";
import { mockDeleteCustomTableData } from "../../actions/delete-custom-table-data/mock";
import { mockGetCustomExtensions } from "../../actions/get-custom-extensions/mock";
import { mockGetCustomExtensionCustomTables } from "../../actions/get-custom-extension-custom-tables/mock";
import { mockGetSecretsKeys } from "../../actions/get-secrets-keys/mock";
import { mockGetSecretVal } from "../../actions/get-secret-val/mock";
import { mockSetSecretVal } from "../../actions/set-secret-val/mock";
import { RenderProviderActions } from "./types";

export const RENDER_MOCKS: RenderProviderActions = {
    addCartDiscount: mockAddCartDiscount,
    addCartFee: mockAddCartFee,
    addCustomSale: mockAddCustomSale,
    addCustomer: mockAddCustomer,
    addCustomerNote: mockAddCustomerNote,
    addOrderNote: mockAddOrderNote,
    addProductDiscount: mockAddProductDiscount,
    addProductFee: mockAddProductFee,
    addProductNote: mockAddProductNote,
    addProductToCart: mockAddProductToCart,
    removeProductFromCart: mockRemoveProductFromCart,
    updateCartItemQuantity: mockUpdateCartItemQuantity,
    adjustInventory: mockAdjustInventory,
    assignCustomer: mockAssignCustomer,
    authenticateUser: mockAuthenticateUser,
    calculateRefundTotal: mockCalculateRefundTotal,
    cashPayment: mockCashPayment,
    clearCart: mockClearCart,
    deleteParkedOrder: mockDeleteParkedOrder,
    exampleFunction: mockExampleFunction,
    getCategories: mockGetCategories,
    getContext: mockGetContext,
    getCurrentCart: mockGetCurrentCart,
    getCustomers: mockGetCustomers,
    getOrders: mockGetOrders,
    getProducts: mockGetProducts,
    getRefunds: mockGetRefunds,
    getRemainingRefundableQuantities: mockGetRemainingRefundableQuantities,
    goToStationHome: mockGoToStationHome,
    initiateRefund: mockInitiateRefund,
    openCashDrawer: mockOpenCashDrawer,
    parkOrder: mockParkOrder,
    partialPayment: mockPartialPayment,
    processPartialRefund: mockProcessPartialRefund,
    removeCustomerFromCart: mockRemoveCustomerFromCart,
    resetRefundDetails: mockResetRefundDetails,
    resumeParkedOrder: mockResumeParkedOrder,
    selectAllRefundItems: mockSelectAllRefundItems,
    setRefundStockAction: mockSetRefundStockAction,
    showConfirmation: mockShowConfirmation,
    showNotification: mockShowNotification,
    switchUser: mockSwitchUser,
    tapToPayPayment: mockTapToPayPayment,
    terminalPayment: mockTerminalPayment,
    triggerWebhook: mockTriggerWebhook,
    triggerZapierWebhook: mockTriggerZapierWebhook,
    vendaraPayment: mockVendaraPayment,
    getFinalContext: mockGetFinalContext,
    print: mockPrint,
    setActiveOrder: mockSetActiveOrder,
    getCustomTables: mockGetCustomTables,
    getCustomTableData: mockGetCustomTableData,
    upsertCustomTableData: mockUpsertCustomTableData,
    deleteCustomTableData: mockDeleteCustomTableData,
    getCustomExtensions: mockGetCustomExtensions,
    getCustomExtensionCustomTables: mockGetCustomExtensionCustomTables,
    getSecretsKeys: mockGetSecretsKeys,
    getSecretVal: mockGetSecretVal,
    setSecretVal: mockSetSecretVal,
};
