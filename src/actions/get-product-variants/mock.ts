import { GetProductVariants, GetProductVariantsParams, GetProductVariantsResponse } from "./types";
import { MOCK_PRODUCTS, safeSerialize } from "../../demo/database";

export const mockGetProductVariants: GetProductVariants = async (params?: GetProductVariantsParams): Promise<GetProductVariantsResponse> => {
    console.log("[Mock] getProductVariants called", params);
    
    if (!params?.productId) {
        throw new Error("productId is required");
    }

    const product = MOCK_PRODUCTS.find(p => p._id === params.productId);
    const variants = product ? product.variants : [];

    return {
        variants: safeSerialize(variants),
        productId: params.productId,
        timestamp: new Date().toISOString()
    };
};

