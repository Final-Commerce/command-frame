import { CFProduct, CFProductVariant } from "../../CommonTypes";

export interface AddProductParams {
    name: string;
    description?: string;
    categories?: string[];
    taxTable?: string;
    images?: string[];
    status?: 'active' | 'inactive';
    /** For simple products: set price directly */
    price?: number;
    sku?: string;
    costPrice?: number;
    manageStock?: boolean;
    /** For variable products: provide variants array */
    variants?: Omit<CFProductVariant, '_id'>[];
}

export interface AddProductResponse {
    product: CFProduct;
    timestamp: string;
}

export type AddProduct = (params: AddProductParams) => Promise<AddProductResponse>;
