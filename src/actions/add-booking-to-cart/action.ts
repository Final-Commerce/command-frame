/**
 * Add booking to cart action
 * Calls the addBookingToCart action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { AddBookingToCart, AddBookingToCartParams, AddBookingToCartResponse } from './types';

export const addBookingToCart: AddBookingToCart = async (
  params: AddBookingToCartParams,
): Promise<AddBookingToCartResponse> => {
  return await commandFrameClient.call<AddBookingToCartParams, AddBookingToCartResponse>('addBookingToCart', params);
};
