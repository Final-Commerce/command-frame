import { AddCartFee, AddCartFeeParams, AddCartFeeResponse } from './types';
import { MOCK_CART } from '../../demo/database';

export const mockAddCartFee: AddCartFee = async (params?: AddCartFeeParams): Promise<AddCartFeeResponse> => {
  console.log('[Mock] addCartFee called', params);

  if (params) {
    if (!MOCK_CART.customFee) MOCK_CART.customFee = [];
    // Contract (FI-6992): fixed `amount` arrives in integer MINOR units
    // (500 = $5); percent arrives 0-100 (50 = 50%). The stored cart shape
    // stays render-like: percent as a fraction (0.5), fixed as minor units.
    const storedAmount = params.isPercent ? params.amount / 100 : Math.round(params.amount);
    MOCK_CART.customFee.push({
      label: params.label || 'Fee',
      amount: storedAmount,
      isPercent: params.isPercent || false,
      applyTaxes: params.applyTaxes || false,
      taxTableId: params.taxTableId,
    });

    const feeAmount = params.isPercent ? MOCK_CART.subtotal * (params.amount / 100) : storedAmount;
    MOCK_CART.total += feeAmount;
    MOCK_CART.amountToBeCharged = MOCK_CART.total;
    MOCK_CART.remainingBalance = MOCK_CART.total;
  }

  return {
    success: true,
    amount: params?.amount || 0,
    isPercent: params?.isPercent || false,
    label: params?.label || '',
    applyTaxes: params?.applyTaxes || false,
    timestamp: new Date().toISOString(),
  };
};
