import { RemoveCustomerFromCart, RemoveCustomerFromCartResponse } from "./types";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";

export const mockRemoveCustomerFromCart: RemoveCustomerFromCart = async (): Promise<RemoveCustomerFromCartResponse> => {
    console.log("[Mock] removeCustomerFromCart called");

    // Actually remove the customer from the mock cart
    MOCK_CART.customer = null;

    // Publish customer-removed event so cart subscribers refresh
    mockPublishEvent('cart', 'customer-removed', {});

    return {
        success: true,
        timestamp: new Date().toISOString()
    };
};

