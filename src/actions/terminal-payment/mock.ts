import { TerminalPayment, TerminalPaymentParams, TerminalPaymentResponse } from './types';
import {
  applyMockPayment,
  assertMockPaymentAmount,
  assertMockPaymentNotDeclined,
  MOCK_CART,
} from '../../demo/database';

/** The host's card payment (kaching handlerHelpers.ts:144-258): the same refusals; a decline rejects, nothing is recorded. */
export const mockTerminalPayment: TerminalPayment = async (
  params?: TerminalPaymentParams,
): Promise<TerminalPaymentResponse> => {
  console.log('[Mock] terminalPayment called', params);

  const amount = assertMockPaymentAmount('terminalPayment', params?.amount);
  const connectionType = params?.paymentType || 'Bluetooth';

  // Simulate terminal interaction
  window.alert(
    `Demo: Processing ${connectionType} Terminal Payment...\n(Please tap, insert, or swipe card on terminal)`,
  );
  // Only "Cloud" routes to the cloud processor; anything else is the native reader (kaching terminal-payment/handler.ts).
  assertMockPaymentNotDeclined('terminal', params?.paymentType === 'Cloud');

  const order = applyMockPayment(amount, 'card', 'stripe_terminal');

  return {
    success: true,
    amount,
    paymentType: 'terminal',
    order,
    timestamp: new Date().toISOString(),
    change: 0,
    cashRounding: 0,
    saleFinalized: !!order,
    remainingBalance: order ? 0 : (MOCK_CART.remainingBalance ?? 0),
  };
};
