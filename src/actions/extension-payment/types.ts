import { CFOrder } from '../../CommonTypes';

/** Params for extension-initiated payments; host routes by `paymentType`. */
export interface ExtensionPaymentParams {
  paymentType: string;
  processor?: string;
  /**
   * The amount to pay with this tender, in integer MINOR currency units
   * (e.g. 1575 = $15.75). Required. Semantics against the cart's balance
   * due: missing → error; less than balance → partial payment (fixed
   * split-payment leg); equal → full payment; more → error.
   */
  amount: number;
  label?: string;
  referenceId?: string;
  extensionId?: string;
  metadata?: Record<string, unknown>;
  /** Override the fulfillment state the order lands in on full payment (validated against the fulfillment state machine; invalid values throw). Omitted: preserve advanced fulfillment, auto-fulfill from draft/pending/on_hold. */
  checkoutFulfillmentTarget?: string;
  /** EMV data when the underlying payment carries one (typed as `IntegrationEmvData` by the integration wrapper). */
  emvData?: unknown;
  /** Processor fee in integer MINOR currency units; recorded on the order's paymentMethod.processorFee. */
  processorFee?: number;
}

export interface ExtensionPaymentResponse {
  success: boolean;
  amount: number | null;
  paymentType: string;
  order: CFOrder | null;
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

export type ExtensionPayment = (params?: ExtensionPaymentParams) => Promise<ExtensionPaymentResponse>;
