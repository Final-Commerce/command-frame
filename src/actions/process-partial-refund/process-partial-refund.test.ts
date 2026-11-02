import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOCK_ORDERS, MOCK_PRODUCT_BASIL_ALMOND, setMockDatabase } from '../../demo/database';
import type { CFActiveOrder } from '../../CommonTypes';
import { mockAddProductToCart } from '../add-product-to-cart/mock';
import { mockCashPayment } from '../cash-payment/mock';
import { mockGetRemainingRefundableQuantities } from '../get-remaining-refundable-quantities/mock';
import { mockGetOrders } from '../get-orders/mock';
import { mockGetRefundPlan } from '../get-refund-plan/mock';
import { mockSelectAllRefundItems } from '../select-all-refund-items/mock';
import { mockProcessPartialRefund } from './mock';

// A refund is checked against what is left of the order and lands on it, so the next read sees it (kaching
// refundDispatcher.ts); the headless legs must add up to the budget exactly.
vi.spyOn(console, 'log').mockImplementation(() => undefined);
vi.spyOn(console, 'warn').mockImplementation(() => undefined);
const ordersBefore = MOCK_ORDERS.length;
afterEach(() => {
  MOCK_ORDERS.splice(ordersBefore);
  setMockDatabase({ declines: {} });
});

/** Two basil pastes (2 × 1200) sold for cash: the order and its line key. */
const sellTwo = async () => {
  const line = await mockAddProductToCart({ variantId: MOCK_PRODUCT_BASIL_ALMOND.variants[0]._id, quantity: 2 });
  const { order } = await mockCashPayment({ amount: 2400 });
  return { orderId: order!._id, itemKey: line.internalId };
};
const remaining = async (orderId: string) => (await mockGetRemainingRefundableQuantities({ orderId })).lineItems;

describe('processPartialRefund mock mirrors the host', () => {
  it('refunds what is left and no more: the second ask is capped, the third has nothing to refund', async () => {
    const { orderId, itemKey } = await sellTwo();
    await expect(mockProcessPartialRefund({ orderId, items: [] })).rejects.toThrow('items was provided but empty');

    const first = await mockProcessPartialRefund({ orderId, items: [{ itemKey, quantity: 1 }] });
    expect(first.refundId).toMatch(/^mock_refund_/);
    expect(await remaining(orderId)).toEqual({ [itemKey]: 1 });

    await mockProcessPartialRefund({ orderId, items: [{ itemKey, quantity: 5 }] });
    expect(await remaining(orderId)).toEqual({ [itemKey]: 0 });
    const refunded = (MOCK_ORDERS.find((o) => o._id === orderId)!.refund ?? []).flatMap((r) => r.refundPayment);
    expect(refunded.map((leg) => leg.amount)).toEqual([1200, 1200]);

    await expect(mockProcessPartialRefund({ orderId, items: [{ itemKey, quantity: 1 }] })).rejects.toThrow(
      'refund.blocked: empty-refund-plan — Refund plan has no allocated amount',
    );
  });

  it('select-all stages the rest, and a call without items refunds it', async () => {
    const { orderId, itemKey } = await sellTwo();
    await mockSelectAllRefundItems({ orderId });
    await mockProcessPartialRefund();
    expect(await remaining(orderId)).toEqual({ [itemKey]: 0 });
  });

  it('a declined refund (mock dataset `declines.refunds`) rejects and records nothing', async () => {
    const { orderId, itemKey } = await sellTwo();
    setMockDatabase({ declines: { refunds: true } });
    await expect(mockProcessPartialRefund({ orderId, items: [{ itemKey, quantity: 1 }] })).rejects.toThrow(
      'Cloud refund failed',
    );
    expect(await remaining(orderId)).toEqual({ [itemKey]: 2 });
  });

  it('the order lands as the host lands it: partially_refunded after part, refunded once all is back', async () => {
    const { orderId, itemKey } = await sellTwo();
    const state = async (paymentState: string) => {
      const order = (await mockGetOrders({ paymentState })).orders.find((o) => o._id === orderId);
      return order && [order.paymentState, order.fulfillmentState, order.status, order.displayState, order.balance];
    };

    await mockProcessPartialRefund({ orderId, items: [{ itemKey, quantity: 1 }] });
    expect(await state('paid')).toBeUndefined();
    expect(await state('partially_refunded')).toEqual([
      'partially_refunded',
      'partially_returned',
      'partial-refund',
      'Partially Refunded',
      1200,
    ]);

    await mockProcessPartialRefund({ orderId, items: [{ itemKey, quantity: 1 }] });
    expect(await state('partially_refunded')).toBeUndefined();
    expect(await state('refunded')).toEqual(['refunded', 'returned', 'refunded', 'Refunded', 0]);
  });

  describe('an order paid by two tenders', () => {
    const order = {
      _id: 'split',
      paymentState: 'paid',
      fulfillmentState: 'fulfilled',
      lineItems: [{ internalId: 'li', variantId: 'v', name: 'Pizza', quantity: 2, total: 2400, totalTax: 0 }],
      paymentMethods: [
        { transactionId: 'cash', paymentType: 'cash', amount: 1000 },
        { transactionId: 'card', paymentType: 'card', amount: 1400 },
      ],
    } as unknown as CFActiveOrder;
    const items = [{ itemKey: 'li', quantity: 1 }];
    const use = () => MOCK_ORDERS.push(structuredClone(order));

    it('raises the modal by default and writes nothing', async () => {
      use();
      expect(await mockProcessPartialRefund({ orderId: 'split', items })).toMatchObject({
        refundId: null,
        modalRaised: true,
      });
      expect(await remaining('split')).toEqual({ li: 2 });
    });

    it('headless legs must equal the budget and fit each source; then they are what each source returns', async () => {
      use();
      const headless = (legs: { transactionId: string; amount: number }[]) =>
        mockProcessPartialRefund({ orderId: 'split', items, openUI: false, legs });
      await expect(headless([{ transactionId: 'cash', amount: 1200 }])).rejects.toThrow(
        'refund.legExceedsSource: legs for source "cash" total 1200 but only 1000 remains refundable on that source',
      );
      await expect(
        headless([
          { transactionId: 'cash', amount: 500 },
          { transactionId: 'card', amount: 500 },
        ]),
      ).rejects.toThrow(
        'refund.legSumMismatch: legs total 1000 but the allocatable refund budget is 1200. Stage cash:500, card:700',
      );
      await headless([
        { transactionId: 'cash', amount: 500 },
        { transactionId: 'card', amount: 700 },
      ]);
      const plan = await mockGetRefundPlan({ orderId: 'split' });
      expect(plan.sources.map((s) => [s.transactionId, s.refundedAmount, s.maxRefundable])).toEqual([
        ['cash', 500, 500],
        ['card', 700, 700],
      ]);
      expect(plan.totalRefunded).toBe(1200);
    });
  });
});
