// Edit Custom Sale Types
export interface EditCustomSaleParams {
  /** The id returned by addCustomSale (`customSaleId`). */
  customSaleId: string;
  label?: string;
  /** Price in integer MINOR currency units (e.g. 1575 = $15.75). */
  price?: number | string;
  /** Must be a positive integer. */
  quantity?: number;
  applyTaxes?: boolean;
  taxTableId?: string;
}

export interface EditCustomSaleResponse {
  success: boolean;
  customSaleId: string;
  label: string;
  price: number;
  quantity: number;
  applyTaxes: boolean;
  timestamp: string;
}

export type EditCustomSale = (params?: EditCustomSaleParams) => Promise<EditCustomSaleResponse>;
