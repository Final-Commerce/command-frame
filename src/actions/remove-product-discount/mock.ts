import { RemoveProductDiscount, RemoveProductDiscountParams, RemoveProductDiscountResponse } from "./types";
import { MOCK_CART, mockPublishEvent } from "../../demo/database";

export const mockRemoveProductDiscount: RemoveProductDiscount = (params?: RemoveProductDiscountParams): Promise<RemoveProductDiscountResponse> => {
    console.log("[Mock] removeProductDiscount called", params);

    const item = params?.internalId
        ? MOCK_CART.products.find(p => p.internalId === params.internalId)
        : MOCK_CART.products[MOCK_CART.products.length - 1];

    if (item) {
        delete item.discount;
        // Publish so cart subscribers refresh.
        mockPublishEvent("cart", "product-discount-removed", { internalId: params?.internalId });
    }

    return Promise.resolve({
        success: true,
        internalId: params?.internalId,
        timestamp: new Date().toISOString()
    });
};
