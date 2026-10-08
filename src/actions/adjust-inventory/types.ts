// Adjust Inventory Types

/** The manual reasons a person can pick, as hub-api's InventorySpecificActionType names them. */
export type ManualStockReason = 'STOCK_RECEIVED' | 'RESTOCK_RETURN' | 'DAMAGE' | 'THEFT' | 'LOSS' | 'INVENTORY_RECOUNT';

export interface AdjustInventoryParams {
  /** String to preserve precision. */
  amount: string;
  /** 'add' (increase), 'subtract' (decrease), or 'set' (recount). */
  stockType: 'add' | 'subtract' | 'set';
  /** Variant to adjust. Omit to use the active product's selected variant. */
  variantId?: string;
  /**
   * A company action from getCustomStockActions. The movement is recorded under its name;
   * `stockType` must match its baseAction (ADD → 'add', REMOVE → 'subtract', RECOUNT → 'set').
   */
  customActionId?: string;
  /**
   * A built-in reason to record instead of the host's default for `stockType`. Must match it:
   * STOCK_RECEIVED / RESTOCK_RETURN → 'add', DAMAGE / THEFT / LOSS → 'subtract', INVENTORY_RECOUNT → 'set'.
   * Rejected together with `customActionId`.
   */
  specificAction?: ManualStockReason;
}

export interface AdjustInventoryResponse {
  success: boolean;
  amount: string;
  stockType: 'add' | 'subtract' | 'set';
  newStock: number;
  timestamp: string;
}

export type AdjustInventory = (params?: AdjustInventoryParams) => Promise<AdjustInventoryResponse>;
