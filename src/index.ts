// Import actions from new folder structure
import { exampleFunction } from "./actions/example-function/action";
import { getProducts } from "./actions/get-products/action";
import { addCustomSale } from "./actions/add-custom-sale/action";
import { getCustomers } from "./actions/get-customers/action";
import { assignCustomer } from "./actions/assign-customer/action";
import { addCustomer } from "./actions/add-customer/action";
import { getCategories } from "./actions/get-categories/action";
import { getProductVariants } from "./actions/get-product-variants/action";
import { getOrders } from "./actions/get-orders/action";
import { getRefunds } from "./actions/get-refunds/action";
import { addCartDiscount } from "./actions/add-cart-discount/action";
import { setProductActive } from "./actions/set-product-active/action";
import { getContext } from "./actions/get-context/action";
import { getFinalContext } from "./actions/get-final-context/action";
import { addProductDiscount } from "./actions/add-product-discount/action";
import { addProductToCart } from "./actions/add-product-to-cart/action";
// Product Actions
import { addProductNote } from "./actions/add-product-note/action";
import { addProductFee } from "./actions/add-product-fee/action";
import { adjustInventory } from "./actions/adjust-inventory/action";
// Order Actions
import { addOrderNote } from "./actions/add-order-note/action";
import { addCartFee } from "./actions/add-cart-fee/action";
import { clearCart } from "./actions/clear-cart/action";
import { parkOrder } from "./actions/park-order/action";
import { resumeParkedOrder } from "./actions/resume-parked-order/action";
import { deleteParkedOrder } from "./actions/delete-parked-order/action";
import { initiateRefund } from "./actions/initiate-refund/action";
import { cashPayment } from "./actions/cash-payment/action";
import { tapToPayPayment } from "./actions/tap-to-pay-payment/action";
import { terminalPayment } from "./actions/terminal-payment/action";
import { vendaraPayment } from "./actions/vendara-payment/action";
// Customer Actions
import { addCustomerNote } from "./actions/add-customer-note/action";
import { removeCustomerFromCart } from "./actions/remove-customer-from-cart/action";
// System Actions
import { goToStationHome } from "./actions/go-to-station-home/action";
import { goToPage } from "./actions/go-to-page/action";
import { openCashDrawer } from "./actions/open-cash-drawer/action";
import { openPopup } from "./actions/open-popup/action";
import { showNotification } from "./actions/show-notification/action";
import { toggleSlideOut } from "./actions/toggle-slide-out/action";
import { showConfirmation } from "./actions/show-confirmation/action";
import { authenticateUser } from "./actions/authenticate-user/action";
import { updateCustomerFacingDisplay } from "./actions/update-customer-facing-display/action";
import { partialPayment } from "./actions/partial-payment/action";
import { switchUser } from "./actions/switch-user/action";
// Integration Actions
import { triggerWebhook } from "./actions/trigger-webhook/action";
import { triggerZapierWebhook } from "./actions/trigger-zapier-webhook/action";
import { getLineItemsByOrder } from "./actions/get-line-items-by-order/action";
import { setRefundStockAction } from "./actions/set-refund-stock-action/action";
import { selectAllRefundItems } from "./actions/select-all-refund-items/action";
import { resetRefundDetails } from "./actions/reset-refund-details/action";
import { calculateRefundTotal } from "./actions/calculate-refund-total/action";
import { getRemainingRefundableQuantities } from "./actions/get-remaining-refundable-quantities/action";
import { processPartialRefund } from "./actions/process-partial-refund/action";
import { getCurrentCart } from "./actions/get-current-cart/action";

