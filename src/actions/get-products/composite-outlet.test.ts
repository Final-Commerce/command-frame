import { afterEach, describe, expect, it } from 'vitest';
import { MOCK_PRODUCT_BASIL_ALMOND, MOCK_PRODUCT_PASTE_TRIO, setMockDatabase } from '../../demo/database';
import { mockGetProducts } from './mock';
import { mockAddProductToCart } from '../add-product-to-cart/mock';

// The mock mirrors the host's outlet rules for composites (kaching resolveComposite + loadCompositeLine).
const trio = async () => (await mockGetProducts({})).products.find((product) => product._id === 'prod_paste_trio');
const hide = (...productIds: string[]) =>
  setMockDatabase({ catalogVisibility: productIds.map((productId) => ({ productId, outletId: 'outlet_main' })) });

afterEach(() => setMockDatabase({ catalogVisibility: [] }));

describe('mock composite at this outlet', () => {
  it('nothing hidden: the demo as it is', async () => {
    // B41: the host adds `needsDate`; the demo trio holds nothing bookable.
    expect((await trio())?.composite).toEqual({ ...MOCK_PRODUCT_PASTE_TRIO.composite, needsDate: false });
  });

  it('a required part left with nothing sold here makes it unavailable; its item is not offered', async () => {
    hide('prod_basil_almond');
    const composite = (await trio())!.composite!;
    expect(composite.parts[0].items.map((item) => item._id)).toEqual(['item_gone']);
    expect(composite).toMatchObject({ available: false });
    const added = await mockAddProductToCart({ variantId: MOCK_PRODUCT_PASTE_TRIO.variants[0]._id, composite: [] });
    expect(added).toMatchObject({ success: false, reason: 'Paste: nothing can be picked at this outlet' });
  });

  it('a category item with no product sold here is empty', async () => {
    hide('prod_habanero');
    const spicy = (await trio())!.composite!.parts[1].items[0];
    expect(spicy).toMatchObject({ unavailable: 'empty', choices: [] });
  });

  it('the composite itself hidden is left out and refused', async () => {
    hide('prod_paste_trio');
    expect(await trio()).toBeUndefined();
    const added = await mockAddProductToCart({ variantId: MOCK_PRODUCT_PASTE_TRIO.variants[0]._id, composite: [] });
    expect(added).toMatchObject({ success: false, reason: 'Paste Trio is not sold at this outlet' });
  });

  it('B35: an item sold out here is shown as out_of_stock and cannot be picked', async () => {
    const shelf = MOCK_PRODUCT_BASIL_ALMOND.variants[0].inventory![0];
    const before = shelf.stock;
    shelf.stock = 0;
    try {
      const paste = (await trio())!.composite!.parts[0];
      expect(paste.items.map((item) => [item._id, item.unavailable])).toEqual([
        ['item_basil', 'out_of_stock'],
        ['item_gone', 'deleted'],
      ]);
      const added = await mockAddProductToCart({
        variantId: MOCK_PRODUCT_PASTE_TRIO.variants[0]._id,
        composite: [{ itemId: 'item_basil', variantId: 'prod_basil_almond_var_main' }],
      });
      expect(added).toMatchObject({ success: false, reason: 'Paste: nothing can be picked at this outlet' });
    } finally {
      shelf.stock = before;
    }
  });

  it('B35: the cart may not take more of a component than its shelf holds — "only N left"', async () => {
    const shelf = MOCK_PRODUCT_BASIL_ALMOND.variants[0].inventory![0];
    const before = shelf.stock;
    shelf.stock = 1;
    try {
      const added = await mockAddProductToCart({
        variantId: MOCK_PRODUCT_PASTE_TRIO.variants[0]._id,
        quantity: 2,
        composite: [
          { itemId: 'item_basil', variantId: 'prod_basil_almond_var_main' },
          { itemId: 'item_spicy', variantId: 'prod_habanero_var_main' },
        ],
      });
      expect(added).toMatchObject({ success: false, reason: 'Basil Almond Paste: only 1 left' });
    } finally {
      shelf.stock = before;
    }
  });
});
