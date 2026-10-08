import { CFOrder } from '../../CommonTypes';

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
  /** Fulfillment state to land on after full payment, e.g. 'pending' to keep the order going to the kitchen. */
  checkoutFulfillmentTarget?: string;
}

export interface RecordExternalPaymentResponse {
  success: boolean;
  /** The amount recorded, in integer MINOR currency units. */
  amount: number;
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
