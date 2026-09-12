import { ReservationStatus } from '@final-commerce/common';
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
  const { booking } = await mockHoldBooking(params);

  const product = MOCK_PRODUCTS.find(({ _id }) => _id === params.productId);
  const variant = params.variantId
    ? product?.variants?.find(({ _id }) => _id === params.variantId)
    : product?.variants?.[0];
  const price = variant?.price ?? product?.minPrice ?? 0;

  const reservation: CFCartReservation = {
    internalId: `res_${booking.id}`,
    bookingId: booking.id,
    productId: params.productId,
    variantId: variant?._id ?? null,
    resourceId: params.resourceId,
    name: product?.name ?? 'Booking',
    resourceName: booking.resourceName,
    price,
    quantity: 1,
    total: price,
    taxTableId: product?.taxTable,
    startAt: booking.startAt,
    endAt: booking.endAt,
    bufferEndAt: booking.bufferEndAt,
    status: ReservationStatus.HELD,
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
  mockPublishEvent('cart', 'reservation-added', { reservation });

  return { booking, reservationInternalId: reservation.internalId, timestamp: new Date().toISOString() };
};
