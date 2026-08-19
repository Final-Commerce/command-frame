// get-stock-history — the stock-changes audit trail (spec §6.5), newest first
export interface GetStockHistoryParams {
  productId: string;
  variantId?: string;
  outletIds?: string[];
  actions?: string[];
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface CFStockChange {
  _id: string;
  productId: string;
  variantId: string;
  outletId: string;
  userId?: string;
  baseAction: 'ADD' | 'REMOVE' | 'RECOUNT' | 'SKIP';
  specificAction: string;
  quantity: number;
  updatedQuantity: number;
  createdAt?: string;
}

export interface GetStockHistoryResponse {
  success: boolean;
  entries: CFStockChange[];
  total: number;
  timestamp: string;
}

export type GetStockHistory = (params: GetStockHistoryParams) => Promise<GetStockHistoryResponse>;
