import { GetCashRoundingAmount, GetCashRoundingAmountParams, GetCashRoundingAmountResponse } from './types';
import { MOCK_CART, mockCashRounding } from '../../demo/database';

/** The host's preview (kaching get-cash-rounding-amount/handler.ts): the dataset's `cashRounding`; none = unchanged. */
export const mockGetCashRoundingAmount: GetCashRoundingAmount = async (
  params?: GetCashRoundingAmountParams,
): Promise<GetCashRoundingAmountResponse> => {
  console.log('[Mock] getCashRoundingAmount called', params);

  const amount = Math.round(params?.amount ?? MOCK_CART.amountToBeCharged ?? MOCK_CART.total ?? 0);
  const { rounded, cashRoundingAmount } = mockCashRounding(amount);

  return {
    success: true,
    amount,
    roundedAmount: rounded,
    cashRounding: cashRoundingAmount,
    timestamp: new Date().toISOString(),
  };
};
