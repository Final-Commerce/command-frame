// Process Partial Refund Types
export interface ProcessPartialRefundParams {
    /**
     * Optional refund reason.
     *
     * KNOWN LIMITATION: not currently persisted on the `Refund` doc or the
     * state-event audit row via this command — the runtime falls back to a
     * fixed 'partial-refund' label instead. Unlike `redeemRefund`, whose
     * `reason` IS recorded. See the README's "Known limitation" section.
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
    refundId: string;
    timestamp: string;
}

export type ProcessPartialRefund = (params?: ProcessPartialRefundParams) => Promise<ProcessPartialRefundResponse>;
