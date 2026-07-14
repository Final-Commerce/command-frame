import { GetProducts, GetProductsParams, GetProductsResponse } from "./types";
import { MOCK_PRODUCTS, safeSerialize } from "../../demo/database";
import { matchesMongoQuery } from "../../demo/mongo-query";

export const mockGetProducts: GetProducts = (params?: GetProductsParams): Promise<GetProductsResponse> => {
    console.log("[Mock] getProducts called", params);

    let products = MOCK_PRODUCTS;
    const query = params?.query || {};

    // Legacy mock-only convenience key.
    if (query.searchValue) {
        const search = String(query.searchValue).toLowerCase();
        products = products.filter(p => p.name.toLowerCase().includes(search) || p.sku?.toLowerCase().includes(search));
    }

    // Contract-style Mongo queries — the real host resolves these against
    // MongoDB, so the mock honors the same shape ($or/$and, $regex, $in,
    // equality; array fields like `categories` match by inclusion).
    products = products.filter(p => matchesMongoQuery(p, query));

    const total = products.length;
    const offset = params?.offset ?? 0;
    const limit = params?.limit ?? 100;
    const paged = products.slice(offset, offset + limit);

    return Promise.resolve({
        products: safeSerialize(paged),
        total,
        timestamp: new Date().toISOString()
    });
};
