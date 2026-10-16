import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  MOCK_BOOKINGS,
  MOCK_CART,
  MOCK_PARKED_ORDERS,
  MOCK_PARKED_ORDER_1,
  MOCK_PRODUCT_BASIL_ALMOND,
  MOCK_PRODUCT_BEER,
  MOCK_PRODUCT_HAIRCUT,
  MOCK_PRODUCT_LEMON,
  resetMockCart,
} from '../../demo/database';
import { mockGetProducts } from './mock';
import { mockAddProductToCart } from '../add-product-to-cart/mock';
import { mockUpdateCartItemQuantity } from '../update-cart-item-quantity/mock';
import { mockResumeParkedOrder } from '../resume-parked-order/mock';
import { mockAddBookingToCart } from '../add-booking-to-cart/mock';

// FT-196: the mocks must refuse and filter exactly like the kaching host (same texts), or a flow is
// built around behaviour the device does not have.
vi.spyOn(console, 'log').mockImplementation(() => undefined);

type Flags = { notSoldInPos?: boolean; notSoldOnline?: boolean };
const touched: Flags[] = [];
const flag = (target: object, flags: Flags) => {
  touched.push(target as Flags);
  Object.assign(target, flags);
};
afterEach(() => {
  for (const target of touched.splice(0)) {
    delete target.notSoldInPos;
    delete target.notSoldOnline;
  }
  resetMockCart();
});

const ids = async (params?: Parameters<typeof mockGetProducts>[0]) =>
  (await mockGetProducts(params)).products.map(({ _id }) => _id);

const STATES = [
  ['missing', {}],
  ['false', { notSoldInPos: false }],
  ['true', { notSoldInPos: true }],
] as const;
const MATRIX = STATES.flatMap(([productLabel, productFlag]) =>
  STATES.map(([variantLabel, variantFlag]) => ({
    productLabel,
    variantLabel,
    productFlag,
    variantFlag,
    sold: productLabel !== 'true' && variantLabel !== 'true',
  })),
);
const basil = MOCK_PRODUCT_BASIL_ALMOND;

describe('getProducts mock mirrors the host (FT-196)', () => {
  it.each(MATRIX)(
    'product $productLabel × variant $variantLabel → returned: $sold',
    async ({ productFlag, variantFlag, sold }) => {
      flag(basil, productFlag);
      flag(basil.variants[0], variantFlag);
      expect((await ids()).includes(basil._id)).toBe(sold);
      expect((await ids({ includeUnlisted: true })).includes(basil._id)).toBe(true);
    },
  );

  it('strips a flagged variant unless includeUnlisted', async () => {
    flag(MOCK_PRODUCT_BEER.variants[1], { notSoldInPos: true });
    const variantsOf = async (includeUnlisted: boolean) =>
      (await mockGetProducts({ includeUnlisted, limit: 1000 })).products
        .find(({ _id }) => _id === MOCK_PRODUCT_BEER._id)!
        .variants.map(({ _id }) => _id);
    expect(await variantsOf(false)).toEqual([MOCK_PRODUCT_BEER.variants[0]._id]);
    expect(await variantsOf(true)).toEqual(MOCK_PRODUCT_BEER.variants.map(({ _id }) => _id));
    expect(MOCK_PRODUCT_BEER.variants).toHaveLength(2);
  });

  it('notSoldOnline: false matches a missing field; true only flagged', async () => {
    flag(basil, { notSoldOnline: true });
    const all = await ids({ limit: 1000 });
    expect(await ids({ query: { notSoldOnline: true } })).toEqual([basil._id]);
    expect(await ids({ query: { notSoldOnline: false }, limit: 1000 })).toEqual(all.filter((id) => id !== basil._id));
  });

  it('naming notSoldInPos replaces the default exclusion', async () => {
    flag(basil, { notSoldInPos: true });
    expect(await ids({ query: { notSoldInPos: true } })).toEqual([basil._id]);
    expect(await ids({ query: { notSoldInPos: false }, limit: 1000 })).not.toContain(basil._id);
  });
});

describe('cart mocks mirror the host refusals (FT-196)', () => {
  it.each(MATRIX)(
    'addProductToCart: product $productLabel × variant $variantLabel → sold: $sold',
    async ({ productFlag, variantFlag, sold }) => {
      flag(basil, productFlag);
      flag(basil.variants[0], variantFlag);
      const add = mockAddProductToCart({ variantId: basil.variants[0]._id });
      if (sold) await expect(add).resolves.toMatchObject({ success: true });
      else await expect(add).rejects.toThrow(`${basil.name} is not sold in POS`);
    },
  );

  it('updateCartItemQuantity refuses an increase only; decrease and removal work', async () => {
    const { internalId } = await mockAddProductToCart({ variantId: basil.variants[0]._id, quantity: 3 });
    flag(basil.variants[0], { notSoldInPos: true });
    expect(() => mockUpdateCartItemQuantity({ internalId, quantity: 4 })).toThrow(`${basil.name} is not sold in POS`);
    await expect(mockUpdateCartItemQuantity({ internalId, quantity: 2 })).resolves.toMatchObject({ success: true });
    await expect(mockUpdateCartItemQuantity({ internalId, quantity: 0 })).resolves.toMatchObject({ quantity: 0 });
  });

  it('resumeParkedOrder refuses, naming the item, and leaves the parked order and the cart alone', async () => {
    flag(MOCK_PRODUCT_LEMON, { notSoldInPos: true });
    const cartBefore = JSON.stringify(MOCK_CART);
    await expect(mockResumeParkedOrder({ orderId: MOCK_PARKED_ORDER_1._id })).rejects.toThrow(
      `${MOCK_PRODUCT_LEMON.name} is not sold in POS`,
    );
    expect(MOCK_PARKED_ORDERS).toContain(MOCK_PARKED_ORDER_1);
    expect(JSON.stringify(MOCK_CART)).toBe(cartBefore);
  });

  it.each([
    ['product', MOCK_PRODUCT_HAIRCUT],
    ['variant', MOCK_PRODUCT_HAIRCUT.variants[0]],
  ])('addBookingToCart refuses a flagged %s before holding a window', async (_label, target) => {
    flag(target, { notSoldInPos: true });
    const bookingsBefore = MOCK_BOOKINGS.length;
    await expect(
      mockAddBookingToCart({
        productId: MOCK_PRODUCT_HAIRCUT._id!,
        resourceId: 'res_room_1',
        startAt: '2099-01-01T10:00:00.000Z',
        endAt: '2099-01-01T10:30:00.000Z',
      }),
    ).resolves.toMatchObject({ success: false, reason: `${MOCK_PRODUCT_HAIRCUT.name} is not sold in POS` });
    expect(MOCK_BOOKINGS).toHaveLength(bookingsBefore);
  });
});
