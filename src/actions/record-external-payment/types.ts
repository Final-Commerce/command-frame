import { CFOrder } from '../../CommonTypes';

/** A tip the customer already paid wherever the money was taken (the website, a delivery app). */
export interface RecordExternalPaymentTip {
  /** Tip in integer MINOR currency units. Must be positive. */
  amount: number;
  /** User id the tip belongs to. Defaults to the cashier recording the payment. */
  tipTo?: string;
}

export interface RecordExternalPaymentParams {
  /**
   * What the payment was — shown on the order and in reports, e.g. 'Paid online',
   * 'Uber Eats', 'Voucher'. Required; trimmed. Not checked against a list, so keep
   * labels consistent across flows.
   */
  label: string;
  /**
   * Amount to record, in integer MINOR currency units. Omit to record the full balance
   * due (completing the order). Below the balance due it records a partial payment —
   * the rest can be taken with any other tender. Above the balance due is an error.
   */
  amount?: number;
  /**
   * Tip paid along with it. Recorded ON TOP of `amount` — it never counts toward the
   * balance due — and stored on the payment like a card tip, so reports and tip-outs
   * see it. Omit for no tip.
   */
  tip?: RecordExternalPaymentTip;
  /** Fulfillment state to land on after full payment, e.g. 'pending' to keep the order going to the kitchen. */
  checkoutFulfillmentTarget?: string;
}

export interface RecordExternalPaymentResponse {
  success: boolean;
  /** The amount recorded against the balance, in integer MINOR currency units. Excludes the tip. */
  amount: number;
  /** The tip recorded on top of `amount`, in integer MINOR currency units; 0 when none. */
  tip: number;
  /** The label, as recorded. */
  label: string;
  paymentType: 'external';
  /** Always 0 — no money changes hands at the terminal. */
  change: number;
  /** Always 0 — cash rounding applies to cash only. */
  cashRounding: number;
  /** The order once the sale completes; null for a partial (split) leg. */
  order: CFOrder | null;
  /** True when this payment settled the remaining balance. */
  saleFinalized: boolean;
  /** Balance still due after this payment, in integer MINOR currency units. */
  remainingBalance: number;
  timestamp: string;
}

export type RecordExternalPayment = (params: RecordExternalPaymentParams) => Promise<RecordExternalPaymentResponse>;
