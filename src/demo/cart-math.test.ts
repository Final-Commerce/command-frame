import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOCK_COMPANY, MOCK_PRODUCT_BASIL_ALMOND, MOCK_PRODUCT_BEET, setMockDatabase } from './database';
import { mockAddProductToCart } from '../actions/add-product-to-cart/mock';
import { mockAddCustomSale } from '../actions/add-custom-sale/mock';
import { mockAddCartDiscount } from '../actions/add-cart-discount/mock';
import { mockAddProductDiscount } from '../actions/add-product-discount/mock';
import { mockGetCurrentCart } from '../actions/get-current-cart/mock';

// The mock cart's money is the host's (kaching utils/tax.ts calculateCartTax): one rounding per rate, largest-remainder
// shares, the cart discount split over the lines — and every part adds up to the total to the cent.
vi.spyOn(console, 'log').mockImplementation(() => undefined);
const rate = (id: string, value: number, priority: number) => ({
  id,
  name: id.toUpperCase(),
  rate: value,
  priority,
  compounding: false,
  taxTableId: 'tax_standard',
  taxTableName: 'Standard',
});
const GST_PST = { tax_standard: [rate('gst', 0.05, 1), rate('pst', 0.07, 2)] };
const savedSettings = MOCK_COMPANY.settings;
const useTax = (taxTables: object, isTaxInclusive: boolean) => {
  MOCK_COMPANY.settings = { ...(savedSettings as object), isTaxInclusive };
  setMockDatabase({ taxTables: taxTables as never });
};
afterEach(() => {
  MOCK_COMPANY.settings = savedSettings;
  setMockDatabase({ taxTables: {} });
});

const add = (product: typeof MOCK_PRODUCT_BEET) => mockAddProductToCart({ variantId: product.variants[0]._id });
const cart = async () => (await mockGetCurrentCart()).cart;
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

describe('mock cart money mirrors the host', () => {
  it('no tax tables: totals are the lines, as before', async () => {
    setMockDatabase({});
    await add(MOCK_PRODUCT_BASIL_ALMOND);
    await add(MOCK_PRODUCT_BEET);
    const c = await cart();
    expect([c.subtotal, c.tax, c.total, c.amountToBeCharged]).toEqual([2200, 0, 2200, 2200]);
    expect(c.taxes).toEqual([]);
  });

  it('exclusive tax: per rate on the whole base, the lines add up to the cart', async () => {
    useTax(GST_PST, false);
    await add(MOCK_PRODUCT_BASIL_ALMOND);
    await add(MOCK_PRODUCT_BEET);
    const c = await cart();
    expect(c.taxes?.map((t) => [t.id, t.amount])).toEqual([
      ['gst', 110],
      ['pst', 154],
    ]);
    expect([c.subtotal, c.tax, c.total]).toEqual([2200, 264, 2464]);
    expect(sum(c.taxes!.map((t) => t.amount))).toBe(c.tax);
  });

  it('rounds once per rate and splits it by largest remainder (3 × 333 at 5% = 50, not 3 × 17)', async () => {
    useTax({ t5: [{ ...rate('gst', 0.05, 1), taxTableId: 't5' }] }, false);
    for (let i = 0; i < 3; i++)
      await mockAddCustomSale({ label: `S${i}`, price: 333, applyTaxes: true, taxTableId: 't5' });
    const c = await cart();
    expect([c.tax, c.total]).toEqual([50, 1049]);
  });

  it('inclusive tax: the price holds the tax, the total does not grow', async () => {
    useTax({ tax_standard: [rate('gst', 0.05, 1)] }, true);
    await add(MOCK_PRODUCT_BASIL_ALMOND);
    const c = await cart();
    expect([c.subtotal, c.tax, c.total]).toEqual([1200, 57, 1200]);
  });

  it('a percent cart discount is split over the lines before tax; the lines sum to the total', async () => {
    useTax(GST_PST, false);
    await add(MOCK_PRODUCT_BASIL_ALMOND);
    await add(MOCK_PRODUCT_BEET);
    await mockAddCartDiscount({ amount: 10, isPercent: true });
    const c = await cart();
    expect(c.taxes?.map((t) => t.amount)).toEqual([99, 139]);
    expect([c.subtotal, c.tax, c.total]).toEqual([2200, 238, 2218]);
  });

  it('a fixed cart discount in minor units; refusals and the whole-percent parse are the host’s', async () => {
    setMockDatabase({});
    await add(MOCK_PRODUCT_BASIL_ALMOND);
    await add(MOCK_PRODUCT_BEET);
    await mockAddCartDiscount({ amount: 500, isPercent: false });
    expect((await cart()).total).toBe(1700);
    await mockAddCartDiscount({ amount: 12.5, isPercent: true });
    expect((await cart()).total).toBe(2200 - 264);
    await expect(mockAddCartDiscount({ amount: 0, isPercent: false })).rejects.toThrow(
      'Discount amount must be greater than 0',
    );
    await expect(mockAddCartDiscount({ amount: 101, isPercent: true })).rejects.toThrow(
      'Discount percentage must be between 0 and 100',
    );
    await expect(mockAddCartDiscount({ amount: 5.5, isPercent: false })).rejects.toThrow(
      'integer in minor currency units',
    );
  });

  it('product discounts stack on the line, a percent stored as a fraction; an unknown line is refused', async () => {
    setMockDatabase({});
    const line = await add(MOCK_PRODUCT_BASIL_ALMOND);
    await mockAddProductDiscount({ internalId: line.internalId, amount: 10, isPercent: true });
    await mockAddProductDiscount({ internalId: line.internalId, amount: 100, isPercent: false });
    const c = await cart();
    expect(c.products[0].discounts?.map((d) => d.value)).toEqual([0.1, 100]);
    expect(c.total).toBe(1200 - 120 - 100);
    await expect(mockAddProductDiscount({ internalId: 'nope', amount: 1, isPercent: false })).rejects.toThrow(
      'No cart item with internalId "nope"',
    );
  });
});
