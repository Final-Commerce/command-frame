import { CashPayment, CashPaymentParams, CashPaymentResponse } from './types';
import { applyMockPayment, assertMockPaymentAmount, MOCK_CART, mockCashRounding } from '../../demo/database';

/**
 * The host's cash payment (kaching handlerHelpers.ts:144-258, dispatchPay.ts:338-375): the leg is cash-rounded with the
 * company's setting, the change is counted against the ROUNDED charge, and every refusal rejects with the host's text.
 */
export const mockCashPayment: CashPayment = async (params: CashPaymentParams): Promise<CashPaymentResponse> => {
  console.log('[Mock] cashPayment called', params);

  const amount = assertMockPaymentAmount('cashPayment', params?.amount);
  const { rounded: charge, cashRoundingAmount } = mockCashRounding(amount);

  let change = 0;
  if (params.tenderedAmount !== undefined) {
    const tendered = Math.round(params.tenderedAmount);
    if (tendered < charge) {
      throw new Error(`cashPayment: tenderedAmount ${tendered} is less than the (cash-rounded) charge ${charge}`);
    }
    change = tendered - charge;
  } else if (params.openChangeCalculator && charge > 0) {
    // Deprecated legacy path: simulate the POS-owned change calculator. A cancel charges nothing and, as on the host
    // (dispatchPay.ts:359-364), still resolves — with no order.
    let input: string | null = '';
    try {
      input = window.prompt(
        `Amount due: $${(charge / 100).toFixed(2)}\nEnter amount tendered (dollars):`,
        (charge / 100).toFixed(2),
      );
    } catch (e) {
      console.warn('Could not open prompt/alert (possibly in non-interactive environment)', e);
    }
    if (input === null) {
      return {
        success: true,
        amount,
        openChangeCalculator: true,
        change: 0,
        cashRounding: 0,
        paymentType: 'cash',
        order: null,
        timestamp: new Date().toISOString(),
        saleFinalized: false,
        remainingBalance: 0,
      };
    }
    const tendered = parseFloat(input);
    if (!isNaN(tendered)) change = Math.round(tendered * 100) - charge;
  }

  const order = applyMockPayment(amount, 'cash', 'cash', cashRoundingAmount);

  return {
    success: true,
    amount,
    openChangeCalculator: params.openChangeCalculator ?? false,
    change,
    ...(params.tenderedAmount !== undefined ? { tenderedAmount: Math.round(params.tenderedAmount) } : {}),
    cashRounding: cashRoundingAmount,
    paymentType: 'cash',
    order,
    timestamp: new Date().toISOString(),
    saleFinalized: !!order,
    remainingBalance: order ? 0 : (MOCK_CART.remainingBalance ?? 0),
  };
};
