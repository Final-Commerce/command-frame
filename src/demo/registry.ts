import { mockAddCartDiscount } from "../actions/add-cart-discount/mock";
import { mockAddCartFee } from "../actions/add-cart-fee/mock";
import { mockAddCustomSale } from "../actions/add-custom-sale/mock";
import { mockAddCustomer } from "../actions/add-customer/mock";
import { mockAddCustomerNote } from "../actions/add-customer-note/mock";
import { mockAddOrderNote } from "../actions/add-order-note/mock";
import { mockAddProductDiscount } from "../actions/add-product-discount/mock";
import { mockAddProductFee } from "../actions/add-product-fee/mock";
import { mockAddProductNote } from "../actions/add-product-note/mock";
import { mockAddProductToCart } from "../actions/add-product-to-cart/mock";
import { mockAdjustInventory } from "../actions/adjust-inventory/mock";
import { mockAssignCustomer } from "../actions/assign-customer/mock";
import { mockAuthenticateUser } from "../actions/authenticate-user/mock";
import { mockCalculateRefundTotal } from "../actions/calculate-refund-total/mock";
import { mockCashPayment } from "../actions/cash-payment/mock";
import { mockClearCart } from "../actions/clear-cart/mock";
import { mockDeleteParkedOrder } from "../actions/delete-parked-order/mock";
import { mockExampleFunction } from "../actions/example-function/mock";
import { mockGetCategories } from "../actions/get-categories/mock";
import { mockGetContext } from "../actions/get-context/mock";
import { mockGetCurrentCart } from "../actions/get-current-cart/mock";
import { mockGetCustomers } from "../actions/get-customers/mock";
import { mockGetLineItemsByOrder } from "../actions/get-line-items-by-order/mock";
import { mockGetOrders } from "../actions/get-orders/mock";
import { mockGetProductVariants } from "../actions/get-product-variants/mock";
import { mockGetProducts } from "../actions/get-products/mock";
import { mockGetRefunds } from "../actions/get-refunds/mock";
import { mockGetRemainingRefundableQuantities } from "../actions/get-remaining-refundable-quantities/mock";
import { mockGoToPage } from "../actions/go-to-page/mock";
import { mockGoToStationHome } from "../actions/go-to-station-home/mock";
import { mockInitiateRefund } from "../actions/initiate-refund/mock";
import { mockOpenCashDrawer } from "../actions/open-cash-drawer/mock";
import { mockOpenPopup } from "../actions/open-popup/mock";
import { mockParkOrder } from "../actions/park-order/mock";
import { mockPartialPayment } from "../actions/partial-payment/mock";
import { mockProcessPartialRefund } from "../actions/process-partial-refund/mock";
import { mockRemoveCustomerFromCart } from "../actions/remove-customer-from-cart/mock";
import { mockResetRefundDetails } from "../actions/reset-refund-details/mock";
import { mockResumeParkedOrder } from "../actions/resume-parked-order/mock";
import { mockSelectAllRefundItems } from "../actions/select-all-refund-items/mock";
import { mockSetProductActive } from "../actions/set-product-active/mock";
import { mockSetRefundStockAction } from "../actions/set-refund-stock-action/mock";
import { mockShowConfirmation } from "../actions/show-confirmation/mock";
import { mockShowNotification } from "../actions/show-notification/mock";
import { mockSwitchUser } from "../actions/switch-user/mock";
import { mockTapToPayPayment } from "../actions/tap-to-pay-payment/mock";
import { mockTerminalPayment } from "../actions/terminal-payment/mock";
import { mockToggleSlideOut } from "../actions/toggle-slide-out/mock";
import { mockTriggerWebhook } from "../actions/trigger-webhook/mock";
import { mockTriggerZapierWebhook } from "../actions/trigger-zapier-webhook/mock";
import { mockUpdateCustomerFacingDisplay } from "../actions/update-customer-facing-display/mock";
import { mockVendaraPayment } from "../actions/vendara-payment/mock";

import { commands } from "../index";

// Type for mock handler
type MockHandler = (params?: any) => Promise<any>;

// Derive Command Name type directly from the commands object keys to enforce exhaustiveness
export type CommandName = keyof typeof commands;

export const MOCK_REGISTRY: Record<CommandName, MockHandler> = {
    "addCartDiscount": mockAddCartDiscount,
    "addCartFee": mockAddCartFee,
    "addCustomSale": mockAddCustomSale,
    "addCustomer": mockAddCustomer,
    "addCustomerNote": mockAddCustomerNote,
    "addOrderNote": mockAddOrderNote,
    "addProductDiscount": mockAddProductDiscount,
    "addProductFee": mockAddProductFee,
    "addProductNote": mockAddProductNote,
    "addProductToCart": mockAddProductToCart,
    "adjustInventory": mockAdjustInventory,
    "assignCustomer": mockAssignCustomer,
    "authenticateUser": mockAuthenticateUser,
    "calculateRefundTotal": mockCalculateRefundTotal,
    "cashPayment": mockCashPayment,
    "clearCart": mockClearCart,
    "deleteParkedOrder": mockDeleteParkedOrder,
    "exampleFunction": mockExampleFunction,
    "getCategories": mockGetCategories,
    "getContext": mockGetContext,
    "getCurrentCart": mockGetCurrentCart,
    "getCustomers": mockGetCustomers,
    "getLineItemsByOrder": mockGetLineItemsByOrder,
    "getOrders": mockGetOrders,
    "getProductVariants": mockGetProductVariants,
    "getProducts": mockGetProducts,
    "getRefunds": mockGetRefunds,
    "getRemainingRefundableQuantities": mockGetRemainingRefundableQuantities,
    "goToPage": mockGoToPage,
    "goToStationHome": mockGoToStationHome,
    "initiateRefund": mockInitiateRefund,
    "openCashDrawer": mockOpenCashDrawer,
    "openPopup": mockOpenPopup,
    "parkOrder": mockParkOrder,
    "partialPayment": mockPartialPayment,
    "processPartialRefund": mockProcessPartialRefund,
    "removeCustomerFromCart": mockRemoveCustomerFromCart,
    "resetRefundDetails": mockResetRefundDetails,
    "resumeParkedOrder": mockResumeParkedOrder,
    "selectAllRefundItems": mockSelectAllRefundItems,
    "setProductActive": mockSetProductActive,
    "setRefundStockAction": mockSetRefundStockAction,
    "showConfirmation": mockShowConfirmation,
    "showNotification": mockShowNotification,
    "switchUser": mockSwitchUser,
    "tapToPayPayment": mockTapToPayPayment,
    "terminalPayment": mockTerminalPayment,
    "toggleSlideOut": mockToggleSlideOut,
    "triggerWebhook": mockTriggerWebhook,
    "triggerZapierWebhook": mockTriggerZapierWebhook,
    "updateCustomerFacingDisplay": mockUpdateCustomerFacingDisplay,
    "vendaraPayment": mockVendaraPayment,
};
