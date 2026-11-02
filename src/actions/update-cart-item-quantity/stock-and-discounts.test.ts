import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOCK_CART, MOCK_CART_MATH, MOCK_PRODUCT_BEET, resetMockCart } from '../../demo/database';
import { mockAddProductToCart } from '../add-product-to-cart/mock';
import { mockAddProductDiscount } from '../add-product-discount/mock';
import { mockUpdateCartItemQuantity } from './mock';

// Raising a line checks its shelf like the host (update-cart-item-quantity/handler.ts:88-105); a line's discounts are
// re-read at the new quantity (utils/tax.ts:54-55): a percent stays that percent of the whole line, a fixed one is per unit.
vi.spyOn(console, 'log').mockImplementation(() => undefined);
const variant = MOCK_PRODUCT_BEET.variants[0];
const price = variant.price;
const saved = structuredClone({ manageStock: variant.manageStock, inventory: variant.inventory });
const shelf = (stock: number, manageStock = true) => {
  variant.manageStock = manageStock;
  variant.inventory = [{ ...saved.inventory![0], stock }];
};
afterEach(() => {
  Object.assign(variant, structuredClone(saved));
  resetMockCart();
});

describe('updateCartItemQuantity keeps stock and discounts like the host', () => {
  it('a raise past the shelf is refused and the line keeps its quantity; lowering always works', async () => {
    shelf(3);
    const { internalId } = await mockAddProductToCart({ variantId: variant._id, quantity: 2 });
    expect(() => mockUpdateCartItemQuantity({ internalId, quantity: 4 })).toThrow(
      'Insufficient stock. Available: 3, Requested: 4',
    );
    expect(MOCK_CART.products[0].quantity).toBe(2);
    await mockUpdateCartItemQuantity({ internalId, quantity: 3 });
    shelf(0);
    await mockUpdateCartItemQuantity({ internalId, quantity: 1 });
    shelf(0, false);
    await mockUpdateCartItemQuantity({ internalId, quantity: 9 });
    expect(MOCK_CART.products[0].quantity).toBe(9);
  });

  it('50 % off stays half the line at 3; 1.00 off per unit becomes 3.00; parts add up to the total', async () => {
    shelf(10, false);
    const { internalId } = await mockAddProductToCart({ variantId: variant._id, quantity: 2 });
    await mockAddProductDiscount({ internalId, amount: 50, isPercent: true });
    await mockAddProductDiscount({ internalId, amount: 100, isPercent: false });
    await mockUpdateCartItemQuantity({ internalId, quantity: 3 });

    const line = MOCK_CART_MATH!.lines[internalId!];
    expect(line.prodDiscounts.map((d) => d.amount)).toEqual([Math.round((price * 3) / 2), 300]);
    expect(MOCK_CART.total).toBe(price * 3 - Math.round((price * 3) / 2) - 300);
  });
});
