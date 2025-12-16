import { CFCategory } from "../../CommonTypes";

// Get Categories Types
export interface GetCategoriesParams {
    /** MongoDB-like query object. */
    query?: {
        // MongoDB query fields
        name?: string | { $regex?: string; $options?: string };
        parentId?: string | null;
        externalId?: string;
        // Text search (searches across name)
        // This is handled by the handler, not directly in query
        [key: string]: any;
    };
}

export interface GetCategoriesResponse {
    categories: CFCategory[];
    timestamp: string;
}

export type GetCategories = (params?: GetCategoriesParams) => Promise<GetCategoriesResponse>;

