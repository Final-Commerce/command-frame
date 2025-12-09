import { CFProduct } from "../../CommonTypes";

// Get Products Types
export interface GetProductsParams {
    query?: {
        // MongoDB query fields
        name?: string | { $regex?: string; $options?: string };
        sku?: string | { $regex?: string; $options?: string };
        status?: string;
        productType?: string;
        categories?: string | { $in?: string[] };
        tags?: string | { $in?: string[] };
        supplier?: string;
        externalId?: string;
        // Text search (searches across name, sku)
        // This is handled by the handler, not directly in query
        [key: string]: any;
    };
}

export interface GetProductsResponse {
    products: CFProduct[];
    timestamp: string;
}

export type GetProducts = (params?: GetProductsParams) => Promise<GetProductsResponse>;
