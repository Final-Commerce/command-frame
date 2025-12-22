import { ClearCart, ClearCartResponse } from "./types";
import { resetMockCart, mockPublishEvent } from "../../demo/database";

export const mockClearCart: ClearCart = async (): Promise<ClearCartResponse> => {
    console.log("[Mock] clearCart called");
    
    resetMockCart();
    
    // Publish cart-created event to simulate cart reset
    mockPublishEvent('cart', 'cart-created', {});

    return {
        success: true,
        timestamp: new Date().toISOString()
    };
};

