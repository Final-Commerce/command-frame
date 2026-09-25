import { CFCartReservation } from '../../CommonTypes';
import { MOCK_CART, MOCK_PRODUCTS, mockPublishEvent } from '../../demo/database';
import { AddBookingToCart, AddBookingToCartParams, AddBookingToCartResponse } from './types';
import { mockHoldBooking } from '../hold-booking/mock';

export const mockAddBookingToCart: AddBookingToCart = async (
  params: AddBookingToCartParams,
): Promise<AddBookingToCartResponse> => {
  console.log('[Mock] addBookingToCart called', params);

  // One call, two effects — the window is claimed AND the service is in the cart. The claim goes
  // first and its refusal propagates: a cart line for a window somebody else took is worse than
  // no line at all.
  const held = await mockHoldBooking(params);
  if (!held.success || !held.booking) {
    return { success: false, reason: held.reason, timestamp: new Date().toISOString() };
  }
  const booking = held.booking;

  // An unknown product used to be sold as "Booking" at zero. The host refuses it, and a mock that
  // quietly sells something no catalogue contains teaches a screen a case that cannot happen.
  const product = MOCK_PRODUCTS.find(({ _id }) => _id === params.productId);
  if (!product) {
    return { success: false, reason: `No product ${params.productId}`, timestamp: new Date().toISOString() };
  }
  // A named variant is honoured or refused, never substituted — the host does the same.
  const variant = params.variantId
    ? product.variants?.find(({ _id }) => _id === params.variantId)
    : product.variants?.[0];
  if (params.variantId && !variant) {
    return {
      success: false,
      reason: `${product.name} has no variant ${params.variantId}`,
      timestamp: new Date().toISOString(),
    };
  }
  const price = variant?.price ?? product.minPrice ?? 0;

  const reservation: CFCartReservation = {
    internalId: `res_${booking.id}`,
    bookingId: booking.id,
    productId: params.productId,
    variantId: variant?._id ?? null,
    resourceId: params.resourceId,
    name: product.name,
    resourceName: booking.resourceName,
    price,
    quantity: 1,
    total: price,
    taxTableId: product.taxTable,
    startAt: booking.startAt,
    endAt: booking.endAt,
    bufferEndAt: booking.bufferEndAt,
    expiresAt: booking.expiresAt,
  };

  if (!MOCK_CART.reservations) MOCK_CART.reservations = [];
  MOCK_CART.reservations.push(reservation);

  MOCK_CART.subtotal += price;
  MOCK_CART.total += price;
  MOCK_CART.amountToBeCharged = MOCK_CART.total;
  MOCK_CART.remainingBalance = MOCK_CART.total;

  // The cart topic, not the bookings one: a screen that only watches bookings still has to
  // repaint its cart, and every other cart mutation announces itself the same way.
  // `cart-created`, as the host publishes: the cart topic carries the whole cart, and a screen
  // written against the host's event was not listening for a name only the mock used.
  mockPublishEvent('cart', 'cart-created', { cart: MOCK_CART });

  return {
    success: true,
    booking,
    reservationInternalId: reservation.internalId,
    timestamp: new Date().toISOString(),
  };
};
