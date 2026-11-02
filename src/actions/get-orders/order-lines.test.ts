import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOCK_CART, MOCK_COMPANY, setMockDatabase } from '../../demo/database';
import { mockAddProductToCart } from '../add-product-to-cart/mock';
import { mockCashPayment } from '../cash-payment/mock';
import { mockGetOrders } from './mock';

// A saved order keeps what the cashier picked, as the host writes it (kaching buildOrderFromCart.ts:121-170): each
// line's modifier rows with their own money and tax, a composite line's components — on the demo fragment
// `src/demo/fragments/combo-and-toppings.json` (a pizza with a toppings group and a pizza + drink combo).
vi.spyOn(console, 'log').mockImplementation(() => undefined);
const fragment = JSON.parse(
  readFileSync(new URL('../../demo/fragments/combo-and-toppings.json', import.meta.url), 'utf8'),
);
const savedSettings = MOCK_COMPANY.settings;
afterEach(() => {
  MOCK_COMPANY.settings = savedSettings;
  setMockDatabase({ taxTables: {} });
});
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

describe('orders keep their lines’ modifiers and components', () => {
  it('a pizza with toppings and a combo with a topped pizza: rows, tax and totals add up to the cent', async () => {
    MOCK_COMPANY.settings = { ...(savedSettings as object), isTaxInclusive: false } as never;
    setMockDatabase({
      categories: fragment.categories,
      products: fragment.products,
      taxTables: {
        gate_tax_food: [
          {
            id: 'hst',
            name: 'HST',
            rate: 0.13,
            priority: 1,
            compounding: false,
            taxTableId: 'gate_tax_food',
            taxTableName: 'Food',
          },
        ],
      },
    });
    await mockAddProductToCart({
      variantId: 'gate_pizza_var',
      quantity: 2,
      modifiers: [
        {
          modifierId: 'gate_mod_toppings',
          choices: [
            { choiceId: 'gate_choice_cheese', quantity: 1 },
            { choiceId: 'gate_choice_olives', quantity: 1 },
          ],
        },
      ],
    });
    await mockAddProductToCart({
      variantId: 'gate_combo_var',
      composite: [
        {
          itemId: 'gate_item_pizza',
          variantId: 'gate_pizza_var',
          modifiers: [
            { modifierId: 'gate_mod_toppings', choices: [{ choiceId: 'gate_choice_mushrooms', quantity: 1 }] },
          ],
        },
        { itemId: 'gate_item_juice', variantId: 'gate_juice_var' },
      ],
    });
    const { order } = await mockCashPayment({ amount: MOCK_CART.total });

    const saved = (await mockGetOrders({ paymentState: 'paid' })).orders.find((o) => o._id === order!._id)!;
    const [pizza, combo] = saved.lineItems;
    expect(pizza.modifiers!.map((m) => [m.choiceName, m.total, m.totalTax])).toEqual([
      ['Extra Cheese', 400, 52],
      ['Olives', 200, 26],
    ]);
    expect(pizza.modifiers![0].taxes).toEqual([expect.objectContaining({ id: 'hst', amount: 52, priority: 1 })]);
    expect(combo.components!.map((c) => c.name)).toEqual(['Gate Pizza', 'Gate Juice']);
    expect(combo.modifiers).toEqual([
      expect.objectContaining({ choiceName: 'Mushrooms', total: 150, componentIndex: 0 }),
    ]);

    // Every modifier row's tax is inside its line's; the lines' tax is the order's; the lines' totals are the order total.
    for (const line of saved.lineItems)
      expect(sum((line.modifiers ?? []).map((m) => m.totalTax ?? 0))).toBeLessThanOrEqual(line.totalTax!);
    expect(sum(saved.lineItems.map((line) => line.totalTax!))).toBe(saved.summary.totalTaxes);
    expect(sum(saved.lineItems.map((line) => line.total!))).toBe(saved.summary.total);
  });
});