// Export actions as command object
export const command = {
    exampleFunction,
    getProducts,
    addCustomSale,
    getCustomers,
    assignCustomer,
    addCustomer,
    getCategories,
    getProductVariants,
    getOrders,
    getRefunds,
    setProductActive,
    addProductDiscount,
    addProductToCart,
    addCartDiscount,
    getContext,
    // Product Actions
    addProductNote,
    addProductFee,
    adjustInventory,
    // Order Actions
    addOrderNote,
    addCartFee,
    clearCart,
    parkOrder,
    resumeParkedOrder,
    deleteParkedOrder,
    initiateRefund,
    cashPayment,
    tapToPayPayment,
    terminalPayment,
    vendaraPayment,
    // Customer Actions
    addCustomerNote,
    removeCustomerFromCart,
    // System Actions
    goToStationHome,
    goToPage,
    openCashDrawer,
    openPopup,
    showNotification,
    toggleSlideOut,
    showConfirmation,
    authenticateUser,
    updateCustomerFacingDisplay,
    partialPayment,
    switchUser,
    // Integration Actions
    triggerWebhook,
    triggerZapierWebhook,
    // Refund Actions
    getLineItemsByOrder,
    setRefundStockAction,
    selectAllRefundItems,
    resetRefundDetails,
    calculateRefundTotal,
    getRemainingRefundableQuantities,
    processPartialRefund,
    getCurrentCart
} as const;

// Export types from action folders (only Params, Response, and Function types)
export type {
    ExampleFunction,
    ExampleFunctionParams,
    ExampleFunctionResponse
} from "./actions/example-function/types";

export type {
    GetProducts,
    GetProductsParams,
    GetProductsResponse
} from "./actions/get-products/types";

export type {
    AddCustomSale,
    AddCustomSaleParams,
    AddCustomSaleResponse
} from "./actions/add-custom-sale/types";

export type {
    GetCustomers,
    GetCustomersParams,
    GetCustomersResponse
} from "./actions/get-customers/types";

export type {
    AssignCustomer,
    AssignCustomerParams,
    AssignCustomerResponse
} from "./actions/assign-customer/types";

export type {
    AddCustomer,
    AddCustomerParams,
    AddCustomerResponse
} from "./actions/add-customer/types";

export type {
    GetCategories,
    GetCategoriesParams,
    GetCategoriesResponse
} from "./actions/get-categories/types";

export type {
    GetProductVariants,
    GetProductVariantsParams,
    GetProductVariantsResponse
} from "./actions/get-product-variants/types";

export type {
    GetOrders,
    GetOrdersParams,
    GetOrdersResponse
} from "./actions/get-orders/types";

export type {
    GetRefunds,
    GetRefundsParams,
    GetRefundsResponse
} from "./actions/get-refunds/types";

export type {
    GetLineItemsByOrder,
    GetLineItemsByOrderParams,
    GetLineItemsByOrderResponse
} from "./actions/get-line-items-by-order/types";

export type {
    SetRefundStockAction,
    SetRefundStockActionParams,
    SetRefundStockActionResponse
} from "./actions/set-refund-stock-action/types";

export type {
    SelectAllRefundItems,
    SelectAllRefundItemsResponse
} from "./actions/select-all-refund-items/types";

export type {
    ResetRefundDetails,
    ResetRefundDetailsResponse
} from "./actions/reset-refund-details/types";

export type {
    CalculateRefundTotal,
    CalculateRefundTotalResponse
} from "./actions/calculate-refund-total/types";

export type {
    GetRemainingRefundableQuantities,
    GetRemainingRefundableQuantitiesResponse
} from "./actions/get-remaining-refundable-quantities/types";

export type {
    ProcessPartialRefund,
    ProcessPartialRefundParams,
    ProcessPartialRefundResponse
} from "./actions/process-partial-refund/types";

export type {
    GetCurrentCart,
    GetCurrentCartResponse
} from "./actions/get-current-cart/types";

export type {
    SetProductActive,
    SetProductActiveParams,
    SetProductActiveResponse
} from "./actions/set-product-active/types";

export type {
    AddProductDiscount,
    AddProductDiscountParams,
    AddProductDiscountResponse
} from "./actions/add-product-discount/types";

