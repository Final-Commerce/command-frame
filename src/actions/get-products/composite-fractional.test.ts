import { afterAll, describe, expect, it } from 'vitest';
import {
  MOCK_PRODUCT_BASIL_ALMOND,
  MOCK_PRODUCT_PASTE_TRIO,
  MOCK_PRODUCTS,
  setMockDatabase,
} from '../../demo/database';
import { mockGetProducts } from './mock';
import { mockGetCompositePrice } from '../get-composite-price/mock';
import { mockCompositeLine } from '../add-product-to-cart/mock';

// FC-1657 like the host: 0.5 kg of Basil Almond Paste a Paste Trio; the demo shelf reads in kg.
const defaults = [...MOCK_PRODUCTS];
afterAll(() => setMockDatabase({ products: defaults }));

const withBasil = (quantity: number, stock: number) => {
  const [variant] = MOCK_PRODUCT_BASIL_ALMOND.variants;
  const basil = {
    ...MOCK_PRODUCT_BASIL_ALMOND,
    variants: [{ ...variant, unitId: 'KGM', inventory: [{ ...variant.inventory![0], stock }] }],
  };
  const [paste, ...rest] = MOCK_PRODUCT_PASTE_TRIO.composite!.parts;
  const trio = {
    ...MOCK_PRODUCT_PASTE_TRIO,
    composite: {
      ...MOCK_PRODUCT_PASTE_TRIO.composite!,
      parts: [{ ...paste, items: [{ ...paste.items[0], quantity }] }, ...rest],
    },
  };
  setMockDatabase({
    products: defaults.map((product) =>
      product._id === basil._id ? basil : product._id === trio._id ? trio : product,
    ),
  });
  return trio;
};
const picks = [
  { itemId: 'item_basil', variantId: 'prod_basil_almond_var_main' },
  { itemId: 'item_spicy', variantId: 'prod_habanero_var_main' },
];
const price = (quantity: number) =>
  mockGetCompositePrice({ variantId: MOCK_PRODUCT_PASTE_TRIO.variants[0]._id, quantity, composite: picks });
const basilItem = async () =>
  (await mockGetProducts({})).products.find((product) => product._id === 'prod_paste_trio')!.composite!.parts[0]
    .items[0];

describe('FC-1657 mock: a fractional item quantity in its unit', () => {
  it('0.5 kg a trio: 1.25 kg on the shelf is offered, 0.3 kg is out_of_stock', async () => {
    withBasil(0.5, 1.25);
    expect((await basilItem()).unavailable).toBeNull();
    withBasil(0.5, 0.3);
    expect((await basilItem()).unavailable).toBe('out_of_stock');
  });

  it('the component carries its unit, as the host writes it', () => {
    const line = mockCompositeLine(withBasil(0.5, 5).composite!, picks, false);
    if (typeof line === 'string') throw new Error(line);
    expect(line.components[0]).toMatchObject({ quantity: 0.5, unit: { unitId: 'KGM', abbreviation: 'kg' } });
  });

  it('3 trios of 0.1 kg take exactly the 0.3 kg on the shelf — counted in grams, no float', async () => {
    withBasil(0.1, 0.3);
    expect(await price(3)).toMatchObject({ success: true });
  });

  it('short: what is left, in kg — never a bare 0.75', async () => {
    withBasil(0.5, 0.75);
    expect(await price(2)).toMatchObject({ success: false, reason: 'Basil Almond Paste: only 0.750 kg left' });
  });
});
