/**
 * Create payment link action
 * Calls the createPaymentLink action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { CreatePaymentLink, CreatePaymentLinkParams, CreatePaymentLinkResponse } from './types';

export const createPaymentLink: CreatePaymentLink = async (
  params: CreatePaymentLinkParams,
): Promise<CreatePaymentLinkResponse> => {
  return await commandFrameClient.call<CreatePaymentLinkParams, CreatePaymentLinkResponse>('createPaymentLink', params);
};
