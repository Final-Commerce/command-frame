import { CFProduct } from '../../CommonTypes';

export interface EditProductParams {
  productId: string;
  changes: {
    name?: string;
    description?: string;
    shortDescription?: string;
    categories?: string[];
    taxTable?: string | null;
    images?: string[];
    status?: 'active' | 'inactive' | 'draft';
    sku?: string;
    barcode?: string;
    tags?: string[];
  };
}

export interface EditProductResponse {
  success: boolean;
  product: CFProduct;
  timestamp: string;
}

export type EditProduct = (params: EditProductParams) => Promise<EditProductResponse>;
