/**
 * Resume Checkout action
 * Calls the resumeCheckout action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { ResumeCheckout, ResumeCheckoutParams, ResumeCheckoutResponse } from './types';

export const resumeCheckout: ResumeCheckout = async (
  params?: ResumeCheckoutParams,
): Promise<ResumeCheckoutResponse> => {
  return await commandFrameClient.call<ResumeCheckoutParams, ResumeCheckoutResponse>(
    'resumeCheckout',
    params ?? {},
  );
};
