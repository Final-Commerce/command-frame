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
  /** True when the leg must carry a `giftCard` destination (a `redeem` source). */
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
}

export interface GetRefundPlanResponse {
  success: boolean;
  orderId: string;
  sources: RefundPlanSource[];
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
