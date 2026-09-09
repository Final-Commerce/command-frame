import { AddBookingToCart, AddBookingToCartParams, AddBookingToCartResponse } from './types';
import { mockHoldBooking } from '../hold-booking/mock';

export const mockAddBookingToCart: AddBookingToCart = async (
  params: AddBookingToCartParams,
): Promise<AddBookingToCartResponse> => {
  console.log('[Mock] addBookingToCart called', params);
  // Same claim as holdBooking — including its refusal when the window is already taken. The mock
  // cart is not modelled here; what a booking screen must handle is the refusal, not the line.
  const { booking } = await mockHoldBooking(params);
  return { booking, reservationInternalId: `res_${booking.id}`, timestamp: new Date().toISOString() };
};
