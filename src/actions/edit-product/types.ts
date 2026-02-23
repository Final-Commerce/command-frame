import { CFProduct } from "../../CommonTypes";

export interface EditProductParams {
    productId: string;
    changes: {
        name?: string;
        description?: string;
        categories?: string[];
        taxTable?: string | null;
        images?: string[];
        status?: 'active' | 'inactive';
    };
}

export interface EditProductResponse {
    product: CFProduct;
    timestamp: string;
}

export type EditProduct = (params: EditProductParams) => Promise<EditProductResponse>;
