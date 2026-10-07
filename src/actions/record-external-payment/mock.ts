import type { RecordExternalPayment, RecordExternalPaymentParams, RecordExternalPaymentResponse } from './types';
import { applyMockPayment, MOCK_CART } from '../../demo/database';

export const mockRecordExternalPayment: RecordExternalPayment = async (
  params: RecordExternalPaymentParams,
): Promise<RecordExternalPaymentResponse> => {
  console.log('[Mock] recordExternalPayment called', params);

  const label = typeof params?.label === 'string' ? params.label.trim() : '';
  if (!label) {
    throw new Error('recordExternalPayment: label is required');
  }
  const balanceDue = MOCK_CART.amountToBeCharged ?? MOCK_CART.total;
  const amount = params.amount ?? balanceDue;
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('recordExternalPayment: amount must be a non-negative integer (minor units)');
  }
  if (amount > balanceDue) {
    throw new Error(`recordExternalPayment: amount ${amount} exceeds the balance due ${balanceDue}`);
  }

  const order = applyMockPayment(amount, 'external', label);
  const remainingBalance = MOCK_CART.remainingBalance ?? 0;

  return {
    success: true,
    amount,
    label,
    paymentType: 'external',
    change: 0,
    cashRounding: 0,
    order,
    saleFinalized: !!order,
    remainingBalance: order ? 0 : remainingBalance,
    timestamp: new Date().toISOString(),
  };
};
