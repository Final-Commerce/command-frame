import { ClearCart, ClearCartResponse } from "./types";
import { resetMockCart } from "../../demo/database";

export const mockClearCart: ClearCart = async (): Promise<ClearCartResponse> => {
    console.log("[Mock] clearCart called");
    
    resetMockCart();

    return {
        success: true,
        timestamp: new Date().toISOString()
    };
};

