import { resolveShipping, type ShippingZoneRule } from '@final-commerce/common';

import type { ShippingOptionView } from '../actions/get-shipping-options/types';
import { MOCK_CART, MOCK_OUTLET_MAIN } from './database';

/*
 * The demo store's Settings › Shipping, so a flow previewed against the mocks meets the real rules
 * (common's `resolveShipping`) rather than a canned list: Canada $10 (free over $100) or Express,
 * Quebec at $15, pickup at the demo store, and nowhere else.
 */
export const MOCK_SHIPPING_ZONES: ShippingZoneRule[] = [
  {
    id: 'zone_canada',
    kind: 'country',
    places: [{ country: 'CA' }],
    ships: true,
    options: [
      {
        id: 'opt_standard',
        type: 'ship',
        name: 'Standard shipping',
        price: 1000,
        freeOver: 10000,
        minDays: 3,
        maxDays: 6,
        channels: ['web', 'pos'],
      },
      { id: 'opt_express', type: 'ship', name: 'Express', price: 2000, minDays: 1, maxDays: 2, channels: ['web'] },
      { id: 'opt_pickup', type: 'pickup', price: 0, channels: ['web'], outletId: MOCK_OUTLET_MAIN.id },
    ],
  },
  {
    id: 'zone_quebec',
    kind: 'province',
    places: [{ country: 'CA', province: 'QC' }],
    ships: true,
    options: [
      {
        id: 'opt_quebec',
        type: 'ship',
        name: 'Standard shipping',
        price: 1500,
        minDays: 4,
        maxDays: 7,
        channels: ['web', 'pos'],
      },
    ],
  },
];

const STORE_NAME = MOCK_OUTLET_MAIN.name ?? 'the store';
const money = (amount: number) => (amount === 0 ? 'Free' : `$${(amount / 100).toFixed(2)}`);

/** The demo cart's options, shaped like the runtime's answer. The mock runs as the website. */
export function mockShippingOptions() {
  const resolution = resolveShipping({
    zones: MOCK_SHIPPING_ZONES,
    address: MOCK_CART.shippingAddress,
    itemsTotal: MOCK_CART.subtotal,
    channel: 'web',
  });
  const options: ShippingOptionView[] = resolution.options.map((option) => ({
    optionId: option.optionId,
    type: option.type,
    name: option.type === 'pickup' ? `Pickup at ${STORE_NAME}` : (option.name ?? ''),
    amount: option.amount,
    priceText: money(option.amount),
    freeShippingHint: option.amountToFree ? `Add ${money(option.amountToFree)} more for free shipping` : null,
    arrivalText: option.minDays != null ? `Arrives in ${option.minDays}–${option.maxDays} business days` : null,
    pickup: option.type === 'pickup' ? { outletId: MOCK_OUTLET_MAIN.id, name: STORE_NAME, hours: [] } : null,
    selected: MOCK_CART.shipping?.optionId === option.optionId,
  }));
  return { resolution, options };
}
