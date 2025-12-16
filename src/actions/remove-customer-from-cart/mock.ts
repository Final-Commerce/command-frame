import { RemoveCustomerFromCart, RemoveCustomerFromCartResponse } from "./types";
import { MOCK_CART } from "../../demo/database";

export const mockRemoveCustomerFromCart: RemoveCustomerFromCart = async (): Promise<RemoveCustomerFromCartResponse> => {
    console.log("[Mock] removeCustomerFromCart called");
    
    // Actually remove the customer from the mock cart
    MOCK_CART.customer = null;

    return {
        success: true,
        timestamp: new Date().toISOString()
    };
};

