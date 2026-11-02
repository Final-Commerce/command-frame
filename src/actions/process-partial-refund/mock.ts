import { ProcessPartialRefund, ProcessPartialRefundParams, ProcessPartialRefundResponse } from './types';
import { DEFAULT_CONFIG, setOrderState } from '@final-commerce/common';
import type { CFActiveOrder } from '../../CommonTypes';
import { MOCK_DECLINES, MOCK_ORDERS, MOCK_STAGED_REFUND, MOCK_USER, stageMockRefund } from '../../demo/database';
import { mockRefundBreakdown, mockRefundRows, mockRemainingOnSource } from '../get-refund-plan/mockRows';

type Leg = { transactionId: string; amount: number };
type Selection = NonNullable<ProcessPartialRefundParams['items']>;

/**
 * The host's partial refund (kaching process-partial-refund/handler.ts, refundDispatcher.ts:426-760): the same refusals
 * in the same order and texts, the multi-tender modal, the headless `legs` contract, and a committed refund lands on the
 * order's `refund[]`, so `getRemainingRefundableQuantities` and `getRefundPlan` see it. Not modelled: the planner's
 * remainder carry and the cash-rounding reconciliation of legs, and where a `giftCard` destination draws from — its
 * money is recorded against the sources.
 */
export const mockProcessPartialRefund: ProcessPartialRefund = async (
  params?: ProcessPartialRefundParams,
): Promise<ProcessPartialRefundResponse> => {
  console.log('[Mock] processPartialRefund called', params);

  assertItemsShape(params);
  const order = refundOrderOf(params);
  const selection = selectionOf(params);
  assertRefundableNow(order, params);

  const openUI = params?.openUI ?? true;
  const legsGiven = !openUI && !!params?.legs?.length;
  if (openUI && (order.paymentMethods?.length ?? 0) > 1) {
    // The cashier allocates in the split-payment modal, which commits; this call writes nothing.
    return { success: true, refundId: null, modalRaised: true, timestamp: new Date().toISOString() };
  }

  const breakdown = mockRefundBreakdown(mockRefundRows(order), selection);
  const budget = allocationBudget(order, breakdown.totals.total);
  const legs = legsGiven ? stagedLegs(order, params!.legs!, budget) : defaultLegs(order, budget);
  if (breakdown.totals.total <= 0 || legs.length === 0) {
    throw new Error('refund.blocked: empty-refund-plan — Refund plan has no allocated amount');
  }
  if (MOCK_DECLINES.refunds) {
    console.warn('[Mock] processPartialRefund failed — the mock dataset sets declines.refunds');
    throw new Error('Cloud refund failed');
  }

  const refundId = recordRefund(order, breakdown.rows, legs, params?.reason);
  settleRefundedOrder(order);
  stageMockRefund(null);
  return { success: true, refundId, modalRaised: false, timestamp: new Date().toISOString() };
};

/** handler.ts:34-41 — a provided `items` is a non-empty list, refused before anything is touched. */
function assertItemsShape(params?: ProcessPartialRefundParams) {
  if (params && 'items' in params && params.items !== undefined) {
    const items: unknown = params.items;
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error(
        'items was provided but empty or not a list. Pass the lines to refund, or omit items to use the staged selection.',
      );
    }
  }
}

/** handler.ts:44-59 — the demo keeps no active order, so the order is `orderId`, else the one select-all staged. */
function refundOrderOf(params?: ProcessPartialRefundParams): CFActiveOrder {
  const orderId = params?.orderId ?? MOCK_STAGED_REFUND?.orderId;
  const order = orderId ? MOCK_ORDERS.find((o) => o._id === orderId) : undefined;
  if (params?.orderId && !order) throw new Error(`Order with ID ${params.orderId} not found`);
  if (!order) throw new Error('No order selected. Please provide orderId.');
  return order;
}

/** handler.ts:86-125 — `items` IS the whole selection; without it the staged one; nothing positive is refused. */
function selectionOf(params?: ProcessPartialRefundParams): Selection {
  const items = params?.items?.length ? params.items : MOCK_STAGED_REFUND?.items;
  if (!items) throw new Error('No refund details. Please select items to refund first.');
  if (!items.some((item) => item.quantity > 0)) {
    throw new Error('No items selected for refund. Please select items to refund first.');
  }
  return items as Selection;
}

