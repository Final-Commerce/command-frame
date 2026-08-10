import type { CFTransitionResult } from '../../common-types/order-state';

// Void Order Types
export type VoidOrderOutcome = 'voided' | 'refunded';

export interface VoidOrderParams {
  /** Order to void; defaults to the active order. */
  orderId?: string;
  /** Optional cashier-facing reason, stamped on the audit trail. */
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
  /** Present when the state machine blocked or forced the transition. */
  transitionResult?: CFTransitionResult;
}

export type VoidOrder = (params?: VoidOrderParams) => Promise<VoidOrderResponse>;
