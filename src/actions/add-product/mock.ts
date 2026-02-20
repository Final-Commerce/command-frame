import { CFProductType } from "../../CommonTypes";
import { AddProduct, AddProductParams, AddProductResponse } from "./types";

export const mockAddProduct: AddProduct = async (params: AddProductParams): Promise<AddProductResponse> => {
    console.log("[Mock] addProduct called", params);
    const hasVariants = params.variants && params.variants.length > 0;
    return {
        product: {
            _id: "mock_product_" + Date.now(),
            name: params.name,
            description: params.description,
            categories: params.categories || [],
            taxTable: params.taxTable || "",
            images: params.images || [],
            status: params.status || "active",
            sku: params.sku,
            productType: hasVariants ? CFProductType.VARIABLE : CFProductType.SIMPLE,
            attributes: [],
            minPrice: params.price || "0",
            maxPrice: params.price || "0",
            variants: hasVariants
                ? params.variants!.map((v, i) => ({ ...v, _id: `mock_variant_${Date.now()}_${i}` }))
                : [{
                    _id: `mock_variant_${Date.now()}_0`,
                    sku: params.sku || "",
                    price: params.price || "0",
                    salePrice: "0",
                    isOnSale: false,
                    manageStock: params.manageStock || false,
                    attributes: [],
                }],
        },
        timestamp: new Date().toISOString(),
    };
};
