// Void Order Types
export type VoidOrderOutcome = 'voided' | 'refunded';

export interface VoidOrderParams {
  /** Order to void; defaults to the active order. */
  orderId?: string;
  /**
   * Optional cashier-facing reason. Recorded on both branches — the void audit
   * trail on a pure void, and (verbatim) on the persisted refund plus its own
   * audit trail on the refund branch — and always carried on the
   * `order-voided` event either way.
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
