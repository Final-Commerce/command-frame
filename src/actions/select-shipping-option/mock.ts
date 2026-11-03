import { MOCK_CART, mockPublishEvent } from '../../demo/database';
import { mockShippingOptions } from '../../demo/shipping';
import type { SelectShippingOption, SelectShippingOptionParams, SelectShippingOptionResponse } from './types';

/** Standalone mock: refuses an option the cart isn't offered, like the runtime does. */
export const mockSelectShippingOption: SelectShippingOption = async (
  params: SelectShippingOptionParams,
): Promise<SelectShippingOptionResponse> => {
  console.log('[Mock] selectShippingOption called', params);
  if (!params) throw new Error('Params required');

  const previous = MOCK_CART.shippingTotal ?? 0;
  if (params.optionId === null) {
    MOCK_CART.shipping = null;
  } else {
    const option = mockShippingOptions().resolution.options.find((o) => o.optionId === params.optionId);
    if (!option) throw new Error('selectShippingOption: this option is not offered for this cart');
    MOCK_CART.shipping = {
      zoneId: option.zoneId,
      optionId: option.optionId,
      type: option.type,
      name: option.name,
      amount: option.amount,
      minDays: option.minDays,
      maxDays: option.maxDays,
      outletId: option.outletId,
    };
  }
  MOCK_CART.shippingTotal = MOCK_CART.shipping?.amount ?? 0;
  MOCK_CART.total += MOCK_CART.shippingTotal - previous;
  mockPublishEvent('cart', 'cart-updated', { shipping: MOCK_CART.shipping });
  return { shipping: MOCK_CART.shipping, cart: MOCK_CART, timestamp: new Date().toISOString() };
};
