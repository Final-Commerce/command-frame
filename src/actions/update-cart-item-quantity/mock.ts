import { UpdateCartItemQuantity, UpdateCartItemQuantityParams, UpdateCartItemQuantityResponse } from './types';
import {
  MOCK_BOOKINGS,
  MOCK_CART,
  MOCK_PRODUCTS,
  mockCompositeStockRefusal,
  mockPlainLineStockRefusal,
  mockPublishEvent,
  recalculateMockCart,
} from '../../demo/database';
import { ReservationStatus, isValidQuantity } from '@final-commerce/common';
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

  // Same refusal and text as the host: a line holding bookings keeps its quantity — its holds are that many seats.
  if (quantity !== 0 && MOCK_CART.reservations?.some((reservation) => reservation.lineItemInternalId === internalId)) {
    throw new Error(
      `${product.name} holds a booking — its quantity is the seats held: remove the line and add it again with the new quantity (addProductToCart with compositeSlot)`,
    );
  }

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
    // Like the host's `dropCompositeLine`: the line's reservations leave with it and their holds are released.
    const linked = (MOCK_CART.reservations ?? []).filter(
      (reservation) => reservation.lineItemInternalId === internalId,
    );
    MOCK_CART.reservations = (MOCK_CART.reservations ?? []).filter((reservation) => !linked.includes(reservation));
    for (const booking of MOCK_BOOKINGS.filter(({ id }) => linked.some(({ bookingId }) => bookingId === id))) {
      booking.status = ReservationStatus.CANCELLED;
    }

    recalculateMockCart();

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

  // Same refusal and text as the host: raising a line not sold in POS (lowering always works).
  const source = MOCK_PRODUCTS.find((p) => p.variants.some((v) => v._id === product.variantId));
  const variant = source?.variants.find((v) => v._id === product.variantId);
  // Same refusal and text as the host (handler.ts:82-84): no quantity change on a variant that cannot be read.
  if (!variant) {
    throw new Error(`Cannot change the quantity of ${product.variantId}: its variant could not be read.`);
  }
  if (quantity > previousQuantity && (source?.notSoldInPos || variant.notSoldInPos)) {
    throw new Error(`${source?.name} is not sold in POS`);
  }
  // A raised line draws on the shelf like the host's (handler.ts:88-105): a composite on its components', a plain line on
  // its variant's, counting everything the cart takes from it.
  if (quantity > previousQuantity) {
    const nextCart = MOCK_CART.products.map((line) => (line.internalId === internalId ? { ...line, quantity } : line));
    const refusal = product.components?.length
      ? mockCompositeStockRefusal(nextCart)
      : mockPlainLineStockRefusal(nextCart, variant);
    if (refusal) throw new Error(refusal);
  }

  // Update quantity
  product.quantity = quantity;

  recalculateMockCart();

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
