import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../client', () => ({ commandFrameClient: { call: vi.fn() } }));

import { commandFrameClient } from '../../client';
import { MOCK_CART } from '../../demo/database';
import { getAddressOptions } from '../get-address-options/action';
import { mockGetAddressOptions } from '../get-address-options/mock';
import { selectShippingOption } from '../select-shipping-option/action';
import { mockSelectShippingOption } from '../select-shipping-option/mock';
import { setOrderAddress } from '../set-order-address/action';
import { mockSetOrderAddress } from '../set-order-address/mock';
import { getShippingOptions } from './action';
import { mockGetShippingOptions } from './mock';

const mockCall = vi.mocked(commandFrameClient).call;
const montreal = {
  address1: '1 Rue Sainte-Catherine',
  city: 'Montréal',
  state: 'Québec',
  postCode: 'h2x 1y4',
  country: 'Canada',
};

describe('shipping commands reach the runtime under their own names', () => {
  beforeEach(() => mockCall.mockReset());

  it.each([
    ['getAddressOptions', () => getAddressOptions({ locale: 'fr' }), { locale: 'fr' }],
    [
      'setOrderAddress',
      () => setOrderAddress({ type: 'shipping', address: null }),
      { type: 'shipping', address: null },
    ],
    ['getShippingOptions', () => getShippingOptions(), undefined],
    ['selectShippingOption', () => selectShippingOption({ optionId: 'x' }), { optionId: 'x' }],
  ])('%s', async (name, run, params) => {
    mockCall.mockResolvedValue({});
    await run();
    expect(mockCall).toHaveBeenCalledWith(name, params);
  });
});

describe('shipping mocks behave like the runtime', () => {
  beforeEach(() => {
    MOCK_CART.shippingAddress = null;
    MOCK_CART.shipping = null;
    MOCK_CART.shippingTotal = 0;
  });

  it('serves Canada with every province, in French when asked', async () => {
    const { countries, defaultCountry } = await mockGetAddressOptions({ locale: 'fr' });
    const canada = countries.find((c) => c.code === 'CA');
    expect(defaultCountry).toBe('CA');
    expect(canada?.provinces).toHaveLength(13);
    expect(canada?.provinces.find((p) => p.code === 'QC')?.name).toBe('Québec');
  });

  it('stores the address as codes and refuses one without a country or street', async () => {
    const { address } = await mockSetOrderAddress({ type: 'shipping', address: montreal });
    expect(address).toMatchObject({ country: 'CA', state: 'QC' });
    await expect(mockSetOrderAddress({ type: 'shipping', address: { city: 'Montréal' } })).rejects.toThrow(/country/);
    await expect(mockSetOrderAddress({ type: 'shipping', address: { country: 'CA' } })).rejects.toThrow(/street/);
  });

  it('lists the most specific zone for the address and prices the cart with the chosen option', async () => {
    await mockSetOrderAddress({ type: 'shipping', address: montreal });
    const { options, required } = await mockGetShippingOptions();
    expect(required).toBe(true);
    expect(options.map((o) => o.optionId)).toEqual(['opt_quebec']);

    const totalBefore = MOCK_CART.total;
    const { shipping } = await mockSelectShippingOption({ optionId: 'opt_quebec' });
    expect(shipping).toMatchObject({ amount: 1500, zoneId: 'zone_quebec' });
    expect(MOCK_CART.total - totalBefore).toBe(1500);
  });

  it('says why when nothing ships there', async () => {
    await mockSetOrderAddress({
      type: 'shipping',
      address: { address1: '10 Downing St', city: 'London', country: 'GB' },
    });
    expect(await mockGetShippingOptions()).toMatchObject({ options: [], reason: 'NO_COVERAGE' });
  });

  it('refuses an option the cart is not offered', async () => {
    await mockSetOrderAddress({ type: 'shipping', address: montreal });
    await expect(mockSelectShippingOption({ optionId: 'opt_express' })).rejects.toThrow(/not offered/);
  });
});
