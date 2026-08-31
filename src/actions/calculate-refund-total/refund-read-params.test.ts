import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateRefundTotal } from './action';
import { getRemainingRefundableQuantities } from '../get-remaining-refundable-quantities/action';
import { selectAllRefundItems } from '../select-all-refund-items/action';

vi.mock('../../client', () => ({
  commandFrameClient: {
    call: vi.fn(),
  },
}));

import { commandFrameClient } from '../../client';

const mockCall = vi.mocked(commandFrameClient.call);

// Regression: these three actions used to call the host with no params,
// silently dropping the documented `orderId` (host handlers consume it).
describe('refund read actions forward params', () => {
  beforeEach(() => {
    mockCall.mockClear();
    mockCall.mockResolvedValue({ success: true });
  });

  it('calculateRefundTotal forwards orderId', async () => {
    await calculateRefundTotal({ orderId: '6931e04f53d9113bd5231dfd' });
    expect(mockCall).toHaveBeenCalledWith('calculateRefundTotal', {
      orderId: '6931e04f53d9113bd5231dfd',
    });
  });

  it('getRemainingRefundableQuantities forwards orderId', async () => {
    await getRemainingRefundableQuantities({ orderId: '6931e04f53d9113bd5231dfd' });
    expect(mockCall).toHaveBeenCalledWith('getRemainingRefundableQuantities', {
      orderId: '6931e04f53d9113bd5231dfd',
    });
  });

  it('selectAllRefundItems forwards orderId', async () => {
    await selectAllRefundItems({ orderId: '6931e04f53d9113bd5231dfd' });
    expect(mockCall).toHaveBeenCalledWith('selectAllRefundItems', {
      orderId: '6931e04f53d9113bd5231dfd',
    });
  });

  it('all three still work with no params (active-order default)', async () => {
    await calculateRefundTotal();
    await getRemainingRefundableQuantities();
    await selectAllRefundItems();
    expect(mockCall).toHaveBeenCalledWith('calculateRefundTotal', undefined);
    expect(mockCall).toHaveBeenCalledWith('getRemainingRefundableQuantities', undefined);
    expect(mockCall).toHaveBeenCalledWith('selectAllRefundItems', undefined);
  });
});
