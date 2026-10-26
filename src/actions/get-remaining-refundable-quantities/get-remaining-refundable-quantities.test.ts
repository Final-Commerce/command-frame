import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mockGetRemainingRefundableQuantities } from './mock';
import { MOCK_ORDERS } from '../../demo/database';
import type { CFActiveOrder } from '../../CommonTypes';

// The mock reads the same rows as `mockGetRefundPlan`, so the two never disagree on what is refundable.
describe('getRemainingRefundableQuantities mock', () => {
  let saved: CFActiveOrder[];
  const useOrders = (...orders: object[]) =>
    MOCK_ORDERS.splice(0, MOCK_ORDERS.length, ...(orders as unknown as CFActiveOrder[]));

  beforeEach(() => {
    saved = MOCK_ORDERS.splice(0, MOCK_ORDERS.length);
    useOrders({
      _id: 'sale',
      lineItems: [{ internalId: 'li-1', name: 'Pizza', quantity: 2, total: 2000 }],
      customSales: [{ customSaleId: 'cs-1', name: 'Extra', quantity: 1, total: 300 }],
      cartFees: [{ id: 'fee-1', label: 'Delivery', amount: 500 }],
      paymentMethods: [
        { transactionId: 'tx-tip', paymentType: 'card', amount: 2800, tip: { amount: 200 } },
        { transactionId: 'tx-cash', paymentType: 'cash', amount: 0 },
      ],
    });
  });
  afterEach(() => {
    MOCK_ORDERS.splice(0, MOCK_ORDERS.length, ...saved);
  });

  it('reports every row of the order as still refundable, keyed like processPartialRefund', async () => {
    const res = await mockGetRemainingRefundableQuantities({ orderId: 'sale' });

    expect(res.lineItems).toEqual({ 'li-1': 2 });
    expect(res.customSales).toEqual({ 'cs-1': 1 });
    expect(res.cartFees).toEqual({ 'fee-1': 1 });
    expect(res.tips).toEqual({ 'tx-tip': 1 });
    expect(res.reservations).toEqual({});
  });

  it('keys a line with only a variantId by that variantId', async () => {
    useOrders({ _id: 'o', lineItems: [{ variantId: 'var-1', name: 'Pizza', quantity: 3, total: 3000 }] });

    const res = await mockGetRemainingRefundableQuantities({ orderId: 'o' });

    expect(res.lineItems).toEqual({ 'var-1': 3 });
  });

  it('throws for an unknown order, like mockGetRefundPlan', async () => {
    await expect(mockGetRemainingRefundableQuantities({ orderId: 'nope' })).rejects.toThrow(
      'Order with ID nope not found',
    );
  });

  it('throws without an orderId instead of picking some order, like the runtime with no active order', async () => {
    await expect(mockGetRemainingRefundableQuantities()).rejects.toThrow('No order selected. Please provide orderId.');
  });

  it('reports a reservation by internalId with its quantity, like kaching', async () => {
    useOrders({ _id: 'o', reservations: [{ internalId: 'res-1', quantity: 1 }] });

    const res = await mockGetRemainingRefundableQuantities({ orderId: 'o' });

    expect(res.reservations).toEqual({ 'res-1': 1 });
  });

  it('keeps the last line when two lines share a key, like kaching', async () => {
    useOrders({
      _id: 'o',
      lineItems: [
        { internalId: 'a', name: 'A', quantity: 2, total: 200 },
        { internalId: 'a', name: 'A', quantity: 3, total: 300 },
      ],
    });

    const res = await mockGetRemainingRefundableQuantities({ orderId: 'o' });

    expect(res.lineItems).toEqual({ a: 3 });
  });

  it('returns empty maps for an empty order', async () => {
    useOrders({ _id: 'o' });

    const res = await mockGetRemainingRefundableQuantities({ orderId: 'o' });

    expect(res).toMatchObject({ lineItems: {}, customSales: {}, cartFees: {}, tips: {}, reservations: {} });
  });

  it('reports a tip per paying method when two payments carry tips', async () => {
    useOrders({
      _id: 'o',
      paymentMethods: [
        { transactionId: 't1', paymentType: 'card', amount: 1000, tip: { amount: 100 } },
        { transactionId: 't2', paymentType: 'card', amount: 1000, tip: { amount: 50 } },
      ],
    });

    const res = await mockGetRemainingRefundableQuantities({ orderId: 'o' });

    expect(res.tips).toEqual({ t1: 1, t2: 1 });
  });
});
