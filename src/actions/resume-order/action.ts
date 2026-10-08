/**
 * Resume order action
 * Calls the resumeOrder action on the parent window
 */

import { commandFrameClient } from '../../client';
import type { ResumeOrder, ResumeOrderParams, ResumeOrderResponse } from './types';

export const resumeOrder: ResumeOrder = async (params?: ResumeOrderParams): Promise<ResumeOrderResponse> => {
  return await commandFrameClient.call<ResumeOrderParams, ResumeOrderResponse>('resumeOrder', params);
};
