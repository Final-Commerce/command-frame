import { CFProductVariant } from '../../CommonTypes';

export interface GetProductVariantsParams {
  productId: string;
  /** default false */
  includeDeleted?: boolean;
}

export interface GetProductVariantsResponse {
  success: boolean;
  variants: CFProductVariant[];
  timestamp: string;
}

export type GetProductVariants = (params: GetProductVariantsParams) => Promise<GetProductVariantsResponse>;
