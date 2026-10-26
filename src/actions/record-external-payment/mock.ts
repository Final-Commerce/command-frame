import type { RecordExternalPayment, RecordExternalPaymentParams, RecordExternalPaymentResponse } from './types';
import { isFulfillmentState } from '@final-commerce/common';
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
  // Same rule as the host: positive, except on a zero-balance checkout.
  if (!Number.isFinite(amount) || amount < 0 || (amount === 0 && balanceDue > 0)) {
    throw new Error('recordExternalPayment: amount must be a positive integer (minor units)');
  }
  const target = params.checkoutFulfillmentTarget;
  if (target !== undefined && !isFulfillmentState(target)) {
    throw new Error(`recordExternalPayment: invalid checkoutFulfillmentTarget "${String(target)}"`);
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
