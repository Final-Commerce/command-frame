// get-inventory — rows for a product (optionally narrowed by variant/outlet)
export interface GetInventoryParams {
  productId: string;
  variantId?: string;
  outletId?: string;
}

export interface CFInventoryRow {
  productId: string;
  variantId: string;
  outletId: string;
  quantity: number;
  manageStock: boolean;
  isDeleted?: boolean;
}

export interface GetInventoryResponse {
  success: boolean;
  rows: CFInventoryRow[];
  timestamp: string;
}

export type GetInventory = (params: GetInventoryParams) => Promise<GetInventoryResponse>;
