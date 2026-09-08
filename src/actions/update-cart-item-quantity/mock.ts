import { UpdateCartItemQuantity, UpdateCartItemQuantityParams, UpdateCartItemQuantityResponse } from './types';
import { MOCK_CART, mockPublishEvent } from '../../demo/database';
import { extendPrice, isValidQuantity } from '@final-commerce/common';
export const mockUpdateCartItemQuantity: UpdateCartItemQuantity = (
  params?: UpdateCartItemQuantityParams,
): Promise<UpdateCartItemQuantityResponse> => {
  console.log('[Mock] updateCartItemQuantity called', params);

  if (!params?.internalId) {
    throw new Error('internalId is required');
  }

  if (params.quantity === undefined || params.quantity === null) {
    throw new Error('quantity is required');
  }

  const { internalId, quantity } = params;

  // Find the product in the cart
  const productIndex = MOCK_CART.products.findIndex((p) => p.internalId === internalId);

  if (productIndex === -1) {
    throw new Error(`Cart item with internalId ${internalId} not found`);
  }

  const product = MOCK_CART.products[productIndex];
  const previousQuantity = product.quantity;

  // The line resolved its unit when it was added; a piece-sold line has none and stays whole.
  if (
    quantity !== 0 &&
    !isValidQuantity(quantity, (product.unit ?? { unitId: 'piece', ratioToBase: 1, precision: 0 }) as never)
  ) {
    throw new Error(
      product.unit
        ? `${quantity} is finer than ${product.unit.abbreviation} can express (${product.unit.precision} decimals)`
        : `${product.name} is sold by the piece, so ${quantity} is not a quantity it can sell in`,
    );
  }

  // If quantity is 0, remove the item
  if (quantity === 0) {
    MOCK_CART.products.splice(productIndex, 1);

    // Recalculate totals
    const lineTotal = extendPrice(product.price, previousQuantity);
    MOCK_CART.subtotal -= lineTotal;
    MOCK_CART.total -= lineTotal;
    MOCK_CART.amountToBeCharged = MOCK_CART.total;
    MOCK_CART.remainingBalance = MOCK_CART.total;

    // Publish product-deleted event
    mockPublishEvent('cart', 'product-deleted', {
      product: product,
      internalId: internalId,
    });

    return Promise.resolve({
      success: true,
      internalId: internalId,
      quantity: 0,
      timestamp: new Date().toISOString(),
    });
  }

  // Update quantity
  product.quantity = quantity;

  // Difference of the two ROUNDED extensions — rounding the delta itself would let the
  // line's running total drift from what extendPrice(price, quantity) says it is.
  const lineTotalDelta = extendPrice(product.price, quantity) - extendPrice(product.price, previousQuantity);
  MOCK_CART.subtotal += lineTotalDelta;
  MOCK_CART.total += lineTotalDelta;
  MOCK_CART.amountToBeCharged = MOCK_CART.total;
  MOCK_CART.remainingBalance = MOCK_CART.total;

  // Publish product-updated event
  mockPublishEvent('cart', 'product-updated', {
    product: product,
    previousQuantity: previousQuantity,
    newQuantity: quantity,
  });

  return Promise.resolve({
    success: true,
    internalId: internalId,
    quantity: quantity,
    timestamp: new Date().toISOString(),
  });
};
