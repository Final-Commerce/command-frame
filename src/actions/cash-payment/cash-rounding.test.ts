import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOCK_CART, MOCK_ORDERS, MOCK_PRODUCT_BASIL_ALMOND, setMockDatabase } from '../../demo/database';
import { mockAddProductToCart } from '../add-product-to-cart/mock';
import { mockAddCustomSale } from '../add-custom-sale/mock';
import { mockGetCashRoundingAmount } from '../get-cash-rounding-amount/mock';
import { mockCashPayment } from './mock';

// Cash is rounded with the company's setting (kaching money/cashRounding.ts), the change counted against the rounded
// charge, and the order records the drawer amount with the signed difference — so what is covered is the total.
vi.spyOn(console, 'log').mockImplementation(() => undefined);
const ordersBefore = MOCK_ORDERS.length;
afterEach(() => {
  MOCK_ORDERS.splice(ordersBefore);
  setMockDatabase({ cashRounding: null });
});

const cartOf1533 = async () => {
  await mockAddProductToCart({ variantId: MOCK_PRODUCT_BASIL_ALMOND.variants[0]._id });
  await mockAddCustomSale({ label: 'Extra', price: 333 });
};

describe('cash payment mirrors the host', () => {
  it('no setting: nothing is rounded', async () => {
    setMockDatabase({ cashRounding: null });
    await cartOf1533();
    expect(await mockGetCashRoundingAmount()).toMatchObject({ amount: 1533, roundedAmount: 1533, cashRounding: 0 });
    const paid = await mockCashPayment({ amount: 1533, tenderedAmount: 2000 });
    expect([paid.change, paid.cashRounding, paid.saleFinalized]).toEqual([467, 0, true]);
  });

  it('"0.05": the preview and the charge round alike; change is from the rounded charge; the order sums', async () => {
    setMockDatabase({ cashRounding: '0.05' });
    await cartOf1533();
    expect(await mockGetCashRoundingAmount()).toMatchObject({ amount: 1533, roundedAmount: 1535, cashRounding: 2 });
    await expect(mockCashPayment({ amount: 1533, tenderedAmount: 1534 })).rejects.toThrow(
      'cashPayment: tenderedAmount 1534 is less than the (cash-rounded) charge 1535',
    );
    const paid = await mockCashPayment({ amount: 1533, tenderedAmount: 2000 });
    expect([paid.amount, paid.change, paid.cashRounding]).toEqual([1533, 465, 2]);
    const [method] = paid.order!.paymentMethods;
    expect([method.amount, method.cashRounding]).toEqual([1535, 2]);
    expect(method.amount - (method.cashRounding ?? 0)).toBe(paid.order!.summary.total);
  });

  it('refuses like the host: no amount, more than due, an empty cart', async () => {
    await expect(mockCashPayment({ amount: 100 })).rejects.toThrow('Cart is empty. Cannot process payment.');
    await cartOf1533();
    await expect(mockCashPayment({} as never)).rejects.toThrow('cashPayment: amount is required');
    await expect(mockCashPayment({ amount: 1534 })).rejects.toThrow(
      'cashPayment: amount 1534 exceeds the balance due 1533',
    );
  });

  it('a partial leg leaves the rest due and no order', async () => {
    await cartOf1533();
    const leg = await mockCashPayment({ amount: 1000 });
    expect([leg.order, leg.saleFinalized, leg.remainingBalance]).toEqual([null, false, 533]);
    expect(MOCK_CART.amountToBeCharged).toBe(533);
  });
});
