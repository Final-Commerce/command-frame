import { MOCK_SHIPPING_ZONES, mockShippingOptions } from '../../demo/shipping';
import type { GetShippingOptions, GetShippingOptionsResponse } from './types';

/** Standalone mock: the demo store's zones run through the real resolver, as the website would. */
export const mockGetShippingOptions: GetShippingOptions = async (): Promise<GetShippingOptionsResponse> => {
  console.log('[Mock] getShippingOptions called');
  const { resolution, options } = mockShippingOptions();
  const message =
    resolution.message ??
    (options.length === 0 && resolution.reason === 'NO_COVERAGE' ? 'Sorry, we only ship within Canada.' : null);
  return {
    required: MOCK_SHIPPING_ZONES.length > 0,
    options,
    reason: resolution.reason,
    message,
    timestamp: new Date().toISOString(),
  };
};
