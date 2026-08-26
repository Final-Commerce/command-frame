// Process Partial Refund Types
export interface ProcessPartialRefundParams {
  /**
   * Optional refund reason.
   *
   * Recorded verbatim on the persisted `Refund` doc's `reason` field and on
   * the state-event audit row — same as `redeemRefund`. When omitted, the
   * refund doc's `reason` stays unset and only the audit row carries the
   * 'partial-refund' fallback label. See the README's "`reason` persistence"
   * section.
   */
  reason?: string;
  /** Optional: specify which order to refund (sets it as active). */
  orderId?: string;
  /**
   * Controls the refund UI for a MULTI-TENDER order (one paid across more
   * than one payment method). Defaults to `true`.
   *
   * - `true` (default, back-compat): the POS raises its split-payment refund
   *   modal so the cashier allocates the refund across the original payment
   *   sources; `processPartialRefund` returns without committing and the
   *   modal drives the commit.
   * - `false`: no modal is raised — the refund is committed headlessly
   *   against the planner's default proportional allocation across those
   *   sources (all cash-rounding invariants preserved). Use this when your
   *   flow renders its own refund UI and needs a fully headless multi-tender
   *   partial refund.
   *
   * Has no effect on single-tender orders (already headless — there is
   * nothing to allocate).
   */
  openUI?: boolean;
  /**
   * Explicit per-tender allocation for the refund — the headless replacement
   * for choosing, in the split-payment refund modal, WHICH original payment
   * each refunded dollar returns to. Each entry names an original payment by
   * its `transactionId` and the amount, **in minor units** (cents), to return
   * to that source.
   *
   * Requires `openUI: false` — with the modal path (`openUI` omitted/`true`)
   * the modal owns allocation and `legs` are ignored. Validation:
   * - Σ of all `amount`s **must equal the allocatable refund budget** —
   *   `min(the refund total computed from the selected items, Σ of each
   *   source's remaining refundable capacity)`; on a full selection this is
   *   the captured total and the cash-rounding gap is auto-stamped (a
   *   mismatch throws; nothing is committed);
   * - the amounts **aggregated per source** must be ≤ that source's remaining
   *   refundable capacity (over-cap throws, naming the source);
   * - a **zero** `amount` entry is IGNORED — dropped like an omitted row,
   *   matching the modal (which let a cashier leave a tender at 0 and filtered
   *   it at commit) — while a **negative** `amount` is rejected;
   * - an unknown `transactionId` throws, naming it.
   *
   * MIXED RETURNS — set `giftCard` on a leg to land that leg's amount on a
   * gift-card / store-credit tender instead of returning it to the source. A
   * single `legs` array may freely mix source-return legs and `giftCard` legs
   * (some money back to the original tenders, the rest onto a card). An
   * all-`giftCard` staging is the `redeemRefund` equivalent through this path.
   * **Credit-first:** the flow must credit the card for the sum of all
   * `giftCard` legs BEFORE calling; on any throw nothing was recorded — reverse
   * the credit.
   *
   * Omit `legs` to keep the default proportional allocation across sources.
   * See "Choosing which payments to refund to" and "Mixed returns" in the README.
   */
  legs?: {
    /** `transactionId` of the original payment this leg draws from. */
    transactionId: string;
    /** Amount for this leg, in minor units (cents). `0` is ignored (dropped
     *  like an omitted row); a negative value is rejected. */
    amount: number;
    /**
     * When set, this leg's amount lands on the gift-card / store-credit
     * ("redeem") tender instead of returning to the source. The leg still
     * draws from `transactionId` for capacity/audit — only the landing
     * tender changes.
     *
     * CREDIT-FIRST: the flow must have already credited the card for the sum
     * of all `giftCard` legs before calling; on any throw nothing was
     * recorded and the caller must reverse that credit. `referenceId` is
     * required when `giftCard` is present.
     */
    giftCard?: {
      /** Card/account id the flow already credited (stored raw). */
      referenceId: string;
      /** Provider/program name. Defaults to `giftCard`. */
      processor?: string;
      /** Human label for the destination tender. */
      label?: string;
    };
  }[];
  /**
   * Route part (or all) of the refund onto ONE gift-card / store-credit tender
   * and let the engine send whatever is left back to the original payments.
   *
   * This is the declarative alternative to hand-building `legs`: state the card
   * and how much lands on it, and the engine does the allocation — it already
   * owns that math for every other refund path. Prefer it over `legs` for a
   * gift-card destination; a flow that computes its own split is duplicating
   * engine arithmetic that will drift (see "Query, never recompute").
   *
   * - `amount` omitted → the WHOLE refund lands on the card (what an
   *   all-`giftCard` `legs` staging does today).
   * - `amount` set → that much lands on the card, in minor units; the
   *   remainder returns to the original payments, allocated by the engine.
   *
   * DRAWING ORDER — the card is filled from the tenders that cannot be
   * refunded to source first (a redeem tender has nowhere to return to), then
   * proportionally from the rest. So `amount` can never be lower than what
   * those tenders must contribute: below that the call throws
   * `REFUND_GIFT_AMOUNT_BELOW_MINIMUM`, naming the minimum, and nothing is
   * committed. Surface that message — it is the number to clamp the field to,
   * so the flow never has to derive it.
   *
   * Exactly one destination card, therefore exactly ONE credit for the caller
   * to place and one to reverse. **Credit-first:** credit `referenceId` for
   * `amount` (or the full refund total when omitted) BEFORE calling; on any
   * throw nothing was recorded — reverse it.
   *
   * Requires `openUI: false`. Mutually exclusive with `legs` — passing both
   * throws, since they are two answers to the same question.
   */
  giftCard?: {
    /** Card/account id the flow already credited (stored raw). */
    referenceId: string;
    /** Minor units landing on the card. Omit for the whole refund. */
    amount?: number;
    /** Provider/program name. Defaults to `giftCard`. */
    processor?: string;
    /** Human label for the destination tender. */
    label?: string;
  };
  /** Optional items to refund. */
  items?: {
    /** internalId or variantId or customSaleId. */
    itemKey: string;
    quantity: number;
    type?: 'product' | 'customSale' | 'fee' | 'tip'; // Optional type hint
    /**
     * Per-item stock disposition for a refunded **product** line — the
     * headless equivalent of the old refund popup's per-row restock/damaged
     * dropdown. Recorded on the persisted refund line so hub-side inventory
     * ingest knows whether the returned units go back on the shelf.
     *
     * - `'RESTOCK'` (default when omitted): units return to sellable stock
     *   — the popup's default first option.
     * - `'REFUND_DAMAGE'`: units are written off as damaged, not restocked.
     *
     * Ignored for non-`product` items (custom sales / fees / tips carry no
     * stock action, exactly as the popup only offered it on line items).
     */
    stockAction?: 'RESTOCK' | 'REFUND_DAMAGE';
  }[];
}

export interface ProcessPartialRefundResponse {
  success: boolean;
  /**
   * The persisted Refund document's id — the REAL one, usable to look the
   * refund up. `null` means nothing has committed: the split-payment modal
   * was raised (`modalRaised: true`) and owns the commit from there.
   *
   * Before kaching 1.9.5-preprod.17 this was the hardcoded string
   * `'processed'` regardless of outcome, so a truthiness check could not
   * detect a refund that silently didn't happen. Guard on it now:
   * `if (!res.refundId && !res.modalRaised) …` is unreachable (such paths
   * throw instead), so `res.refundId` alone answers "did money move".
   */
  refundId: string | null;
  /**
   * True when a multi-tender order raised the split-payment refund modal
   * (`openUI` omitted or `true`): the cashier allocates there and the modal
   * drives the commit — this call wrote nothing. Headless calls
   * (`openUI: false`) never raise it.
   */
  modalRaised: boolean;
  timestamp: string;
}

export type ProcessPartialRefund = (params?: ProcessPartialRefundParams) => Promise<ProcessPartialRefundResponse>;
