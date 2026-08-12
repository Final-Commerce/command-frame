// Get Refund Plan Types
//
// READ-ONLY capacity query. Exposes the refund engine's OWN per-source and
// order-level math so flows can PRESENT accurate refund options without
// re-deriving the numbers client-side (the mutating commands —
// `processPartialRefund` / `redeemRefund` — re-validate at submit time).

export interface GetRefundPlanParams {
  /** Order to inspect; defaults to the active order. */
  orderId?: string;
}

export interface RefundPlanSource {
  transactionId: string;
  paymentType: string;
  processor?: string;
  /** Captured on this payment (minor units). */
  capturedAmount: number;
  /** Already refunded against this source (minor units). */
  refundedAmount: number;
  /** Remaining refundable on this source (minor units) — the engine's own per-source cap. */
  maxRefundable: number;
  /** False for sources the engine cannot refund to directly (redeem without a gift-card destination). */
  refundableToSource: boolean;
  /** For redeem sources: the card number from the payment entry's emv, when present. */
  cardNumber?: string;
}

export interface GetRefundPlanResponse {
  success: boolean;
  orderId: string;
  sources: RefundPlanSource[];
  /** Order-level remaining refundable (minor units) — non-revenue liability already excluded. */
  remainingRefundable: number;
  /** Non-refundable liability (gift-card loads etc., minor units). */
  nonRefundableLiability: number;
  totalCaptured: number;
  totalRefunded: number;
  timestamp: string;
}

export type GetRefundPlan = (params?: GetRefundPlanParams) => Promise<GetRefundPlanResponse>;
