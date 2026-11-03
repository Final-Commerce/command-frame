/**
 * Attach Checkout Contact action
 * Calls the attachCheckoutContact action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { AttachCheckoutContact, AttachCheckoutContactParams, AttachCheckoutContactResponse } from './types';

export const attachCheckoutContact: AttachCheckoutContact = async (
  params: AttachCheckoutContactParams,
): Promise<AttachCheckoutContactResponse> => {
  return await commandFrameClient.call<AttachCheckoutContactParams, AttachCheckoutContactResponse>(
    'attachCheckoutContact',
    params,
  );
};
