import { CFProductType, CurrencyCode } from "../../CommonTypes";
import { EditProduct, EditProductParams, EditProductResponse } from "./types";

// eslint-disable-next-line @typescript-eslint/require-await
export const mockEditProduct: EditProduct = async (params: EditProductParams): Promise<EditProductResponse> => {
    console.log("[Mock] editProduct called", params);
    return {
        product: {
            _id: params.productId,
            externalId: `ext_${params.productId}`,
            currency: CurrencyCode.USD,
            minorUnits: 2,
            name: params.changes.name || "Updated Product",
            description: params.changes.description,
            categories: params.changes.categories || [],
            taxTable: params.changes.taxTable || "",
            images: params.changes.images || [],
            status: params.changes.status || "active",
            productType: CFProductType.SIMPLE,
            attributes: [],
            variants: []
        },
        timestamp: new Date().toISOString()
    };
};
