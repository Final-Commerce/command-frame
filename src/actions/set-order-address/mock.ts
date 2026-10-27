import { normalizeAddress } from '@final-commerce/common';

import { MOCK_CART, mockPublishEvent } from '../../demo/database';
import type { SetOrderAddress, SetOrderAddressParams, SetOrderAddressResponse } from './types';

/**
 * Standalone mock of putting an address on the cart. It refuses what the runtime refuses (no
 * country, an unreadable one, a shipping address without street and city) so a checkout form
 * that looks finished in preview doesn't lose orders on the published site.
 */
export const mockSetOrderAddress: SetOrderAddress = async (
  params: SetOrderAddressParams,
): Promise<SetOrderAddressResponse> => {
  console.log('[Mock] setOrderAddress called', params);
  if (!params || (params.type !== 'shipping' && params.type !== 'billing')) {
    throw new Error("setOrderAddress: type must be 'shipping' or 'billing'");
  }
  const key = params.type === 'shipping' ? 'shippingAddress' : 'billingAddress';

  let address = params.address;
  if (address) {
    const read = normalizeAddress(address);
    if (!read.country) throw new Error('setOrderAddress: choose a country');
    if (params.type === 'shipping' && (!address.address1?.trim() || !address.city?.trim())) {
      throw new Error('setOrderAddress: a shipping address needs a street and a city');
    }
    address = { ...address, country: read.country, state: read.province ?? address.state, fromCustomer: false };
  }

  MOCK_CART[key] = address;
  if (params.type === 'shipping') MOCK_CART.shipping = null;
  mockPublishEvent('cart', 'cart-updated', { [key]: address });
  return { address, cart: MOCK_CART, timestamp: new Date().toISOString() };
};
