// adjustStock — audited two-write movement (spec §3.3.3 / §6.5): the inventory
// row and an append-only stock-changes doc are written together or not at all.

/** Client-facing stock-movement reasons (spec §6.5). History rows may additionally carry server-only values (e.g. APPLIED_FROM_WOO), so CFStockChange.specificAction stays a plain string. */
export type CFStockSpecificAction =
  | 'STOCK_RECEIVED'
  | 'INVENTORY_RECOUNT'
  | 'DAMAGE'
  | 'THEFT'
  | 'LOSS'
  | 'RESTOCK_RETURN'
  | 'REFUND_RESTOCK_RETURN'
  | 'REFUND_DAMAGE'
  | 'SALE'
  | 'TRANSFER'
  | 'BULK_RECOUNT';

export interface AdjustStockParams {
  productId: string;
  variantId: string;
  outletId: string;
  specificAction: CFStockSpecificAction;
  /** Derived from specificAction when omitted; a mismatched explicit value throws. */
  baseAction?: 'ADD' | 'REMOVE' | 'RECOUNT' | 'SKIP';
  /** Signed for ADD/REMOVE (REMOVE negative), absolute for RECOUNT. Integer. */
  quantity: number;
  userId?: string;
}

export interface AdjustStockResponse {
  success: boolean;
  updatedQuantity: number;
  stockChangeId: string;
  timestamp: string;
}

export type AdjustStock = (params: AdjustStockParams) => Promise<AdjustStockResponse>;
