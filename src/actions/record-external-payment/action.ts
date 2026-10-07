/**
 * Record external payment action
 * Calls the recordExternalPayment action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { RecordExternalPayment, RecordExternalPaymentParams, RecordExternalPaymentResponse } from './types';

export const recordExternalPayment: RecordExternalPayment = async (
  params: RecordExternalPaymentParams,
): Promise<RecordExternalPaymentResponse> => {
  return await commandFrameClient.call<RecordExternalPaymentParams, RecordExternalPaymentResponse>(
    'recordExternalPayment',
    params,
  );
};
