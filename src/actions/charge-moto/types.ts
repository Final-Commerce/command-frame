import { CFOrder } from '../../CommonTypes';

// Charge Moto Types
//
// Keyed (card-not-present) MOTO charge for the CURRENT CART. Mirrors kaching's
// `chargeMoto` input (`ChargeMotoInput`) and result (`ChargeMotoResult`).
// Adyen-only today; the caller rings the sale up first (e.g. `addCustomSale`
// for an amount-only charge) exactly as `cashPayment` expects. All money is
// integer MINOR currency units.

/**
 * Provider-encrypted card fields, opaque to this library — mirrors kaching's
 * `MotoCardFields` field for field. Never a raw PAN: these are the CSE blobs
 * the provider's own client-side encrypter produces.
 */
export interface ChargeMotoCardFields {
  encryptedCardNumber: string;
  encryptedExpiryMonth: string;
  encryptedExpiryYear: string;
  encryptedSecurityCode: string;
  /** Optional AVS postal code the operator entered. */
  postalCode?: string;
  /** Provider-side `reference` for this payment. Defaults to the idempotency key server-side. */
  reference?: string;
}

export interface ChargeMotoParams {
  /**
   * Total to charge, base + tip, in integer MINOR currency units. Minimum 50
   * minor units (the processors' floor). This is the leg amount: a value
   * below the cart's balance due records a partial payment.
   */
  amount: number;
  /** Tip portion of `amount`, already collected by the caller's own UI. Defaults to 0. */
  tipAmount?: number;
  /**
   * ISO 4217 code. Optional — the active company's currency is authoritative.
   * When supplied it must match, or the charge is rejected before anything is sent.
   */
  currency?: string;
  card: ChargeMotoCardFields;
  /**
   * Idempotency key for this charge, HELD BY THE CALLER across retries. A
   * retried charge must carry the SAME key so the charge is replayed instead
   * of doubled; use a NEW key after changing the amount.
   */
  idempotencyKey: string;
  /** Optional tender label recorded on the payment method. */
  paymentName?: string;
  /** Fulfillment state to land on after full payment (default: auto-fulfill). */
  targetFulfillmentState?: string;
}

export interface ChargeMotoResponse {
  success: boolean;
  timestamp: string;
  /** The persisted order the charge landed on. */
  order: CFOrder;
  /** True only when this charge completed the sale (`paymentState === 'paid'`). */
  saleFinalized: boolean;
  /** Balance still due after this charge, in integer minor units. 0 when finalized. */
  remainingBalance: number;
}

export type ChargeMoto = (params: ChargeMotoParams) => Promise<ChargeMotoResponse>;
