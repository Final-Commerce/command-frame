// Add Custom Sale Types
export interface AddCustomSaleParams {
  label: string;
  /** Price in integer MINOR currency units (e.g. 1575 = $15.75). */
  price: number | string;
  /** Defaults to 1. Must be a positive integer. */
  quantity?: number;
  applyTaxes?: boolean;
  taxTableId?: string;
}

export interface AddCustomSaleResponse {
  success: boolean;
  customSaleId: string;
  label: string;
  price: number;
  quantity: number;
  applyTaxes: boolean;
  timestamp: string;
}

export type AddCustomSale = (params?: AddCustomSaleParams) => Promise<AddCustomSaleResponse>;
