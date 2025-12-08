// Get Categories Types
export interface GetCategoriesParams {
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
    categories: any[];
    timestamp: string;
}

export type GetCategories = (params?: GetCategoriesParams) => Promise<GetCategoriesResponse>;

