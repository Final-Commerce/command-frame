import { RemoveProductFromCart, RemoveProductFromCartParams, RemoveProductFromCartResponse } from "./types";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";
export const mockRemoveProductFromCart: RemoveProductFromCart = (params?: RemoveProductFromCartParams): Promise<RemoveProductFromCartResponse> => {
    console.log("[Mock] removeProductFromCart called", params);

    if (!params?.internalId) {
        throw new Error("internalId is required");
    }

    const { internalId } = params;

    // Find the product in the cart
    const productIndex = MOCK_CART.products.findIndex(p => p.internalId === internalId);

    if (productIndex === -1) {
        throw new Error(`Cart item with internalId ${internalId} not found`);
    }

    const product = MOCK_CART.products[productIndex];

    // Remove from cart
    MOCK_CART.products.splice(productIndex, 1);

    // Recalculate totals
    const lineTotal = product.price * product.quantity;
    MOCK_CART.subtotal -= lineTotal;
    MOCK_CART.total -= lineTotal;
    MOCK_CART.amountToBeCharged = MOCK_CART.total;
    MOCK_CART.remainingBalance = MOCK_CART.total;

    // Publish product-deleted event
    mockPublishEvent("cart", "product-deleted", {
        product: product,
        internalId: internalId
    });

    return Promise.resolve({
        success: true,
        internalId: internalId,
        timestamp: new Date().toISOString()
    });
};
