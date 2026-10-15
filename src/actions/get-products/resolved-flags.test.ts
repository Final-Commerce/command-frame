import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOCK_PRODUCT_BEER } from '../../demo/database';
import { mockGetProducts } from './mock';

// The host serves the sold-out tile and the POS channel resolved, so a flow combines no flags itself.
vi.spyOn(console, 'log').mockImplementation(() => undefined);
const beer = async () =>
  (await mockGetProducts({ includeUnlisted: true, limit: 1000 })).products.find(
    ({ _id }) => _id === MOCK_PRODUCT_BEER._id,
  );
const before = MOCK_PRODUCT_BEER.variants.map(({ unavailable }) => unavailable);
afterEach(() => {
  delete MOCK_PRODUCT_BEER.notSoldInPos;
  MOCK_PRODUCT_BEER.variants.forEach((variant, index) => {
    delete variant.notSoldInPos;
    variant.unavailable = before[index];
  });
});

describe('getProducts mock resolves the flags', () => {
  it('notSellableInPos: the product flag reaches every variant, a variant flag only its own', async () => {
    MOCK_PRODUCT_BEER.variants[1].notSoldInPos = true;
    expect((await beer())?.variants.map((variant) => variant.notSellableInPos)).toEqual(
      MOCK_PRODUCT_BEER.variants.map((_, index) => index === 1),
    );
    MOCK_PRODUCT_BEER.notSoldInPos = true;
    expect((await beer())?.variants.every((variant) => variant.notSellableInPos)).toBe(true);
  });

  it('product.unavailable only when every variant is sold out', async () => {
    expect(MOCK_PRODUCT_BEER.variants.length).toBeGreaterThan(1);
    MOCK_PRODUCT_BEER.variants.forEach((variant, index) => (variant.unavailable = index === 0));
    expect(await beer()).toMatchObject({ unavailable: false });
    for (const variant of MOCK_PRODUCT_BEER.variants) variant.unavailable = true;
    expect(await beer()).toMatchObject({ unavailable: true });
  });
});
