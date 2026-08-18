// Void Order Types
export type VoidOrderOutcome = 'voided' | 'refunded';

export interface VoidOrderParams {
  /** Order to void; defaults to the active order. */
  orderId?: string;
  /**
   * Optional cashier-facing reason. On a pure void, recorded on the void audit
   * row and carried on the `order-voided` event. On the refund branch it rides
   * the event only — the refund dispatcher does not consume it.
   */
  reason?: string;
}

export interface VoidOrderResponse {
  success: boolean;
  orderId: string;
  /**
   * `voided`   — nothing was captured; pure state transition to voided × cancelled.
   * `refunded` — captured split legs were refunded to their original tenders;
   *              order lands refunded × cancelled (financially equivalent to a
   *              void, but the capture + payout stay on the audit trail).
   */
  outcome: VoidOrderOutcome;
  timestamp: string;
}

export type VoidOrder = (params?: VoidOrderParams) => Promise<VoidOrderResponse>;
