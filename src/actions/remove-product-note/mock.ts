import { RemoveProductNote, RemoveProductNoteParams, RemoveProductNoteResponse } from "./types";
import { MOCK_CART } from "../../demo/database";

export const mockRemoveProductNote: RemoveProductNote = (params?: RemoveProductNoteParams): Promise<RemoveProductNoteResponse> => {
    console.log("[Mock] removeProductNote called", params);

    // Mirror mockAddProductNote: target by internalId, else fall back to the
    // last added item (common POS behavior when no id is provided).
    const item = params?.internalId
        ? MOCK_CART.products.find(p => p.internalId === params.internalId)
        : MOCK_CART.products[MOCK_CART.products.length - 1];
    if (item) {
        delete item.note;
    }

    return Promise.resolve({
        success: true,
        internalId: params?.internalId,
        timestamp: new Date().toISOString()
    });
};