/** refundDispatcher.ts:206-210, 437-475 — the order and option checks before any allocation. */
function assertRefundableNow(order: CFActiveOrder, params?: ProcessPartialRefundParams) {
  if (order.paymentState === 'partially_paid') {
    throw new Error('A partially paid order cannot be refunded. Void it to return the deposit.');
  }
  if (['draft', 'pending', 'on_hold'].includes(String(order.fulfillmentState))) {
    throw new Error('refund.partialNotAllowedOnUnfulfilled');
  }
  if (params?.giftCard && params?.legs?.length) {
    throw new Error(
      'refund.giftCardAndLegs: pass either `legs` (you allocate) or `giftCard` (the engine allocates), not both',
    );
  }
  if (params?.giftCard && (params.openUI ?? true)) {
    throw new Error('refund.giftCardRequiresHeadless: `giftCard` requires openUI: false — the modal owns allocation');
  }
}

/** planRefund.ts:226-238 — a full selection refunds every capture; a partial one its goods value, capped. */
function allocationBudget(order: CFActiveOrder, mathTotal: number): number {
  const sources = (order.paymentMethods ?? []).filter((pm) => mockRemainingOnSource(order, pm.transactionId) > 0);
  const capacity = sources.reduce((sum, pm) => sum + mockRemainingOnSource(order, pm.transactionId), 0);
  const covered = sources.reduce(
    (sum, pm) => sum + Math.max(0, mockRemainingOnSource(order, pm.transactionId) - Math.round(pm.cashRounding ?? 0)),
    0,
  );
  return mathTotal >= covered ? capacity : Math.min(mathTotal, capacity);
}

/** The planner's split over the sources by what each has left (planRefund.ts:195-216, float remainders — as there). */
function defaultLegs(order: CFActiveOrder, budget: number): Leg[] {
  const sources = (order.paymentMethods ?? []).filter((pm) => mockRemainingOnSource(order, pm.transactionId) > 0);
  const capacities = sources.map((pm) => mockRemainingOnSource(order, pm.transactionId));
  const total = capacities.reduce((a, c) => a + c, 0);
  const target = Math.max(0, Math.min(Math.round(budget), total));
  if (target === 0) return [];
  const raw = capacities.map((c) => (c * target) / total);
  const out = raw.map((x) => Math.floor(x));
  const residue = target - out.reduce((a, b) => a + b, 0);
  const ranked = raw.map((r, i) => ({ i, rem: r - out[i] })).sort((a, b) => b.rem - a.rem);
  for (let k = 0; k < residue; k++) out[ranked[k].i] += 1;
  return sources.map((pm, i) => ({ transactionId: pm.transactionId, amount: out[i] })).filter((leg) => leg.amount > 0);
}

/** refundDispatcher.ts:556-733 — the headless `legs`: each one checked, per source capped, the sum equal to the budget. */
function stagedLegs(
  order: CFActiveOrder,
  legs: NonNullable<ProcessPartialRefundParams['legs']>,
  budget: number,
): Leg[] {
  const kept: Leg[] = [];
  for (const leg of legs) {
    const amount = Math.round(leg.amount);
    if (amount === 0) continue;
    if (amount < 0) {
      throw new Error(
        `refund.legAmountInvalid: leg for source "${leg.transactionId}" must not be negative (got ${amount})`,
      );
    }
    const source = (order.paymentMethods ?? []).find((pm) => pm.transactionId === leg.transactionId);
    if (!source) {
      throw new Error(`refund.legUnknownSource: no payment with transactionId "${leg.transactionId}" on this order`);
    }
    if (source.paymentType === 'redeem' && !leg.giftCard) {
      throw new Error(
        `REDEEM_REFUND_UNSUPPORTED: leg for redeem source "${leg.transactionId}" must carry a giftCard destination — the POS cannot push money onto a card without the flow's credit-first cooperation`,
      );
    }
    if (leg.giftCard && !leg.giftCard.referenceId) {
      throw new Error(
        `refund.legGiftCardReferenceRequired: gift-card leg for source "${leg.transactionId}" needs a referenceId`,
      );
    }
    kept.push({ transactionId: leg.transactionId, amount });
  }
  const bySource = new Map<string, number>();
  for (const leg of kept) bySource.set(leg.transactionId, (bySource.get(leg.transactionId) ?? 0) + leg.amount);
  for (const [id, staged] of bySource) {
    const remaining = mockRemainingOnSource(order, id);
    if (staged > remaining) {
      throw new Error(
        `refund.legExceedsSource: legs for source "${id}" total ${staged} but only ${remaining} remains refundable on that source`,
      );
    }
  }
  const legSum = kept.reduce((sum, leg) => sum + leg.amount, 0);
  if (legSum !== budget) {
    const detail = kept.length === 0 ? 'no non-zero legs staged' : `legs total ${legSum}`;
    const expected = defaultLegs(order, budget)
      .map((l) => `${l.transactionId}:${l.amount}`)
      .join(', ');
    throw new Error(
      `refund.legSumMismatch: ${detail} but the allocatable refund budget is ${budget}. ` +
        `Stage ${expected} — or read getRefundPlan().allocation.legs and submit it unchanged.`,
    );
  }
  return kept;
}

