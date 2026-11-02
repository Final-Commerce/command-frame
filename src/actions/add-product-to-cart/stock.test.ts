import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOCK_CART, MOCK_PRODUCT_BEET, resetMockCart } from '../../demo/database';
import { mockAddProductToCart } from './mock';

// A tracked variant sells only what its shelf at the active outlet holds, counted with what the cart already takes
// (kaching add-product-to-cart/handler.ts:152-165); an untracked one sells at any count.
vi.spyOn(console, 'log').mockImplementation(() => undefined);
const variant = MOCK_PRODUCT_BEET.variants[0];
const saved = structuredClone({ manageStock: variant.manageStock, inventory: variant.inventory });
const shelf = (stock: number, manageStock = true) => {
  variant.manageStock = manageStock;
  variant.inventory = [{ ...saved.inventory![0], stock }];
};
afterEach(() => {
  Object.assign(variant, structuredClone(saved));
  resetMockCart();
});

describe('addProductToCart stock mirrors the host', () => {
  it('refuses past the shelf, counting what the cart already holds', async () => {
    shelf(2);
    await mockAddProductToCart({ variantId: variant._id, quantity: 2 });
    await expect(mockAddProductToCart({ variantId: variant._id })).rejects.toThrow(
      'Insufficient stock. Available: 2, Requested: 3',
    );
    expect(MOCK_CART.products.length).toBe(1);
  });

  it('an empty shelf is out of stock; an untracked variant sells anyway', async () => {
    shelf(0);
    await expect(mockAddProductToCart({ variantId: variant._id })).rejects.toThrow('Product is out of stock');
    shelf(0, false);
    expect((await mockAddProductToCart({ variantId: variant._id, quantity: 5 })).success).toBe(true);
  });
});
