import { LoadOrderIntoCart, LoadOrderIntoCartParams, LoadOrderIntoCartResponse } from "./types";
import { MOCK_PARKED_ORDERS, MOCK_CART, resetMockCart, mockPublishEvent } from "../../demo/database";

export const mockLoadOrderIntoCart: LoadOrderIntoCart = async (params: LoadOrderIntoCartParams): Promise<LoadOrderIntoCartResponse> => {
    console.log("[Mock] loadOrderIntoCart called", params);

    if (!params?.orderId) {
        throw new Error("Order ID is required");
    }

    // Same-station policy: a non-empty till errors unless overwrite is passed.
    if (MOCK_CART.products.length > 0 && !params.overwrite) {
        throw new Error("Cart is not empty — pass overwrite: true to replace it");
    }

    const index = MOCK_PARKED_ORDERS.findIndex(o => o._id === params.orderId);
    const orderToLoad = index !== -1 ? MOCK_PARKED_ORDERS[index] : null;

    if (!orderToLoad) {
        throw new Error(`Order with ID ${params.orderId} not found`);
    }

    // Optional state move happens BEFORE hydration; in the mock a move off on_hold
    // simply removes the order from the parked list.
    let transition: LoadOrderIntoCartResponse["transition"];
    if (params.targetFulfillmentState) {
        MOCK_PARKED_ORDERS.splice(index, 1);
        transition = {
            result: { allowed: true },
            from: { payment: "unpaid", fulfillment: "on_hold" },
            to: { payment: "unpaid", fulfillment: params.targetFulfillmentState },
        };
    }

    // Hydrate the till — full cart context (best-effort mapping for the demo).
    resetMockCart();
    MOCK_CART.customer = orderToLoad.customer as any;
    MOCK_CART.products = orderToLoad.lineItems.map(li => ({
        id: li.productId,
        name: li.name,
        quantity: li.quantity,
        price: li.price,
        internalId: li.internalId || li.productId,
        variantId: li.variantId,
        sku: li.sku,
        images: [li.image],
        stock: 100,
        taxTableId: "",
        attributes: li.attributes
    } as any));
    MOCK_CART.subtotal = orderToLoad.summary.subtotalAfterFees;
    MOCK_CART.total = orderToLoad.summary.total;
    MOCK_CART.amountToBeCharged = MOCK_CART.total;
    MOCK_CART.remainingBalance = MOCK_CART.total;

    mockPublishEvent("cart", "cart-created", { cart: MOCK_CART });
    mockPublishEvent("orders", "order-loaded-into-cart", { orderId: params.orderId });

    return {
        success: true,
        order: orderToLoad,
        cart: MOCK_CART as any,
        // The mock till always holds edit rights; lease info arrives with the occupancy follow-up.
        editable: true,
        transition,
        timestamp: new Date().toISOString()
    };
};
