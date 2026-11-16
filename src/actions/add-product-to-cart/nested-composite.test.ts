import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { MOCK_PRODUCT_PASTE_TRIO, MOCK_PRODUCTS, setMockDatabase } from '../../demo/database';
import { CFProductType, type CFProduct } from '../../CommonTypes';
import { mockAddProductToCart } from './mock';
import { mockGetCompositePrice } from '../get-composite-price/mock';

vi.spyOn(console, 'log').mockImplementation(() => undefined);

// Test fixture, kept out of the demo catalogue (the demo host builds no nested line): a composite inside a composite, as the host serves it — the Paste Trio item carries its own `composite` (parts,
// prices, defaults). Each unit of it takes its own picks (`picks[][]`); its own upcharges add on top, its price does not.
// "From" = 30.00 + the Trio's cheapest picks (+1.00). Valid picks are refused in the demo host's own words.
const LUNCH_BOX: CFProduct = {
  ...MOCK_PRODUCT_PASTE_TRIO,
  _id: 'prod_lunch_box',
  name: 'Paste Lunch Box',
  variants: [{ ...MOCK_PRODUCT_PASTE_TRIO.variants[0], _id: 'prod_lunch_box_var_main', price: 3000 }],
  productType: CFProductType.COMPOSITE,
  taxTable: '',
  modifiers: [],
  composite: {
    available: true,
    basePrice: 3000,
    fromPrice: 3100,
    parts: [
      {
        _id: 'part_lunch_trio',
        name: 'Portion',
        required: true,
        min: 1,
        max: 1,
        defaultPick: { itemId: 'item_lunch_trio', variantId: 'prod_paste_trio_var_main' },
        items: [
          {
            _id: 'item_lunch_trio',
            variantId: 'prod_paste_trio_var_main',
            categoryId: null,
            name: 'Paste Trio',
            extraCharge: 0,
            quantity: 1,
            cost: 0,
            unavailable: null,
            choices: [
              {
                productId: 'prod_paste_trio',
                variantId: 'prod_paste_trio_var_main',
                name: 'Paste Trio',
                attributes: [],
              },
            ],
            composite: {
              available: MOCK_PRODUCT_PASTE_TRIO.composite!.available,
              basePrice: MOCK_PRODUCT_PASTE_TRIO.composite!.basePrice,
              fromPrice: MOCK_PRODUCT_PASTE_TRIO.composite!.fromPrice,
              parts: MOCK_PRODUCT_PASTE_TRIO.composite!.parts,
            },
          },
        ],
      },
      {
        _id: 'part_lunch_side',
        name: 'Side',
        required: false,
        min: 0,
        max: 1,
        defaultPick: null,
        items: [
          {
            _id: 'item_lunch_garlic',
            variantId: 'prod_garlic_var_main',
            categoryId: null,
            name: 'Garlic Paste',
            extraCharge: 150,
            quantity: 1,
            cost: 150,
            unavailable: null,
            choices: [
              { productId: 'prod_garlic', variantId: 'prod_garlic_var_main', name: 'Garlic Paste', attributes: [] },
            ],
          },
        ],
      },
    ],
  },
};

const defaults = [...MOCK_PRODUCTS];
beforeAll(() => setMockDatabase({ products: [...defaults, LUNCH_BOX] }));
afterAll(() => setMockDatabase({ products: defaults }));
const variantId = LUNCH_BOX.variants[0]._id;
const trioUnit = [
  { itemId: 'item_basil', variantId: 'prod_basil_almond_var_main' },
  { itemId: 'item_spicy', variantId: 'prod_habanero_var_main' },
];
const trio = (units: (typeof trioUnit)[]) => ({
  itemId: 'item_lunch_trio',
  variantId: 'prod_paste_trio_var_main',
  picks: units,
});

describe('BOM mock: a composite inside a composite is refused like the host', () => {
  it.each([
    [
      'no unit picks',
      [{ itemId: 'item_lunch_trio', variantId: 'prod_paste_trio_var_main' }],
      'Paste Trio: send its picks for each of its 1 (got 0)',
    ],
    ['an inner part short', [trio([[trioUnit[0]]])], 'Paste Trio: Choose: pick at least 1'],
    [
      'valid picks — the demo host builds no nested line',
      [trio([trioUnit])],
      'The demo host does not build a composite inside a composite',
    ],
  ])('%s', async (_, composite, reason) => {
    expect(await mockGetCompositePrice({ variantId, composite })).toMatchObject({ success: false, reason });
    expect(await mockAddProductToCart({ variantId, composite })).toMatchObject({ success: false, reason });
  });
});
