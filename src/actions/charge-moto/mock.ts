import { ChargeMoto, ChargeMotoParams, ChargeMotoResponse } from './types';
import { applyMockPayment, MOCK_CART } from '../../demo/database';

/** Mirrors kaching's `MOTO_MIN_AMOUNT_MINOR` — the processors' floor. */
const MOTO_MIN_AMOUNT_MINOR = 50;

/** The card fields that must be present and non-empty on every keyed charge. */
const REQUIRED_CARD_FIELDS = [
  'encryptedCardNumber',
  'encryptedExpiryMonth',
  'encryptedExpiryYear',
  'encryptedSecurityCode',
] as const;

export const mockChargeMoto: ChargeMoto = async (params: ChargeMotoParams): Promise<ChargeMotoResponse> => {
  console.log('[Mock] chargeMoto called', params);

  if (!params) throw new Error('Params required');
  if (!Number.isInteger(params.amount)) {
    throw new Error('amount must be an integer number of minor units');
  }
  if (params.amount < MOTO_MIN_AMOUNT_MINOR) {
    throw new Error(`amount must be at least ${MOTO_MIN_AMOUNT_MINOR} minor units`);
  }
  for (const field of REQUIRED_CARD_FIELDS) {
    const value = params.card?.[field];
    if (!value || !value.trim()) {
      throw new Error(`card.${field} is required`);
    }
  }
  if (!params.idempotencyKey || !params.idempotencyKey.trim()) {
    throw new Error('idempotencyKey is required so a retry replays instead of recharging');
  }

  const balanceDue = MOCK_CART.amountToBeCharged ?? MOCK_CART.total;
  if (params.amount > balanceDue) {
    throw new Error(`amount ${params.amount} exceeds balance due ${balanceDue}`);
  }

  // The mock always completes the sale in one leg — it does not model
  // kaching's real partial-leg (`saleFinalized: false`) path.
  const order = applyMockPayment(balanceDue, 'card', 'adyen');
  if (!order) {
    throw new Error('MOCK_CHARGE_MOTO_PARTIAL_UNSUPPORTED: the mock only supports charging the full balance due');
  }

  return {
    success: true,
    timestamp: new Date().toISOString(),
    order,
    saleFinalized: true,
    remainingBalance: 0,
  };
};
