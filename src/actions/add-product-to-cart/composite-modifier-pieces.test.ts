import { afterAll, describe, expect, it } from 'vitest';
import { MOCK_PRODUCT_BASIL_ALMOND, MOCK_PRODUCT_PASTE_TRIO, MOCK_PRODUCTS, setMockDatabase } from '../../demo/database';
import type { CFComposite } from '../../CommonTypes';
import { mockCompositeLine } from './mock';

// B31 like kaching `modifierPiecesPerLine`: "Chunky" (+0.50) on a picked item is multiplied by pieces, not by grams.
const defaults = [...MOCK_PRODUCTS];
afterAll(() => setMockDatabase({ products: defaults }));

const compositeWith = (quantity: number, unitId?: string) => {
  const basil = { ...MOCK_PRODUCT_BASIL_ALMOND, variants: [{ ...MOCK_PRODUCT_BASIL_ALMOND.variants[0], unitId }] };
  setMockDatabase({ products: defaults.map((product) => (product._id === basil._id ? basil : product)) });
  const part = MOCK_PRODUCT_PASTE_TRIO.composite!.parts[0];
  return {
    ...MOCK_PRODUCT_PASTE_TRIO.composite!,
    parts: [{ ...part, items: [{ ...part.items[0], quantity }] }],
  } as CFComposite;
};
const pick = {
  itemId: 'item_basil',
  variantId: 'prod_basil_almond_var_main',
  modifiers: [{ modifierId: 'mod_texture', choices: [{ choiceId: 'choice_chunky', quantity: 1 }] }],
};

describe('mock composite line: item modifier × pieces (B31)', () => {
  it.each([
    ['150 g of an item in grams → × 1', 150, 'GRM', 1],
    ['2 pieces → × 2', 2, undefined, 2],
    ['2 × DEFAULT_UNIT_ID → × 2', 2, 'EA', 2],
  ])('%s', (_, quantity, unitId, expected) => {
    const line = mockCompositeLine(compositeWith(quantity, unitId), [pick], false);
    if (typeof line === 'string') throw new Error(line);
    expect(line.modifiers).toMatchObject([{ choiceId: 'choice_chunky', unitPrice: 50, quantity: expected }]);
  });
});
