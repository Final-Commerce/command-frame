import { describe, it, expect, vi, beforeEach } from 'vitest';
import { recordExternalPayment } from './action';
import { mockRecordExternalPayment } from './mock';
import { MOCK_CART, resetMockCart } from '../../demo/database';

vi.mock('../../client', () => ({
  commandFrameClient: {
    call: vi.fn(),
  },
}));

import { commandFrameClient } from '../../client';

const mockCall = vi.mocked(commandFrameClient).call;

describe('recordExternalPayment action', () => {
  it('calls commandFrameClient with recordExternalPayment and params', async () => {
    mockCall.mockResolvedValue({ success: true });

    await recordExternalPayment({ label: 'Paid online', checkoutFulfillmentTarget: 'pending' });

    expect(mockCall).toHaveBeenCalledWith('recordExternalPayment', {
      label: 'Paid online',
      checkoutFulfillmentTarget: 'pending',
    });
  });
});

describe('recordExternalPayment mock', () => {
  beforeEach(() => {
    resetMockCart();
    MOCK_CART.products = [{ id: 'pizza', quantity: 1, price: 1500 } as never];
    MOCK_CART.total = 1500;
    MOCK_CART.amountToBeCharged = 1500;
    MOCK_CART.remainingBalance = 1500;
  });

  it('requires a label', async () => {
    await expect(mockRecordExternalPayment({ label: ' ' })).rejects.toThrow('label is required');
  });

  it('records the whole balance when no amount is given', async () => {
    const response = await mockRecordExternalPayment({ label: ' Paid online ' });

    expect(response).toMatchObject({
      success: true,
      amount: 1500,
      label: 'Paid online',
      paymentType: 'external',
      change: 0,
      cashRounding: 0,
      saleFinalized: true,
      remainingBalance: 0,
    });
  });

  it('records a partial amount and leaves the rest due', async () => {
    const response = await mockRecordExternalPayment({ label: 'Online deposit', amount: 500 });

    expect(response).toMatchObject({ amount: 500, saleFinalized: false, remainingBalance: 1000 });
  });

  it('refuses more than the balance due', async () => {
    await expect(mockRecordExternalPayment({ label: 'Paid online', amount: 2000 })).rejects.toThrow(
      'exceeds the balance due',
    );
  });
});
