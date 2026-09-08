import { CFOrder } from '../../CommonTypes';

// Terminal Payment Types
export interface TerminalPaymentParams {
  /**
   * The amount to pay with this tender, in integer MINOR currency units
   * (e.g. 1575 = $15.75). Required. Semantics against the cart's balance due:
   *   - missing            → error
   *   - less than balance  → partial payment (the POS enters a fixed
   *                          split-payment leg for this amount)
   *   - equal to balance   → full payment
   *   - more than balance  → error
   */
  amount: number;
  /** "Bluetooth" or "Cloud". Only "Cloud" routes to the cloud processor; omitted or "Bluetooth" uses the native card reader. */
  paymentType?: 'Bluetooth' | 'Cloud';
  /** Override the fulfillment state the order lands in on full payment (validated against the fulfillment state machine; invalid values throw). Omitted: preserve advanced fulfillment, auto-fulfill from draft/pending/on_hold. */
  checkoutFulfillmentTarget?: string;
}

export interface TerminalPaymentResponse {
  success: boolean;
  amount: number | null;
  paymentType: string;
  order: CFOrder | null; // ActiveOrder | null
  timestamp: string;
  /** Change due back to the customer in integer MINOR currency units (0 for non-cash tenders). */
  change: number;
  /** Signed cash-rounding delta applied to the charge, in integer MINOR currency units (positive = rounded up); 0 when the company has no cash-rounding setting. */
  cashRounding: number;
  /** True when this tender settled the cart's remaining balance (the sale completed). */
  saleFinalized: boolean;
  /** Balance still due after this tender, in integer MINOR currency units (0 once the sale is finalized). */
  remainingBalance: number;
}

export type TerminalPayment = (params?: TerminalPaymentParams) => Promise<TerminalPaymentResponse>;