/** The committed refund on the order, as the ledger readers see it: the lines taken and the legs paid out. */
function recordRefund(
  order: CFActiveOrder,
  rows: ReturnType<typeof mockRefundBreakdown>['rows'],
  legs: Leg[],
  reason?: string,
): string {
  const refundId = `mock_refund_${Date.now()}`;
  const now = new Date().toISOString();
  const taken = (type: string) => rows.filter((row) => row.type === type);
  const entry = {
    _id: refundId,
    ...(reason ? { reason } : {}),
    lineItems: taken('product').flatMap((row) =>
      (order.lineItems ?? [])
        .filter((li) => (li.internalId || li.variantId) === row.itemKey)
        .map((li) => ({ ...li, quantity: row.quantity })),
    ),
    customSales: taken('customSale').flatMap((row) =>
      (order.customSales ?? [])
        .filter((cs) => cs.customSaleId === row.itemKey)
        .map((cs) => ({ ...cs, quantity: row.quantity })),
    ),
    cartFees: taken('fee').flatMap((row) => (order.cartFees ?? []).filter((fee) => String(fee.id) === row.itemKey)),
    tips: taken('tip').map((row) => ({ transactionId: row.itemKey })),
    refundPayment: legs.map((leg) => {
      const source = order.paymentMethods!.find((pm) => pm.transactionId === leg.transactionId)!;
      return {
        transactionId: `${refundId}_${leg.transactionId}`,
        saleId: leg.transactionId,
        paymentType: source.paymentType,
        processor: source.processor,
        amount: leg.amount,
        timestamp: now,
      };
    }),
    refundedBy: MOCK_USER.id,
    timestamp: now,
  };
  order.refund = [...(order.refund ?? []), entry as never];
  return refundId;
}

/**
 * The order after the refund, as the host lands it: kaching deriveTargetState.ts:116-190 (refund) — refunded once the
 * returned goods value reaches what was covered, else partially_refunded — written by common `setOrderState`
 * (orderMutator.ts:88, legacy `status` and `displayState` with it; the mock keeps no state config, so the default one),
 * and the balance left (orderMutator.ts:98-108).
 */
function settleRefundedOrder(order: CFActiveOrder) {
  const payments = order.paymentMethods ?? [];
  const sum = (values: number[]) => values.reduce((total, value) => total + Math.round(value), 0);
  const legs = (order.refund ?? []).flatMap((refund) => refund.refundPayment ?? []);
  const returned = sum(legs.map((leg) => leg.amount - Math.round(leg.cashRounding ?? 0)));
  const paid = sum(payments.map((pm) => pm.amount ?? 0));
  const covered =
    paid +
    sum(payments.map((pm) => pm.tip?.amount ?? 0)) -
    sum(payments.map((pm) => pm.cashRounding ?? 0)) -
    (order.summary?.nonRevenueTotal ?? 0);
  const goodsWentOut = ['fulfilled', 'partially_fulfilled', 'partially_returned', 'returned'].includes(
    String(order.fulfillmentState),
  );
  if ((covered > 0 && returned >= covered) || (paid === 0 && covered === 0)) {
    setOrderState(order, 'refunded', goodsWentOut ? 'returned' : 'cancelled', DEFAULT_CONFIG);
  } else {
    setOrderState(order, 'partially_refunded', 'partially_returned', DEFAULT_CONFIG);
  }
  order.balance = Math.max(0, (order.summary?.total ?? 0) - returned);
  order.updatedAt = new Date().toISOString();
}
