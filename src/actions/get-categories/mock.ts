import { GetCategories, GetCategoriesParams, GetCategoriesResponse } from "./types";
import { MOCK_CATEGORIES, safeSerialize } from "../../demo/database";

export const mockGetCategories: GetCategories = async (params?: GetCategoriesParams): Promise<GetCategoriesResponse> => {
    console.log("[Mock] getCategories called", params);
    
    // Simple filter simulation
    let categories = MOCK_CATEGORIES;
    const query = params?.query || {};

    if (query.name) {
        const nameFilter = typeof query.name === 'string' ? query.name : '';
        if (nameFilter) {
            categories = categories.filter(c => c.name.toLowerCase().includes(nameFilter.toLowerCase()));
        }
    }

    if (query.parentId !== undefined) {
        categories = categories.filter(c => c.parentId === query.parentId);
    }

    return {
        categories: safeSerialize(categories),
        timestamp: new Date().toISOString()
    };
};

