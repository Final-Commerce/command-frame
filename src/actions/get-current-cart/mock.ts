import { GetCurrentCart, GetCurrentCartResponse } from "./types";
import { MOCK_CART, safeSerialize } from "../../demo/database";

export const mockGetCurrentCart: GetCurrentCart = async (): Promise<GetCurrentCartResponse> => {
    console.log("[Mock] getCurrentCart called");
    
    return {
        success: true,
        cart: safeSerialize(MOCK_CART),
        timestamp: new Date().toISOString()
    };
};