export type {
    AddProductToCart,
    AddProductToCartParams,
    AddProductToCartResponse
} from "./actions/add-product-to-cart/types";

export type {
    AddCartDiscount,
    AddCartDiscountParams,
    AddCartDiscountResponse
} from "./actions/add-cart-discount/types";

export type {
    GetContext,
    GetContextResponse
} from "./actions/get-context/types";

export type {
    GetFinalContext,
    GetFinalContextResponse
} from "./actions/get-final-context/types";

// Product Actions
export type {
    AddProductNote,
    AddProductNoteParams,
    AddProductNoteResponse
} from "./actions/add-product-note/types";
export type {
    AddProductFee,
    AddProductFeeParams,
    AddProductFeeResponse
} from "./actions/add-product-fee/types";
export type {
    AdjustInventory,
    AdjustInventoryParams,
    AdjustInventoryResponse
} from "./actions/adjust-inventory/types";
// Order Actions
export type {
    AddOrderNote,
    AddOrderNoteParams,
    AddOrderNoteResponse
} from "./actions/add-order-note/types";
export type {
    AddCartFee,
    AddCartFeeParams,
    AddCartFeeResponse
} from "./actions/add-cart-fee/types";
export type {
    ClearCart,
    ClearCartResponse
} from "./actions/clear-cart/types";
export type {
    ParkOrder,
    ParkOrderResponse
} from "./actions/park-order/types";
export type {
    ResumeParkedOrder,
    ResumeParkedOrderParams,
    ResumeParkedOrderResponse
} from "./actions/resume-parked-order/types";
export type {
    DeleteParkedOrder,
    DeleteParkedOrderParams,
    DeleteParkedOrderResponse
} from "./actions/delete-parked-order/types";
export type {
    InitiateRefund,
    InitiateRefundParams,
    InitiateRefundResponse
} from "./actions/initiate-refund/types";
export type {
    CashPayment,
    CashPaymentParams,
    CashPaymentResponse
} from "./actions/cash-payment/types";
export type {
    TapToPayPayment,
    TapToPayPaymentParams,
    TapToPayPaymentResponse
} from "./actions/tap-to-pay-payment/types";
export type {
    TerminalPayment,
    TerminalPaymentParams,
    TerminalPaymentResponse
} from "./actions/terminal-payment/types";
export type {
    VendaraPayment,
    VendaraPaymentParams,
    VendaraPaymentResponse
} from "./actions/vendara-payment/types";
// Customer Actions
export type {
    AddCustomerNote,
    AddCustomerNoteParams,
    AddCustomerNoteResponse
} from "./actions/add-customer-note/types";
export type {
    RemoveCustomerFromCart,
    RemoveCustomerFromCartResponse
} from "./actions/remove-customer-from-cart/types";
// System Actions
export type {
    GoToStationHome,
    GoToStationHomeResponse
} from "./actions/go-to-station-home/types";
export type {
    GoToPage,
    GoToPageParams,
    GoToPageResponse
} from "./actions/go-to-page/types";
export type {
    OpenCashDrawer,
    OpenCashDrawerResponse
} from "./actions/open-cash-drawer/types";
export type {
    OpenPopup,
    OpenPopupParams,
    OpenPopupResponse
} from "./actions/open-popup/types";
export type {
    ShowNotification,
    ShowNotificationParams,
    ShowNotificationResponse
} from "./actions/show-notification/types";
export type {
    ToggleSlideOut,
    ToggleSlideOutParams,
    ToggleSlideOutResponse
} from "./actions/toggle-slide-out/types";
export type {
    ShowConfirmation,
    ShowConfirmationParams,
    ShowConfirmationResponse
} from "./actions/show-confirmation/types";
export type {
    AuthenticateUser,
    AuthenticateUserParams,
    AuthenticateUserResponse
} from "./actions/authenticate-user/types";
export type {
    UpdateCustomerFacingDisplay,
    UpdateCustomerFacingDisplayParams,
    UpdateCustomerFacingDisplayResponse
} from "./actions/update-customer-facing-display/types";
export type {
    PartialPayment,
    PartialPaymentParams,
    PartialPaymentResponse
} from "./actions/partial-payment/types";
export type {
    SwitchUser,
    SwitchUserParams,
    SwitchUserResponse
} from "./actions/switch-user/types";
// Integration Actions
export type {
    TriggerWebhook,
    TriggerWebhookParams,
    TriggerWebhookResponse
} from "./actions/trigger-webhook/types";
export type {
    TriggerZapierWebhook,
    TriggerZapierWebhookParams,
    TriggerZapierWebhookResponse
} from "./actions/trigger-zapier-webhook/types";

