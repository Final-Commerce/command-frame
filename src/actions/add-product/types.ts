import { CFProduct } from '../../CommonTypes';

// LOW-LEVEL: creates ONLY the product document (spec §3.1); nested
// variants/inventory are the P3 orchestrator's job — see createProductWithVariants.
export interface AddProductParams {
  name: string;
  description?: string;
  shortDescription?: string;
  /** Category ids (ObjectId strings). Default []. */
  categories?: string[];
  /** Tax table id. Only set when provided (§6.1). */
  taxTable?: string;
  /** Image URLs (uploaded separately — see uploadImage). Default []. */
  images?: string[];
  status?: 'active' | 'inactive' | 'draft';
  sku?: string;
  barcode?: string;
  tags?: string[];
  /** 'variable' when the caller will attach variants; defaults to 'simple'. */
  productType?: 'simple' | 'variable';
  /** Honor a caller-generated ObjectId (orchestrators pre-generate ids). */
  _id?: string;
}

export interface AddProductResponse {
  success: boolean;
  product: CFProduct;
  timestamp: string;
}

export type AddProduct = (params: AddProductParams) => Promise<AddProductResponse>;
