export interface SetOrderTypeParams {
  /**
   * Order to label. Omit to target the live cart — including a cart that isn't an
   * order yet; the type is carried onto the order when it's created.
   */
  orderId?: string;
  /** Any non-empty label (e.g. 'takeout', 'pickup', 'delivery'), or null to clear it. */
  orderType: string | null;
}

export interface SetOrderTypeResponse {
  success: boolean;
  /** The order that was updated, or null when the live cart has no order yet. */
  orderId: string | null;
  orderType: string | null;
  timestamp: string;
}

export type SetOrderType = (params: SetOrderTypeParams) => Promise<SetOrderTypeResponse>;
