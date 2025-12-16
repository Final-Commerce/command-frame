import { AddProductNote, AddProductNoteParams, AddProductNoteResponse } from "./types";
import { MOCK_CART } from "../../demo/database";

export const mockAddProductNote: AddProductNote = async (params?: AddProductNoteParams): Promise<AddProductNoteResponse> => {
    console.log("[Mock] addProductNote called", params);
    
    if (params?.note && params.cartItemId) {
        const item = MOCK_CART.products.find(p => p.internalId === params.cartItemId);
        if (item) {
            item.note = params.note;
        }
    } else if (params?.note && MOCK_CART.products.length > 0) {
        // Fallback to last added item if no ID provided (common behavior in some POS flows)
        MOCK_CART.products[MOCK_CART.products.length - 1].note = params.note;
    }

    return {
        success: true,
        note: params?.note || "",
        cartItemId: params?.cartItemId,
        timestamp: new Date().toISOString()
    };
};
