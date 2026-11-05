import { describe, expect, it, vi } from 'vitest';
import { MOCK_PRODUCT_PASTE_TRIO } from '../../demo/database';
import { mockGetCompositePrice } from './mock';

vi.spyOn(console, 'log').mockImplementation(() => undefined);
const variantId = MOCK_PRODUCT_PASTE_TRIO.variants[0]._id;
const filled = [
  { itemId: 'item_basil', variantId: 'prod_basil_almond_var_main' },
  { itemId: 'item_spicy', variantId: 'prod_habanero_var_main', quantity: 2 },
];

describe('getCompositePrice mock: a picker renders straight from the answer', () => {
  it('missing names the part; nothing is full before any pick', async () => {
    expect(await mockGetCompositePrice({ variantId, composite: [] })).toMatchObject({
      success: false,
      missing: [
        { partId: 'part_paste', name: 'Paste', needed: 1 },
        { partId: 'part_spicy', name: null, needed: 1 },
      ],
      fullPartIds: [],
    });
  });

  it('parts at their max are listed in fullPartIds', async () => {
    expect(await mockGetCompositePrice({ variantId, composite: filled })).toMatchObject({
      success: true,
      missing: [],
      fullPartIds: ['part_paste', 'part_spicy'],
    });
  });

  it('total is for the quantity asked, unitTotal for one; the default quantity is 1', async () => {
    const one = await mockGetCompositePrice({ variantId, composite: filled });
    const three = await mockGetCompositePrice({ variantId, composite: filled, quantity: 3 });
    expect(one).toMatchObject({ unitTotal: 2900, total: 2900 });
    expect(three).toMatchObject({ unitTotal: 2900, total: 8700 });
  });
});
