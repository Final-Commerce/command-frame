// Update Cart Item Quantity Types

export interface UpdateCartItemQuantityParams {
  /** The unique identifier for the specific cart item to update. */
  internalId: string;
  /**
   * The new quantity. If set to 0, the item will be removed from the cart.
   *
   * **May be fractional** for a variant sold by measure; the number of decimals allowed comes
   * from `variant.unit.precision`. The engine refuses anything finer and names the unit in the
   * error. Do not round or clamp before sending — a silently altered quantity is charged and
   * deducted differently than the one the cashier typed.
   */
  quantity: number;
}

export interface UpdateCartItemQuantityResponse {
  success: boolean;
  /** The unique identifier of the updated cart item. */
  internalId: string;
  /** The new quantity after the update. */
  quantity: number;
  timestamp: string;
}

export type UpdateCartItemQuantity = (params?: UpdateCartItemQuantityParams) => Promise<UpdateCartItemQuantityResponse>;
