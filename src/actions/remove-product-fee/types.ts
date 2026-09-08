// Remove Product Fee Types
export interface RemoveProductFeeParams {
  /** If provided, removes fee(s) from a specific cart item. Otherwise uses active product. */
  internalId?: string;
  /**
   * 0-based index of the single fee to remove, in the order the line's fees
   * were added (fees STACK — `addProductFee` appends). Omit to clear ALL
   * fees on the line (the legacy behavior). Out-of-range indexes are a
   * no-op.
   */
  index?: number;
}

export interface RemoveProductFeeResponse {
  success: boolean;
  internalId?: string;
  /** Echoed when a single fee was targeted. */
  index?: number;
  timestamp: string;
}

export type RemoveProductFee = (params?: RemoveProductFeeParams) => Promise<RemoveProductFeeResponse>;
