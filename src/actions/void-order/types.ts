// Void Order Types
export type VoidOrderOutcome = 'voided' | 'refunded';

export interface VoidOrderParams {
  /**
   * Order to void. Omit for the live cart's order (resumed, or part-paid). A finished
   * sale kept for receipts after payment is not the cart's order — pass its id.
   */
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
   * `refunded` — captured payments (a deposit / split legs, or the whole
   *              payment of a paid order never fulfilled) were refunded to their original tenders;
   *              order lands refunded × cancelled (financially equivalent to a
   *              void, but the capture + payout stay on the audit trail).
   */
  outcome: VoidOrderOutcome;
  timestamp: string;
}

export type VoidOrder = (params?: VoidOrderParams) => Promise<VoidOrderResponse>;
