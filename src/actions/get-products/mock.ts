import { GetProducts, GetProductsParams, GetProductsResponse } from "./types";
import { MOCK_PRODUCTS, safeSerialize } from "../../demo/database";

export const mockGetProducts: GetProducts = async (params?: GetProductsParams): Promise<GetProductsResponse> => {
    console.log("[Mock] getProducts called", params);
    
    // Simple filter simulation
    let products = MOCK_PRODUCTS;
    const query = params?.query || {};

    if (query.searchValue) {
        const search = String(query.searchValue).toLowerCase();
        products = products.filter(p => 
            p.name.toLowerCase().includes(search) || 
            p.sku?.toLowerCase().includes(search)
        );
    }

    if (query.categories) {
        // Handle categories filter: { $in: [...] } or direct string
        const catFilter = query.categories;
        if (typeof catFilter === 'string') {
            products = products.filter(p => p.categories?.externalId === catFilter);
        } else if (typeof catFilter === 'object' && '$in' in catFilter) {
            const inList = (catFilter as any).$in as string[];
            products = products.filter(p => inList.includes(p.categories?.externalId));
        } else if (typeof catFilter === 'object' && '$contains' in catFilter) {
             const containsVal = (catFilter as any).$contains as string;
             products = products.filter(p => p.categories?.externalId === containsVal);
        }
    }

    return {
        products: safeSerialize(products),
        timestamp: new Date().toISOString()
    };
};

