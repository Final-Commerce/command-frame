import type { SetActiveProduct, SetActiveProductParams, SetActiveProductResponse } from "./types";

export const mockSetActiveProduct: SetActiveProduct = async (params?: SetActiveProductParams): Promise<SetActiveProductResponse> => {
    console.log("[Mock] setActiveProduct called", params);

    if (!params?.variantId) {
        throw new Error("Variant ID is required");
    }

    // Mock product response
    return {
        success: true,
        product:{
            id: "mock_product",
            internalId: "mock_internal_id",
            externalId: "mock_external_id",
            productExternalId: "mock_product_external_id",
            variantId: params.variantId,
            name: "Mock Product",
            sku: "mock_sku",
            price: 100,
            images: [],
            taxTableId: "mock_tax_table_id",
            quantity: 1,
            note: "Mock Note",
            discount: undefined,
            description: "Mock Description",
            barcodeId: "mock_barcode_id",
            stock: 100,
            allowBackOrder: false,
            fee: undefined,
            isUnlimited: false,
            attributes: "Mock Attributes",
            localQuantity: 1,
        },
        
        timestamp: new Date().toISOString()
    }
}