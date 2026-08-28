// Initiate Refund Types
//
// DEPRECATED: the host no longer renders a refund popup (disabled in kaching
// 1.9.5-preprod.4). Build refund UI in the flow with the headless surface:
// getRefundPlan / getRemainingRefundableQuantities / processPartialRefund /
// redeemRefund. Calling this still stages the active order and (with no
// orderId) still arms barcode refund-scan routing — but no UI opens.
export interface InitiateRefundParams {
  /** The ID of the order to refund. If not provided, uses the currently active order. */
  orderId?: string;
}

export interface InitiateRefundResponse {
  success: boolean;
  orderId: string;
  timestamp: string;
}

/**
 * @deprecated The host-side refund popup is disabled — no UI opens. Stages the
 * active order (and arms barcode refund-scan routing when no `orderId` is
 * given). Build refund UI in the flow: `getRefundPlan`,
 * `getRemainingRefundableQuantities`, `processPartialRefund`, `redeemRefund`.
 */
export type InitiateRefund = (params?: InitiateRefundParams) => Promise<InitiateRefundResponse>;
