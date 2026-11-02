import { TapToPayPayment, TapToPayPaymentParams, TapToPayPaymentResponse } from './types';
import {
  applyMockPayment,
  assertMockPaymentAmount,
  assertMockPaymentNotDeclined,
  MOCK_CART,
} from '../../demo/database';

/** The host's card payment (kaching handlerHelpers.ts:144-258): the same refusals; a decline rejects, nothing is recorded. */
export const mockTapToPayPayment: TapToPayPayment = async (
  params?: TapToPayPaymentParams,
): Promise<TapToPayPaymentResponse> => {
  console.log('[Mock] tapToPayPayment called', params);

  const amount = assertMockPaymentAmount('tapToPayPayment', params?.amount);

  // Simulate Tap to Pay interaction
  window.alert('Demo: Processing Tap to Pay...\n(Please tap card or device on screen)');
  assertMockPaymentNotDeclined('tapToPay', false);

  const order = applyMockPayment(amount, 'card', 'tapToPay');

  return {
    success: true,
    amount,
    paymentType: 'tapToPay',
    order,
    timestamp: new Date().toISOString(),
    change: 0,
    cashRounding: 0,
    saleFinalized: !!order,
    remainingBalance: order ? 0 : (MOCK_CART.remainingBalance ?? 0),
  };
};
