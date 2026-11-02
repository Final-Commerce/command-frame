import { AddProductDiscount, AddProductDiscountParams, AddProductDiscountResponse } from './types';
import { MOCK_CART, mockPublishEvent, recalculateMockCart } from '../../demo/database';
import { resolveDiscountValue } from '../../demo/units';

/**
 * The host's handler (kaching add-product-discount/handler.ts:10-76): same refusals and stored value; a discount is ADDED
 * to the line's discounts (activeEntitiesSlice.ts:194-198), and a booking is discounted by its own internalId. With no
 * internalId the host discounts its active product; the mock, which keeps none, takes the last cart line.
 */
export const mockAddProductDiscount: AddProductDiscount = async (
  params?: AddProductDiscountParams,
): Promise<AddProductDiscountResponse> => {
  console.log('[Mock] addProductDiscount called', params);

  if (!params) throw new Error('Parameters are required for addProductDiscount');
  const { amount, isPercent, label, internalId } = params;
  if (amount === undefined || amount === null) throw new Error('Discount amount is required');
  const discount = {
    value: resolveDiscountValue(amount, isPercent || false),
    isPercent: isPercent || false,
    label: label || 'Discount',
  };

  const line = internalId
    ? MOCK_CART.products.find((p) => p.internalId === internalId)
    : MOCK_CART.products[MOCK_CART.products.length - 1];
  const reservation = internalId ? MOCK_CART.reservations?.find((r) => r.internalId === internalId) : undefined;
  const target = line ?? reservation;
  if (!target) {
    throw new Error(
      internalId
        ? `No cart item with internalId "${internalId}". Pass the internalId returned by addProductToCart ` +
            `(a productId or variantId will not match — internalId is the per-cart-line identifier).`
        : 'No product context. Provide internalId (to update an existing cart item) or use addProductToCart(...) with discounts.',
    );
  }
  target.discounts = [...(target.discounts ?? []), discount];
  recalculateMockCart();
  if (line) {
    mockPublishEvent('cart', 'product-discount-added', {
      product: line,
      internalId,
      discount: { amount, isPercent: discount.isPercent, label: discount.label },
    });
  } else {
    mockPublishEvent('cart', 'cart-created', { cart: MOCK_CART });
  }

  return {
    success: true,
    amount,
    isPercent: discount.isPercent,
    label: discount.label,
    internalId,
    timestamp: new Date().toISOString(),
  };
};
