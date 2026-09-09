import { GetBookings, GetBookingsParams, GetBookingsResponse } from './types';
import { MOCK_BOOKINGS, mockLiveBookings } from '../../demo/database';

export const mockGetBookings: GetBookings = async (params?: GetBookingsParams): Promise<GetBookingsResponse> => {
  console.log('[Mock] getBookings called', params);
  let bookings = params?.includeExpired ? MOCK_BOOKINGS : mockLiveBookings();

  if (params?.resourceId) bookings = bookings.filter((entry) => entry.resourceId === params.resourceId);
  if (params?.productId) bookings = bookings.filter((entry) => entry.productId === params.productId);
  if (params?.customerId) bookings = bookings.filter((entry) => entry.customerId === params.customerId);
  if (params?.from) {
    const from = new Date(params.from);
    bookings = bookings.filter((entry) => new Date(entry.bufferEndAt) > from);
  }
  if (params?.to) {
    const to = new Date(params.to);
    bookings = bookings.filter((entry) => new Date(entry.startAt) < to);
  }

  return { bookings, timestamp: new Date().toISOString() };
};