// Export Common Types
export * from "./CommonTypes";

// Export client
export { commandFrameClient, CommandFrameClient } from "./client";
export type { PostMessageRequest, PostMessageResponse } from "./client";

// Export Pub/Sub
export { topics } from "./pubsub/topic";
export type {
    TopicDefinition,
    TopicEvent,
    TopicEventType,
    TopicSubscriptionCallback,
    TopicSubscription
} from "./pubsub/types";

// Export Pub/Sub Topics
export { customersTopic } from "./pubsub/topics/customers";
export { ordersTopic } from "./pubsub/topics/orders";
export { refundsTopic } from "./pubsub/topics/refunds";
export { productsTopic } from "./pubsub/topics/products";
export { cartTopic } from "./pubsub/topics/cart";
export { paymentsTopic } from "./pubsub/topics/payments";

// Export Pub/Sub Event Types
export type {
    // Customer event payloads
    CustomerCreatedPayload,
    CustomerUpdatedPayload,
    CustomerNoteAddedPayload,
    CustomerNoteDeletedPayload,
    CustomerAssignedPayload,
    CustomerUnassignedPayload,
    // Customer event types
    CustomerCreatedEvent,
    CustomerUpdatedEvent,
    CustomerNoteAddedEvent,
    CustomerNoteDeletedEvent,
    CustomerAssignedEvent,
    CustomerUnassignedEvent,
    // Customer topic union types
    CustomersEventType,
    CustomersEventPayload
} from "./pubsub/topics/customers/types";

// Export Orders Event Types
export type {
    OrderCreatedPayload,
    OrderUpdatedPayload,
    OrderCreatedEvent,
    OrderUpdatedEvent,
    OrdersEventType,
    OrdersEventPayload
} from "./pubsub/topics/orders/types";

// Export Refunds Event Types
export type {
    RefundCreatedPayload,
    RefundUpdatedPayload,
    RefundCreatedEvent,
    RefundUpdatedEvent,
    RefundsEventType,
    RefundsEventPayload
} from "./pubsub/topics/refunds/types";

// Export Products Event Types
export type {
    ProductCreatedPayload,
    ProductUpdatedPayload,
    ProductCreatedEvent,
    ProductUpdatedEvent,
    ProductsEventType,
    ProductsEventPayload
} from "./pubsub/topics/products/types";

// Export Cart Event Types
export type {
    CartCreatedPayload,
    CartCustomerAssignedPayload,
    ProductAddedPayload,
    ProductDeletedPayload,
    CartDiscountAddedPayload,
    CartDiscountRemovedPayload,
    CartFeeAddedPayload,
    CartFeeRemovedPayload,
    CartCreatedEvent,
    CartCustomerAssignedEvent,
    ProductAddedEvent,
    ProductDeletedEvent,
    CartDiscountAddedEvent,
    CartDiscountRemovedEvent,
    CartFeeAddedEvent,
    CartFeeRemovedEvent,
    CartEventType,
    CartEventPayload
} from "./pubsub/topics/cart/types";

// Export Payments Event Types
export type {
    PaymentDonePayload,
    PaymentErrPayload,
    PaymentDoneEvent,
    PaymentErrEvent,
    PaymentsEventType,
    PaymentsEventPayload
} from "./pubsub/topics/payments/types";
