import type { SetActiveProduct, SetActiveProductParams, SetActiveProductResponse } from "./types";
import { CFProductType, CurrencyCode } from "../../CommonTypes";

export const mockSetActiveProduct: SetActiveProduct = async (params?: SetActiveProductParams): Promise<SetActiveProductResponse> => {
    console.log("[Mock] setActiveProduct called", params);

    if (!params?.productId) {
        throw new Error("Product ID is required");
    }

    // Mock product response
    return {
        success: true,
        product: {
            _id: params.productId,
            taxTable: "",
            name: "Mock Product",
            categories: [],
            attributes: [],
            productType:CFProductType.SIMPLE,
            variants: [{
                _id: "mock_variant",
                sku: "mock_sku",
                price: 100,
                salePrice: 0,
                isOnSale: false,
                manageStock: false,
                attributes: [],
            }],
            currency: CurrencyCode.USD,
            minorUnits: 2,
        },
        timestamp: new Date().toISOString()
    }
}