import type { SetOutlet, SetOutletParams, SetOutletResponse } from './types';
import { MOCK_UNCONNECTED_OUTLET_ID } from '../get-outlets/mock';

/**
 * Standalone mock of switching location.
 *
 * It mirrors the two REFUSALS the real command makes — a missing id, and an
 * outlet that cannot take a payment — because those are the mistakes a builder
 * actually hits. A mock that accepted anything would let a location picker look
 * finished and then strand a shopper at a dead payment step on the real site.
 *
 * The unconnected id comes from the `getOutlets` mock rather than being repeated
 * here, so the two cannot drift into telling different stories.
 */
export const mockSetOutlet: SetOutlet = async (params: SetOutletParams): Promise<SetOutletResponse> => {
  console.log('[Mock] setOutlet called', params);

  if (!params) throw new Error('Params required');
  if (!params.outletId || !params.outletId.trim()) {
    throw new Error('setOutlet: outletId is required');
  }
  if (params.outletId === MOCK_UNCONNECTED_OUTLET_ID) {
    throw new Error(
      `setOutlet: outlet ${params.outletId} cannot take an online payment — offer only outlets with connected: true`,
    );
  }

  return { outletId: params.outletId, rehydrated: true, timestamp: new Date().toISOString() };
};
