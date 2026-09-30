// Get Refund Plan Types
//
// READ-ONLY capacity query. Exposes the refund engine's OWN per-source and
// order-level math so flows can PRESENT accurate refund options without
// re-deriving the numbers client-side (the mutating commands —
// `processPartialRefund` / `redeemRefund` — re-validate at submit time).
//
// `allocation` closes the last gap: capacities alone still left a flow to work
// out WHICH tender gets WHAT, and a flow that split the goods value across the
// tenders shaved the sale's cash rounding off gift-card legs and was rejected
// at submit. The engine now returns the legs it would accept — render them,
// submit them unchanged, compute nothing.

export interface GetRefundPlanParams {
  /** Order to inspect; defaults to the active order. */
  orderId?: string;
  /**
   * The selection to allocate — the SAME array you will pass to
   * `processPartialRefund({ items })`, so the plan you render and the refund
   * you submit are computed from one input.
   *
   * A flow that owns its own refund UI holds the selection in its own state and
   * never stages it on the POS, so without this there is nothing for the engine
   * to allocate. Pass it here on every selection change to get the matching
   * {@link RefundPlanAllocation} back. **Purely a read** — unlike
   * `processPartialRefund`, this never stages the selection or touches POS
   * state, so it is safe to call as the cashier ticks rows.
   *
   * Omit it to fall back to the selection already staged on the POS (what
   * `selectAllRefundItems` sets) — the in-POS modal's path. Omitted with
   * nothing staged, no `allocation` comes back.
   */
  items?: {
    /** `internalId` / `variantId` for a product, `customSaleId`, cart-fee id, or tip `transactionId`. */
    itemKey: string;
    quantity: number;
    /** Optional hint; inferred from the order when omitted. */
    type?: 'product' | 'customSale' | 'fee' | 'tip';
  }[];
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

/**
 * One ready-to-submit refund leg. Pass these straight to
 * `processPartialRefund({ openUI: false, legs })` — the amounts are the
 * engine's own allocation and already satisfy its Σ-contract.
 */
export interface RefundPlanLeg {
  /** `transactionId` of the source payment this leg draws from — join key to `sources`. */
  transactionId: string;
  /** Amount to return to this source (minor units). Submit VERBATIM; do not re-derive. */
  amount: number;
  /** `cash` / `card` / `redeem` / etc., copied from the source. */
  paymentType: string;
  /**
   * True when the leg must carry a destination tender (a `redeem` source
   * cannot be refunded to itself — the money needs somewhere to land, credited
   * by the flow FIRST). The destination is usually a gift card but redeem is
   * the general rail: loyalty and store-credit extensions ride it too.
   */
  requiresDestination: boolean;
  /**
   * @deprecated Same value as {@link RefundPlanLeg.requiresDestination} — the
   * old name baked one extension (gift card) into a general redeem concept.
   * Kept populated for existing callers; prefer `requiresDestination`.
   */
  requiresGiftCardDestination: boolean;
  /**
   * Cash legs only: what the drawer actually pays after the company's
   * cash-rounding snap, and the signed delta from `amount`. Display it
   * ("drawer pays 6.50 (+0.01 rounding)") — never apply the snap yourself,
   * and never stage `payout.amount` as the leg (`amount` is the leg).
   */
  payout?: {
    amount: number;
    rounding: number;
  };
}

export type RefundPlanRowType = 'product' | 'customSale' | 'fee' | 'tip';

/** One tax rate's share of a row's refund (minor units). */
export interface RefundPlanTaxLine {
  name: string;
  /** Decimal rate as stored on the order (e.g. `0.15`), when the order recorded one. */
  percentage?: number;
  amount: number;
}

/**
 * The money a row refunds, split the way a receipt shows it. Every field is
 * minor units and already rounded; `subtotal − itemDiscount − cartDiscount +
 * tax === total` always holds. DISPLAY IT — never re-add or prorate it.
 */
export interface RefundPlanAmounts {
  /** Before discounts, tax excluded. For a tip row, the tip itself. */
  subtotal: number;
  /** Per-item discounts on the refunded quantity (positive). */
  itemDiscount: number;
  /** Cart discount share on the refunded quantity (positive). */
  cartDiscount: number;
  /** Tax on the refunded quantity. Zero for a tip. */
  tax: number;
  /** `tax` per rate — the price breakdown's tax lines. */
  taxes: RefundPlanTaxLine[];
  /** What the row refunds. */
  total: number;
}

/**
 * One refundable row of the order — a line item, custom sale, cart fee or tip —
 * served ready to render. Rows with nothing left to refund are not listed.
 */
export interface RefundPlanRow {
  type: RefundPlanRowType;
  /** The key `items[].itemKey` takes, for this call and for `processPartialRefund`. */
  itemKey: string;
  /** Line or fee name; `Tip` for a tip. */
  label: string;
  /** Product lines only, when the order recorded them. */
  sku?: string;
  attributes?: string;
  /** Tip rows only: the tender that took the tip (`card`, `cash`, …). */
  paymentType?: string;
  /** Quantity originally sold. Fees and tips are `1` — all or nothing. */
  quantity: number;
  /** Quantity still refundable — the stepper's max. */
  refundableQuantity: number;
  /** The money for refunding ALL of `refundableQuantity`. */
  amounts: RefundPlanAmounts;
}

/** One selected row and what refunding the selected quantity of it moves. */
export interface RefundPlanSelectedRow {
  type: RefundPlanRowType;
  itemKey: string;
  quantity: number;
  amounts: RefundPlanAmounts;
}

/**
 * The selection's goods value broken down for display. Minor units;
 * `items − discounts + fees + tax + tip === total === allocation.itemTotal`.
 */
export interface RefundPlanTotals {
  /** Σ selected line subtotals (before discounts, tax excluded). */
  items: number;
  /** Σ item + cart discounts on the selected lines (positive). */
  discounts: number;
  /** Σ selected cart fees, tax excluded. */
  fees: number;
  tax: number;
  tip: number;
  total: number;
}

export interface RefundPlanBreakdown {
  rows: RefundPlanSelectedRow[];
  totals: RefundPlanTotals;
}

/**
 * The engine's own allocation of the CURRENT refund selection across the
 * order's captures — what a flow renders and submits instead of computing a
 * split of its own.
 *
 * Present when the call carries a selection: either `params.items` (a flow
 * holding its own selection — the usual case) or a selection already staged on
 * the POS for the active order (`selectAllRefundItems`). Omitted for a bare
 * capacity read with neither.
 */
export interface RefundPlanAllocation {
  /**
   * What Σ `legs.amount` MUST equal — `min(itemTotal, Σ maxRefundable)`, which
   * on a FULL selection is the captured total, not the goods value. Staging the
   * goods value instead is rejected with `refund.legSumMismatch`.
   */
  budget: number;
  /** Goods value of the selection (minor units). DISPLAY ONLY — never allocate against it. */
  itemTotal: number;
  /**
   * `budget − itemTotal` — the sale's cash rounding, returned to the tender that
   * took it. Non-zero only on a cash-rounded capture; the engine stamps it as
   * refund residue at commit.
   */
  rounding: number;
  /** One leg per source that receives money. Submit as `legs`, unchanged. */
  legs: RefundPlanLeg[];
  /**
   * What the selection refunds, per row and in total — the numbers a refund
   * dialog's rows and footer render. Optional so an older runtime still
   * type-checks; kaching 1.12.1+ always sends it.
   */
  breakdown?: RefundPlanBreakdown;
}

export interface GetRefundPlanResponse {
  success: boolean;
  orderId: string;
  sources: RefundPlanSource[];
  /**
   * Every row still refundable on the order, with the money for refunding all
   * of it — what a refund dialog lists before anything is selected. Replaces
   * reading line totals off the order and deciding whether they include tax.
   * Optional so an older runtime still type-checks; kaching 1.12.1+ always
   * sends it.
   */
  rows?: RefundPlanRow[];
  /**
   * Ready-to-submit allocation of the current selection. Present only when a
   * refund selection exists on the active order. See {@link RefundPlanAllocation}.
   */
  allocation?: RefundPlanAllocation;
  /** Order-level remaining refundable (minor units) — non-revenue liability already excluded. */
  remainingRefundable: number;
  /** Non-refundable liability (gift-card loads etc., minor units). */
  nonRefundableLiability: number;
  totalCaptured: number;
  totalRefunded: number;
  timestamp: string;
}

export type GetRefundPlan = (params?: GetRefundPlanParams) => Promise<GetRefundPlanResponse>;
