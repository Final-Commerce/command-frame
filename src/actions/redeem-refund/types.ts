// Redeem Refund Types

export interface RedeemRefundParams {
  /** Order to refund; defaults to the active order. */
  orderId?: string;
  /**
   * Amount to refund onto the redeem tender, integer MINOR currency units
   * (1575 = $15.75). Required; must be > 0 and within the order's remaining
   * refundable capacity (tip-inclusive, across all source payments).
   */
  amount: number;
  /**
   * Destination card/account identifier the funds were credited to
   * (e.g. the gift-card number). Recorded on every refund leg's paymentData
   * for the audit trail. Required.
   */
  referenceId: string;
  /** Destination provider label; defaults to "giftCard" (matches redeemPayment). */
  processor?: string;
  /** Human-readable label for receipts/reporting. */
  label?: string;
  /** Extension identity, recorded on the legs when provided. */
  extensionId?: string;
  /** Opaque extension payload, recorded on the legs when provided. */
  metadata?: Record<string, unknown>;
  /** Cashier-facing reason, recorded on the refund + state-event audit rows. */
  reason?: string;
}

export interface RedeemRefundResponse {
  success: boolean;
  orderId: string;
  /** Total refunded onto the redeem tender (minor units). */
  amount: number;
  /** Echo of the destination identifier the legs were recorded against. */
  referenceId: string;
  /** Number of source payments the amount was drawn from. */
  legCount: number;
  timestamp: string;
}

export type RedeemRefund = (params: RedeemRefundParams) => Promise<RedeemRefundResponse>;
