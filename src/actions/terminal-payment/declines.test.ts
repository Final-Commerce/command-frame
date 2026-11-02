import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MOCK_CART, MOCK_ORDERS, MOCK_PRODUCT_BASIL_ALMOND, setMockDatabase } from '../../demo/database';
import { mockAddProductToCart } from '../add-product-to-cart/mock';
import { mockTapToPayPayment } from '../tap-to-pay-payment/mock';
import { mockTerminalPayment } from './mock';

// The dataset's `declines` (mock only) makes a card payment fail as the host's does: the command rejects with the
// processor's code, nothing is recorded, the cart is still there to pay another way.
vi.spyOn(console, 'log').mockImplementation(() => undefined);
vi.spyOn(console, 'warn').mockImplementation(() => undefined);
vi.stubGlobal('window', { alert: () => undefined });
const ordersBefore = MOCK_ORDERS.length;
beforeEach(async () => {
  setMockDatabase({ declines: {} });
  await mockAddProductToCart({ variantId: MOCK_PRODUCT_BASIL_ALMOND.variants[0]._id });
});
afterEach(() => {
  MOCK_ORDERS.splice(ordersBefore);
  setMockDatabase({ declines: {} });
});

describe('card declines (mock dataset `declines.payments`)', () => {
  it('a declined terminal rejects with the processor code and records nothing', async () => {
    setMockDatabase({ declines: { payments: ['terminal'] } });
    await mockAddProductToCart({ variantId: MOCK_PRODUCT_BASIL_ALMOND.variants[0]._id });
    await expect(mockTerminalPayment({ amount: 1200, paymentType: 'Cloud' })).rejects.toThrow(
      'CLOUD_PAYMENT_FAILED: Card declined',
    );
    await expect(mockTerminalPayment({ amount: 1200 })).rejects.toThrow('NATIVE_PAYMENT_FAILED: Card declined');
    expect(MOCK_ORDERS.length).toBe(ordersBefore);
    expect([MOCK_CART.products.length, MOCK_CART.amountToBeCharged]).toEqual([1, 1200]);
    // Only the named tender declines.
    expect((await mockTapToPayPayment({ amount: 1200 })).saleFinalized).toBe(true);
  });

  it('without the switch every card payment settles; a missing amount is refused as on the host', async () => {
    await expect(mockTerminalPayment({} as never)).rejects.toThrow('terminalPayment: amount is required');
    const paid = await mockTerminalPayment({ amount: 1200 });
    expect([paid.saleFinalized, paid.order?.summary.total]).toEqual([true, 1200]);
  });
});
